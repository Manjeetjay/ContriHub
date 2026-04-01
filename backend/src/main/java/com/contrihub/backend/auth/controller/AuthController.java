package com.contrihub.backend.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.contrihub.backend.auth.dto.AuthResponse;
import com.contrihub.backend.auth.dto.GithubOAuthRequest;
import com.contrihub.backend.auth.dto.LoginRequest;
import com.contrihub.backend.auth.dto.RegisterRequest;
import com.contrihub.backend.auth.service.AuthService;
import com.contrihub.backend.auth.service.GitHubOAuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final GitHubOAuthService gitHubOAuthService;
    

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/github")
    public ResponseEntity<AuthResponse> githubLogin(@RequestBody GithubOAuthRequest request) {
        AuthResponse response = gitHubOAuthService.authenticateWithGitHub(request.getCode(), request.getRedirectUri());
        return ResponseEntity.ok(response);
    }

}
