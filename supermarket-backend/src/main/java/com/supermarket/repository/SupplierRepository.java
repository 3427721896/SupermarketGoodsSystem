package com.supermarket.repository;

import com.supermarket.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, String> {
}
