package com.dev.ecoroute.service;

import com.dev.ecoroute.dto.CarbonResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for integrating with Carbon Interface API.
 * Calculates carbon emissions for different transportation modes.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CarbonService {

    private final RestTemplate restTemplate;

    @Value("${external.apis.carbon.key}")
    private String carbonApiKey;

    @Value("${external.apis.carbon.url}")
    private String carbonApiUrl;

    /**
     * Estimate carbon emissions for transportation.
     *
     * @param transportType Type of transport (flight, car, bus, train, etc.)
     * @param distance Distance in kilometers
     * @return CarbonResponse with carbon emission data
     */
    public CarbonResponse estimateCarbon(String transportType, double distance) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + carbonApiKey);

            // Build request payload
            Map<String, Object> payload = new HashMap<>();
            payload.put("type", "estimate");

            Map<String, Object> estimateData = new HashMap<>();

            // Map transport type to Carbon Interface format
            String carbonTransportType = mapTransportType(transportType);
            estimateData.put("transport_method", carbonTransportType);
            estimateData.put("distance_value", distance);
            estimateData.put("distance_unit", "km");

            payload.put("estimate", estimateData);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            // Call Carbon Interface API
            var response = restTemplate.postForObject(carbonApiUrl, entity, CarbonInterfaceResponse.class);

            if (response != null && response.getData() != null) {
                return convertToCarbonResponse(response.getData(), transportType, distance);
            }

            log.warn("No carbon data received from external API, using fallback calculation for transport: {} distance: {}", transportType, distance);
            return calculateCarbonFallback(transportType, distance);
        } catch (RestClientException e) {
            log.warn("Error fetching from external carbon API: {}, using fallback calculation", e.getMessage());
            // Use fallback calculation if external API fails
            return calculateCarbonFallback(transportType, distance);
        } catch (Exception e) {
            log.error("Unexpected error in carbon calculation: {}", e.getMessage());
            // Use fallback calculation for any unexpected error
            return calculateCarbonFallback(transportType, distance);
        }
    }

    /**
     * Fallback method to calculate carbon emissions locally based on realistic data for Germany.
     * Uses emission factors for different transport types.
     */
    private CarbonResponse calculateCarbonFallback(String transportType, double distance) {
        CarbonResponse response = new CarbonResponse();
        response.setTransportType(transportType);
        response.setDistance(distance);
        response.setUnit("kg");

        // Realistic CO2 emission factors for Germany (grams per kilometer)
        // Sources: German Environmental Agency (UBA), Transport & Environment
        double emissionsPerKm = switch (transportType.toLowerCase()) {
            case "flight" -> 255.0;  // 255g CO2 per km per passenger (common assumption)
            case "car" -> 184.0;     // 184g CO2 per km (average passenger car)
            case "bus" -> 32.0;      // 32g CO2 per km per passenger (fully loaded)
            case "train" -> 18.0;    // 18g CO2 per km per passenger (German average)
            case "motorcycle" -> 92.0; // 92g CO2 per km
            default -> 184.0;        // Default to car
        };

        // Calculate total emissions
        double carbonKg = (emissionsPerKm * distance) / 1000.0;  // Convert grams to kg
        double carbonLb = carbonKg * 2.20462;  // Convert kg to pounds

        response.setCarbonKg(carbonKg);
        response.setCarbonLb(carbonLb);
        response.setEstimateType("local_calculation");

        log.info("Using fallback calculation for {} km by {}: {} kg CO2", distance, transportType, String.format("%.2f", carbonKg));
        return response;
    }

    /**
     * Map user-friendly transport type names to Carbon Interface API format.
     */
    private String mapTransportType(String transportType) {
        return switch (transportType.toLowerCase()) {
            case "flight" -> "flight";
            case "car" -> "personal_car";
            case "bus" -> "bus";
            case "train" -> "train";
            case "motorcycle" -> "motorcycle";
            default -> "personal_car";
        };
    }

    /**
     * Convert Carbon Interface API response to our standardized CarbonResponse DTO.
     */
    private CarbonResponse convertToCarbonResponse(CarbonData data, String transportType, double distance) {
        CarbonResponse response = new CarbonResponse();
        response.setTransportType(transportType);
        response.setDistance(distance);
        response.setUnit("kg");

        if (data.getAttributes() != null) {
            var attrs = data.getAttributes();
            response.setCarbonKg(attrs.getEmissions_kg());
            response.setCarbonLb(attrs.getEmissions_lb());
            response.setEstimateType(attrs.getEstimate_type());
        }

        return response;
    }

    // Inner classes for deserializing Carbon Interface API response
    public static class CarbonInterfaceResponse {
        public CarbonData data;

        public CarbonData getData() { return data; }
        public void setData(CarbonData data) { this.data = data; }
    }

    public static class CarbonData {
        public Attributes attributes;

        public Attributes getAttributes() { return attributes; }
        public void setAttributes(Attributes attributes) { this.attributes = attributes; }
    }

    public static class Attributes {
        public double emissions_kg;
        public double emissions_lb;
        public String estimate_type;

        public double getEmissions_kg() { return emissions_kg; }
        public double getEmissions_lb() { return emissions_lb; }
        public String getEstimate_type() { return estimate_type; }

        public void setEmissions_kg(double emissions_kg) { this.emissions_kg = emissions_kg; }
        public void setEmissions_lb(double emissions_lb) { this.emissions_lb = emissions_lb; }
        public void setEstimate_type(String estimate_type) { this.estimate_type = estimate_type; }
    }
}

