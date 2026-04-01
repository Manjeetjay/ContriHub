package com.contrihub.backend.user.service;


import org.springframework.stereotype.Service;

import com.contrihub.backend.auth.exception.UserNotFoundException;
import com.contrihub.backend.auth.model.User;
import com.contrihub.backend.auth.repository.UserRepository;
import com.contrihub.backend.user.dto.ProfileResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public ProfileResponse getProfile(String identifier) {
        User user = userRepository
                .findByEmailOrUsernameOrGithubId(identifier, identifier, identifier)
                .orElseThrow(() -> new UserNotFoundException("User profile not found"));

        return ProfileResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .username(user.getUsername())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .authType(user.getAuthType() != null ? user.getAuthType().name() : null)
                .githubId(user.getGithubId())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
