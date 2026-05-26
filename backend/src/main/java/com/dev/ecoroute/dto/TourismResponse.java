package com.dev.ecoroute.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * DTO for Geoapify API tourism/attractions information response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TourismResponse {
    private String name;
    private String type;
    private String category;
    private String address;
    private double latitude;
    private double longitude;
    private String website;
    private String description;
    private List<String> categories;
}

