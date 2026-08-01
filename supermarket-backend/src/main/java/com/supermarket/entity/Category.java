package com.supermarket.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String code;

    @Column(name = "description")
    private String desc;

    public Category() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDesc() { return desc; }
    public void setDesc(String desc) { this.desc = desc; }
}
