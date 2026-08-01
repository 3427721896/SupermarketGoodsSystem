package com.supermarket.repository;

import com.supermarket.entity.Goods;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoodsRepository extends JpaRepository<Goods, String> {
}
