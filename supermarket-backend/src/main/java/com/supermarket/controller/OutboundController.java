package com.supermarket.controller;

import com.supermarket.entity.OutboundRecord;
import com.supermarket.service.OutboundService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/outbound")
public class OutboundController {

    private final OutboundService outboundService;

    public OutboundController(OutboundService outboundService) {
        this.outboundService = outboundService;
    }

    @GetMapping
    public List<OutboundRecord> getAll() {
        return outboundService.getAll();
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody OutboundRecord record) {
        try {
            return ResponseEntity.ok(outboundService.save(record));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        outboundService.delete(id);
        return ResponseEntity.ok().build();
    }
}
