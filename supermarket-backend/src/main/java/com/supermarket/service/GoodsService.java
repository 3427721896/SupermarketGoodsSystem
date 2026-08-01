package com.supermarket.service;

import com.supermarket.entity.Goods;
import com.supermarket.repository.GoodsRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GoodsService {

    private final GoodsRepository goodsRepository;

    public GoodsService(GoodsRepository goodsRepository) {
        this.goodsRepository = goodsRepository;
    }

    public List<Goods> getAll() {
        return goodsRepository.findAll();
    }

    public Goods save(Goods goods) {
        if (goods.getId() != null && !goods.getId().isEmpty()) {
            Goods existing = goodsRepository.findById(goods.getId()).orElse(null);
            if (existing != null) {
                existing.setName(goods.getName());
                existing.setCode(goods.getCode());
                existing.setCategoryId(goods.getCategoryId());
                existing.setSpec(goods.getSpec());
                existing.setUnit(goods.getUnit());
                existing.setPrice(goods.getPrice());
                existing.setMinStock(goods.getMinStock());
                existing.setWarehouseId(goods.getWarehouseId());
                existing.setSupplierId(goods.getSupplierId());
                if (goods.getStatus() != null) existing.setStatus(goods.getStatus());
                return goodsRepository.save(existing);
            }
        }

        goods.setId(UUID.randomUUID().toString().substring(0, 8));
        if (goods.getStatus() == null) goods.setStatus("active");
        return goodsRepository.save(goods);
    }

    public void delete(String id) {
        goodsRepository.deleteById(id);
    }

    public Map<String, Object> getStats() {
        List<Goods> goods = goodsRepository.findAll();
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalGoods", goods.size());
        long lowStock = goods.stream().filter(g -> g.getStock() > 0 && g.getStock() <= g.getMinStock()).count();
        long outStock = goods.stream().filter(g -> g.getStock() == 0).count();
        stats.put("lowStock", lowStock);
        stats.put("outStock", outStock);
        return stats;
    }
}
