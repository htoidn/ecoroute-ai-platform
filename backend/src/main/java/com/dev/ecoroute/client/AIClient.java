package com.dev.ecoroute.client;

import com.dev.ecoroute.model.Destination;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AIClient {
    private final RestTemplate restTemplate;

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    public AIClient() {
        this.restTemplate = new RestTemplate();
    }

    public Object recommend(String input, List<Destination> destinations) {

        Map<String, Object> request = new HashMap<>();
        request.put("user_input", input);
        request.put("destinations", destinations);

        ResponseEntity<Object> response = restTemplate.postForEntity(
                aiServiceUrl + "/recommend",
                request,
                Object.class
        );

        return response.getBody();
    }
}
