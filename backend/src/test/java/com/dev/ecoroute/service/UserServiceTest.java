package com.dev.ecoroute.service;

import com.dev.ecoroute.model.AppUser;
import com.dev.ecoroute.repository.AppUserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    private AppUserRepository repository;

    @InjectMocks
    private AppUserService service;

    @Test
    void shouldFindUserByUsername() {

        AppUser user = new AppUser();
        user.setUsername("eco_user");

        when(repository.findByUsername("eco_user"))
                .thenReturn(Optional.of(user));

        Optional<AppUser> result = service.findByUsername("eco_user");

        assertTrue(result.isPresent());
        assertEquals("eco_user", result.get().getUsername());
    }
}