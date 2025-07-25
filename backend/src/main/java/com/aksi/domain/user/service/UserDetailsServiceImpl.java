package com.aksi.domain.user.service;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.auth.service.UserDetailsProvider;
import com.aksi.domain.user.entity.UserEntity;
import com.aksi.domain.user.entity.UserRole;
import com.aksi.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of UserDetailsProvider for authentication */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsProvider {

  private final UserRepository userRepository;

  @Override
  @Transactional(readOnly = true)
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    UserEntity user =
        userRepository
            .findByUsername(username)
            .or(() -> userRepository.findByEmail(username))
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

    if (!user.isActive()) {
      throw new UsernameNotFoundException("User is not active: " + username);
    }

    if (user.isLocked()) {
      throw new UsernameNotFoundException("User is locked until: " + user.getLockedUntil());
    }

    UserDetails userDetails =
        User.builder()
            .username(user.getUsername())
            .password(user.getPasswordHash())
            .authorities(mapRoleToAuthorities(user.getRole()))
            .accountExpired(false)
            .accountLocked(user.isLocked())
            .credentialsExpired(false)
            .disabled(!user.isActive())
            .build();

    log.debug("Loaded user: {} with role: {}", user.getUsername(), user.getRole());

    return userDetails;
  }

  @Override
  @Transactional(readOnly = true)
  public boolean existsByUsername(String username) {
    return userRepository.existsByUsername(username) || userRepository.existsByEmail(username);
  }

  /** Map user role to Spring Security authorities */
  private Collection<? extends GrantedAuthority> mapRoleToAuthorities(UserRole role) {
    String authority = "ROLE_" + role.name();
    return Collections.singletonList(new SimpleGrantedAuthority(authority));
  }
}
