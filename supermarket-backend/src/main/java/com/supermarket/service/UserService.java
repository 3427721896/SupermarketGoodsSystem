package com.supermarket.service;

import com.supermarket.entity.User;
import com.supermarket.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User save(User user) {
        if (user.getId() != null && !user.getId().isEmpty()) {
            User existing = userRepository.findById(user.getId()).orElse(null);
            if (existing != null) {
                existing.setUsername(user.getUsername());
                existing.setName(user.getName());
                existing.setRole(user.getRole());
                existing.setPhone(user.getPhone());
                existing.setStatus(user.getStatus());
                if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                    existing.setPassword(user.getPassword());
                }
                return userRepository.save(existing);
            }
        }

        user.setId(UUID.randomUUID().toString().substring(0, 8));
        user.setCreatedAt(LocalDate.now().toString());
        if (user.getStatus() == null) user.setStatus("active");
        return userRepository.save(user);
    }

    public void delete(String id) {
        userRepository.deleteById(id);
    }
}
