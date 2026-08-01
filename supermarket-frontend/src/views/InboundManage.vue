<template>
  <div class="panel">
    <div class="panel-header">
      <h3>入库记录</h3>
      <div class="panel-tools">
        <button class="btn btn-success btn-sm" @click="openForm()">+ 新增入库</button>
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
          <thead><tr><th>编号</th><th>商品</th><th>数量</th><th>单价</th><th>金额</th><th>供应商</th><th>仓库</th><th>日期</th><th>操作人</th><th>备注</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-if="filteredRecords.length === 0"><td colspan="11" class="table-empty">暂无入库记录</td></tr>
            <tr v-for="r in filteredRecords" :key="r.id">
              <td>{{ r.id }}</td>
              <td><strong>{{ r.goodsName }}</strong></td>
              <td>{{ r.quantity }}</td>
              <td>{{ formatMoney(r.price) }}</td>
              <td>{{ formatMoney(r.quantity * r.price) }}</td>
              <td>{{ getSupplierName(r.supplierId) }}</td>
              <td>{{ getWarehouseName(r.warehouseId) }}</td>
              <td>{{ r.date }}</td>
              <td>{{ r.operator }}</td>
              <td>{{ r.remark || '-' }}</td>
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
import { inboundAPI, goodsAPI, warehouseAPI, supplierAPI } from '../api'
import { useAuthStore } from '../stores/auth'

const openModal = inject('openModal')
const closeModal = inject('closeModal')
const showConfirm = inject('showConfirm')
const formatMoney = inject('formatMoney')

const authStore = useAuthStore()
const records = ref([])
const goods = ref([])
const warehouses = ref([])
const suppliers = ref([])
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

function getSupplierName(id) { const s = suppliers.value.find(x => x.id === id); return s ? s.name : '-' }
function getWarehouseName(id) { const w = warehouses.value.find(x => x.id === id); return w ? w.name : '-' }

onMounted(async () => {
  const [r, g, w, s] = await Promise.all([inboundAPI.getAll(), goodsAPI.getAll(), warehouseAPI.getAll(), supplierAPI.getAll()])
  records.value = r.data; goods.value = g.data; warehouses.value = w.data; suppliers.value = s.data
})

function openForm() {
  const gList = goods.value
  const sList = suppliers.value
  const wList = warehouses.value
  const user = authStore.currentUser
  const today = new Date().toISOString().split('T')[0]

  const body = `
    <div class="form-group"><label>选择商品 *</label>
      <select id="infGoods" onchange="window._updateInboundInfo()">
        <option value="">-- 请选择商品 --</option>
        ${gList.map(g => `<option value="${g.id}" data-name="${g.name}" data-warehouse="${g.warehouseId}" data-supplier="${g.supplierId}" data-price="${g.price}">${g.name}（${g.code}）</option>`).join('')}
      </select></div>
    <div class="form-row">
      <div class="form-group"><label>入库数量 *</label><input id="infQty" type="number" min="1" value="1" placeholder="数量"></div>
      <div class="form-group"><label>入库单价 *</label><input id="infPrice" type="number" step="0.01" placeholder="单价"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>目标仓库</label><select id="infWarehouse">${wList.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}</select></div>
      <div class="form-group"><label>供应商</label><select id="infSupplier">${sList.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</select></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>入库日期 *</label><input id="infDate" type="date" value="${today}"></div>
      <div class="form-group"><label>操作人</label><input id="infOperator" value="${user?.name || ''}" readonly></div>
    </div>
    <div class="form-group"><label>备注</label><input id="infRemark" placeholder="入库备注信息"></div>`

  const footer = `<button class="btn btn-outline" onclick="window._closeModal()">取消</button><button class="btn btn-success" onclick="window._saveInbound()">确认入库</button>`

  window._closeModal = closeModal
  window._updateInboundInfo = () => {
    const sel = document.getElementById('infGoods')
    if (!sel) return
    const opt = sel.selectedOptions[0]
    if (opt && opt.dataset.warehouse) {
      document.getElementById('infWarehouse').value = opt.dataset.warehouse
      document.getElementById('infSupplier').value = opt.dataset.supplier
      document.getElementById('infPrice').value = opt.dataset.price
    }
  }
  window._saveInbound = async () => {
    const goodsId = document.getElementById('infGoods').value
    const qty = parseInt(document.getElementById('infQty').value)
    const price = parseFloat(document.getElementById('infPrice').value)
    if (!goodsId || !qty || qty <= 0 || !price) { alert('请填写完整的入库信息'); return }
    const g = gList.find(g => g.id === goodsId)
    if (!g) { alert('商品不存在'); return }
    await inboundAPI.save({
      goodsId, goodsName: g.name, quantity: qty, price,
      supplierId: document.getElementById('infSupplier').value,
      warehouseId: document.getElementById('infWarehouse').value,
      date: document.getElementById('infDate').value,
      operator: document.getElementById('infOperator').value.trim(),
      remark: document.getElementById('infRemark').value.trim()
    })
    closeModal(); refresh()
  }
  openModal('新增入库', body, footer)
}

async function deleteItem(id) {
  showConfirm('确定要删除该入库记录吗？', async () => { await inboundAPI.delete(id); refresh() })
}

async function refresh() {
  const [r, g] = await Promise.all([inboundAPI.getAll(), goodsAPI.getAll()])
  records.value = r.data; goods.value = g.data
}
</script>
