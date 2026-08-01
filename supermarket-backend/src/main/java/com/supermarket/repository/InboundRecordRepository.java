package com.supermarket.repository;

import com.supermarket.entity.InboundRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InboundRecordRepository extends JpaRepository<InboundRecord, String> {
}
