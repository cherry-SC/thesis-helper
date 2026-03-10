<template>
  <div class="min-h-screen">
    <Login v-if="!isLoggedIn" @success="handleLoginSuccess" />
    
    <template v-else>
      <NavBar 
        :current-tab="currentTab" 
        :tabs="tabs" 
        :user="user"
        @update:tab="currentTab = $event"
        @logout="handleLogout"
        @settings="showSettings = true"
      />

      <main class="pt-24 pb-12 px-6">
        <div class="max-w-7xl mx-auto">
          <div class="mb-10 animate-fade-in-up">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              学术论文写作助手
            </h1>
            <p class="text-gray-500 text-lg">
              欢迎回来，{{ user?.name }}！专业的论文查重 · 格式排版 · 参考文献管理工具
            </p>
          </div>

          <TabCheck 
            v-show="currentTab === 'check'"
          />

          <TabFormat 
            v-show="currentTab === 'format'"
          />

          <TabReference 
            v-show="currentTab === 'reference'"
            :selected-style="selectedStyle"
            :citation-styles="citationStyles"
            :generated-ref="references[0]"
            @add="showAddReference = true"
            @delete="deleteReference"
            @copy="copyCitation"
            @update:style="selectedStyle = $event"
            @import="importReference"
            ref="referenceTab"
          />

          <TabProgress 
            v-show="currentTab === 'progress'"
          />
        </div>
      </main>

      <AddReferenceModal 
        :show="showAddReference" 
        @close="showAddReference = false"
        @submit="addReference"
      />

      <!-- 设置弹窗 -->
      <div v-if="showSettings" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showSettings = false">
        <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">个人设置</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">姓名</label>
              <input v-model="settings.name" type="text" class="w-full px-4 py-2 border border-gray-200 rounded-lg">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">邮箱</label>
              <input v-model="settings.email" type="email" class="w-full px-4 py-2 border border-gray-200 rounded-lg" disabled>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">新密码（留空不修改）</label>
              <input v-model="settings.newPassword" type="password" class="w-full px-4 py-2 border border-gray-200 rounded-lg">
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button @click="showSettings = false" class="flex-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">取消</button>
            <button @click="saveSettings" class="flex-1 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700">保存</button>
          </div>

          <div class="mt-6 pt-6 border-t">
            <button @click="exportAllData" class="w-full py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              导出所有数据
            </button>
          </div>
        </div>
      </div>

      <footer class="border-t border-gray-200 py-8 px-6 mt-auto">
        <div class="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2026 ThesisHelper - 学术论文写作助手</p>
          <p class="mt-1">数据存储在本地浏览器中</p>
        </div>
      </footer>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import Login from './components/Login.vue'
import TabCheck from './components/tabs/TabCheck.vue'
import TabFormat from './components/tabs/TabFormat.vue'
import TabReference from './components/tabs/TabReference.vue'
import TabProgress from './components/tabs/TabProgress.vue'
import AddReferenceModal from './components/AddReferenceModal.vue'
import { auth, referenceStore, storage, STORAGE_KEYS } from './utils/storage.js'

const isLoggedIn = ref(false)
const user = ref(null)
const currentTab = ref('check')
const tabs = [
  { id: 'check', name: '论文查重' },
  { id: 'format', name: '格式排版' },
  { id: 'reference', name: '参考文献' },
  { id: 'progress', name: '写作进度' }
]

const showAddReference = ref(false)
const showSettings = ref(false)
const referenceTab = ref(null)

const selectedStyle = ref('GB/T 7714-2015')
const citationStyles = ['GB/T 7714-2015', 'APA 7th', 'MLA 9th', 'Chicago', 'IEEE']

const references = ref([])

const settings = reactive({
  name: '',
  email: '',
  newPassword: ''
})

onMounted(() => {
  checkLogin()
})

const checkLogin = () => {
  user.value = auth.getCurrentUser()
  isLoggedIn.value = !!user.value
  if (user.value) {
    loadReferences()
    settings.name = user.value.name
    settings.email = user.value.email
  }
}

const handleLoginSuccess = (userData) => {
  user.value = userData
  isLoggedIn.value = true
  settings.name = user.value.name
  settings.email = user.value.email
  loadReferences()
}

const handleLogout = () => {
  auth.logout()
  isLoggedIn.value = false
  user.value = null
}

const loadReferences = () => {
  references.value = referenceStore.getAll()
}

const addReference = (ref) => {
  referenceStore.add(ref)
  loadReferences()
}

const deleteReference = (id) => {
  referenceStore.delete(id)
  loadReferences()
}

const copyCitation = (ref) => {
  const citation = `${ref.authors}. ${ref.title}[J]. ${ref.journal}, ${ref.year}.`
  navigator.clipboard.writeText(citation)
}

const importReference = (ref) => {
  referenceStore.add(ref)
  loadReferences()
}

const saveSettings = () => {
  const users = storage.get(STORAGE_KEYS.USERS) || []
  const userIndex = users.findIndex(u => u.id === user.value.id)
  if (userIndex !== -1) {
    users[userIndex].name = settings.name
    if (settings.newPassword) {
      users[userIndex].password = settings.newPassword
    }
    storage.set(STORAGE_KEYS.USERS, users)
  }
  
  user.value.name = settings.name
  storage.set(STORAGE_KEYS.CURRENT_USER, user.value)
  
  showSettings.value = false
}

const exportAllData = () => {
  const data = {
    user: user.value,
    references: referenceStore.getAll(),
    format: storage.get(STORAGE_KEYS.FORMAT_CONFIG)?.[user.value.id],
    progress: storage.get(STORAGE_KEYS.PROGRESS)?.[user.value.id],
    papers: storage.get(STORAGE_KEYS.PAPERS)?.[user.value.id]
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'thesis-helper-backup.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.scroller::-webkit-scrollbar {
  width: 6px;
}
.scroller::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
.scroller::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
.scroller::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
