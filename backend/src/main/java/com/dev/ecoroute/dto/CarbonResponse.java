package com.dev.ecoroute.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Carbon Interface API carbon emission estimation response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CarbonResponse {
    private double carbonKg;  // Carbon emissions in kilograms
    private String transportType;
    private double distance;
    private String unit;
    private double carbonLb;  // Carbon emissions in pounds
    private String estimateType;
}

