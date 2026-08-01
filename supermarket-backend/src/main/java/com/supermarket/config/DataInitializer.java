package com.supermarket.config;

import com.supermarket.entity.*;
import com.supermarket.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final WarehouseRepository warehouseRepository;
    private final GoodsRepository goodsRepository;
    private final InboundRecordRepository inboundRepository;
    private final OutboundRecordRepository outboundRepository;

    public DataInitializer(UserRepository userRepository, CategoryRepository categoryRepository,
                           SupplierRepository supplierRepository, WarehouseRepository warehouseRepository,
                           GoodsRepository goodsRepository, InboundRecordRepository inboundRepository,
                           OutboundRecordRepository outboundRepository) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.warehouseRepository = warehouseRepository;
        this.goodsRepository = goodsRepository;
        this.inboundRepository = inboundRepository;
        this.outboundRepository = outboundRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // Users
        userRepository.save(createUser("u001", "admin", "123456", "系统管理员", "admin", "13800000001", "2025-01-01"));
        userRepository.save(createUser("u002", "employee", "123456", "张员工", "employee", "13800000002", "2025-01-15"));
        userRepository.save(createUser("u003", "emp2", "123456", "李员工", "employee", "13800000003", "2025-03-01"));

        // Categories
        categoryRepository.save(createCategory("c001", "食品饮料", "FOOD", "各类食品及饮品"));
        categoryRepository.save(createCategory("c002", "日用品", "DAILY", "日常家居用品"));
        categoryRepository.save(createCategory("c003", "酒水", "WINE", "白酒/啤酒/红酒/饮料"));
        categoryRepository.save(createCategory("c004", "乳制品", "MILK", "牛奶/酸奶/奶酪"));
        categoryRepository.save(createCategory("c005", "调味品", "SPICE", "油盐酱醋等调味品"));
        categoryRepository.save(createCategory("c006", "零食糖果", "SNACK", "休闲零食及糖果"));
        categoryRepository.save(createCategory("c007", "洗护用品", "WASH", "洗发水/沐浴露等"));
        categoryRepository.save(createCategory("c008", "纸品清洁", "PAPER", "纸巾/清洁用品"));

        // Suppliers
        supplierRepository.save(createSupplier("s001", "康师傅食品有限公司", "王经理", "13900010001", "北京市朝阳区食品工业园A区", "SUP001"));
        supplierRepository.save(createSupplier("s002", "宝洁日化集团", "刘经理", "13900010002", "广州市天河区日化大道88号", "SUP002"));
        supplierRepository.save(createSupplier("s003", "青岛啤酒股份有限公司", "赵经理", "13900010003", "山东省青岛市啤酒路1号", "SUP003"));
        supplierRepository.save(createSupplier("s004", "蒙牛乳业集团", "陈经理", "13900010004", "内蒙古呼和浩特市乳业大街", "SUP004"));
        supplierRepository.save(createSupplier("s005", "海天味业有限公司", "林经理", "13900010005", "广东省佛山市高明区", "SUP005"));

        // Warehouses
        warehouseRepository.save(createWarehouse("w001", "A区总仓库", "WH-A", "张仓库", "仓库园区A栋", 5000));
        warehouseRepository.save(createWarehouse("w002", "B区冷库", "WH-B", "李冷库", "仓库园区B栋(冷链)", 3000));
        warehouseRepository.save(createWarehouse("w003", "C区日用品库", "WH-C", "王日用", "仓库园区C栋", 4000));

        // Goods
        goodsRepository.save(createGoods("g001", "康师傅红烧牛肉面", "GOODS001", "c001", "110g/包", "箱", 48.00, 500, 50, "w001", "s001"));
        goodsRepository.save(createGoods("g002", "海飞丝去屑洗发水", "GOODS002", "c007", "400ml/瓶", "瓶", 45.90, 200, 30, "w003", "s002"));
        goodsRepository.save(createGoods("g003", "青岛啤酒经典500ml", "GOODS003", "c003", "500ml/罐", "箱", 72.00, 300, 40, "w001", "s003"));
        goodsRepository.save(createGoods("g004", "蒙牛纯牛奶", "GOODS004", "c004", "250ml/盒", "箱", 65.00, 45, 60, "w002", "s004"));
        goodsRepository.save(createGoods("g005", "海天酱油金标生抽", "GOODS005", "c005", "500ml/瓶", "瓶", 12.80, 800, 100, "w001", "s005"));
        goodsRepository.save(createGoods("g006", "维达抽纸3层", "GOODS006", "c008", "130抽/包", "提", 24.90, 350, 50, "w003", "s002"));
        goodsRepository.save(createGoods("g007", "奥利奥夹心饼干", "GOODS007", "c006", "97g/盒", "盒", 9.90, 0, 30, "w001", "s001"));
        goodsRepository.save(createGoods("g008", "舒肤佳沐浴露", "GOODS008", "c007", "720ml/瓶", "瓶", 35.90, 18, 25, "w003", "s002"));

        // Inbound records
        inboundRepository.save(createInbound("in001", "g001", "康师傅红烧牛肉面", 300, 45.00, "s001", "w001", "张员工", "2025-06-10", "月初采购入库"));
        inboundRepository.save(createInbound("in002", "g003", "青岛啤酒经典500ml", 200, 68.00, "s003", "w001", "李员工", "2025-06-12", "夏季啤酒备货"));
        inboundRepository.save(createInbound("in003", "g005", "海天酱油金标生抽", 500, 11.50, "s005", "w001", "张员工", "2025-06-14", "调味品补货"));
        inboundRepository.save(createInbound("in004", "g002", "海飞丝去屑洗发水", 100, 42.00, "s002", "w003", "李员工", "2025-06-15", "日化用品补货"));
        inboundRepository.save(createInbound("in005", "g004", "蒙牛纯牛奶", 80, 60.00, "s004", "w002", "张员工", "2025-06-16", "乳制品周采购"));

        // Outbound records
        outboundRepository.save(createOutbound("out001", "g001", "康师傅红烧牛肉面", 80, 48.00, "w001", "李员工", "2025-06-11", "销售出库", "永辉超市", "正常销售"));
        outboundRepository.save(createOutbound("out002", "g005", "海天酱油金标生抽", 200, 12.80, "w001", "张员工", "2025-06-13", "调拨出库", "华联超市", "门店调拨"));
        outboundRepository.save(createOutbound("out003", "g003", "青岛啤酒经典500ml", 50, 72.00, "w001", "李员工", "2025-06-15", "销售出库", "大润发", "正常销售"));
        outboundRepository.save(createOutbound("out004", "g006", "维达抽纸3层", 100, 24.90, "w003", "张员工", "2025-06-16", "销售出库", "物美超市", "促销活动"));
    }

    private User createUser(String id, String username, String password, String name, String role, String phone, String createdAt) {
        User u = new User();
        u.setId(id); u.setUsername(username); u.setPassword(password);
        u.setName(name); u.setRole(role); u.setPhone(phone);
        u.setStatus("active"); u.setCreatedAt(createdAt);
        return u;
    }

    private Category createCategory(String id, String name, String code, String desc) {
        Category c = new Category();
        c.setId(id); c.setName(name); c.setCode(code); c.setDesc(desc);
        return c;
    }

    private Supplier createSupplier(String id, String name, String contact, String phone, String address, String code) {
        Supplier s = new Supplier();
        s.setId(id); s.setName(name); s.setContact(contact); s.setPhone(phone);
        s.setAddress(address); s.setCode(code);
        return s;
    }

    private Warehouse createWarehouse(String id, String name, String code, String manager, String address, int capacity) {
        Warehouse w = new Warehouse();
        w.setId(id); w.setName(name); w.setCode(code); w.setManager(manager);
        w.setAddress(address); w.setCapacity(capacity); w.setStatus("active");
        return w;
    }

    private Goods createGoods(String id, String name, String code, String categoryId, String spec,
                              String unit, double price, int stock, int minStock, String warehouseId, String supplierId) {
        Goods g = new Goods();
        g.setId(id); g.setName(name); g.setCode(code); g.setCategoryId(categoryId);
        g.setSpec(spec); g.setUnit(unit); g.setPrice(price); g.setStock(stock);
        g.setMinStock(minStock); g.setWarehouseId(warehouseId); g.setSupplierId(supplierId);
        g.setStatus("active");
        return g;
    }

    private InboundRecord createInbound(String id, String goodsId, String goodsName, int qty, double price,
                                        String supplierId, String warehouseId, String operator, String date, String remark) {
        InboundRecord r = new InboundRecord();
        r.setId(id); r.setGoodsId(goodsId); r.setGoodsName(goodsName); r.setQuantity(qty);
        r.setPrice(price); r.setSupplierId(supplierId); r.setWarehouseId(warehouseId);
        r.setOperator(operator); r.setDate(date); r.setRemark(remark);
        return r;
    }

    private OutboundRecord createOutbound(String id, String goodsId, String goodsName, int qty, double price,
                                          String warehouseId, String operator, String date, String type, String customer, String remark) {
        OutboundRecord r = new OutboundRecord();
        r.setId(id); r.setGoodsId(goodsId); r.setGoodsName(goodsName); r.setQuantity(qty);
        r.setPrice(price); r.setWarehouseId(warehouseId); r.setOperator(operator);
        r.setDate(date); r.setType(type); r.setCustomer(customer); r.setRemark(remark);
        return r;
    }
}
