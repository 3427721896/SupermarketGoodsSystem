package com.supermarket.controller;

import com.supermarket.entity.Goods;
import com.supermarket.service.GoodsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/goods")
public class GoodsController {

    private final GoodsService goodsService;

    public GoodsController(GoodsService goodsService) {
        this.goodsService = goodsService;
    }

    @GetMapping
    public List<Goods> getAll() {
        return goodsService.getAll();
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return goodsService.getStats();
    }

    @PostMapping
    public Goods save(@RequestBody Goods goods) {
        return goodsService.save(goods);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        goodsService.delete(id);
        return ResponseEntity.ok().build();
    }
}
