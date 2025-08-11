# Cookie-Based Authentication

## Why Cookie Instead of JWT in Header?

### Advantages of Cookie-based auth:
1. **Security**:
   - HttpOnly cookies are not accessible via JavaScript (XSS protection)
   - Secure flag - transmission only over HTTPS
   - SameSite - CSRF attack protection

2. **Simplicity**:
   - Browser automatically sends cookies
   - No need to store tokens in localStorage
   - Automatic deletion when browser is closed (session cookies)

3. **Session Management**:
   - Ability to invalidate sessions on server
   - Centralized management of active sessions
   - Easier to implement "logout from all devices"

## Architecture

### Auth Flow
```
1. Login: POST /api/v1/auth/login
   -> Credential verification
   -> Session creation in Redis/DB
   -> Set-Cookie: SESSION=<sessionId>; HttpOnly; Secure; SameSite=Strict

2. Authenticated Request: GET /api/v1/orders
   -> Cookie: SESSION=<sessionId>
   -> Session verification in Redis/DB
   -> Request execution

3. Logout: POST /api/v1/auth/logout
   -> Session deletion from Redis/DB
   -> Set-Cookie: SESSION=; Max-Age=0
```

## Implementation

### 1. Security Configuration
```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final SessionAuthenticationFilter sessionAuthFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .ignoringRequestMatchers("/api/v1/auth/login")
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/login", "/api/v1/auth/refresh").permitAll()
                .requestMatchers("/api/v1/**").authenticated()
                .anyRequest().permitAll()
            )
            .addFilterBefore(sessionAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            )
            .build();
    }
}
```

### 2. Session Model
```java
@Data
@Builder
@RedisHash(value = "sessions", timeToLive = 86400) // 24 hours
public class Session {
    @Id
    private String id;
    
    private String userId;
    private String username;
    private String branchId;
    private Set<String> roles;
    private Set<String> permissions;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    private LocalDateTime lastAccessedAt;
    private String ipAddress;
    private String userAgent;
}
```

### 3. Session Service
```java
@Service
@RequiredArgsConstructor
public class SessionService {
    
    private final SessionRepository sessionRepository;
    private final SecureRandom secureRandom = new SecureRandom();
    
    public Session createSession(User user, String ipAddress, String userAgent) {
        String sessionId = generateSecureSessionId();
        
        Session session = Session.builder()
            .id(sessionId)
            .userId(user.getId())
            .username(user.getUsername())
            .branchId(user.getCurrentBranchId())
            .roles(user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet()))
            .permissions(user.getEffectivePermissions())
            .ipAddress(ipAddress)
            .userAgent(userAgent)
            .lastAccessedAt(LocalDateTime.now())
            .build();
        
        return sessionRepository.save(session);
    }
    
    public Optional<Session> findSession(String sessionId) {
        return sessionRepository.findById(sessionId)
            .map(session -> {
                // Update last accessed time
                session.setLastAccessedAt(LocalDateTime.now());
                return sessionRepository.save(session);
            });
    }
    
    public void invalidateSession(String sessionId) {
        sessionRepository.deleteById(sessionId);
    }
    
    public void invalidateAllUserSessions(String userId) {
        sessionRepository.deleteAllByUserId(userId);
    }
    
    private String generateSecureSessionId() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
```

### 4. Session Authentication Filter
```java
@Component
@RequiredArgsConstructor
public class SessionAuthenticationFilter extends OncePerRequestFilter {
    
    private static final String SESSION_COOKIE_NAME = "SESSION";
    private final SessionService sessionService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String sessionId = extractSessionId(request);
        
        if (sessionId != null) {
            sessionService.findSession(sessionId)
                .ifPresent(session -> {
                    SecurityUser principal = SecurityUser.builder()
                        .userId(session.getUserId())
                        .username(session.getUsername())
                        .branchId(session.getBranchId())
                        .roles(session.getRoles())
                        .permissions(session.getPermissions())
                        .build();
                    
                    Authentication auth = new PreAuthenticatedAuthenticationToken(
                        principal, null, principal.getAuthorities()
                    );
                    
                    SecurityContextHolder.getContext().setAuthentication(auth);
                });
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String extractSessionId(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            return Arrays.stream(cookies)
                .filter(cookie -> SESSION_COOKIE_NAME.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
        }
        return null;
    }
}
```

### 5. Auth Controller
```java
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    private final SessionService sessionService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request,
                                             HttpServletRequest httpRequest,
                                             HttpServletResponse httpResponse) {
        
        User user = authService.authenticate(request.getUsername(), request.getPassword());
        
        Session session = sessionService.createSession(
            user,
            httpRequest.getRemoteAddr(),
            httpRequest.getHeader("User-Agent")
        );
        
        Cookie sessionCookie = createSessionCookie(session.getId());
        httpResponse.addCookie(sessionCookie);
        
        // Also set CSRF token
        CsrfToken csrfToken = (CsrfToken) httpRequest.getAttribute(CsrfToken.class.getName());
        if (csrfToken != null) {
            Cookie csrfCookie = new Cookie("XSRF-TOKEN", csrfToken.getToken());
            csrfCookie.setPath("/");
            csrfCookie.setHttpOnly(false); // Must be readable by JS
            httpResponse.addCookie(csrfCookie);
        }
        
        return ResponseEntity.ok(LoginResponse.builder()
            .userId(user.getId())
            .username(user.getUsername())
            .roles(user.getRoles())
            .branchId(user.getCurrentBranchId())
            .build());
    }
    
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> logout(HttpServletRequest request,
                                     HttpServletResponse response) {
        
        String sessionId = extractSessionId(request);
        if (sessionId != null) {
            sessionService.invalidateSession(sessionId);
        }
        
        Cookie sessionCookie = createSessionCookie("");
        sessionCookie.setMaxAge(0);
        response.addCookie(sessionCookie);
        
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/refresh")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> refresh() {
        // Session was already refreshed in filter
        return ResponseEntity.ok().build();
    }
    
    private Cookie createSessionCookie(String value) {
        Cookie cookie = new Cookie("SESSION", value);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // Only HTTPS in production
        cookie.setSameSite("Strict");
        cookie.setMaxAge(-1); // Session cookie
        return cookie;
    }
}
```

### 6. CSRF Protection
```java
@Component
public class CsrfHeaderFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {
        
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (csrfToken != null) {
            response.setHeader("X-CSRF-TOKEN", csrfToken.getToken());
        }
        
        filterChain.doFilter(request, response);
    }
}
```

### 7. Frontend Integration
```javascript
// axios configuration
axios.defaults.withCredentials = true; // Include cookies

// CSRF token handling
axios.interceptors.request.use(config => {
    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
    }
    return config;
});

// Login
async function login(username, password) {
    const response = await axios.post('/api/v1/auth/login', {
        username,
        password
    });
    // Session cookie is automatically set by browser
    return response.data;
}

// Authenticated request
async function getOrders() {
    // Cookie is automatically included
    const response = await axios.get('/api/v1/orders');
    return response.data;
}
```

## Session Management Features

### 1. Active Sessions View
```java
@GetMapping("/api/v1/users/me/sessions")
@PreAuthorize("isAuthenticated()")
public List<SessionInfo> getActiveSessions(Authentication auth) {
    SecurityUser user = (SecurityUser) auth.getPrincipal();
    return sessionService.findAllUserSessions(user.getUserId())
        .stream()
        .map(this::toSessionInfo)
        .collect(Collectors.toList());
}
```

### 2. Revoke Specific Session
```java
@DeleteMapping("/api/v1/users/me/sessions/{sessionId}")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<Void> revokeSession(@PathVariable String sessionId,
                                        Authentication auth) {
    SecurityUser user = (SecurityUser) auth.getPrincipal();
    sessionService.revokeUserSession(user.getUserId(), sessionId);
    return ResponseEntity.ok().build();
}
```

### 3. Remember Me
```java
private Cookie createSessionCookie(String value, boolean rememberMe) {
    Cookie cookie = new Cookie("SESSION", value);
    cookie.setPath("/");
    cookie.setHttpOnly(true);
    cookie.setSecure(true);
    cookie.setSameSite("Strict");
    
    if (rememberMe) {
        cookie.setMaxAge(30 * 24 * 60 * 60); // 30 days
    } else {
        cookie.setMaxAge(-1); // Session cookie
    }
    
    return cookie;
}
```

## Security Considerations

### 1. Cookie Settings
```yaml
server:
  servlet:
    session:
      cookie:
        http-only: true
        secure: true # Only in production
        same-site: strict
```

### 2. Session Configuration
```java
@Configuration
public class SessionConfig {
    
    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(
            new RedisStandaloneConfiguration("localhost", 6379)
        );
    }
    
    @Bean
    public RedisTemplate<String, Session> redisTemplate() {
        RedisTemplate<String, Session> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory());
        template.setDefaultSerializer(new GenericJackson2JsonRedisSerializer());
        return template;
    }
}
```

### 3. Rate Limiting
```java
@Component
public class LoginRateLimiter {
    
    private final LoadingCache<String, Integer> attemptsCache;
    
    public LoginRateLimiter() {
        this.attemptsCache = CacheBuilder.newBuilder()
            .expireAfterWrite(15, TimeUnit.MINUTES)
            .build(new CacheLoader<String, Integer>() {
                @Override
                public Integer load(String key) {
                    return 0;
                }
            });
    }
    
    public void loginFailed(String username) {
        int attempts = attemptsCache.getUnchecked(username);
        attemptsCache.put(username, attempts + 1);
    }
    
    public boolean isBlocked(String username) {
        return attemptsCache.getUnchecked(username) >= 5;
    }
}
```

## Testing

### 1. Integration Test
```java
@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void testLogin() throws Exception {
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "username": "operator1",
                        "password": "password123"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(cookie().exists("SESSION"))
            .andExpect(cookie().httpOnly("SESSION", true))
            .andExpect(cookie().secure("SESSION", true));
    }
    
    @Test
    void testAuthenticatedRequest() throws Exception {
        Cookie sessionCookie = new Cookie("SESSION", "valid-session-id");
        
        mockMvc.perform(get("/api/v1/orders")
                .cookie(sessionCookie))
            .andExpect(status().isOk());
    }
}
```

## Advantages Over JWT

1. **Revocation Capability**: Sessions can be deleted from Redis
2. **Size**: Session ID is shorter than JWT
3. **Security**: HttpOnly cookies are protected from XSS
4. **Stateful**: Can store additional data in session
5. **Simplicity**: No need to manage tokens on client

This approach provides secure and reliable authentication for your dry cleaning management system.