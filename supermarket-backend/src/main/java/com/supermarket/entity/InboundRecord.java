package com.supermarket.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "inbound_records")
public class InboundRecord {
    @Id
    private String id;

    private String goodsId;
    private String goodsName;
    private int quantity;
    private double price;
    private String supplierId;
    private String warehouseId;
    private String operator;
    private String date;
    private String remark;

    public InboundRecord() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getGoodsId() { return goodsId; }
    public void setGoodsId(String goodsId) { this.goodsId = goodsId; }

    public String getGoodsName() { return goodsName; }
    public void setGoodsName(String goodsName) { this.goodsName = goodsName; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getSupplierId() { return supplierId; }
    public void setSupplierId(String supplierId) { this.supplierId = supplierId; }

    public String getWarehouseId() { return warehouseId; }
    public void setWarehouseId(String warehouseId) { this.warehouseId = warehouseId; }

    public String getOperator() { return operator; }
    public void setOperator(String operator) { this.operator = operator; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
}
