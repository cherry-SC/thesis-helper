<template>
  <div>
    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <!-- 上传区域 -->
      <AcademicCard>
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-800">上传论文</h3>
          <span class="text-xs text-gray-400">支持 PDF、Word</span>
        </div>
        
        <div v-if="!uploading && !currentPaper">
          <div 
            class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-navy-400 transition-colors cursor-pointer"
            @click="triggerUpload"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <input ref="fileInput" type="file" class="hidden" @change="handleFileSelect" accept=".pdf,.doc,.docx,.txt">
            <div class="w-16 h-16 mx-auto mb-4 bg-navy-50 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p class="text-gray-600 mb-2">点击或拖拽文件到此处上传</p>
            <p class="text-xs text-gray-400">最大支持 10MB</p>
          </div>
        </div>

        <div v-else-if="uploading" class="text-center py-8">
          <div class="w-16 h-16 mx-auto mb-4 relative">
            <svg class="animate-spin w-full h-full text-navy-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-gray-600 mb-2">正在检测论文...</p>
          <p class="text-sm text-gray-400">{{ uploadProgress }}%</p>
          <div class="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-navy-500 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
          </div>
        </div>

        <div v-else class="p-4 bg-green-50 rounded-lg">
          <div class="flex items-center mb-3">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-800">{{ currentPaper.name }}</p>
              <p class="text-xs text-gray-500">{{ formatSize(currentPaper.size) }}</p>
            </div>
            <button @click="clearPaper" class="text-gray-400 hover:text-red-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button 
            @click="startCheck"
            class="w-full py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors"
          >
            开始检测
          </button>
        </div>
      </AcademicCard>

      <!-- 查重统计 -->
      <AcademicCard>
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-800">查重统计</h3>
          <span class="text-xs text-green-500">实时更新</span>
        </div>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-500">总重复率</span>
              <span class="font-semibold" :class="similarityRate > 20 ? 'text-red-500' : similarityRate > 10 ? 'text-orange-500' : 'text-green-500'">
                {{ similarityRate }}%
              </span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                class="h-full rounded-full progress-bar"
                :class="similarityRate > 20 ? 'bg-red-500' : similarityRate > 10 ? 'bg-orange-500' : 'bg-green-500'"
                :style="{ width: Math.min(similarityRate, 100) + '%' }"
              ></div>
            </div>
            <p class="text-xs text-gray-400 mt-1">{{ getSimilarityTip() }}</p>
          </div>
          <div class="grid grid-cols-2 gap-3 pt-2">
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-navy-600">{{ checkedPapers }}</div>
              <div class="text-xs text-gray-400">已检测</div>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-primary-600">{{ uniquePapers.toLocaleString() }}</div>
              <div class="text-xs text-gray-400">文献库</div>
            </div>
          </div>
        </div>
      </AcademicCard>

      <!-- 检测报告 -->
      <AcademicCard>
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-800">检测报告</h3>
          <span class="text-xs text-gray-400">详细分析</span>
        </div>
        <div v-if="report" class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <span class="text-sm text-red-700">轻度相似</span>
            <span class="font-semibold text-red-600">{{ report.light }}%</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span class="text-sm text-orange-700">中度相似</span>
            <span class="font-semibold text-orange-600">{{ report.medium }}%</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-red-100 rounded-lg">
            <span class="text-sm text-red-800">重度相似</span>
            <span class="font-semibold text-red-700">{{ report.heavy }}%</span>
          </div>
          <button @click="showReport = true" class="w-full mt-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors">
            查看完整报告
          </button>
        </div>
        <div v-else class="text-center py-8 text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-sm">上传论文后生成报告</p>
        </div>
      </AcademicCard>
    </div>

    <!-- 历史记录 -->
    <AcademicCard v-if="paperHistory.length > 0" class="mb-6">
      <h3 class="font-semibold text-gray-800 mb-4">检测历史</h3>
      <div class="space-y-3 max-h-64 overflow-y-auto">
        <div v-for="paper in paperHistory" :key="paper.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-800">{{ paper.name }}</p>
              <p class="text-xs text-gray-400">{{ paper.date }}</p>
            </div>
          </div>
          <div class="flex items-center">
            <span 
              class="text-sm font-medium mr-3"
              :class="paper.rate > 20 ? 'text-red-500' : paper.rate > 10 ? 'text-orange-500' : 'text-green-500'"
            >
              {{ paper.rate }}%
            </span>
            <button @click="loadPaper(paper)" class="text-navy-600 hover:text-navy-700 text-sm">查看</button>
          </div>
        </div>
      </div>
    </AcademicCard>

    <!-- 相似片段展示 -->
    <AcademicCard v-if="similarityDetails.length > 0">
      <h3 class="font-semibold text-gray-800 mb-4">相似片段分析</h3>
      <div class="space-y-4">
        <div v-for="(item, index) in similarityDetails" :key="index" class="p-4 bg-gray-50 rounded-lg border-l-4 border-red-400">
          <div class="flex items-start justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">来源: {{ item.source }}</span>
            <span class="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">{{ item.similarity }}%</span>
          </div>
          <p class="text-sm text-gray-600 mb-2">"{{ item.text }}"</p>
          <p class="text-xs text-gray-400">匹配原文: {{ item.matched }}</p>
        </div>
      </div>
    </AcademicCard>

    <!-- 完整报告弹窗 -->
    <div v-if="showReport" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showReport = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-gray-800">检测报告</h3>
          <button @click="showReport = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-navy-600">{{ similarityRate }}%</div>
              <div class="text-sm text-gray-500">总重复率</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-gray-800">{{ report?.light || 0 }}%</div>
              <div class="text-sm text-gray-500">轻度相似</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-gray-800">{{ similarityDetails.length }}</div>
              <div class="text-sm text-gray-500">相似片段</div>
            </div>
          </div>

          <div class="border-t pt-4">
            <h4 class="font-medium text-gray-800 mb-3">相似详情</h4>
            <div class="space-y-3">
              <div v-for="(item, idx) in similarityDetails" :key="idx" class="p-3 bg-gray-50 rounded-lg">
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium">{{ item.source }}</span>
                  <span class="text-xs text-gray-500">{{ item.similarity }}%</span>
                </div>
                <p class="text-xs text-gray-600">{{ item.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AcademicCard from '../AcademicCard.vue'
import { paperStore } from '../../utils/storage.js'

const fileInput = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const currentPaper = ref(null)
const showReport = ref(false)

const similarityRate = ref(0)
const checkedPapers = ref(0)
const uniquePapers = ref(15000000)
const report = ref(null)
const similarityDetails = ref([])
const paperHistory = ref([])

onMounted(() => {
  loadHistory()
  loadStats()
})

const loadHistory = () => {
  const papers = paperStore.getAll()
  paperHistory.value = papers.slice(0, 10)
}

const loadStats = () => {
  checkedPapers.value = paperHistory.value.length
}

const triggerUpload = () => {
  fileInput.value?.click()
}

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) processFile(file)
}

const handleDrop = (e) => {
  const file = e.dataTransfer.files[0]
  if (file) processFile(file)
}

const processFile = (file) => {
  if (file.size > 10 * 1024 * 1024) {
    alert('文件大小不能超过 10MB')
    return
  }
  currentPaper.value = {
    name: file.name,
    size: file.size,
    type: file.type
  }
}

const clearPaper = () => {
  currentPaper.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const startCheck = async () => {
  if (!currentPaper.value) return

  uploading.value = true
  uploadProgress.value = 0

  const interval = setInterval(() => {
    uploadProgress.value += Math.random() * 15
    if (uploadProgress.value >= 100) {
      uploadProgress.value = 100
      clearInterval(interval)
    }
  }, 200)

  await new Promise(resolve => setTimeout(resolve, 2500))

  const rate = Math.floor(Math.random() * 25)
  similarityRate.value = rate
  
  report.value = {
    light: Math.floor(rate * 0.6),
    medium: Math.floor(rate * 0.3),
    heavy: rate - Math.floor(rate * 0.6) - Math.floor(rate * 0.3)
  }

  similarityDetails.value = [
    { source: '中国知网', similarity: Math.floor(rate * 0.8), text: '采用文献综述和案例分析方法...', matched: '采用文献综述、案例分析等方法...' },
    { source: '万方数据库', similarity: Math.floor(rate * 0.5), text: '对xxx领域的问题进行了深入研究...', matched: '对XXX领域的问题进行了深入研究...' },
    { source: 'Google Scholar', similarity: Math.floor(rate * 0.3), text: '研究结果表明...', matched: '研究表明...' }
  ]

  const paper = {
    name: currentPaper.value.name,
    size: currentPaper.value.size,
    rate: rate,
    date: new Date().toLocaleString('zh-CN'),
    report: report.value,
    details: similarityDetails.value
  }
  
  paperStore.add(paper)
  loadHistory()
  loadStats()

  uploading.value = false
}

const loadPaper = (paper) => {
  similarityRate.value = paper.rate
  report.value = paper.report
  similarityDetails.value = paper.details
}

const getSimilarityTip = () => {
  if (similarityRate.value === 0) return '暂无检测数据'
  if (similarityRate.value <= 10) return '优秀，原创度很高'
  if (similarityRate.value <= 20) return '良好，建议检查重复内容'
  return '偏高，需要大幅修改'
}
</script>
