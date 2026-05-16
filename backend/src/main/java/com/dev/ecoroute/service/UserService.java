package com.dev.ecoroute.service;

import com.dev.ecoroute.model.User;
import com.dev.ecoroute.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;

    public List<User> getAllUsers() {
        return repository.findAll();
    }

    public User getUserById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    public Optional<User> findByUsername(String username) {
        return repository.findByUsername(username);
    }

    public User createUser(User user) {
        return repository.save(user);
    }

    public User updateUser(Long id, User updatedUser) {

        User user = getUserById(id);

        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());

        return repository.save(user);
    }

    public void deleteUser(Long id) {
        repository.deleteById(id);
    }
}
