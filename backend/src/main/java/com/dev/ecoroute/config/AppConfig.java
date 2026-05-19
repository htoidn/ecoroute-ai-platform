package com.dev.ecoroute.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Application configuration for beans.
 * Configures RestTemplate for external API communication.
 */
@Configuration
public class AppConfig {

    /**
     * Create and configure a RestTemplate bean for making HTTP requests to external APIs.
     *
     * @return Configured RestTemplate bean
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

