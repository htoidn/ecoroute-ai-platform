package com.dev.ecoroute.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for OpenWeatherMap API weather information response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class WeatherResponse {
    private String city;
    private String country;
    private double temperature;
    private String condition;
    private int humidity;
    private double windSpeed;
    private String description;
}
