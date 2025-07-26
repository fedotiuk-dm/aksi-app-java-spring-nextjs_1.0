package com.aksi.domain.auth.service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.aksi.domain.auth.config.JwtProperties;
import com.aksi.shared.validation.ValidationConstants;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Service for JWT token operations */
@Slf4j
@Service
@RequiredArgsConstructor
public class JwtTokenService {

  private final JwtProperties jwtProperties;

  /** Generate access token for user */
  public String generateAccessToken(UserDetails userDetails) {
    return generateToken(userDetails, jwtProperties.getAccessTokenExpirationSeconds());
  }

  /** Generate refresh token */
  public String generateRefreshToken() {
    Map<String, Object> claims = new HashMap<>();
    claims.put(ValidationConstants.Jwt.CLAIM_TYPE, ValidationConstants.Jwt.TOKEN_TYPE_REFRESH);
    return createToken(
        claims,
        ValidationConstants.Jwt.TOKEN_TYPE_REFRESH,
        jwtProperties.getRefreshTokenExpirationSeconds());
  }

  /** Extract username from token */
  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  /** Extract single claim from token */
  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  /** Validate token */
  public boolean isTokenValid(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
  }

  /** Check if token is expired */
  public boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  /** Generate token with user details */
  private String generateToken(UserDetails userDetails, long expirationSeconds) {
    Map<String, Object> claims = new HashMap<>();
    claims.put(ValidationConstants.Jwt.CLAIM_AUTHORITIES, userDetails.getAuthorities());
    return createToken(claims, userDetails.getUsername(), expirationSeconds);
  }

  /** Create JWT token */
  private String createToken(Map<String, Object> claims, String subject, long expirationSeconds) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + (expirationSeconds * 1000));

    return Jwts.builder()
        .claims(claims)
        .subject(subject)
        .issuedAt(now)
        .expiration(expiryDate)
        .issuer(jwtProperties.getIssuer())
        .signWith(getSigningKey())
        .compact();
  }

  /** Extract token expiration date */
  private Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  /** Extract all claims from token */
  private Claims extractAllClaims(String token) {
    try {
      return Jwts.parser()
          .verifyWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtProperties.getSecret())))
          .build()
          .parseSignedClaims(token)
          .getPayload();
    } catch (JwtException e) {
      log.error(ValidationConstants.Jwt.JWT_PARSING_ERROR, e.getMessage());
      throw new IllegalArgumentException(ValidationConstants.Messages.INVALID_JWT_TOKEN, e);
    }
  }

  /** Get signing key from secret */
  private Key getSigningKey() {
    byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret());
    return Keys.hmacShaKeyFor(keyBytes);
  }
}
