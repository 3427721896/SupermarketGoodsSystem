<template>
  <div class="panel">
    <div class="panel-header">
      <h3>供应商列表</h3>
      <button class="btn btn-primary btn-sm" @click="openForm()">+ 新增供应商</button>
    </div>
    <div class="panel-body" style="padding:0;">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>编码</th><th>供应商名称</th><th>联系人</th><th>电话</th><th>地址</th><th>供应商品数</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="s in suppliers" :key="s.id">
              <td><strong>{{ s.code }}</strong></td>
              <td>{{ s.name }}</td>
              <td>{{ s.contact || '-' }}</td>
              <td>{{ s.phone || '-' }}</td>
              <td>{{ s.address || '-' }}</td>
              <td>{{ goodsCount(s.id) }}</td>
              <td>
                <button class="btn btn-outline btn-xs" @click="openForm(s.id)">编辑</button>
                <button class="btn btn-danger btn-xs" @click="deleteItem(s.id)">删除</button>
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
import { supplierAPI, goodsAPI } from '../api'

const openModal = inject('openModal')
const closeModal = inject('closeModal')
const showConfirm = inject('showConfirm')

const suppliers = ref([])
const goods = ref([])

onMounted(async () => {
  const [s, g] = await Promise.all([supplierAPI.getAll(), goodsAPI.getAll()])
  suppliers.value = s.data; goods.value = g.data
})

function goodsCount(supId) { return goods.value.filter(g => g.supplierId === supId).length }

function openForm(id) {
  const sup = id ? suppliers.value.find(s => s.id === id) : null
  const body = `
    <input type="hidden" id="sfId" value="${sup ? sup.id : ''}">
    <div class="form-row">
      <div class="form-group"><label>供应商编码 *</label><input id="sfCode" value="${sup ? sup.code : ''}" placeholder="如 SUP006"></div>
      <div class="form-group"><label>供应商名称 *</label><input id="sfName" value="${sup ? sup.name : ''}" placeholder="公司名称"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>联系人</label><input id="sfContact" value="${sup ? sup.contact || '' : ''}" placeholder="联系人姓名"></div>
      <div class="form-group"><label>联系电话</label><input id="sfPhone" value="${sup ? sup.phone || '' : ''}" placeholder="手机/座机"></div>
    </div>
    <div class="form-group"><label>地址</label><input id="sfAddress" value="${sup ? sup.address || '' : ''}" placeholder="公司地址"></div>`
  const footer = `<button class="btn btn-outline" onclick="window._closeModal()">取消</button><button class="btn btn-primary" onclick="window._saveSupplier()">保存</button>`
  window._closeModal = closeModal
  window._saveSupplier = async () => {
    const data = {
      id: document.getElementById('sfId').value || undefined,
      code: document.getElementById('sfCode').value.trim(),
      name: document.getElementById('sfName').value.trim(),
      contact: document.getElementById('sfContact').value.trim(),
      phone: document.getElementById('sfPhone').value.trim(),
      address: document.getElementById('sfAddress').value.trim()
    }
    if (!data.code || !data.name) { alert('请填写供应商编码和名称'); return }
    await supplierAPI.save(data); closeModal(); refresh()
  }
  openModal(sup ? '编辑供应商' : '新增供应商', body, footer)
}

async function deleteItem(id) {
  const sup = suppliers.value.find(s => s.id === id)
  if (!sup) return
  showConfirm(`确定要删除供应商「${sup.name}」吗？`, async () => { await supplierAPI.delete(id); refresh() })
}

async function refresh() {
  const [s, g] = await Promise.all([supplierAPI.getAll(), goodsAPI.getAll()])
  suppliers.value = s.data; goods.value = g.data
}
</script>
