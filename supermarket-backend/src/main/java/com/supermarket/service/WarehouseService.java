package com.supermarket.service;

import com.supermarket.entity.Warehouse;
import com.supermarket.repository.WarehouseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    public WarehouseService(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

    public List<Warehouse> getAll() {
        return warehouseRepository.findAll();
    }

    public Warehouse save(Warehouse warehouse) {
        if (warehouse.getId() == null || warehouse.getId().isEmpty()) {
            warehouse.setId(UUID.randomUUID().toString().substring(0, 8));
        }
        return warehouseRepository.save(warehouse);
    }

    public void delete(String id) {
        warehouseRepository.deleteById(id);
    }
}
