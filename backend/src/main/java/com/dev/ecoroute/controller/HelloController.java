package com.dev.ecoroute.controller;

import com.dev.ecoroute.dto.ApiResponse;
import com.dev.ecoroute.dto.HelloResponse;
import com.dev.ecoroute.service.HelloService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/hello")
public class HelloController {

    private final HelloService helloService;

    public HelloController(HelloService helloService) {
        this.helloService = helloService;
    }

    @GetMapping
    public ApiResponse<HelloResponse> getHello() {
        HelloResponse response = new HelloResponse(helloService.getMessage());

        return new ApiResponse<>(
                true,
                "Request successful",
                response,
                null
        );
    }
}
