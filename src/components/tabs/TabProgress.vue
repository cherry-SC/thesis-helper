<template>
  <div>
    <!-- 统计卡片 -->
    <div class="grid md:grid-cols-4 gap-6 mb-8">
      <AcademicCard class="text-center">
        <div class="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
          <span class="text-2xl text-white font-bold">{{ totalDays }}</span>
        </div>
        <div class="text-gray-500 text-sm">剩余天数</div>
      </AcademicCard>
      <AcademicCard class="text-center">
        <div class="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-navy-400 to-navy-600 rounded-full flex items-center justify-center">
          <span class="text-2xl text-white font-bold">{{ progressPercent }}%</span>
        </div>
        <div class="text-gray-500 text-sm">总体进度</div>
      </AcademicCard>
      <AcademicCard class="text-center">
        <div class="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
          <span class="text-2xl text-white font-bold">{{ wordCount.toLocaleString() }}</span>
        </div>
        <div class="text-gray-500 text-sm">已写字数</div>
      </AcademicCard>
      <AcademicCard class="text-center">
        <div class="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
          <span class="text-2xl text-white font-bold">{{ milestoneCount }}</span>
        </div>
        <div class="text-gray-500 text-sm">已完成里程碑</div>
      </AcademicCard>
    </div>

    <!-- 时间线 -->
    <AcademicCard class="mb-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="font-semibold text-gray-800">写作计划</h3>
        <button @click="showEditTimeline = true" class="text-navy-600 hover:text-navy-700 text-sm flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          编辑计划
        </button>
      </div>
      <div class="relative">
        <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div class="space-y-6">
          <div v-for="(item, index) in timeline" :key="index" class="relative flex items-start ml-4">
            <div 
              class="absolute left-6 w-5 h-5 rounded-full border-4 border-white shadow-md"
              :class="item.completed ? 'bg-green-500' : item.current ? 'bg-navy-500 animate-pulse-glow' : 'bg-gray-300'"
            ></div>
            <div class="ml-12 flex-1">
              <div class="bg-white border border-gray-100 rounded-lg p-4 shadow-sm" :class="item.current ? 'ring-2 ring-navy-400' : ''">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium text-gray-800">{{ item.title }}</h4>
                  <div class="flex items-center gap-2">
                    <button 
                      v-if="!item.completed && !item.current"
                      @click="removeMilestone(index)"
                      class="text-gray-400 hover:text-red-500"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <span class="text-xs px-2 py-1 rounded" :class="item.completed ? 'bg-green-100 text-green-600' : item.current ? 'bg-navy-100 text-navy-600' : 'bg-gray-100 text-gray-400'">
                      {{ item.completed ? '已完成' : item.current ? '进行中' : '待开始' }}
                    </span>
                  </div>
                </div>
                <p class="text-sm text-gray-500 mb-2">{{ item.description }}</p>
                <div class="flex items-center justify-between text-xs text-gray-400">
                  <span>{{ item.date }}</span>
                  <div class="flex items-center gap-2">
                    <span v-if="item.completed && item.words">字数: {{ item.words.toLocaleString() }}</span>
                    <button 
                      v-if="!item.completed"
                      @click="completeMilestone(index)"
                      class="text-green-600 hover:text-green-700"
                    >
                      {{ item.current ? '完成' : '设为当前' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          @click="addMilestone"
          class="mt-4 ml-12 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-navy-400 hover:text-navy-600 transition-colors flex items-center"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          添加里程碑
        </button>
      </div>
    </AcademicCard>

    <!-- 每日目标 -->
    <AcademicCard>
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-800">写作目标</h3>
        <button @click="showGoalSettings = true" class="text-navy-600 hover:text-navy-700 text-sm">
          设置
        </button>
      </div>
      <div class="mb-4">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-gray-500">今日进度</span>
          <span class="font-medium text-navy-600">{{ todayProgress.toLocaleString() }} / {{ dailyGoal.toLocaleString() }} 字</span>
        </div>
        <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-navy-500 to-navy-600 rounded-full progress-bar"
            :style="{ width: Math.min(todayProgress / dailyGoal * 100, 100) + '%' }"
          ></div>
        </div>
      </div>
      <div class="grid md:grid-cols-3 gap-4">
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="text-xs text-gray-400 mb-1">本周已写</div>
          <div class="text-xl font-bold text-gray-700">{{ weeklyWords.toLocaleString() }} 字</div>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="text-xs text-gray-400 mb-1">本周目标</div>
          <div class="text-xl font-bold text-gray-700">{{ weeklyGoal.toLocaleString() }} 字</div>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="text-xs text-gray-400 mb-1">预计完成</div>
          <div class="text-xl font-bold text-gray-700">{{ estimatedFinish }}</div>
        </div>
      </div>
      
      <div class="mt-4 pt-4 border-t">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-500">更新今日字数</span>
        </div>
        <div class="flex gap-2">
          <input 
            v-model.number="newWords"
            type="number"
            placeholder="输入今日写字数"
            class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
          >
          <button 
            @click="updateTodayWords"
            class="px-6 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors"
          >
            更新
          </button>
        </div>
      </div>
    </AcademicCard>

    <!-- 编辑计划弹窗 -->
    <div v-if="showEditTimeline" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showEditTimeline = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">编辑写作计划</h3>
        
        <div class="space-y-3">
          <div v-for="(item, index) in timeline" :key="index" class="p-3 bg-gray-50 rounded-lg">
            <input v-model="item.title" class="w-full px-3 py-1 border rounded mb-2 text-sm font-medium" placeholder="标题">
            <input v-model="item.description" class="w-full px-3 py-1 border rounded mb-2 text-sm" placeholder="描述">
            <input v-model="item.date" type="date" class="px-3 py-1 border rounded text-sm">
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button @click="showEditTimeline = false" class="flex-1 py-2 border rounded-lg hover:bg-gray-50">取消</button>
          <button @click="saveTimeline" class="flex-1 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700">保存</button>
        </div>
      </div>
    </div>

    <!-- 目标设置弹窗 -->
    <div v-if="showGoalSettings" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showGoalSettings = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">目标设置</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">每日目标（字）</label>
            <input v-model.number="goalSettings.dailyGoal" type="number" class="w-full px-4 py-2 border rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">每周目标（字）</label>
            <input v-model.number="goalSettings.weeklyGoal" type="number" class="w-full px-4 py-2 border rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">截止日期</label>
            <input v-model="goalSettings.deadline" type="date" class="w-full px-4 py-2 border rounded-lg">
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button @click="showGoalSettings = false" class="flex-1 py-2 border rounded-lg hover:bg-gray-50">取消</button>
          <button @click="saveGoalSettings" class="flex-1 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import AcademicCard from '../AcademicCard.vue'
import { progressStore } from '../../utils/storage.js'

const showEditTimeline = ref(false)
const showGoalSettings = ref(false)
const newWords = ref(0)

const goalSettings = reactive({
  dailyGoal: 2000,
  weeklyGoal: 10000,
  deadline: ''
})

const defaultTimeline = [
  { title: '选题确定', description: '确定论文研究方向和题目', date: '2025-12-01', completed: true, words: null },
  { title: '文献综述', description: '完成相关领域的文献调研', date: '2026-01-15', completed: true, words: 5000 },
  { title: '开题报告', description: '提交开题报告并通过审核', date: '2026-01-20', completed: true, words: 8000 },
  { title: '初稿撰写', description: '完成论文主体内容', date: '2026-03-15', completed: false, current: true, words: 28500 },
  { title: '论文修改', description: '根据导师意见修改完善', date: '2026-04-01', completed: false, words: null },
  { title: '终稿提交', description: '提交最终定稿', date: '2026-04-20', completed: false, words: null },
  { title: '答辩准备', description: '准备答辩PPT和材料', date: '2026-05-01', completed: false, words: null }
]

const timeline = ref([])
const todayProgress = ref(0)
const weeklyWords = ref(0)

onMounted(() => {
  loadProgress()
})

const loadProgress = () => {
  const saved = progressStore.get()
  if (saved) {
    timeline.value = saved.timeline || [...defaultTimeline]
    goalSettings.dailyGoal = saved.dailyGoal || 2000
    goalSettings.weeklyGoal = saved.weeklyGoal || 10000
    goalSettings.deadline = saved.deadline || ''
    todayProgress.value = saved.todayProgress || 0
    weeklyWords.value = saved.weeklyWords || 0
  } else {
    timeline.value = [...defaultTimeline]
  }
}

const saveProgress = () => {
  progressStore.save({
    timeline: timeline.value,
    dailyGoal: goalSettings.dailyGoal,
    weeklyGoal: goalSettings.weeklyGoal,
    deadline: goalSettings.deadline,
    todayProgress: todayProgress.value,
    weeklyWords: weeklyWords.value
  })
}

const dailyGoal = computed(() => goalSettings.dailyGoal)
const weeklyGoal = computed(() => goalSettings.weeklyGoal)

const totalDays = computed(() => {
  if (!goalSettings.deadline) return 30
  const diff = new Date(goalSettings.deadline) - new Date()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
})

const progressPercent = computed(() => {
  const completed = timeline.value.filter(t => t.completed).length
  return Math.round(completed / timeline.value.length * 100)
})

const wordCount = computed(() => {
  const current = timeline.value.find(t => t.current)
  return current?.words || 0
})

const milestoneCount = computed(() => {
  return timeline.value.filter(t => t.completed).length
})

const estimatedFinish = computed(() => {
  if (!goalSettings.deadline) return '待设置'
  const date = new Date(goalSettings.deadline)
  return `${date.getMonth() + 1}月${date.getDate()}日`
})

const completeMilestone = (index) => {
  const item = timeline.value[index]
  const newWordCount = wordCount.value + 1000
  
  if (item.current) {
    item.current = false
    item.completed = true
    item.words = newWordCount
    
    const nextIndex = index + 1
    if (nextIndex < timeline.value.length) {
      timeline.value[nextIndex].current = true
    }
  } else {
    timeline.value.forEach((t, i) => {
      t.current = i === index
    })
  }
  
  todayProgress.value = dailyGoal.value
  weeklyWords.value += dailyGoal.value
  saveProgress()
}

const removeMilestone = (index) => {
  timeline.value.splice(index, 1)
  saveProgress()
}

const addMilestone = () => {
  timeline.value.push({
    title: '新里程碑',
    description: '添加描述',
    date: new Date().toISOString().split('T')[0],
    completed: false,
    words: null
  })
  saveProgress()
}

const updateTodayWords = () => {
  todayProgress.value = newWords.value
  weeklyWords.value += newWords.value
  saveProgress()
  newWords.value = 0
}

const saveTimeline = () => {
  saveProgress()
  showEditTimeline.value = false
}

const saveGoalSettings = () => {
  saveProgress()
  showGoalSettings.value = false
}
</script>
