package com.supermarket.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "suppliers")
public class Supplier {
    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String contact;
    private String phone;
    private String address;

    @Column(nullable = false)
    private String code;

    public Supplier() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}
