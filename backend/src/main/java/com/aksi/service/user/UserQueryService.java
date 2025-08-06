package com.aksi.service.user;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.user.dto.UserBranchesResponse;
import com.aksi.api.user.dto.UserDetail;
import com.aksi.api.user.dto.UserListResponse;
import com.aksi.api.user.dto.UserRole;
import com.aksi.domain.user.UserEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.UserMapper;
import com.aksi.repository.UserRepository;
import com.aksi.repository.UserSpecification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for user-related read operations. All methods are read-only and optimized for
 * queries.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class UserQueryService implements UserDetailsService {

  private final UserRepository userRepository;
  private final UserMapper userMapper;
  private final UserPermissionService permissionService;

  /**
   * Find user by ID.
   *
   * @param id user ID
   * @return user if found
   */
  public Optional<UserEntity> findById(UUID id) {
    return userRepository.findById(id);
  }

  /**
   * Find user by username.
   *
   * @param username the username
   * @return user if found
   */
  public Optional<UserEntity> findByUsername(String username) {
    return userRepository.findByUsername(username);
  }

  /**
   * Find user by email.
   *
   * @param email the email
   * @return user if found
   */
  public Optional<UserEntity> findByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  /**
   * Get user details by ID.
   *
   * @param userId user ID
   * @return user details
   * @throws NotFoundException if user not found
   */
  public UserDetail getUserDetailById(UUID userId) {
    UserEntity userEntity =
        findById(userId)
            .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));
    return userMapper.toUserDetail(userEntity);
  }

  /**
   * List users with pagination and filtering.
   *
   * @param page page number (0-based)
   * @param size page size
   * @param sortBy sort field
   * @param sortOrder sort order (asc/desc)
   * @param search search term for username, first name, or last name
   * @param role filter by role
   * @param branchId filter by branch
   * @param active filter by active status
   * @return paginated user list
   */
  public UserListResponse listUsers(
      Integer page,
      Integer size,
      String sortBy,
      String sortOrder,
      String search,
      UserRole role,
      UUID branchId,
      Boolean active) {

    // OpenAPI schema defines defaults: page=0, size=20, sortBy=createdAt, sortOrder=asc
    Sort.Direction direction =
        "desc".equalsIgnoreCase(sortOrder) ? Sort.Direction.DESC : Sort.Direction.ASC;

    Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

    log.debug(
        "Searching users - search: {}, role: {}, branchId: {}, active: {}",
        search,
        role,
        branchId,
        active);

    Page<UserEntity> userPage =
        userRepository.findAll(
            UserSpecification.searchUsers(search, null, null, role, branchId, active, null),
            pageable);

    // Build paginated response using fluent API
    return new UserListResponse()
        .data(userMapper.toUserSummaryList(userPage.getContent()))
        .totalElements(userPage.getTotalElements())
        .totalPages(userPage.getTotalPages())
        .size(userPage.getSize())
        .number(userPage.getNumber())
        .numberOfElements(userPage.getNumberOfElements())
        .first(userPage.isFirst())
        .last(userPage.isLast())
        .empty(userPage.isEmpty());
  }

  /**
   * Get user branches.
   *
   * @param userId user ID
   * @return user branches response
   * @throws NotFoundException if user not found
   */
  public UserBranchesResponse getUserBranches(UUID userId) {
    UserEntity userEntity =
        userRepository
            .findByIdWithBranches(userId)
            .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

    UserBranchesResponse response = new UserBranchesResponse();
    response.setBranches(
        userEntity.getBranchAssignments().stream()
            .map(userMapper::toBranchAssignment)
            .collect(Collectors.toList()));

    return response;
  }

  /**
   * Check if username exists.
   *
   * @param username the username to check
   * @return true if exists
   */
  public boolean existsByUsername(String username) {
    return userRepository.existsByUsername(username);
  }

  /**
   * Check if email exists.
   *
   * @param email the email to check
   * @return true if exists
   */
  public boolean existsByEmail(String email) {
    return userRepository.existsByEmail(email);
  }

  /**
   * Check if email exists for another user.
   *
   * @param currentEmail current user email
   * @param newEmail new email to check
   * @return true if email exists for another user
   */
  public boolean existsByEmailExcludingCurrent(String currentEmail, String newEmail) {
    return !currentEmail.equals(newEmail) && existsByEmail(newEmail);
  }

  /**
   * Load user by username for Spring Security authentication.
   *
   * @param username the username
   * @return UserDetails for Spring Security
   * @throws UsernameNotFoundException if user not found
   */
  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    UserEntity userEntity =
        findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

    var authorities =
        userEntity.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
            .collect(Collectors.toList());

    return org.springframework.security.core.userdetails.User.builder()
        .username(userEntity.getUsername())
        .password(userEntity.getPasswordHash())
        .authorities(authorities)
        .accountExpired(false)
        .accountLocked(!userEntity.isActive())
        .credentialsExpired(false)
        .disabled(!userEntity.isActive())
        .build();
  }

  /**
   * Get permissions for a user based on their roles.
   *
   * @param userId user ID
   * @return list of permissions
   */
  public List<String> getUserPermissions(UUID userId) {
    UserEntity userEntity =
        findById(userId)
            .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

    return permissionService.getPermissionsForRoles(userEntity.getRoles());
  }
}
