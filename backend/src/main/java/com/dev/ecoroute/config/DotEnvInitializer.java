package com.dev.ecoroute.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

public class DotEnvInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        ConfigurableEnvironment environment = applicationContext.getEnvironment();
        
        // Load environment variables from .env file
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        // Convert dotenv entries to a map
        Map<String, Object> envMap = new HashMap<>();
        dotenv.entries().forEach(entry ->
                envMap.put(entry.getKey(), entry.getValue())
        );

        // Add the map as a property source with high priority
        environment.getPropertySources().addFirst(
                new MapPropertySource("dotenv", envMap)
        );
    }
}



