<template>
  <div>
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- 格式设置 -->
      <AcademicCard>
        <h3 class="font-semibold text-gray-800 mb-4">论文格式设置</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">论文类型</label>
            <select v-model="localConfig.type" @change="saveConfig" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent">
              <option>本科毕业论文</option>
              <option>硕士学术论文</option>
              <option>博士学位论文</option>
              <option>期刊投稿论文</option>
              <option>课程论文</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">专业学科</label>
            <select v-model="localConfig.subject" @change="saveConfig" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent">
              <option>计算机科学</option>
              <option>经济学</option>
              <option>法学</option>
              <option>文学</option>
              <option>工学</option>
              <option>理学</option>
              <option>管理学</option>
              <option>教育学</option>
              <option>医学</option>
              <option>其他</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">引用格式</label>
            <select v-model="localConfig.citation" @change="saveConfig" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent">
              <option>GB/T 7714-2015</option>
              <option>APA 7th</option>
              <option>MLA 9th</option>
              <option>Chicago</option>
              <option>IEEE</option>
              <option>Harvard</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">正文字体</label>
              <select v-model="localConfig.font" @change="saveConfig" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>宋体</option>
                <option>Times New Roman</option>
                <option>黑体</option>
                <option>微软雅黑</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">字号</label>
              <select v-model="localConfig.fontSize" @change="saveConfig" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>小四 (12pt)</option>
                <option>五号 (10.5pt)</option>
                <option>小五 (9pt)</option>
                <option>四号 (14pt)</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">行距</label>
              <select v-model="localConfig.lineSpacing" @change="saveConfig" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>1.5倍</option>
                <option>单倍</option>
                <option>1.75倍</option>
                <option>2倍</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">页边距</label>
              <select v-model="localConfig.margin" @change="saveConfig" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>上下2.5cm 左右3cm</option>
                <option>上下2cm 左右2.5cm</option>
                <option>上下2.54cm 左右3.17cm</option>
              </select>
            </div>
          </div>
        </div>
      </AcademicCard>

      <!-- 排版预览 -->
      <AcademicCard>
        <h3 class="font-semibold text-gray-800 mb-4">排版预览</h3>
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <div class="text-xs text-gray-400 mb-4 text-center">预览效果</div>
          <div 
            class="text-justify leading-relaxed bg-white p-4 border"
            :style="previewStyle"
          >
            <p class="mb-4 text-center font-bold" :style="{ fontFamily: localConfig.font === '宋体' ? 'serif' : 'sans-serif' }">
              论文标题示例
            </p>
            <p class="mb-4" :style="textStyle">
              本文以XXX为研究对象，采用文献综述、案例分析等方法，对{{ localConfig.subject }}领域的问题进行了深入研究。研究表明，{{ getConclusion() }}。
            </p>
            <p :style="textStyle">
              <strong>关键词：</strong>{{ localConfig.subject }}；研究方法；结论与建议
            </p>
          </div>
        </div>
        <div class="mt-4 flex gap-3">
          <button @click="exportConfig" class="flex-1 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors flex items-center justify-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            导出配置
          </button>
          <button @click="resetConfig" class="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            重置
          </button>
        </div>
      </AcademicCard>
    </div>

    <!-- 格式检查清单 -->
    <AcademicCard>
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-800">格式检查清单</h3>
        <div class="text-sm text-gray-500">
          已完成 <span class="text-green-600 font-medium">{{ completedCount }}/{{ checklist.length }}</span> 项
        </div>
      </div>
      <div class="grid md:grid-cols-4 gap-4">
        <div v-for="item in checklist" :key="item.name" 
          class="p-4 rounded-lg border-2 transition-all cursor-pointer"
          :class="item.checked ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300'"
          @click="toggleCheck(item)"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-2xl">{{ item.icon }}</span>
            <svg v-if="item.checked" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="font-medium text-gray-700 text-sm">{{ item.name }}</div>
          <div class="text-xs mt-1" :class="item.checked ? 'text-green-600' : 'text-gray-400'">
            {{ item.checked ? '已完成' : '待检查' }}
          </div>
        </div>
      </div>
    </AcademicCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AcademicCard from '../AcademicCard.vue'
import { formatStore, auth } from '../../utils/storage.js'

const defaultConfig = {
  type: '本科毕业论文',
  subject: '计算机科学',
  citation: 'GB/T 7714-2015',
  font: '宋体',
  fontSize: '小四 (12pt)',
  lineSpacing: '1.5倍',
  margin: '上下2.5cm 左右3cm'
}

const localConfig = ref({ ...defaultConfig })

const checklist = ref([
  { name: '封面格式', icon: '📄', checked: false },
  { name: '目录自动生成', icon: '📑', checked: false },
  { name: '中英文摘要', icon: '📝', checked: false },
  { name: '章节标题', icon: '🔤', checked: false },
  { name: '图表规范', icon: '📊', checked: false },
  { name: '参考文献格式', icon: '📚', checked: false },
  { name: '页眉页脚', icon: '📖', checked: false },
  { name: '行距段距', icon: '📏', checked: false }
])

onMounted(() => {
  loadConfig()
})

const loadConfig = () => {
  const saved = formatStore.get()
  if (saved) {
    localConfig.value = { ...defaultConfig, ...saved }
  }
}

const saveConfig = () => {
  formatStore.save(localConfig.value)
}

const resetConfig = () => {
  localConfig.value = { ...defaultConfig }
  saveConfig()
}

const toggleCheck = (item) => {
  item.checked = !item.checked
  saveConfig()
}

const exportConfig = () => {
  const configText = `论文格式配置
================
论文类型：${localConfig.value.type}
专业学科：${localConfig.value.subject}
引用格式：${localConfig.value.citation}
正文字体：${localConfig.value.font}
字号：${localConfig.value.fontSize}
行距：${localConfig.value.lineSpacing}
页边距：${localConfig.value.margin}

检查清单：
${checklist.value.map(c => `[${c.checked ? '✓' : ' '}] ${c.name}`).join('\n')}
`
  const blob = new Blob([configText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '论文格式配置.txt'
  a.click()
  URL.revokeObjectURL(url)
}

const completedCount = computed(() => checklist.value.filter(c => c.checked).length)

const previewStyle = computed(() => ({
  fontSize: localConfig.value.fontSize.split(' ')[1]?.replace('(', '').replace('pt)', '') + 'pt',
  lineHeight: localConfig.value.lineSpacing
}))

const textStyle = computed(() => ({
  fontFamily: localConfig.value.font === '宋体' ? 'serif' : localConfig.value.font === 'Times New Roman' ? 'Times New Roman, serif' : 'sans-serif',
  fontSize: localConfig.value.fontSize.split(' ')[1]?.replace('(', '').replace('pt)', '') + 'pt',
  lineHeight: localConfig.value.lineSpacing
}))

const getConclusion = () => {
  if (localConfig.value.type === '本科毕业论文') {
    return '通过实证分析验证了假设，具有一定的理论和实践意义'
  } else if (localConfig.value.type === '硕士学术论文') {
    return '提出了创新性的理论框架和方法，为该领域研究提供了新思路'
  } else if (localConfig.value.type === '博士学位论文') {
    return '建立了系统的理论体系，在学术上具有重要创新价值'
  }
  return '得出有价值的结论和建议'
}
</script>
