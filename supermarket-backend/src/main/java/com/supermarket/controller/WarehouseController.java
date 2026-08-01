package com.supermarket.controller;

import com.supermarket.entity.Warehouse;
import com.supermarket.service.WarehouseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseController {

    private final WarehouseService warehouseService;

    public WarehouseController(WarehouseService warehouseService) {
        this.warehouseService = warehouseService;
    }

    @GetMapping
    public List<Warehouse> getAll() {
        return warehouseService.getAll();
    }

    @PostMapping
    public Warehouse save(@RequestBody Warehouse warehouse) {
        return warehouseService.save(warehouse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        warehouseService.delete(id);
        return ResponseEntity.ok().build();
    }
}
