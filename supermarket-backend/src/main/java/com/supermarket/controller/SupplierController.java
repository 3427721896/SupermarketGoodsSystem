package com.supermarket.controller;

import com.supermarket.entity.Supplier;
import com.supermarket.service.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public List<Supplier> getAll() {
        return supplierService.getAll();
    }

    @PostMapping
    public Supplier save(@RequestBody Supplier supplier) {
        return supplierService.save(supplier);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        supplierService.delete(id);
        return ResponseEntity.ok().build();
    }
}
