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
import com.aksi.domain.user.util.UserSecurityUtils;
import com.aksi.shared.validation.ValidationConstants;

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
            .orElseThrow(
                () ->
                    new UsernameNotFoundException(
                        String.format(ValidationConstants.Messages.USER_NOT_FOUND, username)));

    // Check if user can login
    if (!UserSecurityUtils.canLogin(user)) {
      if (!user.isActive()) {
        throw new UsernameNotFoundException(
            String.format(ValidationConstants.Messages.USER_NOT_ACTIVE, username));
      } else {
        throw new UsernameNotFoundException(
            String.format(ValidationConstants.Messages.USER_LOCKED, user.getLockedUntil()));
      }
    }

    UserDetails userDetails =
        User.builder()
            .username(user.getUsername())
            .password(user.getPasswordHash())
            .authorities(mapRoleToAuthorities(user.getRole()))
            .accountExpired(false)
            .accountLocked(UserSecurityUtils.isAccountLocked(user))
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
    String authority = ValidationConstants.Messages.ROLE_PREFIX + role.name();
    return Collections.singletonList(new SimpleGrantedAuthority(authority));
  }
}
