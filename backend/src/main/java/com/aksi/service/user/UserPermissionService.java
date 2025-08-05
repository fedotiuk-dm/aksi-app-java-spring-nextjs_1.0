package com.aksi.service.user;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aksi.api.user.dto.UserRole;

import jakarta.annotation.PostConstruct;

/** Service for managing role-based permissions. */
@Service
public class UserPermissionService {

  private Map<UserRole, List<String>> rolePermissions;

  @PostConstruct
  public void init() {
    // This could be loaded from configuration or database
    rolePermissions =
        Map.of(
            UserRole.ADMIN,
                List.of("users.*", "orders.*", "customers.*", "branches.*", "reports.*"),
            UserRole.MANAGER, List.of("orders.*", "customers.*", "reports.view"),
            UserRole.OPERATOR,
                List.of(
                    "orders.create",
                    "orders.update",
                    "orders.view",
                    "customers.create",
                    "customers.update",
                    "customers.view"),
            UserRole.CLEANER, List.of("orders.view", "orders.updateStatus"),
            UserRole.DRIVER, List.of("orders.view", "orders.updateDelivery"),
            UserRole.ACCOUNTANT,
                List.of("orders.view", "customers.view", "reports.view", "billing.*"));
  }

  public List<String> getPermissionsForRoles(Set<UserRole> roles) {
    return roles.stream()
        .flatMap(role -> rolePermissions.getOrDefault(role, List.of()).stream())
        .distinct()
        .collect(Collectors.toList());
  }

  public List<String> getPermissionsForRole(UserRole role) {
    return rolePermissions.getOrDefault(role, List.of());
  }
}
