package com.dev.ecoroute.service;

import com.dev.ecoroute.model.AppUser;
import com.dev.ecoroute.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppUserService {
    private final AppUserRepository repository;

    public List<AppUser> getAllUsers() {
        return repository.findAll();
    }

    public AppUser getUserById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Optional<AppUser> findByUsername(String username) {
        return repository.findByUsername(username);
    }

    public AppUser createUser(AppUser user) {
        return repository.save(user);
    }

    public AppUser updateUser(Long id, AppUser updatedUser) {
        AppUser user = getUserById(id);

        user.setEmail(updatedUser.getEmail());
        user.setUsername(updatedUser.getUsername());
        user.setPassword(updatedUser.getPassword());
        user.setRole(updatedUser.getRole());
        user.setActive(updatedUser.getActive());
        user.setPreferences(updatedUser.getPreferences());

        return repository.save(user);
    }

    public void deleteUser(Long id) {
        repository.deleteById(id);
    }
}
