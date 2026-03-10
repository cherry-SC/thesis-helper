<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">添加参考文献</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">标题</label>
          <input v-model="localRef.title" type="text" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">作者</label>
          <input v-model="localRef.authors" type="text" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">年份</label>
            <input v-model="localRef.year" type="text" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">类型</label>
            <select v-model="localRef.type" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent">
              <option>期刊论文</option>
              <option>书籍</option>
              <option>会议论文</option>
              <option>学位论文</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">期刊/出版社</label>
          <input v-model="localRef.journal" type="text" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent">
        </div>
      </div>
      <div class="flex gap-3 mt-6">
        <button @click="$emit('close')" class="flex-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">取消</button>
        <button @click="submit" class="flex-1 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors">添加</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'submit'])

const localRef = ref({
  title: '',
  authors: '',
  year: '',
  type: '期刊论文',
  journal: ''
})

watch(() => props.show, (val) => {
  if (!val) {
    localRef.value = { title: '', authors: '', year: '', type: '期刊论文', journal: '' }
  }
})

const submit = () => {
  if (localRef.value.title && localRef.value.authors) {
    emit('submit', { ...localRef.value })
    emit('close')
  }
}
</script>
