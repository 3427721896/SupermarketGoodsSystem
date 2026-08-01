/**
 * 超市货物仓库管理系统 - 数据层
 * 使用 localStorage 模拟数据库存储
 */

const DB = (function () {
    const KEYS = {
        users: 'swms_users',
        categories: 'swms_categories',
        suppliers: 'swms_suppliers',
        warehouses: 'swms_warehouses',
        goods: 'swms_goods',
        inbound: 'swms_inbound',
        outbound: 'swms_outbound',
        currentUser: 'swms_current_user',
    };

    // ========== 通用方法 ==========

    function _read(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch (e) {
            return [];
        }
    }

    function _write(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function _genId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
    }

    // ========== 初始化默认数据 ==========

    function initDefaultData() {
        // 初始化用户
        if (_read(KEYS.users).length === 0) {
            _write(KEYS.users, [
                {
                    id: 'u001',
                    username: 'admin',
                    password: '123456',
                    name: '系统管理员',
                    role: 'admin',
                    phone: '13800000001',
                    status: 'active',
                    createdAt: '2025-01-01',
                },
                {
                    id: 'u002',
                    username: 'employee',
                    password: '123456',
                    name: '张员工',
                    role: 'employee',
                    phone: '13800000002',
                    status: 'active',
                    createdAt: '2025-01-15',
                },
                {
                    id: 'u003',
                    username: 'emp2',
                    password: '123456',
                    name: '李员工',
                    role: 'employee',
                    phone: '13800000003',
                    status: 'active',
                    createdAt: '2025-03-01',
                },
            ]);
        }

        // 初始化分类
        if (_read(KEYS.categories).length === 0) {
            _write(KEYS.categories, [
                { id: 'c001', name: '食品饮料', code: 'FOOD', desc: '各类食品及饮品' },
                { id: 'c002', name: '日用品', code: 'DAILY', desc: '日常家居用品' },
                { id: 'c003', name: '酒水', code: 'WINE', desc: '白酒/啤酒/红酒/饮料' },
                { id: 'c004', name: '乳制品', code: 'MILK', desc: '牛奶/酸奶/奶酪' },
                { id: 'c005', name: '调味品', code: 'SPICE', desc: '油盐酱醋等调味品' },
                { id: 'c006', name: '零食糖果', code: 'SNACK', desc: '休闲零食及糖果' },
                { id: 'c007', name: '洗护用品', code: 'WASH', desc: '洗发水/沐浴露等' },
                { id: 'c008', name: '纸品清洁', code: 'PAPER', desc: '纸巾/清洁用品' },
            ]);
        }

        // 初始化供应商
        if (_read(KEYS.suppliers).length === 0) {
            _write(KEYS.suppliers, [
                { id: 's001', name: '康师傅食品有限公司', contact: '王经理', phone: '13900010001', address: '北京市朝阳区食品工业园A区', code: 'SUP001' },
                { id: 's002', name: '宝洁日化集团', contact: '刘经理', phone: '13900010002', address: '广州市天河区日化大道88号', code: 'SUP002' },
                { id: 's003', name: '青岛啤酒股份有限公司', contact: '赵经理', phone: '13900010003', address: '山东省青岛市啤酒路1号', code: 'SUP003' },
                { id: 's004', name: '蒙牛乳业集团', contact: '陈经理', phone: '13900010004', address: '内蒙古呼和浩特市乳业大街', code: 'SUP004' },
                { id: 's005', name: '海天味业有限公司', contact: '林经理', phone: '13900010005', address: '广东省佛山市高明区', code: 'SUP005' },
            ]);
        }

        // 初始化仓库
        if (_read(KEYS.warehouses).length === 0) {
            _write(KEYS.warehouses, [
                { id: 'w001', name: 'A区总仓库', code: 'WH-A', manager: '张仓库', address: '仓库园区A栋', capacity: 5000, status: 'active' },
                { id: 'w002', name: 'B区冷库', code: 'WH-B', manager: '李冷库', address: '仓库园区B栋(冷链)', capacity: 3000, status: 'active' },
                { id: 'w003', name: 'C区日用品库', code: 'WH-C', manager: '王日用', address: '仓库园区C栋', capacity: 4000, status: 'active' },
            ]);
        }

        // 初始化商品
        if (_read(KEYS.goods).length === 0) {
            _write(KEYS.goods, [
                { id: 'g001', name: '康师傅红烧牛肉面', code: 'GOODS001', categoryId: 'c001', spec: '110g/包', unit: '箱', price: 48.00, stock: 500, minStock: 50, warehouseId: 'w001', supplierId: 's001', status: 'active' },
                { id: 'g002', name: '海飞丝去屑洗发水', code: 'GOODS002', categoryId: 'c007', spec: '400ml/瓶', unit: '瓶', price: 45.90, stock: 200, minStock: 30, warehouseId: 'w003', supplierId: 's002', status: 'active' },
                { id: 'g003', name: '青岛啤酒经典500ml', code: 'GOODS003', categoryId: 'c003', spec: '500ml/罐', unit: '箱', price: 72.00, stock: 300, minStock: 40, warehouseId: 'w001', supplierId: 's003', status: 'active' },
                { id: 'g004', name: '蒙牛纯牛奶', code: 'GOODS004', categoryId: 'c004', spec: '250ml/盒', unit: '箱', price: 65.00, stock: 45, minStock: 60, warehouseId: 'w002', supplierId: 's004', status: 'active' },
                { id: 'g005', name: '海天酱油金标生抽', code: 'GOODS005', categoryId: 'c005', spec: '500ml/瓶', unit: '瓶', price: 12.80, stock: 800, minStock: 100, warehouseId: 'w001', supplierId: 's005', status: 'active' },
                { id: 'g006', name: '维达抽纸3层', code: 'GOODS006', categoryId: 'c008', spec: '130抽/包', unit: '提', price: 24.90, stock: 350, minStock: 50, warehouseId: 'w003', supplierId: 's002', status: 'active' },
                { id: 'g007', name: '奥利奥夹心饼干', code: 'GOODS007', categoryId: 'c006', spec: '97g/盒', unit: '盒', price: 9.90, stock: 0, minStock: 30, warehouseId: 'w001', supplierId: 's001', status: 'active' },
                { id: 'g008', name: '舒肤佳沐浴露', code: 'GOODS008', categoryId: 'c007', spec: '720ml/瓶', unit: '瓶', price: 35.90, stock: 18, minStock: 25, warehouseId: 'w003', supplierId: 's002', status: 'active' },
            ]);
        }

        // 初始化入库记录
        if (_read(KEYS.inbound).length === 0) {
            _write(KEYS.inbound, [
                { id: 'in001', goodsId: 'g001', goodsName: '康师傅红烧牛肉面', quantity: 300, price: 45.00, supplierId: 's001', warehouseId: 'w001', operator: '张员工', date: '2025-06-10', remark: '月初采购入库' },
                { id: 'in002', goodsId: 'g003', goodsName: '青岛啤酒经典500ml', quantity: 200, price: 68.00, supplierId: 's003', warehouseId: 'w001', operator: '李员工', date: '2025-06-12', remark: '夏季啤酒备货' },
                { id: 'in003', goodsId: 'g005', goodsName: '海天酱油金标生抽', quantity: 500, price: 11.50, supplierId: 's005', warehouseId: 'w001', operator: '张员工', date: '2025-06-14', remark: '调味品补货' },
                { id: 'in004', goodsId: 'g002', goodsName: '海飞丝去屑洗发水', quantity: 100, price: 42.00, supplierId: 's002', warehouseId: 'w003', operator: '李员工', date: '2025-06-15', remark: '日化用品补货' },
                { id: 'in005', goodsId: 'g004', goodsName: '蒙牛纯牛奶', quantity: 80, price: 60.00, supplierId: 's004', warehouseId: 'w002', operator: '张员工', date: '2025-06-16', remark: '乳制品周采购' },
            ]);
        }

        // 初始化出库记录
        if (_read(KEYS.outbound).length === 0) {
            _write(KEYS.outbound, [
                { id: 'out001', goodsId: 'g001', goodsName: '康师傅红烧牛肉面', quantity: 80, price: 48.00, warehouseId: 'w001', operator: '李员工', date: '2025-06-11', type: '销售出库', customer: '永辉超市', remark: '正常销售' },
                { id: 'out002', goodsId: 'g005', goodsName: '海天酱油金标生抽', quantity: 200, price: 12.80, warehouseId: 'w001', operator: '张员工', date: '2025-06-13', type: '调拨出库', customer: '华联超市', remark: '门店调拨' },
                { id: 'out003', goodsId: 'g003', goodsName: '青岛啤酒经典500ml', quantity: 50, price: 72.00, warehouseId: 'w001', operator: '李员工', date: '2025-06-15', type: '销售出库', customer: '大润发', remark: '正常销售' },
                { id: 'out004', goodsId: 'g006', goodsName: '维达抽纸3层', quantity: 100, price: 24.90, warehouseId: 'w003', operator: '张员工', date: '2025-06-16', type: '销售出库', customer: '物美超市', remark: '促销活动' },
            ]);
        }
    }

    // ========== 用户相关 ==========

    function authenticate(username, password) {
        const users = _read(KEYS.users);
        return users.find(u => u.username === username && u.password === password && u.status === 'active') || null;
    }

    function getUsers() {
        return _read(KEYS.users);
    }

    function saveUser(user) {
        const users = _read(KEYS.users);
        if (user.id) {
            const idx = users.findIndex(u => u.id === user.id);
            if (idx >= 0) { users[idx] = user; }
        } else {
            user.id = _genId();
            user.createdAt = new Date().toISOString().split('T')[0];
            users.push(user);
        }
        _write(KEYS.users, users);
        return user;
    }

    function deleteUser(id) {
        const users = _read(KEYS.users).filter(u => u.id !== id);
        _write(KEYS.users, users);
    }

    // ========== 分类相关 ==========

    function getCategories() {
        return _read(KEYS.categories);
    }

    function saveCategory(cat) {
        const list = _read(KEYS.categories);
        if (cat.id) {
            const idx = list.findIndex(c => c.id === cat.id);
            if (idx >= 0) { list[idx] = cat; }
        } else {
            cat.id = _genId();
            list.push(cat);
        }
        _write(KEYS.categories, list);
        return cat;
    }

    function deleteCategory(id) {
        const list = _read(KEYS.categories).filter(c => c.id !== id);
        _write(KEYS.categories, list);
    }

    // ========== 供应商相关 ==========

    function getSuppliers() {
        return _read(KEYS.suppliers);
    }

    function saveSupplier(sup) {
        const list = _read(KEYS.suppliers);
        if (sup.id) {
            const idx = list.findIndex(s => s.id === sup.id);
            if (idx >= 0) { list[idx] = sup; }
        } else {
            sup.id = _genId();
            list.push(sup);
        }
        _write(KEYS.suppliers, list);
        return sup;
    }

    function deleteSupplier(id) {
        const list = _read(KEYS.suppliers).filter(s => s.id !== id);
        _write(KEYS.suppliers, list);
    }

    // ========== 仓库相关 ==========

    function getWarehouses() {
        return _read(KEYS.warehouses);
    }

    function saveWarehouse(wh) {
        const list = _read(KEYS.warehouses);
        if (wh.id) {
            const idx = list.findIndex(w => w.id === wh.id);
            if (idx >= 0) { list[idx] = wh; }
        } else {
            wh.id = _genId();
            list.push(wh);
        }
        _write(KEYS.warehouses, list);
        return wh;
    }

    function deleteWarehouse(id) {
        const list = _read(KEYS.warehouses).filter(w => w.id !== id);
        _write(KEYS.warehouses, list);
    }

    // ========== 商品相关 ==========

    function getGoods() {
        return _read(KEYS.goods);
    }

    function saveGoods(goods) {
        const list = _read(KEYS.goods);
        if (goods.id) {
            const idx = list.findIndex(g => g.id === goods.id);
            if (idx >= 0) { list[idx] = goods; }
        } else {
            goods.id = _genId();
            list.push(goods);
        }
        _write(KEYS.goods, list);
        return goods;
    }

    function deleteGoods(id) {
        const list = _read(KEYS.goods).filter(g => g.id !== id);
        _write(KEYS.goods, list);
    }

    function updateGoodsStock(goodsId, delta) {
        const list = _read(KEYS.goods);
        const goods = list.find(g => g.id === goodsId);
        if (goods) {
            goods.stock += delta;
            if (goods.stock < 0) goods.stock = 0;
            _write(KEYS.goods, list);
        }
        return goods;
    }

    // ========== 入库相关 ==========

    function getInboundRecords() {
        return _read(KEYS.inbound);
    }

    function saveInbound(record) {
        const list = _read(KEYS.inbound);
        if (record.id) {
            const idx = list.findIndex(r => r.id === record.id);
            if (idx >= 0) { list[idx] = record; }
        } else {
            record.id = _genId();
            list.unshift(record);
        }
        _write(KEYS.inbound, list);
        return record;
    }

    function deleteInbound(id) {
        const list = _read(KEYS.inbound).filter(r => r.id !== id);
        _write(KEYS.inbound, list);
    }

    // ========== 出库相关 ==========

    function getOutboundRecords() {
        return _read(KEYS.outbound);
    }

    function saveOutbound(record) {
        const list = _read(KEYS.outbound);
        if (record.id) {
            const idx = list.findIndex(r => r.id === record.id);
            if (idx >= 0) { list[idx] = record; }
        } else {
            record.id = _genId();
            list.unshift(record);
        }
        _write(KEYS.outbound, list);
        return record;
    }

    function deleteOutbound(id) {
        const list = _read(KEYS.outbound).filter(r => r.id !== id);
        _write(KEYS.outbound, list);
    }

    // ========== 统计 ==========

    function getStats() {
        const goods = _read(KEYS.goods);
        const inbound = _read(KEYS.inbound);
        const outbound = _read(KEYS.outbound);
        const warehouses = _read(KEYS.warehouses);
        const suppliers = _read(KEYS.suppliers);
        const lowStock = goods.filter(g => g.stock > 0 && g.stock <= g.minStock).length;
        const outStock = goods.filter(g => g.stock === 0).length;
        const totalInbound = inbound.reduce((sum, r) => sum + r.quantity * r.price, 0);
        const totalOutbound = outbound.reduce((sum, r) => sum + r.quantity * r.price, 0);

        return {
            totalGoods: goods.length,
            totalWarehouses: warehouses.length,
            totalSuppliers: suppliers.length,
            totalInbound: inbound.length,
            totalOutbound: outbound.length,
            totalInboundValue: totalInbound,
            totalOutboundValue: totalOutbound,
            lowStock,
            outStock,
        };
    }

    // 初始化
    initDefaultData();

    return {
        KEYS,
        authenticate,
        getUsers, saveUser, deleteUser,
        getCategories, saveCategory, deleteCategory,
        getSuppliers, saveSupplier, deleteSupplier,
        getWarehouses, saveWarehouse, deleteWarehouse,
        getGoods, saveGoods, deleteGoods, updateGoodsStock,
        getInboundRecords, saveInbound, deleteInbound,
        getOutboundRecords, saveOutbound, deleteOutbound,
        getStats,
        _genId,
    };
})();
