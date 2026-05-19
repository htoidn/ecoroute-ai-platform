package com.dev.ecoroute.service;

import com.dev.ecoroute.dto.WeatherResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

/**
 * Service for integrating with OpenWeatherMap API.
 * Provides weather information for specified cities.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WeatherService {

    private final RestTemplate restTemplate;

    @Value("${external.apis.weather.key}")
    private String weatherApiKey;

    @Value("${external.apis.weather.url}")
    private String weatherApiUrl;

    /**
     * Get weather information for a specific city.
     *
     * @param city The city name
     * @return WeatherResponse containing temperature, condition, humidity, etc.
     */
    public WeatherResponse getWeatherByCity(String city) {
        try {
            String url = String.format("%s?q=%s&appid=%s&units=metric", weatherApiUrl, city, weatherApiKey);

            // Call OpenWeatherMap API
            var response = restTemplate.getForObject(url, WeatherMap.class);

            if (response != null) {
                return convertToWeatherResponse(response, city);
            }

            log.warn("No weather data received for city: {}", city);
            return null;
        } catch (RestClientException e) {
            log.error("Error fetching weather for city {}: {}", city, e.getMessage());
            throw new RuntimeException("Failed to fetch weather data: " + e.getMessage());
        }
    }

    /**
     * Convert OpenWeatherMap response to our standardized WeatherResponse DTO.
     */
    private WeatherResponse convertToWeatherResponse(WeatherMap owmResponse, String city) {
        WeatherResponse response = new WeatherResponse();
        response.setCity(city);
        response.setCountry(owmResponse.getSys() != null ? owmResponse.getSys().getCountry() : "");
        response.setTemperature(owmResponse.getMain() != null ? owmResponse.getMain().getTemp() : 0);
        response.setHumidity(owmResponse.getMain() != null ? owmResponse.getMain().getHumidity() : 0);
        response.setWindSpeed(owmResponse.getWind() != null ? owmResponse.getWind().getSpeed() : 0);

        if (!owmResponse.getWeather().isEmpty()) {
            response.setCondition(owmResponse.getWeather().get(0).getMain());
            response.setDescription(owmResponse.getWeather().get(0).getDescription());
        }

        return response;
    }

    // Inner classes for deserializing OpenWeatherMap response
    public static class WeatherMap {
        public Main main;
        public Wind wind;
        public java.util.List<Weather> weather;
        public Sys sys;

        // Getters
        public Main getMain() { return main; }
        public Wind getWind() { return wind; }
        public java.util.List<Weather> getWeather() { return weather != null ? weather : java.util.Collections.emptyList(); }
        public Sys getSys() { return sys; }

        public void setMain(Main main) { this.main = main; }
        public void setWind(Wind wind) { this.wind = wind; }
        public void setWeather(java.util.List<Weather> weather) { this.weather = weather; }
        public void setSys(Sys sys) { this.sys = sys; }
    }

    public static class Main {
        public double temp;
        public int humidity;

        public double getTemp() { return temp; }
        public int getHumidity() { return humidity; }
        public void setTemp(double temp) { this.temp = temp; }
        public void setHumidity(int humidity) { this.humidity = humidity; }
    }

    public static class Wind {
        public double speed;

        public double getSpeed() { return speed; }
        public void setSpeed(double speed) { this.speed = speed; }
    }

    public static class Weather {
        public String main;
        public String description;

        public String getMain() { return main; }
        public String getDescription() { return description; }
        public void setMain(String main) { this.main = main; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class Sys {
        public String country;

        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }
    }
}

