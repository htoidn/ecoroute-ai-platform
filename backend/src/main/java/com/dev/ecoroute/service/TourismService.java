package com.dev.ecoroute.service;

import com.dev.ecoroute.dto.TourismResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for integrating with Geoapify API.
 * Provides tourism attractions and points of interest information.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TourismService {

    private final RestTemplate restTemplate;

    @Value("${external.apis.geoapify.key}")
    private String geoapifyApiKey;

    @Value("${external.apis.geoapify.url}")
    private String geoapifyApiUrl;

    /**
     * Get tourism attractions and sights near specified coordinates.
     *
     * @param latitude Location latitude
     * @param longitude Location longitude
     * @param radius Search radius in kilometers (default 5)
     * @return List of TourismResponse with attractions information
     */
    public List<TourismResponse> getTouristAttractions(double latitude, double longitude, int radius) {
        try {
            String url = String.format("%s?categories=tourism.sights&filter=circle:%f,%f,%d&limit=10&apiKey=%s",
                    geoapifyApiUrl, longitude, latitude, Math.max(100, radius * 1000), geoapifyApiKey);

            // Call Geoapify API
            var response = restTemplate.getForObject(url, GeoapifyResponse.class);

            if (response != null && response.getFeatures() != null) {
                return response.getFeatures().stream()
                        .map(this::convertToTourismResponse)
                        .collect(Collectors.toList());
            }

            log.warn("No tourism data received for coordinates: ({},{})", latitude, longitude);
            return Collections.emptyList();
        } catch (RestClientException e) {
            log.error("Error fetching tourism attractions: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch tourism data: " + e.getMessage());
        }
    }

    /**
     * Convert Geoapify feature response to our standardized TourismResponse DTO.
     */
    private TourismResponse convertToTourismResponse(Feature feature) {
        TourismResponse response = new TourismResponse();

        if (feature.getProperties() != null) {
            var props = feature.getProperties();
            response.setName(props.getName());
            response.setType(props.getType());
            response.setCategory(props.getCategory());
            response.setAddress(props.getAddress_line1());
            response.setWebsite(props.getWebsite());
            response.setDescription(props.getDescription());
        }

        if (feature.getGeometry() != null && feature.getGeometry().getCoordinates() != null) {
            var coords = feature.getGeometry().getCoordinates();
            if (coords.size() >= 2) {
                response.setLongitude(coords.get(0));
                response.setLatitude(coords.get(1));
            }
        }

        return response;
    }

    // Inner classes for deserializing Geoapify response
    public static class GeoapifyResponse {
        public java.util.List<Feature> features;

        public java.util.List<Feature> getFeatures() {
            return features != null ? features : Collections.emptyList();
        }
        public void setFeatures(java.util.List<Feature> features) { this.features = features; }
    }

    public static class Feature {
        public Properties properties;
        public Geometry geometry;

        public Properties getProperties() { return properties; }
        public Geometry getGeometry() { return geometry; }
        public void setProperties(Properties properties) { this.properties = properties; }
        public void setGeometry(Geometry geometry) { this.geometry = geometry; }
    }

    public static class Properties {
        public String name;
        public String type;
        public String category;
        public String address_line1;
        public String website;
        public String description;

        // Getters and Setters
        public String getName() { return name; }
        public String getType() { return type; }
        public String getCategory() { return category; }
        public String getAddress_line1() { return address_line1; }
        public String getWebsite() { return website; }
        public String getDescription() { return description; }

        public void setName(String name) { this.name = name; }
        public void setType(String type) { this.type = type; }
        public void setCategory(String category) { this.category = category; }
        public void setAddress_line1(String address_line1) { this.address_line1 = address_line1; }
        public void setWebsite(String website) { this.website = website; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class Geometry {
        public java.util.List<Double> coordinates;

        public java.util.List<Double> getCoordinates() { return coordinates; }
        public void setCoordinates(java.util.List<Double> coordinates) { this.coordinates = coordinates; }
    }
}

