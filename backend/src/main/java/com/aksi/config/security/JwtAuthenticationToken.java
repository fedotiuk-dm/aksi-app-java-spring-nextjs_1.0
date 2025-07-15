package com.aksi.config.security;

import java.util.Collection;
import java.util.UUID;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

/**
 * JWT Authentication Token for Spring Security. Holds user information extracted from JWT token.
 */
public class JwtAuthenticationToken extends AbstractAuthenticationToken {

  private static final long serialVersionUID = 1L;

  private final UUID userId;
  private final String username;
  private final String token;

  /**
   * Constructor for authenticated token.
   *
   * @param userId User ID from JWT
   * @param username Username from JWT
   * @param authorities User authorities/roles
   * @param token Original JWT token
   */
  public JwtAuthenticationToken(
      UUID userId,
      String username,
      Collection<? extends GrantedAuthority> authorities,
      String token) {
    super(authorities);
    this.userId = userId;
    this.username = username;
    this.token = token;
    setAuthenticated(true);
  }

  /**
   * Constructor for unauthenticated token.
   *
   * @param token JWT token to be validated
   */
  public JwtAuthenticationToken(String token) {
    super(null);
    this.userId = null;
    this.username = null;
    this.token = token;
    setAuthenticated(false);
  }

  @Override
  public Object getCredentials() {
    return token;
  }

  @Override
  public Object getPrincipal() {
    return userId;
  }

  public UUID getUserId() {
    return userId;
  }

  public String getUsername() {
    return username;
  }

  public String getToken() {
    return token;
  }

  @Override
  public String getName() {
    return username != null ? username : "";
  }
}
