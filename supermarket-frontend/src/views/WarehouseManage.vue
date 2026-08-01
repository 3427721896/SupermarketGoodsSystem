<template>
  <div class="panel">
    <div class="panel-header">
      <h3>仓库列表</h3>
      <button class="btn btn-primary btn-sm" @click="openForm()">+ 新增仓库</button>
    </div>
    <div class="panel-body" style="padding:0;">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>仓库编码</th><th>仓库名称</th><th>负责人</th><th>地址</th><th>容量</th><th>商品数</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="w in warehouses" :key="w.id">
              <td><strong>{{ w.code }}</strong></td>
              <td>{{ w.name }}</td>
              <td>{{ w.manager || '-' }}</td>
              <td>{{ w.address || '-' }}</td>
              <td>{{ w.capacity }}</td>
              <td>{{ goodsCount(w.id) }}</td>
              <td><span class="badge" :class="w.status === 'active' ? 'badge-success' : 'badge-warning'">{{ w.status === 'active' ? '启用' : '停用' }}</span></td>
              <td>
                <button class="btn btn-outline btn-xs" @click="openForm(w.id)">编辑</button>
                <button class="btn btn-danger btn-xs" @click="deleteItem(w.id)">删除</button>
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
import { warehouseAPI, goodsAPI } from '../api'

const openModal = inject('openModal')
const closeModal = inject('closeModal')
const showConfirm = inject('showConfirm')

const warehouses = ref([])
const goods = ref([])

onMounted(async () => {
  const [w, g] = await Promise.all([warehouseAPI.getAll(), goodsAPI.getAll()])
  warehouses.value = w.data; goods.value = g.data
})

function goodsCount(whId) { return goods.value.filter(g => g.warehouseId === whId).length }

function openForm(id) {
  const wh = id ? warehouses.value.find(w => w.id === id) : null
  const body = `
    <input type="hidden" id="wfId" value="${wh ? wh.id : ''}">
    <div class="form-row">
      <div class="form-group"><label>仓库编码 *</label><input id="wfCode" value="${wh ? wh.code : ''}" placeholder="如 WH-D"></div>
      <div class="form-group"><label>仓库名称 *</label><input id="wfName" value="${wh ? wh.name : ''}" placeholder="仓库名称"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>负责人</label><input id="wfManager" value="${wh ? wh.manager || '' : ''}" placeholder="负责人姓名"></div>
      <div class="form-group"><label>容量</label><input id="wfCapacity" type="number" value="${wh ? wh.capacity : 1000}"></div>
    </div>
    <div class="form-group"><label>地址</label><input id="wfAddress" value="${wh ? wh.address || '' : ''}" placeholder="仓库地址"></div>`
  const footer = `<button class="btn btn-outline" onclick="window._closeModal()">取消</button><button class="btn btn-primary" onclick="window._saveWarehouse()">保存</button>`
  window._closeModal = closeModal
  window._saveWarehouse = async () => {
    const data = {
      id: document.getElementById('wfId').value || undefined,
      code: document.getElementById('wfCode').value.trim(),
      name: document.getElementById('wfName').value.trim(),
      manager: document.getElementById('wfManager').value.trim(),
      capacity: parseInt(document.getElementById('wfCapacity').value) || 0,
      address: document.getElementById('wfAddress').value.trim(),
      status: 'active'
    }
    if (!data.code || !data.name) { alert('请填写仓库编码和名称'); return }
    await warehouseAPI.save(data); closeModal(); refresh()
  }
  openModal(wh ? '编辑仓库' : '新增仓库', body, footer)
}

async function deleteItem(id) {
  const wh = warehouses.value.find(w => w.id === id)
  if (!wh) return
  showConfirm(`确定要删除仓库「${wh.name}」吗？`, async () => { await warehouseAPI.delete(id); refresh() })
}

async function refresh() {
  const [w, g] = await Promise.all([warehouseAPI.getAll(), goodsAPI.getAll()])
  warehouses.value = w.data; goods.value = g.data
}
</script>
