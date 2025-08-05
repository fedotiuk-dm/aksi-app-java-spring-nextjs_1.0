package com.aksi.service.user;

import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.user.dto.UserBranchesResponse;
import com.aksi.api.user.dto.UserDetail;
import com.aksi.api.user.dto.UserListResponse;
import com.aksi.api.user.dto.UserRole;
import com.aksi.domain.user.User;
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
public class UserQueryService {

  private final UserRepository userRepository;
  private final UserMapper userMapper;

  /**
   * Find user by ID.
   *
   * @param id user ID
   * @return user if found
   */
  public Optional<User> findById(UUID id) {
    return userRepository.findById(id);
  }

  /**
   * Find user by username.
   *
   * @param username the username
   * @return user if found
   */
  public Optional<User> findByUsername(String username) {
    return userRepository.findByUsername(username);
  }

  /**
   * Find user by email.
   *
   * @param email the email
   * @return user if found
   */
  public Optional<User> findByEmail(String email) {
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
    User user =
        findById(userId)
            .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));
    return userMapper.toUserDetail(user);
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

    // Set defaults
    int pageNumber = page != null ? page : 0;
    int pageSize = size != null ? size : 20;
    String sortField = sortBy != null ? sortBy : "createdAt";
    Sort.Direction direction =
        "desc".equalsIgnoreCase(sortOrder) ? Sort.Direction.DESC : Sort.Direction.ASC;

    Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(direction, sortField));

    log.debug(
        "Searching users - search: {}, role: {}, branchId: {}, active: {}",
        search,
        role,
        branchId,
        active);

    Page<User> userPage =
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
    User user =
        findById(userId)
            .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

    UserBranchesResponse response = new UserBranchesResponse();
    response.setBranches(
        user.getBranchAssignments().stream()
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
   * Count users by role.
   *
   * @param role the role to count
   * @return number of users with the role
   */
  public long countByRole(UserRole role) {
    return userRepository.countByRolesContaining(role);
  }

  /**
   * Count active users.
   *
   * @return number of active users
   */
  public long countActiveUsers() {
    return userRepository.countByActiveTrue();
  }
}
