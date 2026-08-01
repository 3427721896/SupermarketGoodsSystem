package com.supermarket.controller;

import com.supermarket.entity.InboundRecord;
import com.supermarket.service.InboundService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inbound")
public class InboundController {

    private final InboundService inboundService;

    public InboundController(InboundService inboundService) {
        this.inboundService = inboundService;
    }

    @GetMapping
    public List<InboundRecord> getAll() {
        return inboundService.getAll();
    }

    @PostMapping
    public InboundRecord save(@RequestBody InboundRecord record) {
        return inboundService.save(record);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        inboundService.delete(id);
        return ResponseEntity.ok().build();
    }
}
