package com.dev.ecoroute.controller;

import com.dev.ecoroute.dto.TourismResponse;
import com.dev.ecoroute.service.TourismService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for Tourism API endpoints.
 * Provides tourism attractions and points of interest through Geoapify integration.
 */
@RestController
@RequestMapping("/api/tourism")
@RequiredArgsConstructor
public class TourismController {

    private final TourismService tourismService;

    /**
     * Get tourism attractions near specified coordinates.
     *
     * @param latitude Location latitude
     * @param longitude Location longitude
     * @param radius Search radius in kilometers (optional, default 5)
     * @return List of TourismResponse with attractions information
     */
    @GetMapping
    public ResponseEntity<List<TourismResponse>> getTourismAttractions(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "5") int radius) {
        List<TourismResponse> response = tourismService.getTouristAttractions(latitude, longitude, radius);
        return ResponseEntity.ok(response);
    }
}

