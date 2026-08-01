package com.supermarket.repository;

import com.supermarket.entity.OutboundRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OutboundRecordRepository extends JpaRepository<OutboundRecord, String> {
}
