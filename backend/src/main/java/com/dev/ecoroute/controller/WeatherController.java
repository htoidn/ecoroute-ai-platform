package com.dev.ecoroute.controller;

import com.dev.ecoroute.dto.WeatherResponse;
import com.dev.ecoroute.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Weather API endpoints.
 * Provides weather information for specified cities through OpenWeatherMap integration.
 */
@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

    /**
     * Get weather information for a specific city.
     *
     * @param city City name
     * @return WeatherResponse with temperature, condition, humidity, etc.
     */
    @GetMapping("/{city}")
    public ResponseEntity<WeatherResponse> getWeatherByCity(@PathVariable String city) {
        WeatherResponse response = weatherService.getWeatherByCity(city);
        return ResponseEntity.ok(response);
    }
}

