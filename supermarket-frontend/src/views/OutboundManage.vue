<template>
  <div class="panel">
    <div class="panel-header">
      <h3>出库记录</h3>
      <div class="panel-tools">
        <button class="btn btn-warning btn-sm" @click="openForm()">+ 新增出库</button>
      </div>
    </div>
    <div class="panel-body">
      <div class="search-bar">
        <input type="text" v-model="searchKeyword" placeholder="🔍 搜索商品名称...">
        <input type="date" v-model="dateFrom" title="开始日期">
        <input type="date" v-model="dateTo" title="结束日期">
      </div>
      <div class="table-wrapper">
        <table>
          <thead><tr><th>编号</th><th>商品</th><th>数量</th><th>单价</th><th>金额</th><th>类型</th><th>客户</th><th>仓库</th><th>日期</th><th>操作人</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-if="filteredRecords.length === 0"><td colspan="11" class="table-empty">暂无出库记录</td></tr>
            <tr v-for="r in filteredRecords" :key="r.id">
              <td>{{ r.id }}</td>
              <td><strong>{{ r.goodsName }}</strong></td>
              <td>{{ r.quantity }}</td>
              <td>{{ formatMoney(r.price) }}</td>
              <td>{{ formatMoney(r.quantity * r.price) }}</td>
              <td><span class="badge badge-info">{{ r.type || '销售出库' }}</span></td>
              <td>{{ r.customer || '-' }}</td>
              <td>{{ getWarehouseName(r.warehouseId) }}</td>
              <td>{{ r.date }}</td>
              <td>{{ r.operator }}</td>
              <td><button class="btn btn-danger btn-xs" @click="deleteItem(r.id)">删除</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import { outboundAPI, goodsAPI, warehouseAPI } from '../api'
import { useAuthStore } from '../stores/auth'

const openModal = inject('openModal')
const closeModal = inject('closeModal')
const showConfirm = inject('showConfirm')
const formatMoney = inject('formatMoney')

const authStore = useAuthStore()
const records = ref([])
const goods = ref([])
const warehouses = ref([])
const searchKeyword = ref('')
const dateFrom = ref('')
const dateTo = ref('')

const filteredRecords = computed(() => {
  let list = records.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(r => r.goodsName.toLowerCase().includes(kw))
  }
  if (dateFrom.value) list = list.filter(r => r.date >= dateFrom.value)
  if (dateTo.value) list = list.filter(r => r.date <= dateTo.value)
  return list
})

function getWarehouseName(id) { const w = warehouses.value.find(x => x.id === id); return w ? w.name : '-' }

onMounted(async () => {
  const [r, g, w] = await Promise.all([outboundAPI.getAll(), goodsAPI.getAll(), warehouseAPI.getAll()])
  records.value = r.data; goods.value = g.data; warehouses.value = w.data
})

function openForm() {
  const gList = goods.value.filter(g => g.stock > 0)
  const wList = warehouses.value
  const user = authStore.currentUser
  const today = new Date().toISOString().split('T')[0]

  const body = `
    <div class="form-group"><label>选择商品 *</label>
      <select id="outfGoods" onchange="window._updateOutboundInfo()">
        <option value="">-- 请选择商品 --</option>
        ${gList.map(g => `<option value="${g.id}" data-name="${g.name}" data-warehouse="${g.warehouseId}" data-max="${g.stock}" data-price="${g.price}">${g.name}（库存: ${g.stock}）</option>`).join('')}
      </select></div>
    ${gList.length === 0 ? '<p style="color:var(--danger);font-size:13px;">⚠️ 所有商品库存为0，无法出库</p>' : ''}
    <div class="form-row">
      <div class="form-group"><label>出库数量 *</label><input id="outfQty" type="number" min="1" value="1" placeholder="数量"><small id="outfStockHint" style="color:var(--text-muted);"></small></div>
      <div class="form-group"><label>出库单价 *</label><input id="outfPrice" type="number" step="0.01" placeholder="单价"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>出库类型</label><select id="outfType"><option>销售出库</option><option>调拨出库</option><option>退货出库</option><option>报损出库</option><option>其他出库</option></select></div>
      <div class="form-group"><label>客户/目的地</label><input id="outfCustomer" placeholder="客户名称"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>出库仓库</label><select id="outfWarehouse">${wList.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}</select></div>
      <div class="form-group"><label>出库日期 *</label><input id="outfDate" type="date" value="${today}"></div>
    </div>
    <div class="form-group"><label>操作人</label><input id="outfOperator" value="${user?.name || ''}" readonly></div>`

  const footer = `<button class="btn btn-outline" onclick="window._closeModal()">取消</button><button class="btn btn-warning" onclick="window._saveOutbound()">确认出库</button>`

  window._closeModal = closeModal
  window._updateOutboundInfo = () => {
    const sel = document.getElementById('outfGoods')
    if (!sel) return
    const opt = sel.selectedOptions[0]
    const hint = document.getElementById('outfStockHint')
    if (opt && opt.dataset.warehouse) {
      document.getElementById('outfWarehouse').value = opt.dataset.warehouse
      document.getElementById('outfPrice').value = opt.dataset.price
      hint.textContent = `当前库存: ${opt.dataset.max}`
    } else { hint.textContent = '' }
  }
  window._saveOutbound = async () => {
    const goodsId = document.getElementById('outfGoods').value
    const qty = parseInt(document.getElementById('outfQty').value)
    const price = parseFloat(document.getElementById('outfPrice').value)
    if (!goodsId || !qty || qty <= 0 || !price) { alert('请填写完整的出库信息'); return }
    const g = gList.find(g => g.id === goodsId)
    if (!g) { alert('商品不存在'); return }
    if (qty > g.stock) { alert(`库存不足！当前库存：${g.stock}`); return }
    await outboundAPI.save({
      goodsId, goodsName: g.name, quantity: qty, price,
      type: document.getElementById('outfType').value,
      customer: document.getElementById('outfCustomer').value.trim(),
      warehouseId: document.getElementById('outfWarehouse').value,
      date: document.getElementById('outfDate').value,
      operator: document.getElementById('outfOperator').value.trim()
    })
    closeModal(); refresh()
  }
  openModal('新增出库', body, footer)
}

async function deleteItem(id) {
  showConfirm('确定要删除该出库记录吗？', async () => { await outboundAPI.delete(id); refresh() })
}

async function refresh() {
  const [r, g] = await Promise.all([outboundAPI.getAll(), goodsAPI.getAll()])
  records.value = r.data; goods.value = g.data
}
</script>
