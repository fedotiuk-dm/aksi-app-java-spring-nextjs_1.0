package com.aksi.service.auth;

import java.util.UUID;

import com.aksi.api.auth.dto.LoginRequest;
import com.aksi.api.auth.dto.LoginResponse;
import com.aksi.api.auth.dto.SessionInfo;

import jakarta.servlet.http.HttpSession;

/** Service interface for authentication operations. */
public interface AuthService {

  /** Login user with credentials and return login response. */
  LoginResponse login(LoginRequest loginRequest, HttpSession session);

  /** Get session information for current session. */
  SessionInfo getSessionInfo(HttpSession session);

  /** Logout current user and invalidate session. */
  void logout(HttpSession session);

  /**
   * Invalidate all sessions for a specific user. Used for security purposes when needed to force
   * logout from all devices.
   */
  void invalidateAllUserSessions(UUID userId);
}
