package com.supermarket.service;

import com.supermarket.entity.Goods;
import com.supermarket.entity.OutboundRecord;
import com.supermarket.repository.GoodsRepository;
import com.supermarket.repository.OutboundRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class OutboundService {

    private final OutboundRecordRepository outboundRepository;
    private final GoodsRepository goodsRepository;

    public OutboundService(OutboundRecordRepository outboundRepository, GoodsRepository goodsRepository) {
        this.outboundRepository = outboundRepository;
        this.goodsRepository = goodsRepository;
    }

    public List<OutboundRecord> getAll() {
        return outboundRepository.findAll();
    }

    @Transactional
    public OutboundRecord save(OutboundRecord record) {
        // Check stock
        Goods goods = goodsRepository.findById(record.getGoodsId()).orElse(null);
        if (goods == null) {
            throw new RuntimeException("商品不存在");
        }
        if (record.getQuantity() > goods.getStock()) {
            throw new RuntimeException("库存不足！当前库存：" + goods.getStock());
        }

        record.setId(UUID.randomUUID().toString().substring(0, 8));
        goods.setStock(goods.getStock() - record.getQuantity());
        goodsRepository.save(goods);

        return outboundRepository.save(record);
    }

    public void delete(String id) {
        outboundRepository.deleteById(id);
    }
}
