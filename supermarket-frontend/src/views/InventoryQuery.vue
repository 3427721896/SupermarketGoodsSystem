<template>
  <div class="panel">
    <div class="panel-header"><h3>库存查询</h3></div>
    <div class="panel-body">
      <div class="search-bar">
        <input type="text" v-model="searchKeyword" placeholder="🔍 搜索商品...">
        <select v-model="filterCat">
          <option value="">全部分类</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
        <select v-model="filterWh">
          <option value="">全部仓库</option>
          <option v-for="w in warehouses" :key="w.id" :value="w.id">{{ w.name }}</option>
        </select>
        <select v-model="filterStock">
          <option value="all">全部状态</option>
          <option value="normal">库存正常</option>
          <option value="low">库存不足</option>
          <option value="out">缺货</option>
        </select>
      </div>
      <div class="table-wrapper">
        <table>
          <thead><tr><th>编码</th><th>商品名称</th><th>分类</th><th>规格</th><th>库存</th><th>最低库存</th><th>单价</th><th>库存金额</th><th>仓库</th><th>状态</th></tr></thead>
          <tbody>
            <tr v-if="filteredGoods.length === 0"><td colspan="10" class="table-empty">暂无商品</td></tr>
            <tr v-for="g in filteredGoods" :key="g.id" :class="stockRowClass(g.stock, g.minStock)">
              <td>{{ g.code }}</td>
              <td><strong>{{ g.name }}</strong></td>
              <td>{{ getCategoryName(g.categoryId) }}</td>
              <td>{{ g.spec || '-' }}</td>
              <td><strong>{{ g.stock }}</strong></td>
              <td>{{ g.minStock }}</td>
              <td>{{ formatMoney(g.price) }}</td>
              <td>{{ formatMoney(g.stock * g.price) }}</td>
              <td>{{ getWarehouseName(g.warehouseId) }}</td>
              <td v-html="stockStatusBadge(g.stock, g.minStock)"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import { goodsAPI, categoryAPI, warehouseAPI } from '../api'

const formatMoney = inject('formatMoney')
const stockStatusBadge = inject('stockStatusBadge')
const stockRowClass = inject('stockRowClass')

const goods = ref([])
const categories = ref([])
const warehouses = ref([])
const searchKeyword = ref('')
const filterCat = ref('')
const filterWh = ref('')
const filterStock = ref('all')

const filteredGoods = computed(() => {
  let list = goods.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(g => g.name.toLowerCase().includes(kw) || g.code.toLowerCase().includes(kw))
  }
  if (filterCat.value) list = list.filter(g => g.categoryId === filterCat.value)
  if (filterWh.value) list = list.filter(g => g.warehouseId === filterWh.value)
  if (filterStock.value === 'normal') list = list.filter(g => g.stock > g.minStock)
  if (filterStock.value === 'low') list = list.filter(g => g.stock > 0 && g.stock <= g.minStock)
  if (filterStock.value === 'out') list = list.filter(g => g.stock === 0)
  return list
})

function getCategoryName(id) { const c = categories.value.find(x => x.id === id); return c ? c.name : '-' }
function getWarehouseName(id) { const w = warehouses.value.find(x => x.id === id); return w ? w.name : '-' }

onMounted(async () => {
  const [g, c, w] = await Promise.all([goodsAPI.getAll(), categoryAPI.getAll(), warehouseAPI.getAll()])
  goods.value = g.data; categories.value = c.data; warehouses.value = w.data
})
</script>
