package com.dev.ecoroute.service;

import com.dev.ecoroute.dto.RouteResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

/**
 * Service for integrating with OpenRouteService API.
 * Provides route calculation and distance/duration information.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RouteService {

    private final RestTemplate restTemplate;

    @Value("${external.apis.route.key}")
    private String routeApiKey;

    @Value("${external.apis.route.url}")
    private String routeApiUrl;

    /**
     * Calculate route between two coordinates.
     *
     * @param startLat Starting latitude
     * @param startLon Starting longitude
     * @param endLat Ending latitude
     * @param endLon Ending longitude
     * @return RouteResponse with distance, duration, and route geometry
     */
    public RouteResponse getRoute(double startLat, double startLon, double endLat, double endLon) {
        try {
            // Construct the URL with coordinates
            String url = String.format("%s?start=%f,%f&end=%f,%f",
                    routeApiUrl, startLon, startLat, endLon, endLat);

            // Set up headers with API key
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", routeApiKey);
            headers.set("Content-Type", "application/json");

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            // Call OpenRouteService API using exchange instead of getForObject
            var response = restTemplate.exchange(url, HttpMethod.GET, entity, OrsResponse.class).getBody();

            if (response != null && !response.getRoutes().isEmpty()) {
                return convertToRouteResponse(response.getRoutes().get(0));
            }

            log.warn("No route found for coordinates: ({},{})-({},{})",
                    startLat, startLon, endLat, endLon);
            return null;
        } catch (RestClientException e) {
            log.error("Error fetching route: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch route data: " + e.getMessage());
        }
    }

    /**
     * Convert OpenRouteService response to our standardized RouteResponse DTO.
     */
    private RouteResponse convertToRouteResponse(Route route) {
        RouteResponse response = new RouteResponse();

        if (route.getProperties() != null) {
            response.setDistance(route.getProperties().getSummary() != null ?
                    route.getProperties().getSummary().getDistance() : 0);
            response.setDuration(route.getProperties().getSummary() != null ?
                    route.getProperties().getSummary().getDuration() : 0);
        }

        response.setSummary("Route calculated successfully");

        return response;
    }

    // Inner classes for deserializing OpenRouteService response
    public static class OrsResponse {
        public java.util.List<Route> routes;

        public java.util.List<Route> getRoutes() {
            return routes != null ? routes : java.util.Collections.emptyList();
        }
        public void setRoutes(java.util.List<Route> routes) { this.routes = routes; }
    }

    public static class Route {
        public RouteProperties properties;

        public RouteProperties getProperties() { return properties; }
        public void setProperties(RouteProperties properties) { this.properties = properties; }
    }

    public static class RouteProperties {
        public Summary summary;

        public Summary getSummary() { return summary; }
        public void setSummary(Summary summary) { this.summary = summary; }
    }

    public static class Summary {
        public double distance;
        public double duration;

        public double getDistance() { return distance; }
        public double getDuration() { return duration; }
        public void setDistance(double distance) { this.distance = distance; }
        public void setDuration(double duration) { this.duration = duration; }
    }
}

