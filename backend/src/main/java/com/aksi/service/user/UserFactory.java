package com.aksi.service.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.aksi.api.user.dto.CreateUserRequest;
import com.aksi.domain.user.User;
import com.aksi.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

/** Simple factory for creating User entities. All defaults come from OpenAPI specification. */
@Component
@RequiredArgsConstructor
public class UserFactory {

  private final UserMapper userMapper;
  private final PasswordEncoder passwordEncoder;

  /**
   * Create user from DTO request.
   *
   * @param request create user request from API
   * @return new User entity ready to save
   */
  public User createFromRequest(CreateUserRequest request) {
    // MapStruct does all the mapping including defaults from OpenAPI
    User user = userMapper.toUser(request);

    // Only handle password encoding - the one thing that can't be in DTO
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

    // These are always the same for new users - no need for config
    user.setFailedLoginAttempts(0);

    return user;
  }
}
