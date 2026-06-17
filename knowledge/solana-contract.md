# Solana 合约开发

## 竞赛关联

比赛要求选手使用 Rust 语言和 Anchor 框架开发 Solana 链上合约，包括转账合约、账户管理等。Solana 是高性能公链，与以太坊（EVM）的合约开发模式有显著差异，选手需要掌握其独特的账户模型和程序开发方式。

## 核心技能

- **Solana 账户模型**：Program Derived Address（PDA）、数据账户
- **Anchor 框架**：项目初始化、指令定义、账户验证
- **合约开发**：Rust 语法、Anchor 宏、指令处理
- **本地测试**：Solana Test Validator、Anchor Test
- **转账功能**：SOL 转账、SPL Token 转账

## 详细讲解

### 1. 环境搭建

```bash
# 安装 Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"

# 安装 Anchor
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked

# 创建项目
anchor init solana-transfer
cd solana-transfer
```

项目结构：

```
solana-transfer/
├── programs/
│   └── solana-transfer/
│       ├── src/
│       │   └── lib.rs           # 合约代码
│       ├── Cargo.toml
│       └── Xargo.toml
├── tests/
│   └── solana-transfer.ts       # 测试脚本
├── migrations/
├── Anchor.toml
└── package.json
```

### 2. Anchor.toml 配置

```toml
[features]
seeds = false
skip-lint = false

[programs.localnet]
solana-transfer = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
```

### 3. 转账合约代码

```rust
// programs/solana-transfer/src/lib.rs
use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solana_transfer {
    use super::*;

    /// 初始化转账账户
    pub fn initialize(ctx: Context<Initialize>, bump: u8) -> Result<()> {
        let transfer_account = &mut ctx.accounts.transfer_account;
        transfer_account.owner = ctx.accounts.user.key();
        transfer_account.balance = 0;
        transfer_account.bump = bump;
        Ok(())
    }

    /// 存入 SOL
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        // 从用户账户转账到程序账户
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.transfer_account.to_account_info(),
            },
        );
        system_program::transfer(cpi_context, amount)?;

        let transfer_account = &mut ctx.accounts.transfer_account;
        transfer_account.balance += amount;

        Ok(())
    }

    /// 提取 SOL
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let transfer_account = &mut ctx.accounts.transfer_account;

        require!(transfer_account.balance >= amount, ErrorCode::InsufficientBalance);

        // 从程序账户转账到用户账户
        transfer_account.sub_lamports(amount)?;
        ctx.accounts.user.add_lamports(amount)?;

        transfer_account.balance -= amount;

        Ok(())
    }

    /// 转账给其他用户
    pub fn transfer(ctx: Context<Transfer>, amount: u64) -> Result<()> {
        let from_account = &mut ctx.accounts.from_account;
        require!(from_account.balance >= amount, ErrorCode::InsufficientBalance);

        let to_account = &mut ctx.accounts.to_account;
        require!(from_account.owner == ctx.accounts.from.key(), ErrorCode::Unauthorized);

        from_account.balance -= amount;
        to_account.balance += amount;

        Ok(())
    }
}

// ===== 账户结构 =====

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        space = 8 + TransferAccount::LEN,
        seeds = [b"transfer", user.key().as_ref()],
        bump
    )]
    pub transfer_account: Account<'info, TransferAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"transfer", user.key().as_ref()],
        bump = transfer_account.bump
    )]
    pub transfer_account: Account<'info, TransferAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"transfer", user.key().as_ref()],
        bump = transfer_account.bump
    )]
    pub transfer_account: Account<'info, TransferAccount>,
}

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut)]
    pub from: Signer<'info>,

    #[account(
        mut,
        seeds = [b"transfer", from.key().as_ref()],
        bump = from_account.bump
    )]
    pub from_account: Account<'info, TransferAccount>,

    #[account(
        mut,
        seeds = [b"transfer", to.key().as_ref()],
        bump = to_account.bump
    )]
    pub to_account: Account<'info, TransferAccount>,

    /// CHECK: 只用于 PDA 派生
    pub to: AccountInfo<'info>,
}

// ===== 数据账户 =====

#[account]
pub struct TransferAccount {
    pub owner: Pubkey,     // 账户所有者
    pub balance: u64,      // 账户余额
    pub bump: u8,          // PDA bump
}

impl TransferAccount {
    pub const LEN: usize = 32 + 8 + 1;  // owner + balance + bump
}

// ===== 错误定义 =====

#[error_code]
pub enum ErrorCode {
    #[msg("余额不足")]
    InsufficientBalance,
    #[msg("未授权操作")]
    Unauthorized,
}
```

### 4. 测试脚本

```typescript
// tests/solana-transfer.ts
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaTransfer } from "../target/types/solana_transfer";
import { expect } from "chai";

describe("solana-transfer", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaTransfer as Program<SolanaTransfer>;

  const user = anchor.web3.Keypair.generate();
  const receiver = anchor.web3.Keypair.generate();

  before(async () => {
    // 空投 SOL 给测试账户
    const airdropTx = await provider.connection.requestAirdrop(
      user.publicKey,
      10 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropTx);
  });

  it("初始化转账账户", async () => {
    const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("transfer"), user.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .initialize(255)
      .accounts({ user: user.publicKey })
      .signers([user])
      .rpc();

    const account = await program.account.transferAccount.fetch(pda);
    expect(account.owner.toString()).to.equal(user.publicKey.toString());
    expect(account.balance.toNumber()).to.equal(0);
  });

  it("存入 SOL", async () => {
    const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("transfer"), user.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .deposit(new anchor.BN(1_000_000_000))  // 1 SOL
      .accounts({ user: user.publicKey })
      .signers([user])
      .rpc();

    const account = await program.account.transferAccount.fetch(pda);
    expect(account.balance.toNumber()).to.equal(1_000_000_000);
  });
});
```

### 5. 常用命令

```bash
# 启动本地测试网
solana-test-validator

# 构建合约
anchor build

# 部署合约到本地测试网
anchor deploy

# 运行测试
anchor test

# 生成新程序 ID
anchor keys list

# 查看账户
solana account <ADDRESS>
```

## 重点内容

- Solana 使用 **账户模型**，数据存储在独立账户中
- **PDA**（Program Derived Address）是程序控制的地址，不需要私钥
- Anchor 的 `#[derive(Accounts)]` 宏自动验证账户权限
- `seeds` 和 `bump` 用于派生 PDA 地址
- `#[account]` 宏自动实现序列化/反序列化

## 注意事项

- Solana 合约是无状态的，所有数据存储在外部账户
- PDA 地址不能有对应的私钥
- 每笔交易需要指定所有涉及的账户
- Solana 合约使用 Rust 编写，与 EVM 完全不同

## 常见误区

- 误区：混淆 Solana 的账户模型和 EVM 的存储模型
- 误区：忘记在交易中包含所有账户引用
- 误区：PDA 的 seeds 拼接错误，派生地址不一致
- 误区：测试前未空投 SOL，账户余额不足

## 官方资源扩展

- [Solana 开发文档](https://solana.com/zh/docs) - Solana 官方中文文档，最佳学习资源
- [Anchor 框架文档](https://www.anchor-lang.com/docs) - Anchor 完整文档
- [Solana Cookbook](https://solanacookbook.com/zh/) - Solana 开发实用指南
- [Solana Playground](https://beta.solpg.io/) - 在线 Solana 开发环境