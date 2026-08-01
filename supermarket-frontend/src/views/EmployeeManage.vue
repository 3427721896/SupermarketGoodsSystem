<template>
  <div class="panel" v-if="authStore.isAdmin">
    <div class="panel-header">
      <h3>员工列表</h3>
      <button class="btn btn-primary btn-sm" @click="openForm()">+ 新增员工</button>
    </div>
    <div class="panel-body" style="padding:0;">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>用户名</th><th>姓名</th><th>角色</th><th>手机号</th><th>状态</th><th>创建日期</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="u in users" :key="u.id">
              <td><strong>{{ u.username }}</strong></td>
              <td>{{ u.name }}</td>
              <td><span class="badge" :class="u.role === 'admin' ? 'badge-info' : 'badge-success'">{{ u.role === 'admin' ? '管理员' : '员工' }}</span></td>
              <td>{{ u.phone || '-' }}</td>
              <td><span class="badge" :class="u.status === 'active' ? 'badge-success' : 'badge-danger'">{{ u.status === 'active' ? '在职' : '禁用' }}</span></td>
              <td>{{ u.createdAt || '-' }}</td>
              <td>
                <button class="btn btn-outline btn-xs" @click="openForm(u.id)">编辑</button>
                <button v-if="u.id !== authStore.currentUser?.id" class="btn btn-danger btn-xs" @click="deleteItem(u.id)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div v-else class="panel"><div class="panel-body"><p>您没有权限访问此页面。</p></div></div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { userAPI } from '../api'
import { useAuthStore } from '../stores/auth'

const openModal = inject('openModal')
const closeModal = inject('closeModal')
const showConfirm = inject('showConfirm')
const authStore = useAuthStore()

const users = ref([])

onMounted(async () => {
  const res = await userAPI.getAll()
  users.value = res.data
})

function openForm(id) {
  const emp = id ? users.value.find(u => u.id === id) : null
  const body = `
    <input type="hidden" id="efId" value="${emp ? emp.id : ''}">
    <div class="form-row">
      <div class="form-group"><label>用户名 *</label><input id="efUsername" value="${emp ? emp.username : ''}" placeholder="登录用户名"></div>
      <div class="form-group"><label>密码 *</label><input id="efPassword" type="password" value="${emp ? emp.password : ''}" placeholder="${emp ? '留空不修改' : '登录密码'}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>姓名 *</label><input id="efName" value="${emp ? emp.name : ''}" placeholder="真实姓名"></div>
      <div class="form-group"><label>手机号</label><input id="efPhone" value="${emp ? emp.phone || '' : ''}" placeholder="手机号码"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>角色</label><select id="efRole"><option value="admin" ${emp && emp.role === 'admin' ? 'selected' : ''}>管理员</option><option value="employee" ${emp && emp.role === 'employee' ? 'selected' : ''}>员工</option></select></div>
      <div class="form-group"><label>状态</label><select id="efStatus"><option value="active" ${emp && emp.status === 'active' ? 'selected' : ''}>在职</option><option value="disabled" ${emp && emp.status === 'disabled' ? 'selected' : ''}>禁用</option></select></div>
    </div>`
  const footer = `<button class="btn btn-outline" onclick="window._closeModal()">取消</button><button class="btn btn-primary" onclick="window._saveEmployee()">保存</button>`
  window._closeModal = closeModal
  window._saveEmployee = async () => {
    const idVal = document.getElementById('efId').value
    const username = document.getElementById('efUsername').value.trim()
    const password = document.getElementById('efPassword').value.trim()
    const name = document.getElementById('efName').value.trim()
    if (!username || !name) { alert('请填写用户名和姓名'); return }
    if (!idVal && !password) { alert('请填写密码'); return }
    const data = {
      id: idVal || undefined, username, name,
      role: document.getElementById('efRole').value,
      phone: document.getElementById('efPhone').value.trim(),
      status: document.getElementById('efStatus').value
    }
    if (idVal && !password) {
      delete data.password
    } else {
      data.password = password
    }
    await userAPI.save(data)
    closeModal(); refresh()
  }
  openModal(emp ? '编辑员工' : '新增员工', body, footer)
}

async function deleteItem(id) {
  const emp = users.value.find(u => u.id === id)
  if (!emp) return
  showConfirm(`确定要删除员工「${emp.name}」吗？`, async () => { await userAPI.delete(id); refresh() })
}

async function refresh() {
  const res = await userAPI.getAll()
  users.value = res.data
}
</script>
