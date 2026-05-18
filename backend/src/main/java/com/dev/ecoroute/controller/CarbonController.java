package com.dev.ecoroute.controller;

import com.dev.ecoroute.dto.CarbonResponse;
import com.dev.ecoroute.service.CarbonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Carbon API endpoints.
 * Provides carbon emission estimates through Carbon Interface integration.
 */
@RestController
@RequestMapping("/api/carbon")
@RequiredArgsConstructor
public class CarbonController {

    private final CarbonService carbonService;

    /**
     * Estimate carbon emissions for transportation.
     *
     * @param transportType Type of transport (flight, car, bus, train, etc.)
     * @param distance Distance in kilometers
     * @return CarbonResponse with carbon emission data
     */
    @GetMapping
    public ResponseEntity<CarbonResponse> estimateCarbon(
            @RequestParam String transportType,
            @RequestParam double distance) {
        CarbonResponse response = carbonService.estimateCarbon(transportType, distance);
        return ResponseEntity.ok(response);
    }
}

