<template>
  <div class="panel">
    <div class="panel-header">
      <h3>商品列表</h3>
      <div class="panel-tools">
        <button class="btn btn-primary btn-sm" @click="openForm()">+ 新增商品</button>
      </div>
    </div>
    <div class="panel-body">
      <div class="search-bar">
        <input type="text" v-model="searchKeyword" @input="filterGoods" placeholder="🔍 搜索商品名称/编码...">
        <select v-model="filterCat" @change="filterGoods">
          <option value="">全部分类</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
        <select v-model="filterWh" @change="filterGoods">
          <option value="">全部仓库</option>
          <option v-for="w in warehouses" :key="w.id" :value="w.id">{{ w.name }}</option>
        </select>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr><th>编码</th><th>名称</th><th>分类</th><th>规格</th><th>单位</th><th>单价</th><th>库存</th><th>最低库存</th><th>仓库</th><th>状态</th><th>操作</th></tr>
          </thead>
          <tbody>
            <tr v-if="filteredGoods.length === 0"><td colspan="11" class="table-empty">暂无商品数据</td></tr>
            <tr v-for="g in filteredGoods" :key="g.id" :class="stockRowClass(g.stock, g.minStock)">
              <td>{{ g.code }}</td>
              <td><strong>{{ g.name }}</strong></td>
              <td>{{ getCategoryName(g.categoryId) }}</td>
              <td>{{ g.spec || '-' }}</td>
              <td>{{ g.unit || '-' }}</td>
              <td>{{ formatMoney(g.price) }}</td>
              <td><strong>{{ g.stock }}</strong></td>
              <td>{{ g.minStock }}</td>
              <td>{{ getWarehouseName(g.warehouseId) }}</td>
              <td v-html="stockStatusBadge(g.stock, g.minStock)"></td>
              <td>
                <button class="btn btn-outline btn-xs" @click="openForm(g.id)">编辑</button>
                <button class="btn btn-danger btn-xs" @click="deleteItem(g.id)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import { goodsAPI, categoryAPI, warehouseAPI, supplierAPI } from '../api'

const openModal = inject('openModal')
const closeModal = inject('closeModal')
const showConfirm = inject('showConfirm')
const formatMoney = inject('formatMoney')
const stockStatusBadge = inject('stockStatusBadge')
const stockRowClass = inject('stockRowClass')

const goods = ref([])
const categories = ref([])
const warehouses = ref([])
const suppliers = ref([])
const searchKeyword = ref('')
const filterCat = ref('')
const filterWh = ref('')

const filteredGoods = computed(() => {
  let list = goods.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(g => g.name.toLowerCase().includes(kw) || g.code.toLowerCase().includes(kw))
  }
  if (filterCat.value) list = list.filter(g => g.categoryId === filterCat.value)
  if (filterWh.value) list = list.filter(g => g.warehouseId === filterWh.value)
  return list
})

function getCategoryName(id) { const c = categories.value.find(x => x.id === id); return c ? c.name : '-' }
function getWarehouseName(id) { const w = warehouses.value.find(x => x.id === id); return w ? w.name : '-' }

onMounted(async () => {
  const [g, c, w, s] = await Promise.all([goodsAPI.getAll(), categoryAPI.getAll(), warehouseAPI.getAll(), supplierAPI.getAll()])
  goods.value = g.data; categories.value = c.data; warehouses.value = w.data; suppliers.value = s.data
})

function openForm(id) {
  const item = id ? goods.value.find(g => g.id === id) : null
  const title = item ? '编辑商品' : '新增商品'
  const body = `
    <input type="hidden" id="gfId" value="${item ? item.id : ''}">
    <div class="form-row">
      <div class="form-group"><label>商品编码 *</label><input id="gfCode" value="${item ? item.code : ''}" placeholder="如 GOODS009"></div>
      <div class="form-group"><label>商品名称 *</label><input id="gfName" value="${item ? item.name : ''}" placeholder="商品名称"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>分类</label><select id="gfCat">${categories.value.map(c => `<option value="${c.id}" ${item && item.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>
      <div class="form-group"><label>规格</label><input id="gfSpec" value="${item ? item.spec || '' : ''}" placeholder="如 500ml/瓶"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>单位</label><input id="gfUnit" value="${item ? item.unit || '' : ''}" placeholder="箱/瓶/包"></div>
      <div class="form-group"><label>单价 *</label><input id="gfPrice" type="number" step="0.01" value="${item ? item.price : ''}" placeholder="0.00"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>初始库存</label><input id="gfStock" type="number" value="${item ? item.stock : 0}" ${item ? 'readonly' : ''}></div>
      <div class="form-group"><label>最低库存预警</label><input id="gfMinStock" type="number" value="${item ? item.minStock : 50}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>所属仓库</label><select id="gfWarehouse">${warehouses.value.map(w => `<option value="${w.id}" ${item && item.warehouseId === w.id ? 'selected' : ''}>${w.name}</option>`).join('')}</select></div>
      <div class="form-group"><label>供应商</label><select id="gfSupplier">${suppliers.value.map(s => `<option value="${s.id}" ${item && item.supplierId === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}</select></div>
    </div>`
  const footer = `<button class="btn btn-outline" onclick="window._closeModal()">取消</button><button class="btn btn-primary" onclick="window._saveGoods()">保存</button>`

  window._closeModal = closeModal
  window._saveGoods = async () => {
    const data = {
      id: document.getElementById('gfId').value || undefined,
      code: document.getElementById('gfCode').value.trim(),
      name: document.getElementById('gfName').value.trim(),
      categoryId: document.getElementById('gfCat').value,
      spec: document.getElementById('gfSpec').value.trim(),
      unit: document.getElementById('gfUnit').value.trim(),
      price: parseFloat(document.getElementById('gfPrice').value) || 0,
      minStock: parseInt(document.getElementById('gfMinStock').value) || 0,
      warehouseId: document.getElementById('gfWarehouse').value,
      supplierId: document.getElementById('gfSupplier').value,
      status: 'active'
    }
    if (!data.code || !data.name) { alert('请填写商品编码和名称'); return }
    if (item) data.stock = item.stock
    else data.stock = parseInt(document.getElementById('gfStock').value) || 0
    await goodsAPI.save(data)
    closeModal()
    refresh()
  }
  openModal(title, body, footer)
}

async function deleteItem(id) {
  const g = goods.value.find(x => x.id === id)
  if (!g) return
  showConfirm(`确定要删除商品「${g.name}」吗？此操作不可恢复。`, async () => { await goodsAPI.delete(id); refresh() })
}

async function refresh() {
  const res = await goodsAPI.getAll()
  goods.value = res.data
}

function filterGoods() { /* computed handles this */ }
</script>
