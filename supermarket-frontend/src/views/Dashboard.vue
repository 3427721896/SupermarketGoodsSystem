<template>
  <div>
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-icon blue">📦</div>
        <div class="stat-info"><h3>{{ stats.totalGoods }}</h3><p>商品总数</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">📥</div>
        <div class="stat-info"><h3>{{ stats.totalInbound }}</h3><p>入库记录</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">📤</div>
        <div class="stat-info"><h3>{{ stats.totalOutbound }}</h3><p>出库记录</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red">⚠️</div>
        <div class="stat-info"><h3>{{ stats.lowStock + stats.outStock }}</h3><p>库存预警</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon cyan">🏭</div>
        <div class="stat-info"><h3>{{ stats.totalWarehouses }}</h3><p>仓库数量</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple">🚚</div>
        <div class="stat-info"><h3>{{ stats.totalSuppliers }}</h3><p>供应商</p></div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;" class="dashboard-grid">
      <div class="panel">
        <div class="panel-header"><h3>⚠️ 库存预警商品</h3></div>
        <div class="panel-body" style="padding:0;">
          <div class="table-wrapper">
            <table>
              <thead><tr><th>商品名称</th><th>当前库存</th><th>最低库存</th><th>状态</th></tr></thead>
              <tbody>
                <tr v-if="lowStockGoods.length === 0">
                  <td colspan="4" class="table-empty">暂无预警商品 🎉</td>
                </tr>
                <tr v-for="g in lowStockGoods" :key="g.id" :class="stockRowClass(g.stock, g.minStock)">
                  <td>{{ g.name }}</td>
                  <td>{{ g.stock }}</td>
                  <td>{{ g.minStock }}</td>
                  <td v-html="stockStatusBadge(g.stock, g.minStock)"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header"><h3>📥 最近入库记录</h3></div>
        <div class="panel-body" style="padding:0;">
          <div class="table-wrapper">
            <table>
              <thead><tr><th>商品</th><th>数量</th><th>日期</th><th>操作人</th></tr></thead>
              <tbody>
                <tr v-if="recentInbound.length === 0">
                  <td colspan="4" class="table-empty">暂无记录</td>
                </tr>
                <tr v-for="r in recentInbound" :key="r.id">
                  <td>{{ r.goodsName }}</td>
                  <td>{{ r.quantity }}</td>
                  <td>{{ r.date }}</td>
                  <td>{{ r.operator }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { goodsAPI, inboundAPI, warehouseAPI, supplierAPI } from '../api'

const stockStatusBadge = inject('stockStatusBadge')
const stockRowClass = inject('stockRowClass')
const formatMoney = inject('formatMoney')

const stats = ref({ totalGoods: 0, totalInbound: 0, totalOutbound: 0, lowStock: 0, outStock: 0, totalWarehouses: 0, totalSuppliers: 0 })
const lowStockGoods = ref([])
const recentInbound = ref([])

onMounted(async () => {
  try {
    const [goodsRes, inboundRes, outboundRes, whRes, supRes] = await Promise.all([
      goodsAPI.getAll(), inboundAPI.getAll(), import('../api').then(m => m.outboundAPI.getAll()),
      warehouseAPI.getAll(), supplierAPI.getAll()
    ])
    const goods = goodsRes.data
    const inbound = inboundRes.data
    const outbound = outboundRes.data
    const warehouses = whRes.data
    const suppliers = supRes.data

    stats.value = {
      totalGoods: goods.length,
      totalInbound: inbound.length,
      totalOutbound: outbound.length,
      lowStock: goods.filter(g => g.stock > 0 && g.stock <= g.minStock).length,
      outStock: goods.filter(g => g.stock === 0).length,
      totalWarehouses: warehouses.length,
      totalSuppliers: suppliers.length
    }

    lowStockGoods.value = goods.filter(g => g.stock <= g.minStock).sort((a, b) => a.stock - b.stock)
    recentInbound.value = inbound.slice(0, 5)
  } catch (e) {
    console.error('Failed to load dashboard data', e)
  }
})
</script>

<style scoped>
@media (max-width: 768px) {
  .dashboard-grid { grid-template-columns: 1fr !important; }
}
</style>
