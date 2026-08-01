<template>
  <div class="panel">
    <div class="panel-header">
      <h3>商品分类</h3>
      <button class="btn btn-primary btn-sm" @click="openForm()">+ 新增分类</button>
    </div>
    <div class="panel-body" style="padding:0;">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>分类编码</th><th>分类名称</th><th>描述</th><th>商品数量</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="c in categories" :key="c.id">
              <td><strong>{{ c.code }}</strong></td>
              <td>{{ c.name }}</td>
              <td>{{ c.desc || '-' }}</td>
              <td>{{ goodsCount(c.id) }}</td>
              <td>
                <button class="btn btn-outline btn-xs" @click="openForm(c.id)">编辑</button>
                <button class="btn btn-danger btn-xs" @click="deleteItem(c.id)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { categoryAPI, goodsAPI } from '../api'

const openModal = inject('openModal')
const closeModal = inject('closeModal')
const showConfirm = inject('showConfirm')

const categories = ref([])
const goods = ref([])

onMounted(async () => {
  const [c, g] = await Promise.all([categoryAPI.getAll(), goodsAPI.getAll()])
  categories.value = c.data; goods.value = g.data
})

function goodsCount(catId) { return goods.value.filter(g => g.categoryId === catId).length }

function openForm(id) {
  const cat = id ? categories.value.find(c => c.id === id) : null
  const body = `
    <input type="hidden" id="cfId" value="${cat ? cat.id : ''}">
    <div class="form-group"><label>分类编码 *</label><input id="cfCode" value="${cat ? cat.code : ''}" placeholder="大写英文缩写"></div>
    <div class="form-group"><label>分类名称 *</label><input id="cfName" value="${cat ? cat.name : ''}" placeholder="分类名称"></div>
    <div class="form-group"><label>描述</label><textarea id="cfDesc" rows="2" placeholder="分类描述...">${cat ? cat.desc || '' : ''}</textarea></div>`
  const footer = `<button class="btn btn-outline" onclick="window._closeModal()">取消</button><button class="btn btn-primary" onclick="window._saveCategory()">保存</button>`
  window._closeModal = closeModal
  window._saveCategory = async () => {
    const data = {
      id: document.getElementById('cfId').value || undefined,
      code: document.getElementById('cfCode').value.trim(),
      name: document.getElementById('cfName').value.trim(),
      desc: document.getElementById('cfDesc').value.trim()
    }
    if (!data.code || !data.name) { alert('请填写分类编码和名称'); return }
    await categoryAPI.save(data); closeModal(); refresh()
  }
  openModal(cat ? '编辑分类' : '新增分类', body, footer)
}

async function deleteItem(id) {
  const cat = categories.value.find(c => c.id === id)
  if (!cat) return
  showConfirm(`确定要删除分类「${cat.name}」吗？`, async () => { await categoryAPI.delete(id); refresh() })
}

async function refresh() {
  const [c, g] = await Promise.all([categoryAPI.getAll(), goodsAPI.getAll()])
  categories.value = c.data; goods.value = g.data
}
</script>
