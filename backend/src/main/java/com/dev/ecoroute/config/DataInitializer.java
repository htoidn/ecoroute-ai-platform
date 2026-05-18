package com.dev.ecoroute.config;

import com.dev.ecoroute.model.AppUser;
import com.dev.ecoroute.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
// Only run this initializer when the 'local' profile is active (local development)
@Profile("local")
public class DataInitializer {

    @Bean
    public CommandLineRunner initDefaultUser(AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Create a default admin user if none exists — useful for local development
            String adminEmail = "admin@ecoroute.local";
            String adminUsername = "admin";
            if (userRepository.findByUsername(adminUsername).isEmpty() && userRepository.findByEmail(adminEmail).isEmpty()) {
                AppUser admin = new AppUser();
                admin.setEmail(adminEmail);
                admin.setUsername(adminUsername);
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                admin.setActive(true);
                admin.setCreatedAt(LocalDateTime.now());
                admin.setPreferences("{}");
                userRepository.save(admin);
                System.out.println("[DataInitializer] Created default admin user: 'admin' / password 'admin123'");
            }
        };
    }
}

