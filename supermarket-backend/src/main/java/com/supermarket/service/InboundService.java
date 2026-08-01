package com.supermarket.service;

import com.supermarket.entity.Goods;
import com.supermarket.entity.InboundRecord;
import com.supermarket.repository.GoodsRepository;
import com.supermarket.repository.InboundRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class InboundService {

    private final InboundRecordRepository inboundRepository;
    private final GoodsRepository goodsRepository;

    public InboundService(InboundRecordRepository inboundRepository, GoodsRepository goodsRepository) {
        this.inboundRepository = inboundRepository;
        this.goodsRepository = goodsRepository;
    }

    public List<InboundRecord> getAll() {
        return inboundRepository.findAll();
    }

    @Transactional
    public InboundRecord save(InboundRecord record) {
        record.setId(UUID.randomUUID().toString().substring(0, 8));

        // Update goods stock
        Goods goods = goodsRepository.findById(record.getGoodsId()).orElse(null);
        if (goods != null) {
            goods.setStock(goods.getStock() + record.getQuantity());
            goodsRepository.save(goods);
        }

        return inboundRepository.save(record);
    }

    public void delete(String id) {
        inboundRepository.deleteById(id);
    }
}
