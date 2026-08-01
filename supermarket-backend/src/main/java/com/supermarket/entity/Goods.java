package com.supermarket.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "goods")
public class Goods {
    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String code;

    private String categoryId;
    private String spec;
    private String unit;
    private double price;
    private int stock;
    private int minStock;
    private String warehouseId;
    private String supplierId;
    private String status = "active";

    public Goods() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getSpec() { return spec; }
    public void setSpec(String spec) { this.spec = spec; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public int getMinStock() { return minStock; }
    public void setMinStock(int minStock) { this.minStock = minStock; }

    public String getWarehouseId() { return warehouseId; }
    public void setWarehouseId(String warehouseId) { this.warehouseId = warehouseId; }

    public String getSupplierId() { return supplierId; }
    public void setSupplierId(String supplierId) { this.supplierId = supplierId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
