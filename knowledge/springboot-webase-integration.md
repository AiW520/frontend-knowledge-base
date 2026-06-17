# 整合 WeBASE-Front

## 竞赛关联

比赛后端开发要求选手通过 Spring Boot 调用 WeBASE-Front 的 API 接口，实现合约编译和部署。这是后端与区块链交互的核心功能，需要掌握 HTTP 调用和合约管理。

## 核心技能

- **RestTemplate / HttpClient**：Java HTTP 请求工具
- **WeBASE-Front API 调用**：合约编译、合约部署
- **合约信息管理**：保存合约地址、ABI、Bytecode
- **异步回调处理**：部署交易确认
- **实体类设计**：合约信息的数据模型

## 详细讲解

### 1. WeBASE API 调用工具类

```java
package com.example.project.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Component
public class WebaseApiUtil {

    private static final String WEBASE_URL = "http://localhost:5002/WeBASE-Front";

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 编译合约
     * @param contractName 合约名称
     * @param solidityCode Solidity 源代码
     * @return ABI 和 Bytecode
     */
    public JSONObject compileContract(String contractName, String solidityCode) {
        String url = WEBASE_URL + "/contract/compile";

        // 构建请求体
        Map<String, Object> params = Map.of(
            "contractName", contractName,
            "solidityBase64", java.util.Base64.getEncoder()
                .encodeToString(solidityCode.getBytes())
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(params, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
            url, request, String.class
        );

        return JSON.parseObject(response.getBody());
    }

    /**
     * 部署合约
     * @param groupId 群组 ID
     * @param contractName 合约名称
     * @param abiInfo 合约 ABI
     * @param bytecodeBin 合约 Bytecode
     * @param userAddress 部署者地址
     * @param constructorParams 构造参数
     * @return 合约地址
     */
    public JSONObject deployContract(
            Integer groupId,
            String contractName,
            String abiInfo,
            String bytecodeBin,
            String userAddress,
            Object[] constructorParams) {

        String url = WEBASE_URL + "/contract/deploy";

        Map<String, Object> params = Map.of(
            "groupId", groupId,
            "contractName", contractName,
            "abiInfo", abiInfo,
            "bytecodeBin", bytecodeBin,
            "userAddress", userAddress,
            "constructorParams", constructorParams != null
                ? constructorParams : new Object[0]
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(params, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
            url, request, String.class
        );

        return JSON.parseObject(response.getBody());
    }

    /**
     * 查询合约列表
     */
    public JSONObject getContractList(Integer groupId, Integer pageNumber, Integer pageSize) {
        String url = String.format(
            "%s/contract/contractList?groupId=%d&pageNumber=%d&pageSize=%d",
            WEBASE_URL, groupId, pageNumber, pageSize
        );

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return JSON.parseObject(response.getBody());
    }
}
```

### 2. 合约信息实体类

```java
package com.example.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("sys_contract")
public class SysContract {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String contractName;       // 合约名称
    private String contractAddress;    // 合约地址
    private String contractAbi;        // 合约 ABI（JSON）
    private String contractBin;        // 合约 Bytecode
    private String solidityCode;       // Solidity 源码
    private Long groupId;              // 所属群组 ID
    private Long userId;               // 部署者 ID
    private Integer status;            // 0-未部署 1-已部署

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime deployTime;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableLogic
    private Integer deleted;
}
```

### 3. 合约部署 Service

```java
package com.example.project.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.project.common.BusinessException;
import com.example.project.common.ErrorCode;
import com.example.project.entity.SysContract;
import com.example.project.mapper.SysContractMapper;
import com.example.project.service.SysContractService;
import com.example.project.util.WebaseApiUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SysContractServiceImpl
        extends ServiceImpl<SysContractMapper, SysContract>
        implements SysContractService {

    @Autowired
    private WebaseApiUtil webaseApiUtil;

    @Override
    @Transactional
    public SysContract deployContract(String contractName, String solidityCode,
                                       Long userId, Integer groupId) {
        // 1. 编译合约
        JSONObject compileResult = webaseApiUtil.compileContract(
            contractName, solidityCode
        );

        if (compileResult.getInteger("code") != 0) {
            throw new BusinessException(
                ErrorCode.BLOCKCHAIN_ERROR.getCode(),
                "合约编译失败: " + compileResult.getString("message")
            );
        }

        // 2. 获取编译结果
        JSONObject compileData = compileResult.getJSONObject("data");
        String abiInfo = compileData.getString("abi");
        String bytecodeBin = compileData.getString("bytecodeBin");

        // 3. 部署合约
        JSONObject deployResult = webaseApiUtil.deployContract(
            groupId,
            contractName,
            abiInfo,
            bytecodeBin,
            "0x用户地址",  // 实际使用部署者地址
            null
        );

        if (deployResult.getInteger("code") != 0) {
            throw new BusinessException(
                ErrorCode.CONTRACT_DEPLOY_FAILED.getCode(),
                "合约部署失败: " + deployResult.getString("message")
            );
        }

        String contractAddress = deployResult.getJSONObject("data")
            .getString("contractAddress");

        // 4. 保存合约信息到数据库
        SysContract contract = new SysContract();
        contract.setContractName(contractName);
        contract.setContractAddress(contractAddress);
        contract.setContractAbi(abiInfo);
        contract.setContractBin(bytecodeBin);
        contract.setSolidityCode(solidityCode);
        contract.setGroupId(Long.valueOf(groupId));
        contract.setUserId(userId);
        contract.setStatus(1);

        this.save(contract);

        return contract;
    }
}
```

### 4. 合约部署 Controller

```java
package com.example.project.controller;

import com.example.project.common.Result;
import com.example.project.common.ErrorCode;
import com.example.project.common.BusinessException;
import com.example.project.config.LoginInterceptor;
import com.example.project.entity.SysContract;
import com.example.project.service.SysContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/contract")
public class ContractController {

    @Autowired
    private SysContractService contractService;

    @PostMapping("/deploy")
    public Result<SysContract> deployContract(@RequestBody Map<String, Object> params) {
        String contractName = (String) params.get("contractName");
        String solidityCode = (String) params.get("solidityCode");
        Integer groupId = params.get("groupId") != null
            ? Integer.valueOf(params.get("groupId").toString()) : 1;

        if (contractName == null || contractName.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAM_MISSING.getCode(), "合约名称不能为空");
        }
        if (solidityCode == null || solidityCode.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAM_MISSING.getCode(), "合约源码不能为空");
        }

        Long userId = LoginInterceptor.getCurrentUserId();

        SysContract contract = contractService.deployContract(
            contractName, solidityCode, userId, groupId
        );

        return Result.success(contract);
    }
}
```

### 5. 合约下载接口

```java
@GetMapping("/download/{contractId}")
public void downloadContract(@PathVariable Long contractId,
                              HttpServletResponse response) {
    SysContract contract = contractService.getById(contractId);

    if (contract == null) {
        throw new BusinessException(ErrorCode.CONTRACT_NOT_FOUND);
    }

    try {
        // 设置响应头
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition",
            "attachment; filename=" + contract.getContractName() + ".sol");

        // 写入 Solidity 源码
        response.getWriter().write(contract.getSolidityCode());
        response.getWriter().flush();
    } catch (Exception e) {
        throw new BusinessException("文件下载失败");
    }
}
```

## 重点内容

- `RestTemplate` 是 Spring 提供的 HTTP 请求工具，用于调用外部 API
- WeBASE-Front 的合约编译接口返回 ABI 和 Bytecode
- 合约部署是异步操作，需要等待区块链确认
- 合约信息（地址、ABI、Bytecode）需要持久化存储
- 使用 `@Transactional` 确保编译、部署、保存三步的原子性

## 注意事项

- WeBASE-Front 地址需要配置正确，通常为 `http://localhost:5002/WeBASE-Front`
- Solidity 源码需要 Base64 编码后发送
- 合约部署需要消耗 Gas，部署者账户需要有余额
- 合约 ABI 和 Bytecode 较大，数据库字段需要足够长度

## 常见误区

- 误区：忘记 Base64 编码 Solidity 源码
- 误区：部署后未保存合约地址，后续无法调用
- 误区：编译和部署分离，编译失败仍继续部署
- 误区：合约下载接口未设置正确的 Content-Type

## 官方资源扩展

- [WeBASE-Front 接口文档](https://webasedoc.readthedocs.io/zh_CN/latest/docs/WeBASE-Front/interface.html) - 完整 API 接口说明
- [Spring RestTemplate](https://docs.spring.io/spring-framework/reference/integration/rest-clients.html) - 官方 REST 客户端文档
- [FISCO BCOS 合约开发](https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/develop/smart_contract.html) - 合约开发指南