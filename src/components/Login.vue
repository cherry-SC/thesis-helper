<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-700 to-navy-500 px-4">
    <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
    
    <div class="w-full max-w-md relative">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white">ThesisHelper</h1>
        <p class="text-white/60 mt-2">学术论文写作助手</p>
      </div>

      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <div class="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button 
            @click="mode = 'login'"
            :class="['flex-1 py-2 rounded-md text-sm font-medium transition-all', mode === 'login' ? 'bg-white text-navy-600 shadow-sm' : 'text-gray-500']"
          >
            登录
          </button>
          <button 
            @click="mode = 'register'"
            :class="['flex-1 py-2 rounded-md text-sm font-medium transition-all', mode === 'register' ? 'bg-white text-navy-600 shadow-sm' : 'text-gray-500']"
          >
            注册
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="mode === 'register'">
            <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
            <input 
              v-model="form.name"
              type="text" 
              required
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              placeholder="请输入姓名"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <input 
              v-model="form.email"
              type="email" 
              required
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              placeholder="example@mail.com"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input 
              v-model="form.password"
              type="password" 
              required
              minlength="6"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              placeholder="至少6位"
            >
          </div>

          <div v-if="mode === 'register'">
            <label class="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
            <input 
              v-model="form.confirmPassword"
              type="password" 
              required
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              placeholder="再次输入密码"
            >
          </div>

          <div v-if="error" class="text-red-500 text-sm text-center">{{ error }}</div>
          
          <div v-if="success" class="text-green-500 text-sm text-center">{{ success }}</div>

          <button 
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-gradient-to-r from-navy-600 to-navy-700 text-white rounded-lg font-medium hover:from-navy-700 hover:to-navy-800 transition-all disabled:opacity-50"
          >
            {{ loading ? '处理中...' : (mode === 'login' ? '登录' : '注册') }}
          </button>
        </form>

        <div class="mt-6 pt-6 border-t border-gray-100 text-center">
          <p class="text-sm text-gray-500">
            演示账号: demo@mail.com / 123456
          </p>
        </div>
      </div>

      <p class="text-center text-white/40 text-sm mt-6">
        © 2026 ThesisHelper - 助力学术研究
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { auth } from '../utils/storage.js'

const emit = defineEmits(['success'])

const mode = ref('login')
const loading = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  
  if (mode.value === 'register' && form.password !== form.confirmPassword) {
    error.value = '两次密码输入不一致'
    return
  }

  loading.value = true

  await new Promise(resolve => setTimeout(resolve, 500))

  if (mode.value === 'login') {
    const user = auth.login(form.email, form.password)
    if (!user) {
      if (form.email === 'demo@mail.com' && form.password === '123456') {
        const demoUser = { id: 999, name: '演示用户', email: 'demo@mail.com' }
        localStorage.setItem('thesis_helper_user', JSON.stringify(demoUser))
        emit('success', demoUser)
      } else {
        error.value = '邮箱或密码错误'
      }
    } else {
      emit('success', user)
    }
  } else {
    const result = auth.register(form.name, form.email, form.password)
    if (result.error) {
      error.value = result.error
    } else {
      success.value = '注册成功，正在跳转...'
      setTimeout(() => emit('success', result), 1000)
    }
  }

  loading.value = false
}
</script>

<style scoped>
.bg-grid-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>
