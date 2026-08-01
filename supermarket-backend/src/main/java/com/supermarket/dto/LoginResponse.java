package com.supermarket.dto;

import com.supermarket.entity.User;

public class LoginResponse {
    private String token;
    private UserResponse user;

    public LoginResponse(String token, User user) {
        this.token = token;
        this.user = new UserResponse(user);
    }

    public String getToken() { return token; }
    public UserResponse getUser() { return user; }

    public static class UserResponse {
        private String id;
        private String username;
        private String name;
        private String role;
        private String phone;
        private String status;

        public UserResponse(User user) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.name = user.getName();
            this.role = user.getRole();
            this.phone = user.getPhone();
            this.status = user.getStatus();
        }

        public String getId() { return id; }
        public String getUsername() { return username; }
        public String getName() { return name; }
        public String getRole() { return role; }
        public String getPhone() { return phone; }
        public String getStatus() { return status; }
    }
}
