package com.contrihub.backend.auth.service;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.contrihub.backend.auth.dto.AuthResponse;
import com.contrihub.backend.auth.dto.LoginRequest;
import com.contrihub.backend.auth.dto.RegisterRequest;
import com.contrihub.backend.auth.exception.*;
import com.contrihub.backend.auth.model.Role;
import com.contrihub.backend.auth.model.User;
import com.contrihub.backend.auth.repository.UserRepository;
import com.contrihub.backend.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {

        if(userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("User with this email already exists");
        }

        User newUser = User.builder()
        .username(request.getUsername())
        .password(passwordEncoder.encode(request.getPassword()))
        .firstName(request.getFirstName())
        .lastName(request.getLastName())
        .role(Role.USER)
        .email(request.getEmail())
        .build();

        userRepository.save(newUser);
        return toRespone(newUser);
    }

    // This method changes user model to auth response dto
    private AuthResponse toRespone(User newUser) {
        return AuthResponse.builder()
        .email(newUser.getEmail())
        .token(jwtService.generateToken(newUser))
        .role(newUser.getRole().name())
        .build();
    }

    public AuthResponse login(LoginRequest request) {
        if(userRepository.findByEmail(request.getEmail()).isEmpty()) {
            throw new UserNotFoundException("User with this email does not exist");
        }

        User user = userRepository.findByEmail(request.getEmail()).get();
        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid password");
        }

        return toRespone(user);
    }

    
}
