package com.aksi.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Утилітарний клас для роботи з JWT
 */
@Component
public class JwtUtils {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private long jwtExpiration;
    
    @Value("${jwt.refresh.expiration:604800000}")
    private long refreshTokenExpiration;
    
    /**
     * Витягує ім'я користувача з JWT токена
     * @param token JWT токен
     * @return ім'я користувача
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    /**
     * Витягує довільне поле з JWT токена
     * @param token JWT токен
     * @param claimsResolver функція для витягу поля
     * @return значення поля
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    /**
     * Генерує JWT токен для користувача
     * @param userDetails дані користувача
     * @return JWT токен
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }
    
    /**
     * Генерує JWT токен з додатковими полями
     * @param extraClaims додаткові поля
     * @param userDetails дані користувача
     * @return JWT токен
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey())
                .compact();
    }
    
    /**
     * Перевіряє дійсність JWT токена
     * @param token JWT токен
     * @param userDetails дані користувача
     * @return true, якщо токен дійсний
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }
    
    /**
     * Перевіряє чи закінчився термін дії токена
     * @param token JWT токен
     * @return true, якщо термін дії закінчився
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    /**
     * Витягує дату закінчення терміну дії токена
     * @param token JWT токен
     * @return дата закінчення
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    /**
     * Витягує всі поля з JWT токена
     * @param token JWT токен
     * @return поля токена
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    
    /**
     * Отримує ключ для підпису JWT
     * @return ключ
     */
    private javax.crypto.SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    /**
     * Повертає час життя токена в секундах
     * @return час життя в секундах
     */
    public long getExpirationInSeconds() {
        return jwtExpiration / 1000;
    }
    
    /**
     * Генерує refresh token для користувача
     * @param userDetails дані користувача
     * @return JWT refresh token
     */
    public String generateRefreshToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(getSignInKey())
                .compact();
    }
    
    /**
     * Повертає час життя refresh токена в секундах
     * @return час життя в секундах
     */
    public long getRefreshExpirationInSeconds() {
        return refreshTokenExpiration / 1000;
    }
} 