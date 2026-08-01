package com.supermarket.service;

import com.supermarket.entity.Supplier;
import com.supermarket.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public List<Supplier> getAll() {
        return supplierRepository.findAll();
    }

    public Supplier save(Supplier supplier) {
        if (supplier.getId() == null || supplier.getId().isEmpty()) {
            supplier.setId(UUID.randomUUID().toString().substring(0, 8));
        }
        return supplierRepository.save(supplier);
    }

    public void delete(String id) {
        supplierRepository.deleteById(id);
    }
}
