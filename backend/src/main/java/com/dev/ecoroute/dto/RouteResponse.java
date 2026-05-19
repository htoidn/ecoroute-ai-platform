package com.dev.ecoroute.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for OpenRouteService API route information response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RouteResponse {
    private double distance;  // in meters
    private double duration;  // in seconds
    private String routeGeometry;
    private String summary;
}

