package com.aksi.service.user;

import java.util.Set;

import org.springframework.stereotype.Component;

import com.aksi.api.user.dto.UserRole;
import com.aksi.domain.user.User;

import lombok.RequiredArgsConstructor;

/** Manages user role operations. */
@Component
@RequiredArgsConstructor
public class UserRoleManager {

  public void addRole(User user, UserRole role) {
    user.getRoles().add(role);
  }

  public void removeRole(User user, UserRole role) {
    user.getRoles().remove(role);
  }

  public boolean hasRole(User user, UserRole role) {
    return user.getRoles().contains(role);
  }

  public boolean hasAnyRole(User user, Set<UserRole> checkRoles) {
    return checkRoles.stream().anyMatch(role -> hasRole(user, role));
  }

  public void setRoles(User user, Set<UserRole> roles) {
    user.getRoles().clear();
    user.getRoles().addAll(roles);
  }
}
