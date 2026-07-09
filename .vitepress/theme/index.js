import DefaultTheme from 'vitepress/theme'
import { h, ref, onMounted } from 'vue'
import './style.css'

const ACCESS_STORAGE_KEY = 'bri-training-access-v1'
const ACCESS_HASH = '4a547a10159a34bb09095bbef633288e128748c9d119047d130368ee53b9788c'

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

const AccessGate = {
  name: 'AccessGate',
  setup() {
    const locked = ref(true)
    const secret = ref('')
    const error = ref('')
    const checking = ref(false)

    const unlock = () => {
      locked.value = false
      document.documentElement.removeAttribute('data-access-lock')
    }

    onMounted(() => {
      try {
        if (localStorage.getItem(ACCESS_STORAGE_KEY) === ACCESS_HASH) {
          unlock()
          return
        }
      } catch (storageError) {
        error.value = '当前浏览器无法读取本地访问状态，请输入访问密钥。'
      }

      document.documentElement.setAttribute('data-access-lock', 'locked')
    })

    const submit = async () => {
      const value = secret.value.trim()
      if (!value) {
        error.value = '请输入访问密钥。'
        return
      }

      if (!crypto?.subtle) {
        error.value = '当前浏览器不支持安全校验，请更换现代浏览器访问。'
        return
      }

      checking.value = true
      error.value = ''

      try {
        const hash = await sha256Hex(value)
        if (hash !== ACCESS_HASH) {
          error.value = '访问密钥不正确。'
          return
        }

        localStorage.setItem(ACCESS_STORAGE_KEY, hash)
        unlock()
      } catch (submitError) {
        error.value = '校验失败，请刷新后重试。'
      } finally {
        checking.value = false
      }
    }

    return () => {
      if (!locked.value) return null

      return h('div', { class: 'training-access-gate', role: 'dialog', 'aria-modal': 'true' }, [
        h('form', {
          class: 'training-access-card',
          onSubmit: (event) => {
            event.preventDefault()
            submit()
          }
        }, [
          h('div', { class: 'training-access-kicker' }, 'Training Access'),
          h('h1', { class: 'training-access-title' }, '请输入访问密钥'),
          h('p', { class: 'training-access-desc' }, '该知识库仅供培训学习使用，需要验证后查看。'),
          h('input', {
            class: 'training-access-input',
            value: secret.value,
            type: 'password',
            autocomplete: 'current-password',
            autofocus: true,
            placeholder: '访问密钥',
            onInput: (event) => {
              secret.value = event.target.value
            }
          }),
          error.value ? h('p', { class: 'training-access-error' }, error.value) : null,
          h('button', {
            class: 'training-access-button',
            type: 'submit',
            disabled: checking.value
          }, checking.value ? '校验中...' : '进入知识库')
        ])
      ])
    }
  }
}

export default {
  extends: DefaultTheme,
  Layout() {
    return h('div', null, [
      h(DefaultTheme.Layout),
      h(AccessGate)
    ])
  }
}
