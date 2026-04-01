package com.contrihub.backend.auth.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.contrihub.backend.auth.dto.AuthResponse;
import com.contrihub.backend.auth.model.AuthType;
import com.contrihub.backend.auth.model.Role;
import com.contrihub.backend.auth.model.User;
import com.contrihub.backend.auth.repository.UserRepository;
import com.contrihub.backend.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GitHubOAuthService {

    private static final String GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
    private static final String GITHUB_USER_URL = "https://api.github.com/user";
    private static final String GITHUB_EMAILS_URL = "https://api.github.com/user/emails";

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RestTemplate restTemplate;

    @Value("${spring.security.oauth2.client.registration.github.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.github.client-secret}")
    private String clientSecret;

    // ─── Public API ─────────────────────────────────────────────

    public AuthResponse authenticateWithGitHub(String code, String redirectUri) {
        String accessToken = exchangeCodeForToken(code, redirectUri);
        Map<String, Object> profile = fetchUserProfile(accessToken);

        String githubId = String.valueOf(profile.get("id"));
        String username = (String) profile.get("login");
        String avatarUrl = (String) profile.get("avatar_url");

        // Try public profile email first, fall back to /user/emails API
        String email = (String) profile.get("email");
        final String resolvedEmail = (email != null) ? email : fetchPrimaryEmail(accessToken);

        User user = findOrCreateUser(githubId, username, resolvedEmail, avatarUrl, accessToken);

        // Refresh token on every login (GitHub tokens can expire/rotate)
        user.setGithubAccessToken(accessToken);
        userRepository.save(user);

        return toResponse(user);
    }

    // ─── GitHub API Calls ───────────────────────────────────────

    private String exchangeCodeForToken(String code, String redirectUri) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        Map<String, String> body = new HashMap<>();
        body.put("client_id", clientId);
        body.put("client_secret", clientSecret);
        body.put("code", code);
        if (redirectUri != null && !redirectUri.isBlank()) {
            body.put("redirect_uri", redirectUri);
        }

        ResponseEntity<Map> response = restTemplate.postForEntity(
                GITHUB_TOKEN_URL, new HttpEntity<>(body, headers), Map.class);

        String accessToken = (String) response.getBody().get("access_token");
        if (accessToken == null) {
            throw new RuntimeException("Failed to exchange GitHub authorization code for access token");
        }
        return accessToken;
    }

    private Map<String, Object> fetchUserProfile(String accessToken) {
        HttpEntity<Void> request = new HttpEntity<>(bearerHeaders(accessToken));
        ResponseEntity<Map> response = restTemplate.exchange(
                GITHUB_USER_URL, HttpMethod.GET, request, Map.class);
        return response.getBody();
    }

    /**
     * Fetches the user's primary verified email from GitHub's /user/emails API.
     * Works even when the user's profile email is set to private.
     */
    private String fetchPrimaryEmail(String accessToken) {
        try {
            HttpEntity<Void> request = new HttpEntity<>(bearerHeaders(accessToken));
            ResponseEntity<List> response = restTemplate.exchange(
                    GITHUB_EMAILS_URL, HttpMethod.GET, request, List.class);

            List<Map<String, Object>> emails = response.getBody();
            if (emails == null) return null;

            // Prefer primary + verified
            for (Map<String, Object> entry : emails) {
                if (Boolean.TRUE.equals(entry.get("primary"))
                        && Boolean.TRUE.equals(entry.get("verified"))) {
                    return (String) entry.get("email");
                }
            }
            // Fallback: any verified email
            for (Map<String, Object> entry : emails) {
                if (Boolean.TRUE.equals(entry.get("verified"))) {
                    return (String) entry.get("email");
                }
            }
        } catch (Exception e) {
            // If email fetch fails, continue without email
        }
        return null;
    }

    // ─── User Management ────────────────────────────────────────

    private User findOrCreateUser(String githubId, String username, String email,
                                  String avatarUrl, String accessToken) {
        return userRepository.findByGithubId(githubId)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .githubId(githubId)
                            .username(username)
                            .email(email)
                            .avatarUrl(avatarUrl)
                            .role(Role.USER)
                            .authType(AuthType.OAUTH)
                            .githubAccessToken(accessToken)
                            .build();
                    return userRepository.save(newUser);
                });
    }

    // ─── Helpers ────────────────────────────────────────────────

    private HttpHeaders bearerHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        return headers;
    }

    private AuthResponse toResponse(User user) {
        return AuthResponse.builder()
                .email(user.getEmail())
                .token(jwtService.generateToken(user))
                .role(user.getRole().name())
                .build();
    }
}
