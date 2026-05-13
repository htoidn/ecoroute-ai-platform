package com.dev.ecoroute.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

import javax.sql.DataSource;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner loadData(DataSource dataSource) {
        return args -> {
            try {
                ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
                // Load schema first if not already created
                populator.addScript(new ClassPathResource("db/schema.sql"));
                // Then load data
                populator.addScript(new ClassPathResource("db/data.sql"));
                populator.setContinueOnError(true);
                populator.setSeparator(";");
                populator.execute(dataSource);
                System.out.println("Database schema and data loaded successfully!");
            } catch (Exception e) {
                System.err.println("Error loading database: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
}

