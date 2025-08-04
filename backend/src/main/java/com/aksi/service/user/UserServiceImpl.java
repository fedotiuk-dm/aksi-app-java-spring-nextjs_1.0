package com.aksi.service.user;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.user.dto.ChangePasswordRequest;
import com.aksi.api.user.dto.CreateUserRequest;
import com.aksi.api.user.dto.UpdateBranchesRequest;
import com.aksi.api.user.dto.UpdateRolesRequest;
import com.aksi.api.user.dto.UpdateUserRequest;
import com.aksi.api.user.dto.UserBranchesResponse;
import com.aksi.api.user.dto.UserDetail;
import com.aksi.api.user.dto.UserListResponse;
import com.aksi.api.user.dto.UserRole;
import com.aksi.domain.user.User;
import com.aksi.mapper.UserMapper;
import com.aksi.repository.user.UserRepository;
import com.aksi.repository.user.UserSpecification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of UserService. */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final UserMapper userMapper;

  @Override
  @Transactional(readOnly = true)
  public Optional<User> findById(UUID id) {
    return userRepository.findById(id);
  }

  @Override
  @Transactional(readOnly = true)
  public Optional<User> findByUsername(String username) {
    return userRepository.findByUsername(username);
  }

  @Override
  @Transactional(readOnly = true)
  public Optional<User> findByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<User> findAll(Pageable pageable) {
    return userRepository.findAll(pageable);
  }

  @Override
  public User createUser(
      String username,
      String email,
      String password,
      String firstName,
      String lastName,
      String phone) {
    log.info("Creating new user with username: {}", username);

    // Repository handles validation
    userRepository.validateUsernameUnique(username);
    userRepository.validateEmailUnique(email);

    // Use Entity factory method
    User user =
        User.createNewUser(
            username, email, passwordEncoder.encode(password), firstName, lastName, phone);

    return userRepository.save(user);
  }

  @Override
  public void changePassword(UUID userId, String currentPassword, String newPassword) {
    log.info("Changing password for user: {}", userId);

    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

    // If currentPassword is provided, verify it (self password change)
    // If null, assume admin is changing password (skip verification)
    if (currentPassword != null
        && !passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
      throw new IllegalArgumentException("Current password is incorrect");
    }

    user.setPasswordHash(passwordEncoder.encode(newPassword));
    userRepository.save(user);
  }

  @Override
  public User updateUserRoles(UUID userId, Set<UserRole> roles) {
    log.info("Updating roles for user: {}", userId);

    User user =
        userRepository
            .findByIdWithRoles(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

    // Entity handles role management
    user.setRoles(roles);

    return userRepository.save(user);
  }

  @Override
  public User activateUser(UUID userId) {
    log.info("Activating user: {}", userId);

    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

    // Entity handles activation logic
    user.activate();

    return userRepository.save(user);
  }

  @Override
  public User deactivateUser(UUID userId) {
    log.info("Deactivating user: {}", userId);

    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

    // Entity handles deactivation logic
    user.deactivate();

    return userRepository.save(user);
  }

  @Override
  public boolean verifyPassword(User user, String password) {
    return passwordEncoder.matches(password, user.getPasswordHash());
  }

  @Override
  public void recordFailedLogin(User user) {
    // Entity handles failed login logic
    user.recordFailedLogin();
    if (user.getFailedLoginAttempts() >= 5) {
      log.warn("User {} locked due to too many failed login attempts", user.getUsername());
    }
    userRepository.save(user);
  }

  @Override
  public void resetFailedLogins(User user) {
    // Entity handles reset logic
    user.resetFailedLogins();
    userRepository.save(user);
  }

  // API DTO methods implementation
  @Override
  @Transactional(readOnly = true)
  public UserDetail getUserDetailById(UUID userId) {
    User user =
        findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
    return userMapper.toUserDetail(user);
  }

  @Override
  public UserDetail createUserAndReturnDetail(CreateUserRequest request) {
    log.info("Creating new user with username: {}", request.getUsername());

    // Repository handles validation
    userRepository.validateUsernameUnique(request.getUsername());
    userRepository.validateEmailUnique(request.getEmail());

    // Use mapper to convert DTO to entity
    User user = userMapper.toUser(request);

    // Set encoded password (mapper ignores this sensitive field)
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

    // Save user (roles are already set by mapper)
    user = userRepository.save(user);

    return userMapper.toUserDetail(user);
  }

  @Override
  public UserDetail updateUserAndReturnDetail(UUID userId, UpdateUserRequest request) {
    log.info("Updating user with id: {}", userId);

    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

    // Repository handles email validation
    if (request.getEmail() != null) {
      userRepository.validateEmailUniqueForUpdate(user.getEmail(), request.getEmail());
    }

    // Use mapper to update user from DTO
    userMapper.updateUserFromDto(request, user);

    user = userRepository.save(user);
    return userMapper.toUserDetail(user);
  }

  @Override
  public UserDetail activateUserAndReturnDetail(UUID userId) {
    User user = activateUser(userId);
    return userMapper.toUserDetail(user);
  }

  @Override
  public UserDetail deactivateUserAndReturnDetail(UUID userId) {
    User user = deactivateUser(userId);
    return userMapper.toUserDetail(user);
  }

  @Override
  public UserDetail updateUserRolesAndReturnDetail(UUID userId, UpdateRolesRequest request) {
    User user = updateUserRoles(userId, Set.copyOf(request.getRoles()));
    return userMapper.toUserDetail(user);
  }

  @Override
  public void changePassword(UUID userId, ChangePasswordRequest request) {
    changePassword(userId, request.getCurrentPassword(), request.getNewPassword());
  }

  @Override
  @Transactional(readOnly = true)
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

    return userMapper.toUserListResponse(userPage);
  }

  @Override
  @Transactional(readOnly = true)
  public UserBranchesResponse getUserBranches(UUID userId) {
    User user =
        findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

    UserBranchesResponse response = new UserBranchesResponse();
    response.setBranches(userMapper.mapBranchAssignments(user.getBranchAssignments()));

    return response;
  }

  @Override
  public UserBranchesResponse updateUserBranches(UUID userId, UpdateBranchesRequest request) {
    // TODO: Implement branch assignment update
    // This requires Branch entity and UserBranchAssignment management

    log.warn("Branch assignment update not yet implemented for user ID: {}", userId);

    return new UserBranchesResponse();
  }
}
