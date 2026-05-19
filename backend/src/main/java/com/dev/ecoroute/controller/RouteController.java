package com.dev.ecoroute.controller;

import com.dev.ecoroute.dto.RouteResponse;
import com.dev.ecoroute.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Route API endpoints.
 * Provides route calculation and distance information through OpenRouteService integration.
 */
@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    /**
     * Get route between two coordinates.
     *
     * @param startLat Starting latitude
     * @param startLon Starting longitude
     * @param endLat Ending latitude
     * @param endLon Ending longitude
     * @return RouteResponse with distance, duration, and route information
     */
    @GetMapping
    public ResponseEntity<RouteResponse> getRoute(
            @RequestParam double startLat,
            @RequestParam double startLon,
            @RequestParam double endLat,
            @RequestParam double endLon) {
        RouteResponse response = routeService.getRoute(startLat, startLon, endLat, endLon);
        return ResponseEntity.ok(response);
    }
}
