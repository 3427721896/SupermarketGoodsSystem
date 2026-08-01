package com.supermarket.service;

import com.supermarket.config.JwtUtil;
import com.supermarket.dto.LoginRequest;
import com.supermarket.dto.LoginResponse;
import com.supermarket.entity.User;
import com.supermarket.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

        if (userOpt.isEmpty()) {
            throw new RuntimeException("用户名或密码错误");
        }

        User user = userOpt.get();

        if (!"active".equals(user.getStatus())) {
            throw new RuntimeException("该账号已被禁用");
        }

        // Plain text password comparison (matching original localStorage behavior)
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }

        if (!user.getRole().equals(request.getRole())) {
            throw new RuntimeException("该用户不属于所选角色，请重新选择身份");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
        return new LoginResponse(token, user);
    }
}
