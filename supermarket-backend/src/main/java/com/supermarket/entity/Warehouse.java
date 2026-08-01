package com.supermarket.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "warehouses")
public class Warehouse {
    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String code;

    private String manager;
    private String address;
    private int capacity;
    private String status = "active";

    public Warehouse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getManager() { return manager; }
    public void setManager(String manager) { this.manager = manager; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
