/**
 * 超市货物仓库管理系统 - 主应用模块
 */

const App = (function () {
    const user = Auth.requireAuth();
    if (!user) return {};

    const isAdmin = user.role === 'admin';

    // ========== DOM 引用 ==========

    const $sidebar = document.getElementById('sidebar');
    const $sidebarNav = document.getElementById('sidebarNav');
    const $menuToggle = document.getElementById('menuToggle');
    const $mainWrapper = document.querySelector('.main-wrapper');
    const $pageTitle = document.getElementById('pageTitle');
    const $mainContent = document.getElementById('mainContent');
    const $currentUser = document.getElementById('currentUser');
    const $currentTime = document.getElementById('currentTime');
    const $roleBadge = document.getElementById('roleBadge');
    const $btnLogout = document.getElementById('btnLogout');
    const $modalOverlay = document.getElementById('modalOverlay');
    const $modalTitle = document.getElementById('modalTitle');
    const $modalBody = document.getElementById('modalBody');
    const $modalFooter = document.getElementById('modalFooter');
    const $modalClose = document.getElementById('modalClose');
    const $confirmOverlay = document.getElementById('confirmOverlay');
    const $confirmMsg = document.getElementById('confirmMsg');
    const $confirmOk = document.getElementById('confirmOk');
    const $confirmCancel = document.getElementById('confirmCancel');

    // ========== 导航配置 ==========

    const navSections = [
        {
            title: '主菜单',
            items: [
                { id: 'dashboard', icon: '📊', label: '控制台', adminOnly: false },
            ],
        },
        {
            title: '基础数据',
            items: [
                { id: 'goods', icon: '📦', label: '商品管理', adminOnly: false },
                { id: 'categories', icon: '🏷️', label: '分类管理', adminOnly: false },
                { id: 'warehouses', icon: '🏭', label: '仓库管理', adminOnly: true },
                { id: 'suppliers', icon: '🚚', label: '供应商管理', adminOnly: true },
            ],
        },
        {
            title: '出入库',
            items: [
                { id: 'inbound', icon: '📥', label: '入库管理', adminOnly: false },
                { id: 'outbound', icon: '📤', label: '出库管理', adminOnly: false },
                { id: 'inventory', icon: '📋', label: '库存查询', adminOnly: false },
            ],
        },
        {
            title: '系统管理',
            items: [
                { id: 'employees', icon: '👥', label: '员工管理', adminOnly: true },
            ],
        },
    ];

    // ========== 初始化 ==========

    function init() {
        renderSidebar();
        updateUserInfo();
        updateClock();
        setInterval(updateClock, 1000);
        bindEvents();
        navigateTo('dashboard');
    }

    // ========== 侧边栏 ==========

    function renderSidebar() {
        let html = '';
        navSections.forEach(section => {
            const visibleItems = section.items.filter(item => !item.adminOnly || isAdmin);
            if (visibleItems.length === 0) return;
            html += `<div class="nav-section"><div class="nav-section-title">${section.title}</div>`;
            visibleItems.forEach(item => {
                html += `
                    <div class="nav-item" data-page="${item.id}">
                        <span class="nav-item-icon">${item.icon}</span>
                        <span class="nav-item-label">${item.label}</span>
                    </div>`;
            });
            html += '</div>';
        });
        $sidebarNav.innerHTML = html;
    }

    function setActiveNav(pageId) {
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        const target = document.querySelector(`.nav-item[data-page="${pageId}"]`);
        if (target) target.classList.add('active');
    }

    // ========== 用户信息 ==========

    function updateUserInfo() {
        $currentUser.textContent = `👤 ${user.name}（${user.role === 'admin' ? '管理员' : '员工'}）`;
        $roleBadge.textContent = user.role === 'admin' ? '管理员' : '员工';
        $roleBadge.className = 'topbar-role-badge ' + (user.role === 'admin' ? 'badge-admin' : 'badge-employee');
    }

    function updateClock() {
        const now = new Date();
        $currentTime.textContent = now.toLocaleString('zh-CN', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
        });
    }

    // ========== 事件绑定 ==========

    function bindEvents() {
        $menuToggle.addEventListener('click', toggleSidebar);
        $btnLogout.addEventListener('click', () => {
            showConfirm('确定要退出登录吗？', () => Auth.logout());
        });
        $sidebarNav.addEventListener('click', e => {
            const item = e.target.closest('.nav-item');
            if (item) navigateTo(item.dataset.page);
        });
        $modalClose.addEventListener('click', closeModal);
        $modalOverlay.addEventListener('click', e => {
            if (e.target === $modalOverlay) closeModal();
        });
        $confirmCancel.addEventListener('click', closeConfirm);
        $confirmOverlay.addEventListener('click', e => {
            if (e.target === $confirmOverlay) closeConfirm();
        });
    }

    function toggleSidebar() {
        $sidebar.classList.toggle('collapsed');
        $mainWrapper.classList.toggle('expanded');
    }

    // ========== 导航 ==========

    function navigateTo(pageId) {
        setActiveNav(pageId);
        let title, html;
        switch (pageId) {
            case 'dashboard':   title = '控制台';      html = renderDashboard(); break;
            case 'goods':       title = '商品管理';    html = renderGoodsPage(); break;
            case 'categories':  title = '分类管理';    html = renderCategoriesPage(); break;
            case 'warehouses':  title = '仓库管理';    html = renderWarehousesPage(); break;
            case 'suppliers':   title = '供应商管理';  html = renderSuppliersPage(); break;
            case 'inbound':     title = '入库管理';    html = renderInboundPage(); break;
            case 'outbound':    title = '出库管理';    html = renderOutboundPage(); break;
            case 'inventory':   title = '库存查询';    html = renderInventoryPage(); break;
            case 'employees':   title = '员工管理';    html = renderEmployeesPage(); break;
            default:            title = '控制台';      html = renderDashboard();
        }
        $pageTitle.textContent = title;
        $mainContent.innerHTML = html;
        // 为移动端自动收起侧边栏
        if (window.innerWidth <= 768) {
            $sidebar.classList.remove('expanded-mobile');
        }
    }

    // ========== 模态框 ==========

    function openModal(title, bodyHtml, footerHtml) {
        $modalTitle.textContent = title;
        $modalBody.innerHTML = bodyHtml;
        $modalFooter.innerHTML = footerHtml || '';
        $modalOverlay.classList.add('show');
    }

    function closeModal() {
        $modalOverlay.classList.remove('show');
    }

    let _confirmCallback = null;

    function showConfirm(message, callback) {
        $confirmMsg.textContent = message;
        _confirmCallback = callback;
        $confirmOverlay.classList.add('show');
    }

    function closeConfirm() {
        $confirmOverlay.classList.remove('show');
        _confirmCallback = null;
    }

    $confirmOk.addEventListener('click', () => {
        if (_confirmCallback) _confirmCallback();
        closeConfirm();
    });

    // ========== 辅助函数 ==========

    function getCategoryName(id) {
        const cat = DB.getCategories().find(c => c.id === id);
        return cat ? cat.name : '-';
    }

    function getWarehouseName(id) {
        const wh = DB.getWarehouses().find(w => w.id === id);
        return wh ? wh.name : '-';
    }

    function getSupplierName(id) {
        const sup = DB.getSuppliers().find(s => s.id === id);
        return sup ? sup.name : '-';
    }

    function stockStatusBadge(stock, minStock) {
        if (stock === 0) return '<span class="badge badge-danger">缺货</span>';
        if (stock <= minStock) return '<span class="badge badge-warning">库存不足</span>';
        return '<span class="badge badge-success">正常</span>';
    }

    function stockRowClass(stock, minStock) {
        if (stock === 0) return 'row-out-stock';
        if (stock <= minStock) return 'row-low-stock';
        return '';
    }

    function formatMoney(val) {
        return '¥' + Number(val).toFixed(2);
    }

    // ====================================================================
    //  控制台
    // ====================================================================

    function renderDashboard() {
        const stats = DB.getStats();
        const goods = DB.getGoods();
        const lowStockGoods = goods.filter(g => g.stock <= g.minStock).sort((a, b) => a.stock - b.stock);
        const recentInbound = DB.getInboundRecords().slice(0, 5);
        const recentOutbound = DB.getOutboundRecords().slice(0, 5);

        return `
            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">📦</div>
                    <div class="stat-info"><h3>${stats.totalGoods}</h3><p>商品总数</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">📥</div>
                    <div class="stat-info"><h3>${stats.totalInbound}</h3><p>入库记录</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">📤</div>
                    <div class="stat-info"><h3>${stats.totalOutbound}</h3><p>出库记录</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon red">⚠️</div>
                    <div class="stat-info"><h3>${stats.lowStock + stats.outStock}</h3><p>库存预警</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon cyan">🏭</div>
                    <div class="stat-info"><h3>${stats.totalWarehouses}</h3><p>仓库数量</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">🚚</div>
                    <div class="stat-info"><h3>${stats.totalSuppliers}</h3><p>供应商</p></div>
                </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                <div class="panel">
                    <div class="panel-header"><h3>⚠️ 库存预警商品</h3></div>
                    <div class="panel-body" style="padding:0;">
                        <div class="table-wrapper">
                            <table>
                                <thead><tr><th>商品名称</th><th>当前库存</th><th>最低库存</th><th>状态</th></tr></thead>
                                <tbody>
                                    ${lowStockGoods.length === 0
                                        ? '<tr><td colspan="4" class="table-empty">暂无预警商品 🎉</td></tr>'
                                        : lowStockGoods.map(g => `
                                            <tr class="${stockRowClass(g.stock, g.minStock)}">
                                                <td>${g.name}</td>
                                                <td>${g.stock}</td>
                                                <td>${g.minStock}</td>
                                                <td>${stockStatusBadge(g.stock, g.minStock)}</td>
                                            </tr>`).join('')}
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
                                    ${recentInbound.length === 0
                                        ? '<tr><td colspan="4" class="table-empty">暂无记录</td></tr>'
                                        : recentInbound.map(r => `
                                            <tr>
                                                <td>${r.goodsName}</td>
                                                <td>${r.quantity}</td>
                                                <td>${r.date}</td>
                                                <td>${r.operator}</td>
                                            </tr>`).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    // ====================================================================
    //  商品管理
    // ====================================================================

    function renderGoodsPage() {
        const goods = DB.getGoods();
        const categories = DB.getCategories();
        const warehouses = DB.getWarehouses();

        return `
            <div class="panel">
                <div class="panel-header">
                    <h3>商品列表</h3>
                    <div class="panel-tools">
                        <button class="btn btn-primary btn-sm" onclick="App.openGoodsForm()">+ 新增商品</button>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="search-bar">
                        <input type="text" id="goodsSearch" placeholder="🔍 搜索商品名称/编码..." oninput="App.filterGoods()">
                        <select id="goodsCatFilter" onchange="App.filterGoods()">
                            <option value="">全部分类</option>
                            ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                        </select>
                        <select id="goodsWhFilter" onchange="App.filterGoods()">
                            <option value="">全部仓库</option>
                            ${warehouses.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <tr><th>编码</th><th>名称</th><th>分类</th><th>规格</th><th>单位</th><th>单价</th><th>库存</th><th>最低库存</th><th>仓库</th><th>状态</th><th>操作</th></tr>
                            </thead>
                            <tbody id="goodsTableBody">
                                ${renderGoodsRows(goods)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;
    }

    function renderGoodsRows(goods) {
        if (goods.length === 0) {
            return '<tr><td colspan="11" class="table-empty">暂无商品数据</td></tr>';
        }
        return goods.map(g => `
            <tr class="${stockRowClass(g.stock, g.minStock)}">
                <td>${g.code}</td>
                <td><strong>${g.name}</strong></td>
                <td>${getCategoryName(g.categoryId)}</td>
                <td>${g.spec || '-'}</td>
                <td>${g.unit || '-'}</td>
                <td>${formatMoney(g.price)}</td>
                <td><strong>${g.stock}</strong></td>
                <td>${g.minStock}</td>
                <td>${getWarehouseName(g.warehouseId)}</td>
                <td>${stockStatusBadge(g.stock, g.minStock)}</td>
                <td>
                    <button class="btn btn-outline btn-xs" onclick="App.openGoodsForm('${g.id}')">编辑</button>
                    <button class="btn btn-danger btn-xs" onclick="App.deleteGoods('${g.id}')">删除</button>
                </td>
            </tr>`).join('');
    }

    function filterGoods() {
        const keyword = (document.getElementById('goodsSearch')?.value || '').toLowerCase();
        const catId = document.getElementById('goodsCatFilter')?.value || '';
        const whId = document.getElementById('goodsWhFilter')?.value || '';
        let goods = DB.getGoods();
        if (keyword) {
            goods = goods.filter(g => g.name.toLowerCase().includes(keyword) || g.code.toLowerCase().includes(keyword));
        }
        if (catId) goods = goods.filter(g => g.categoryId === catId);
        if (whId) goods = goods.filter(g => g.warehouseId === whId);
        const tbody = document.getElementById('goodsTableBody');
        if (tbody) tbody.innerHTML = renderGoodsRows(goods);
    }

    function openGoodsForm(id) {
        const goods = id ? DB.getGoods().find(g => g.id === id) : null;
        const categories = DB.getCategories();
        const warehouses = DB.getWarehouses();
        const suppliers = DB.getSuppliers();
        const title = goods ? '编辑商品' : '新增商品';

        const body = `
            <input type="hidden" id="gfId" value="${goods ? goods.id : ''}">
            <div class="form-row">
                <div class="form-group"><label>商品编码 *</label><input id="gfCode" value="${goods ? goods.code : ''}" placeholder="如 GOODS009"></div>
                <div class="form-group"><label>商品名称 *</label><input id="gfName" value="${goods ? goods.name : ''}" placeholder="商品名称"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>分类</label><select id="gfCat">${categories.map(c => `<option value="${c.id}" ${goods && goods.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>
                <div class="form-group"><label>规格</label><input id="gfSpec" value="${goods ? goods.spec || '' : ''}" placeholder="如 500ml/瓶"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>单位</label><input id="gfUnit" value="${goods ? goods.unit || '' : ''}" placeholder="箱/瓶/包"></div>
                <div class="form-group"><label>单价 *</label><input id="gfPrice" type="number" step="0.01" value="${goods ? goods.price : ''}" placeholder="0.00"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>初始库存</label><input id="gfStock" type="number" value="${goods ? goods.stock : 0}" ${goods ? 'readonly' : ''}></div>
                <div class="form-group"><label>最低库存预警</label><input id="gfMinStock" type="number" value="${goods ? goods.minStock : 50}"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>所属仓库</label><select id="gfWarehouse">${warehouses.map(w => `<option value="${w.id}" ${goods && goods.warehouseId === w.id ? 'selected' : ''}>${w.name}</option>`).join('')}</select></div>
                <div class="form-group"><label>供应商</label><select id="gfSupplier">${suppliers.map(s => `<option value="${s.id}" ${goods && goods.supplierId === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}</select></div>
            </div>`;

        const footer = `
            <button class="btn btn-outline" onclick="App.closeModal()">取消</button>
            <button class="btn btn-primary" onclick="App.saveGoods()">保存</button>`;

        openModal(title, body, footer);
    }

    function saveGoods() {
        const id = document.getElementById('gfId').value;
        const code = document.getElementById('gfCode').value.trim();
        const name = document.getElementById('gfName').value.trim();
        if (!code || !name) { alert('请填写商品编码和名称'); return; }

        const data = {
            id: id || undefined,
            code, name,
            categoryId: document.getElementById('gfCat').value,
            spec: document.getElementById('gfSpec').value.trim(),
            unit: document.getElementById('gfUnit').value.trim(),
            price: parseFloat(document.getElementById('gfPrice').value) || 0,
            minStock: parseInt(document.getElementById('gfMinStock').value) || 0,
            warehouseId: document.getElementById('gfWarehouse').value,
            supplierId: document.getElementById('gfSupplier').value,
            status: 'active',
        };

        if (id) {
            const existing = DB.getGoods().find(g => g.id === id);
            data.stock = existing ? existing.stock : 0;
        } else {
            data.stock = parseInt(document.getElementById('gfStock').value) || 0;
        }

        DB.saveGoods(data);
        closeModal();
        navigateTo('goods');
    }

    function deleteGoods(id) {
        const goods = DB.getGoods().find(g => g.id === id);
        if (!goods) return;
        showConfirm(`确定要删除商品「${goods.name}」吗？此操作不可恢复。`, () => {
            DB.deleteGoods(id);
            navigateTo('goods');
        });
    }

    // ====================================================================
    //  分类管理
    // ====================================================================

    function renderCategoriesPage() {
        const cats = DB.getCategories();
        const goods = DB.getGoods();

        return `
            <div class="panel">
                <div class="panel-header">
                    <h3>商品分类</h3>
                    <button class="btn btn-primary btn-sm" onclick="App.openCategoryForm()">+ 新增分类</button>
                </div>
                <div class="panel-body" style="padding:0;">
                    <div class="table-wrapper">
                        <table>
                            <thead><tr><th>分类编码</th><th>分类名称</th><th>描述</th><th>商品数量</th><th>操作</th></tr></thead>
                            <tbody>
                                ${cats.map(c => {
                                    const count = goods.filter(g => g.categoryId === c.id).length;
                                    return `
                                    <tr>
                                        <td><strong>${c.code}</strong></td>
                                        <td>${c.name}</td>
                                        <td>${c.desc || '-'}</td>
                                        <td>${count}</td>
                                        <td>
                                            <button class="btn btn-outline btn-xs" onclick="App.openCategoryForm('${c.id}')">编辑</button>
                                            <button class="btn btn-danger btn-xs" onclick="App.deleteCategory('${c.id}')">删除</button>
                                        </td>
                                    </tr>`;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;
    }

    function openCategoryForm(id) {
        const cat = id ? DB.getCategories().find(c => c.id === id) : null;
        const body = `
            <input type="hidden" id="cfId" value="${cat ? cat.id : ''}">
            <div class="form-group"><label>分类编码 *</label><input id="cfCode" value="${cat ? cat.code : ''}" placeholder="大写英文缩写"></div>
            <div class="form-group"><label>分类名称 *</label><input id="cfName" value="${cat ? cat.name : ''}" placeholder="分类名称"></div>
            <div class="form-group"><label>描述</label><textarea id="cfDesc" rows="2" placeholder="分类描述...">${cat ? cat.desc || '' : ''}</textarea></div>`;
        const footer = `<button class="btn btn-outline" onclick="App.closeModal()">取消</button><button class="btn btn-primary" onclick="App.saveCategory()">保存</button>`;
        openModal(cat ? '编辑分类' : '新增分类', body, footer);
    }

    function saveCategory() {
        const id = document.getElementById('cfId').value;
        const code = document.getElementById('cfCode').value.trim();
        const name = document.getElementById('cfName').value.trim();
        if (!code || !name) { alert('请填写分类编码和名称'); return; }
        DB.saveCategory({ id: id || undefined, code, name, desc: document.getElementById('cfDesc').value.trim() });
        closeModal();
        navigateTo('categories');
    }

    function deleteCategory(id) {
        const cat = DB.getCategories().find(c => c.id === id);
        if (!cat) return;
        showConfirm(`确定要删除分类「${cat.name}」吗？`, () => {
            DB.deleteCategory(id);
            navigateTo('categories');
        });
    }

    // ====================================================================
    //  仓库管理
    // ====================================================================

    function renderWarehousesPage() {
        const warehouses = DB.getWarehouses();
        const goods = DB.getGoods();
        return `
            <div class="panel">
                <div class="panel-header">
                    <h3>仓库列表</h3>
                    <button class="btn btn-primary btn-sm" onclick="App.openWarehouseForm()">+ 新增仓库</button>
                </div>
                <div class="panel-body" style="padding:0;">
                    <div class="table-wrapper">
                        <table>
                            <thead><tr><th>仓库编码</th><th>仓库名称</th><th>负责人</th><th>地址</th><th>容量</th><th>商品数</th><th>状态</th><th>操作</th></tr></thead>
                            <tbody>
                                ${warehouses.map(w => {
                                    const count = goods.filter(g => g.warehouseId === w.id).length;
                                    return `
                                    <tr>
                                        <td><strong>${w.code}</strong></td>
                                        <td>${w.name}</td>
                                        <td>${w.manager || '-'}</td>
                                        <td>${w.address || '-'}</td>
                                        <td>${w.capacity}</td>
                                        <td>${count}</td>
                                        <td><span class="badge ${w.status === 'active' ? 'badge-success' : 'badge-warning'}">${w.status === 'active' ? '启用' : '停用'}</span></td>
                                        <td>
                                            <button class="btn btn-outline btn-xs" onclick="App.openWarehouseForm('${w.id}')">编辑</button>
                                            <button class="btn btn-danger btn-xs" onclick="App.deleteWarehouse('${w.id}')">删除</button>
                                        </td>
                                    </tr>`;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;
    }

    function openWarehouseForm(id) {
        const wh = id ? DB.getWarehouses().find(w => w.id === id) : null;
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
            <div class="form-group"><label>地址</label><input id="wfAddress" value="${wh ? wh.address || '' : ''}" placeholder="仓库地址"></div>`;
        const footer = `<button class="btn btn-outline" onclick="App.closeModal()">取消</button><button class="btn btn-primary" onclick="App.saveWarehouse()">保存</button>`;
        openModal(wh ? '编辑仓库' : '新增仓库', body, footer);
    }

    function saveWarehouse() {
        const id = document.getElementById('wfId').value;
        const code = document.getElementById('wfCode').value.trim();
        const name = document.getElementById('wfName').value.trim();
        if (!code || !name) { alert('请填写仓库编码和名称'); return; }
        DB.saveWarehouse({
            id: id || undefined, code, name,
            manager: document.getElementById('wfManager').value.trim(),
            capacity: parseInt(document.getElementById('wfCapacity').value) || 0,
            address: document.getElementById('wfAddress').value.trim(),
            status: 'active',
        });
        closeModal();
        navigateTo('warehouses');
    }

    function deleteWarehouse(id) {
        const wh = DB.getWarehouses().find(w => w.id === id);
        if (!wh) return;
        showConfirm(`确定要删除仓库「${wh.name}」吗？`, () => {
            DB.deleteWarehouse(id);
            navigateTo('warehouses');
        });
    }

    // ====================================================================
    //  供应商管理
    // ====================================================================

    function renderSuppliersPage() {
        const suppliers = DB.getSuppliers();
        const goods = DB.getGoods();
        return `
            <div class="panel">
                <div class="panel-header">
                    <h3>供应商列表</h3>
                    <button class="btn btn-primary btn-sm" onclick="App.openSupplierForm()">+ 新增供应商</button>
                </div>
                <div class="panel-body" style="padding:0;">
                    <div class="table-wrapper">
                        <table>
                            <thead><tr><th>编码</th><th>供应商名称</th><th>联系人</th><th>电话</th><th>地址</th><th>供应商品数</th><th>操作</th></tr></thead>
                            <tbody>
                                ${suppliers.map(s => {
                                    const count = goods.filter(g => g.supplierId === s.id).length;
                                    return `
                                    <tr>
                                        <td><strong>${s.code}</strong></td>
                                        <td>${s.name}</td>
                                        <td>${s.contact || '-'}</td>
                                        <td>${s.phone || '-'}</td>
                                        <td>${s.address || '-'}</td>
                                        <td>${count}</td>
                                        <td>
                                            <button class="btn btn-outline btn-xs" onclick="App.openSupplierForm('${s.id}')">编辑</button>
                                            <button class="btn btn-danger btn-xs" onclick="App.deleteSupplier('${s.id}')">删除</button>
                                        </td>
                                    </tr>`;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;
    }

    function openSupplierForm(id) {
        const sup = id ? DB.getSuppliers().find(s => s.id === id) : null;
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
            <div class="form-group"><label>地址</label><input id="sfAddress" value="${sup ? sup.address || '' : ''}" placeholder="公司地址"></div>`;
        const footer = `<button class="btn btn-outline" onclick="App.closeModal()">取消</button><button class="btn btn-primary" onclick="App.saveSupplier()">保存</button>`;
        openModal(sup ? '编辑供应商' : '新增供应商', body, footer);
    }

    function saveSupplier() {
        const id = document.getElementById('sfId').value;
        const code = document.getElementById('sfCode').value.trim();
        const name = document.getElementById('sfName').value.trim();
        if (!code || !name) { alert('请填写供应商编码和名称'); return; }
        DB.saveSupplier({
            id: id || undefined, code, name,
            contact: document.getElementById('sfContact').value.trim(),
            phone: document.getElementById('sfPhone').value.trim(),
            address: document.getElementById('sfAddress').value.trim(),
        });
        closeModal();
        navigateTo('suppliers');
    }

    function deleteSupplier(id) {
        const sup = DB.getSuppliers().find(s => s.id === id);
        if (!sup) return;
        showConfirm(`确定要删除供应商「${sup.name}」吗？`, () => {
            DB.deleteSupplier(id);
            navigateTo('suppliers');
        });
    }

    // ====================================================================
    //  入库管理
    // ====================================================================

    function renderInboundPage() {
        const records = DB.getInboundRecords();

        return `
            <div class="panel">
                <div class="panel-header">
                    <h3>入库记录</h3>
                    <div class="panel-tools">
                        <button class="btn btn-success btn-sm" onclick="App.openInboundForm()">+ 新增入库</button>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="search-bar">
                        <input type="text" id="inboundSearch" placeholder="🔍 搜索商品名称..." oninput="App.filterInbound()">
                        <input type="date" id="inboundDateFrom" onchange="App.filterInbound()" title="开始日期">
                        <input type="date" id="inboundDateTo" onchange="App.filterInbound()" title="结束日期">
                    </div>
                    <div class="table-wrapper">
                        <table>
                            <thead><tr><th>编号</th><th>商品</th><th>数量</th><th>单价</th><th>金额</th><th>供应商</th><th>仓库</th><th>日期</th><th>操作人</th><th>备注</th><th>操作</th></tr></thead>
                            <tbody id="inboundTableBody">
                                ${renderInboundRows(records)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;
    }

    function renderInboundRows(records) {
        if (records.length === 0) return '<tr><td colspan="11" class="table-empty">暂无入库记录</td></tr>';
        return records.map(r => `
            <tr>
                <td>${r.id}</td>
                <td><strong>${r.goodsName}</strong></td>
                <td>${r.quantity}</td>
                <td>${formatMoney(r.price)}</td>
                <td>${formatMoney(r.quantity * r.price)}</td>
                <td>${getSupplierName(r.supplierId)}</td>
                <td>${getWarehouseName(r.warehouseId)}</td>
                <td>${r.date}</td>
                <td>${r.operator}</td>
                <td>${r.remark || '-'}</td>
                <td><button class="btn btn-danger btn-xs" onclick="App.deleteInbound('${r.id}')">删除</button></td>
            </tr>`).join('');
    }

    function filterInbound() {
        const keyword = (document.getElementById('inboundSearch')?.value || '').toLowerCase();
        const from = document.getElementById('inboundDateFrom')?.value || '';
        const to = document.getElementById('inboundDateTo')?.value || '';
        let records = DB.getInboundRecords();
        if (keyword) records = records.filter(r => r.goodsName.toLowerCase().includes(keyword));
        if (from) records = records.filter(r => r.date >= from);
        if (to) records = records.filter(r => r.date <= to);
        const tbody = document.getElementById('inboundTableBody');
        if (tbody) tbody.innerHTML = renderInboundRows(records);
    }

    function openInboundForm() {
        const goods = DB.getGoods();
        const suppliers = DB.getSuppliers();
        const warehouses = DB.getWarehouses();

        const body = `
            <div class="form-group"><label>选择商品 *</label>
                <select id="infGoods" onchange="App.updateInboundInfo()">
                    <option value="">-- 请选择商品 --</option>
                    ${goods.map(g => `<option value="${g.id}" data-name="${g.name}" data-warehouse="${g.warehouseId}" data-supplier="${g.supplierId}">${g.name}（${g.code}）</option>`).join('')}
                </select></div>
            <div class="form-row">
                <div class="form-group"><label>入库数量 *</label><input id="infQty" type="number" min="1" value="1" placeholder="数量"></div>
                <div class="form-group"><label>入库单价 *</label><input id="infPrice" type="number" step="0.01" placeholder="单价"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>目标仓库</label><select id="infWarehouse">${warehouses.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}</select></div>
                <div class="form-group"><label>供应商</label><select id="infSupplier">${suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</select></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>入库日期 *</label><input id="infDate" type="date" value="${new Date().toISOString().split('T')[0]}"></div>
                <div class="form-group"><label>操作人</label><input id="infOperator" value="${user.name}" readonly></div>
            </div>
            <div class="form-group"><label>备注</label><input id="infRemark" placeholder="入库备注信息"></div>`;

        const footer = `<button class="btn btn-outline" onclick="App.closeModal()">取消</button><button class="btn btn-success" onclick="App.saveInbound()">确认入库</button>`;
        openModal('新增入库', body, footer);
    }

    function updateInboundInfo() {
        const sel = document.getElementById('infGoods');
        if (!sel) return;
        const opt = sel.selectedOptions[0];
        if (opt && opt.dataset.warehouse) {
            document.getElementById('infWarehouse').value = opt.dataset.warehouse;
            document.getElementById('infSupplier').value = opt.dataset.supplier;
            const goods = DB.getGoods().find(g => g.id === opt.value);
            if (goods) document.getElementById('infPrice').value = goods.price;
        }
    }

    function saveInbound() {
        const goodsId = document.getElementById('infGoods').value;
        const qty = parseInt(document.getElementById('infQty').value);
        const price = parseFloat(document.getElementById('infPrice').value);
        if (!goodsId || !qty || qty <= 0 || !price) { alert('请填写完整的入库信息'); return; }

        const goods = DB.getGoods().find(g => g.id === goodsId);
        if (!goods) { alert('商品不存在'); return; }

        const record = {
            goodsId,
            goodsName: goods.name,
            quantity: qty,
            price,
            supplierId: document.getElementById('infSupplier').value,
            warehouseId: document.getElementById('infWarehouse').value,
            date: document.getElementById('infDate').value,
            operator: document.getElementById('infOperator').value.trim(),
            remark: document.getElementById('infRemark').value.trim(),
        };

        DB.saveInbound(record);
        DB.updateGoodsStock(goodsId, qty);
        closeModal();
        navigateTo('inbound');
    }

    function deleteInbound(id) {
        showConfirm('确定要删除该入库记录吗？库存不会自动调整，请手动处理。', () => {
            DB.deleteInbound(id);
            navigateTo('inbound');
        });
    }

    // ====================================================================
    //  出库管理
    // ====================================================================

    function renderOutboundPage() {
        const records = DB.getOutboundRecords();

        return `
            <div class="panel">
                <div class="panel-header">
                    <h3>出库记录</h3>
                    <div class="panel-tools">
                        <button class="btn btn-warning btn-sm" onclick="App.openOutboundForm()">+ 新增出库</button>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="search-bar">
                        <input type="text" id="outboundSearch" placeholder="🔍 搜索商品名称..." oninput="App.filterOutbound()">
                        <input type="date" id="outboundDateFrom" onchange="App.filterOutbound()" title="开始日期">
                        <input type="date" id="outboundDateTo" onchange="App.filterOutbound()" title="结束日期">
                    </div>
                    <div class="table-wrapper">
                        <table>
                            <thead><tr><th>编号</th><th>商品</th><th>数量</th><th>单价</th><th>金额</th><th>类型</th><th>客户</th><th>仓库</th><th>日期</th><th>操作人</th><th>操作</th></tr></thead>
                            <tbody id="outboundTableBody">
                                ${renderOutboundRows(records)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;
    }

    function renderOutboundRows(records) {
        if (records.length === 0) return '<tr><td colspan="11" class="table-empty">暂无出库记录</td></tr>';
        return records.map(r => `
            <tr>
                <td>${r.id}</td>
                <td><strong>${r.goodsName}</strong></td>
                <td>${r.quantity}</td>
                <td>${formatMoney(r.price)}</td>
                <td>${formatMoney(r.quantity * r.price)}</td>
                <td><span class="badge badge-info">${r.type || '销售出库'}</span></td>
                <td>${r.customer || '-'}</td>
                <td>${getWarehouseName(r.warehouseId)}</td>
                <td>${r.date}</td>
                <td>${r.operator}</td>
                <td><button class="btn btn-danger btn-xs" onclick="App.deleteOutbound('${r.id}')">删除</button></td>
            </tr>`).join('');
    }

    function filterOutbound() {
        const keyword = (document.getElementById('outboundSearch')?.value || '').toLowerCase();
        const from = document.getElementById('outboundDateFrom')?.value || '';
        const to = document.getElementById('outboundDateTo')?.value || '';
        let records = DB.getOutboundRecords();
        if (keyword) records = records.filter(r => r.goodsName.toLowerCase().includes(keyword));
        if (from) records = records.filter(r => r.date >= from);
        if (to) records = records.filter(r => r.date <= to);
        const tbody = document.getElementById('outboundTableBody');
        if (tbody) tbody.innerHTML = renderOutboundRows(records);
    }

    function openOutboundForm() {
        const goods = DB.getGoods().filter(g => g.stock > 0);
        const warehouses = DB.getWarehouses();

        const body = `
            <div class="form-group"><label>选择商品 *</label>
                <select id="outfGoods" onchange="App.updateOutboundInfo()">
                    <option value="">-- 请选择商品 --</option>
                    ${goods.map(g => `<option value="${g.id}" data-name="${g.name}" data-warehouse="${g.warehouseId}" data-max="${g.stock}" data-price="${g.price}">${g.name}（库存: ${g.stock}）</option>`).join('')}
                </select></div>
            ${goods.length === 0 ? '<p style="color:var(--danger);font-size:13px;">⚠️ 所有商品库存为0，无法出库</p>' : ''}
            <div class="form-row">
                <div class="form-group"><label>出库数量 *</label><input id="outfQty" type="number" min="1" value="1" placeholder="数量"><small id="outfStockHint" style="color:var(--text-muted);"></small></div>
                <div class="form-group"><label>出库单价 *</label><input id="outfPrice" type="number" step="0.01" placeholder="单价"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>出库类型</label><select id="outfType"><option>销售出库</option><option>调拨出库</option><option>退货出库</option><option>报损出库</option><option>其他出库</option></select></div>
                <div class="form-group"><label>客户/目的地</label><input id="outfCustomer" placeholder="客户名称"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>出库仓库</label><select id="outfWarehouse">${warehouses.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}</select></div>
                <div class="form-group"><label>出库日期 *</label><input id="outfDate" type="date" value="${new Date().toISOString().split('T')[0]}"></div>
            </div>
            <div class="form-group"><label>操作人</label><input id="outfOperator" value="${user.name}" readonly></div>`;

        const footer = `<button class="btn btn-outline" onclick="App.closeModal()">取消</button><button class="btn btn-warning" onclick="App.saveOutbound()">确认出库</button>`;
        openModal('新增出库', body, footer);
    }

    function updateOutboundInfo() {
        const sel = document.getElementById('outfGoods');
        if (!sel) return;
        const opt = sel.selectedOptions[0];
        const hintEl = document.getElementById('outfStockHint');
        if (opt && opt.dataset.warehouse) {
            document.getElementById('outfWarehouse').value = opt.dataset.warehouse;
            document.getElementById('outfPrice').value = opt.dataset.price;
            hintEl.textContent = `当前库存: ${opt.dataset.max}`;
        } else {
            hintEl.textContent = '';
        }
    }

    function saveOutbound() {
        const goodsId = document.getElementById('outfGoods').value;
        const qty = parseInt(document.getElementById('outfQty').value);
        const price = parseFloat(document.getElementById('outfPrice').value);
        if (!goodsId || !qty || qty <= 0 || !price) { alert('请填写完整的出库信息'); return; }

        const goods = DB.getGoods().find(g => g.id === goodsId);
        if (!goods) { alert('商品不存在'); return; }
        if (qty > goods.stock) { alert(`库存不足！当前库存：${goods.stock}`); return; }

        const record = {
            goodsId,
            goodsName: goods.name,
            quantity: qty,
            price,
            type: document.getElementById('outfType').value,
            customer: document.getElementById('outfCustomer').value.trim(),
            warehouseId: document.getElementById('outfWarehouse').value,
            date: document.getElementById('outfDate').value,
            operator: document.getElementById('outfOperator').value.trim(),
        };

        DB.saveOutbound(record);
        DB.updateGoodsStock(goodsId, -qty);
        closeModal();
        navigateTo('outbound');
    }

    function deleteOutbound(id) {
        showConfirm('确定要删除该出库记录吗？库存不会自动调整，请手动处理。', () => {
            DB.deleteOutbound(id);
            navigateTo('outbound');
        });
    }

    // ====================================================================
    //  库存查询
    // ====================================================================

    function renderInventoryPage() {
        const goods = DB.getGoods();
        const categories = DB.getCategories();
        const warehouses = DB.getWarehouses();

        return `
            <div class="panel">
                <div class="panel-header"><h3>库存查询</h3></div>
                <div class="panel-body">
                    <div class="search-bar">
                        <input type="text" id="invSearch" placeholder="🔍 搜索商品..." oninput="App.filterInventory()">
                        <select id="invCatFilter" onchange="App.filterInventory()">
                            <option value="">全部分类</option>
                            ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                        </select>
                        <select id="invWhFilter" onchange="App.filterInventory()">
                            <option value="">全部仓库</option>
                            ${warehouses.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                        </select>
                        <select id="invStockFilter" onchange="App.filterInventory()">
                            <option value="all">全部状态</option>
                            <option value="normal">库存正常</option>
                            <option value="low">库存不足</option>
                            <option value="out">缺货</option>
                        </select>
                    </div>
                    <div class="table-wrapper">
                        <table>
                            <thead><tr><th>编码</th><th>商品名称</th><th>分类</th><th>规格</th><th>库存</th><th>最低库存</th><th>单价</th><th>库存金额</th><th>仓库</th><th>状态</th></tr></thead>
                            <tbody id="invTableBody">
                                ${renderInventoryRows(goods)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;
    }

    function renderInventoryRows(goods) {
        if (goods.length === 0) return '<tr><td colspan="10" class="table-empty">暂无商品</td></tr>';
        return goods.map(g => `
            <tr class="${stockRowClass(g.stock, g.minStock)}">
                <td>${g.code}</td>
                <td><strong>${g.name}</strong></td>
                <td>${getCategoryName(g.categoryId)}</td>
                <td>${g.spec || '-'}</td>
                <td><strong>${g.stock}</strong></td>
                <td>${g.minStock}</td>
                <td>${formatMoney(g.price)}</td>
                <td>${formatMoney(g.stock * g.price)}</td>
                <td>${getWarehouseName(g.warehouseId)}</td>
                <td>${stockStatusBadge(g.stock, g.minStock)}</td>
            </tr>`).join('');
    }

    function filterInventory() {
        const keyword = (document.getElementById('invSearch')?.value || '').toLowerCase();
        const catId = document.getElementById('invCatFilter')?.value || '';
        const whId = document.getElementById('invWhFilter')?.value || '';
        const stockFilter = document.getElementById('invStockFilter')?.value || 'all';
        let goods = DB.getGoods();
        if (keyword) goods = goods.filter(g => g.name.toLowerCase().includes(keyword) || g.code.toLowerCase().includes(keyword));
        if (catId) goods = goods.filter(g => g.categoryId === catId);
        if (whId) goods = goods.filter(g => g.warehouseId === whId);
        if (stockFilter === 'normal') goods = goods.filter(g => g.stock > g.minStock);
        if (stockFilter === 'low') goods = goods.filter(g => g.stock > 0 && g.stock <= g.minStock);
        if (stockFilter === 'out') goods = goods.filter(g => g.stock === 0);
        const tbody = document.getElementById('invTableBody');
        if (tbody) tbody.innerHTML = renderInventoryRows(goods);
    }

    // ====================================================================
    //  员工管理（仅管理员）
    // ====================================================================

    function renderEmployeesPage() {
        if (!isAdmin) return '<div class="panel"><div class="panel-body"><p>您没有权限访问此页面。</p></div></div>';

        const users = DB.getUsers();
        return `
            <div class="panel">
                <div class="panel-header">
                    <h3>员工列表</h3>
                    <button class="btn btn-primary btn-sm" onclick="App.openEmployeeForm()">+ 新增员工</button>
                </div>
                <div class="panel-body" style="padding:0;">
                    <div class="table-wrapper">
                        <table>
                            <thead><tr><th>用户名</th><th>姓名</th><th>角色</th><th>手机号</th><th>状态</th><th>创建日期</th><th>操作</th></tr></thead>
                            <tbody>
                                ${users.map(u => `
                                    <tr>
                                        <td><strong>${u.username}</strong></td>
                                        <td>${u.name}</td>
                                        <td><span class="badge ${u.role === 'admin' ? 'badge-info' : 'badge-success'}">${u.role === 'admin' ? '管理员' : '员工'}</span></td>
                                        <td>${u.phone || '-'}</td>
                                        <td><span class="badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}">${u.status === 'active' ? '在职' : '禁用'}</span></td>
                                        <td>${u.createdAt || '-'}</td>
                                        <td>
                                            <button class="btn btn-outline btn-xs" onclick="App.openEmployeeForm('${u.id}')">编辑</button>
                                            ${u.id !== user.id ? `<button class="btn btn-danger btn-xs" onclick="App.deleteEmployee('${u.id}')">删除</button>` : ''}
                                        </td>
                                    </tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;
    }

    function openEmployeeForm(id) {
        const emp = id ? DB.getUsers().find(u => u.id === id) : null;
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
            </div>`;
        const footer = `<button class="btn btn-outline" onclick="App.closeModal()">取消</button><button class="btn btn-primary" onclick="App.saveEmployee()">保存</button>`;
        openModal(emp ? '编辑员工' : '新增员工', body, footer);
    }

    function saveEmployee() {
        const id = document.getElementById('efId').value;
        const username = document.getElementById('efUsername').value.trim();
        const password = document.getElementById('efPassword').value.trim();
        const name = document.getElementById('efName').value.trim();
        if (!username || !name) { alert('请填写用户名和姓名'); return; }
        if (!id && !password) { alert('请填写密码'); return; }

        const data = {
            id: id || undefined,
            username, name,
            role: document.getElementById('efRole').value,
            phone: document.getElementById('efPhone').value.trim(),
            status: document.getElementById('efStatus').value,
        };

        if (id) {
            const existing = DB.getUsers().find(u => u.id === id);
            if (existing) {
                data.password = password || existing.password;
                data.createdAt = existing.createdAt;
            }
        } else {
            data.password = password;
        }

        DB.saveUser(data);
        closeModal();
        navigateTo('employees');
    }

    function deleteEmployee(id) {
        const emp = DB.getUsers().find(u => u.id === id);
        if (!emp) return;
        showConfirm(`确定要删除员工「${emp.name}」吗？`, () => {
            DB.deleteUser(id);
            navigateTo('employees');
        });
    }

    // ========== 导出公共接口 ==========

    init();

    return {
        navigateTo,
        openModal: (a, b, c) => openModal(a, b, c),
        closeModal,
        showConfirm,
        filterGoods, openGoodsForm, saveGoods, deleteGoods,
        openCategoryForm, saveCategory, deleteCategory,
        openWarehouseForm, saveWarehouse, deleteWarehouse,
        openSupplierForm, saveSupplier, deleteSupplier,
        filterInbound, openInboundForm, updateInboundInfo, saveInbound, deleteInbound,
        filterOutbound, openOutboundForm, updateOutboundInfo, saveOutbound, deleteOutbound,
        filterInventory,
        openEmployeeForm, saveEmployee, deleteEmployee,
    };
})();
