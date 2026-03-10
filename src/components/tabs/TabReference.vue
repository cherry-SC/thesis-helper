<template>
  <div>
    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <!-- 文献库 -->
      <div class="md:col-span-2">
        <AcademicCard>
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-gray-800">参考文献库</h3>
            <div class="flex gap-2">
              <button @click="$emit('add')" class="px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors text-sm flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                添加文献
              </button>
              <button @click="showImport = true" class="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                导入
              </button>
              <button @click="exportBibtex" class="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                导出BibTeX
              </button>
            </div>
          </div>
          
          <div class="mb-4 flex gap-2">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="搜索文献标题、作者..." 
              class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
            >
            <select v-model="filterType" class="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="">全部类型</option>
              <option>期刊论文</option>
              <option>书籍</option>
              <option>会议论文</option>
              <option>学位论文</option>
              <option>网页</option>
            </select>
          </div>

          <div v-if="filteredRefs.length === 0" class="text-center py-12 text-gray-400">
            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p>暂无文献，请添加或导入</p>
          </div>

          <div v-else class="space-y-3 max-h-96 overflow-y-auto">
            <div v-for="ref in filteredRefs" :key="ref.id" class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="font-medium text-gray-800 text-sm mb-1">{{ ref.title }}</div>
                  <div class="text-xs text-gray-500 mb-2">{{ ref.authors }}</div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xs px-2 py-0.5 bg-navy-100 text-navy-600 rounded">{{ ref.type }}</span>
                    <span class="text-xs text-gray-400">{{ ref.journal }}, {{ ref.year }}</span>
                    <span v-if="ref.doi" class="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded">DOI: {{ ref.doi }}</span>
                  </div>
                </div>
                <div class="flex gap-1 ml-2">
                  <button @click="copyCitation(ref)" class="p-1.5 text-gray-400 hover:text-navy-600 transition-colors" title="复制引用">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button @click="editRef(ref)" class="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="编辑">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="$emit('delete', ref.id)" class="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="删除">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AcademicCard>
      </div>

      <!-- 统计 -->
      <AcademicCard>
        <h3 class="font-semibold text-gray-800 mb-4">引用统计</h3>
        <div class="space-y-4">
          <div class="text-center p-4 bg-gradient-to-br from-navy-500 to-navy-700 rounded-xl text-white">
            <div class="text-3xl font-bold mb-1">{{ references.length }}</div>
            <div class="text-sm opacity-80">总文献数</div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="text-center p-3 bg-blue-50 rounded-lg">
              <div class="text-xl font-bold text-blue-600">{{ journalCount }}</div>
              <div class="text-xs text-gray-500">期刊论文</div>
            </div>
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <div class="text-xl font-bold text-green-600">{{ bookCount }}</div>
              <div class="text-xs text-gray-500">书籍</div>
            </div>
            <div class="text-center p-3 bg-purple-50 rounded-lg">
              <div class="text-xl font-bold text-purple-600">{{ conferenceCount }}</div>
              <div class="text-xs text-gray-500">会议论文</div>
            </div>
            <div class="text-center p-3 bg-orange-50 rounded-lg">
              <div class="text-xl font-bold text-orange-600">{{ thesisCount }}</div>
              <div class="text-xs text-gray-500">学位论文</div>
            </div>
          </div>
        </div>
      </AcademicCard>
    </div>

    <!-- 引用生成器 -->
    <AcademicCard>
      <h3 class="font-semibold text-gray-800 mb-4">快速引用生成</h3>
      <div class="flex flex-wrap gap-3 mb-4">
        <button 
          v-for="style in citationStyles" 
          :key="style"
          @click="$emit('update:style', style)"
          :class="[
            'px-4 py-2 rounded-lg text-sm transition-colors',
            selectedStyle === style 
              ? 'bg-navy-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ style }}
        </button>
      </div>
      <div class="bg-gray-50 rounded-lg p-4 font-mono text-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-500">引用预览</span>
          <button class="text-navy-600 hover:text-navy-700 text-xs" @click="copyGenerated">复制</button>
        </div>
        <p class="text-gray-700">{{ generatedCitation }}</p>
      </div>
    </AcademicCard>

    <!-- 导入弹窗 -->
    <div v-if="showImport" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showImport = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">导入文献</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">导入方式</label>
            <div class="flex gap-4">
              <label class="flex items-center">
                <input type="radio" v-model="importType" value="bibtex" class="mr-2"> BibTeX
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="importType" value="text" class="mr-2"> 手动输入
              </label>
            </div>
          </div>

          <div v-if="importType === 'bibtex'">
            <label class="block text-sm font-medium text-gray-600 mb-2">粘贴 BibTeX 内容</label>
            <textarea 
              v-model="bibtexContent"
              rows="8"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg font-mono text-xs"
              placeholder="@article{key,&#10;  author = {Author Name},&#10;  title = {Title},&#10;  journal = {Journal},&#10;  year = {2024}&#10;}"
            ></textarea>
          </div>

          <div v-else>
            <div class="space-y-3">
              <input v-model="importRef.title" placeholder="标题" class="w-full px-4 py-2 border rounded-lg">
              <input v-model="importRef.authors" placeholder="作者（用逗号分隔）" class="w-full px-4 py-2 border rounded-lg">
              <div class="grid grid-cols-2 gap-3">
                <input v-model="importRef.year" placeholder="年份" class="px-4 py-2 border rounded-lg">
                <select v-model="importRef.type" class="px-4 py-2 border rounded-lg">
                  <option value="期刊论文">期刊论文</option>
                  <option value="书籍">书籍</option>
                  <option value="会议论文">会议论文</option>
                  <option value="学位论文">学位论文</option>
                </select>
              </div>
              <input v-model="importRef.journal" placeholder="期刊/出版社" class="w-full px-4 py-2 border rounded-lg">
            </div>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button @click="showImport = false" class="flex-1 py-2 border rounded-lg hover:bg-gray-50">取消</button>
          <button @click="handleImport" class="flex-1 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700">导入</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AcademicCard from '../AcademicCard.vue'
import { referenceStore, auth } from '../../utils/storage.js'

const props = defineProps({
  selectedStyle: String,
  citationStyles: Array,
  generatedRef: Object
})

const emit = defineEmits(['add', 'delete', 'copy', 'update:style', 'import'])

const searchQuery = ref('')
const filterType = ref('')
const showImport = ref(false)
const importType = ref('bibtex')
const bibtexContent = ref('')
const importRef = ref({ title: '', authors: '', year: '', type: '期刊论文', journal: '' })

const references = ref([])

onMounted(() => {
  loadReferences()
})

const loadReferences = () => {
  references.value = referenceStore.getAll()
}

const filteredRefs = computed(() => {
  let result = references.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(r => 
      r.title.toLowerCase().includes(query) || 
      r.authors.toLowerCase().includes(query)
    )
  }
  if (filterType.value) {
    result = result.filter(r => r.type === filterType.value)
  }
  return result
})

const journalCount = computed(() => references.value.filter(r => r.type === '期刊论文').length)
const bookCount = computed(() => references.value.filter(r => r.type === '书籍').length)
const conferenceCount = computed(() => references.value.filter(r => r.type === '会议论文').length)
const thesisCount = computed(() => references.value.filter(r => r.type === '学位论文').length)

const generatedCitation = computed(() => {
  const ref = props.generatedRef || references.value[0]
  if (!ref) return '暂无文献'
  
  if (props.selectedStyle === 'GB/T 7714-2015') {
    return `${ref.authors}. ${ref.title}[${getTypeCode(ref.type)}]. ${ref.journal}, ${ref.year}.`
  } else if (props.selectedStyle === 'APA 7th') {
    return `${ref.authors} (${ref.year}). ${ref.title}. ${ref.journal}.`
  } else if (props.selectedStyle === 'MLA 9th') {
    return `${ref.authors}. "${ref.title}." ${ref.journal}, ${ref.year}.`
  } else if (props.selectedStyle === 'IEEE') {
    return `${ref.authors}, "${ref.title}," ${ref.journal}, ${ref.year}.`
  }
  return `${ref.authors}. ${ref.title}. ${ref.journal}, ${ref.year}.`
})

const getTypeCode = (type) => {
  const map = {
    '期刊论文': 'J',
    '书籍': 'M',
    '会议论文': 'C',
    '学位论文': 'D',
    '网页': 'EB'
  }
  return map[type] || 'J'
}

const copyCitation = (ref) => {
  const citation = generatedCitation.value
  navigator.clipboard.writeText(citation)
}

const copyGenerated = () => {
  navigator.clipboard.writeText(generatedCitation.value)
}

const editRef = (ref) => {
  importRef.value = { ...ref }
  importType.value = 'text'
  showImport.value = true
}

const exportBibtex = () => {
  const bibtex = references.value.map(ref => {
    const key = ref.authors.split(',')[0]?.trim().replace(/\s/g, '') + ref.year
    const type = ref.type === '期刊论文' ? 'article' : ref.type === '书籍' ? 'book' : ref.type === '会议论文' ? 'inproceedings' : 'phdthesis'
    return `@${type}{${key},
  author = {${ref.authors}},
  title = {${ref.title}},
  journal = {${ref.journal}},
  year = {${ref.year}}
}`
  }).join('\n\n')
  
  const blob = new Blob([bibtex], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'references.bib'
  a.click()
  URL.revokeObjectURL(url)
}

const handleImport = () => {
  if (importType.value === 'text' && importRef.value.title) {
    emit('import', { ...importRef.value })
  } else if (importType.value === 'bibtex' && bibtexContent.value) {
    // 简单的 BibTeX 解析
    const lines = bibtexContent.value.split('\n')
    let current = {}
    lines.forEach(line => {
      const authorMatch = line.match(/author\s*=\s*\{(.+?)\}/)
      const titleMatch = line.match(/title\s*=\s*\{(.+?)\}/)
      const journalMatch = line.match(/journal\s*=\s*\{(.+?)\}/)
      const yearMatch = line.match(/year\s*=\s*\{(.+?)\}/)
      if (authorMatch) current.authors = authorMatch[1]
      if (titleMatch) current.title = titleMatch[1]
      if (journalMatch) current.journal = journalMatch[1]
      if (yearMatch) current.year = yearMatch[1]
    })
    if (current.title) {
      current.type = '期刊论文'
      emit('import', current)
    }
  }
  showImport.value = false
  importRef.value = { title: '', authors: '', year: '', type: '期刊论文', journal: '' }
  bibtexContent.value = ''
}

defineExpose({ loadReferences })
</script>
