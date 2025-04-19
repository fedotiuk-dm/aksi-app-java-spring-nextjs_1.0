docker logs backend

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

 :: Spring Boot ::                (v3.4.4)

2025-04-18 22:31:34 INFO  c.a.AksiApplication - Starting AksiApplication v1.0.0 using Java 21.0.6 with PID 1 (/app/app.jar started by spring in /app)
2025-04-18 22:31:34 INFO  c.a.AksiApplication - The following 1 profile is active: "prod"
2025-04-18 22:31:35 TRACE o.s.c.c.MultipleOpenApiSupportCondition - Condition MultipleOpenApiSupportCondition on org.springdoc.core.configuration.SpringDocConfiguration$SpringDocActuatorConfiguration#springdocBeanFactoryPostProcessor3 matched due to AnyNestedCondition 1 matched 1 did not; NestedCondition on MultipleOpenApiSupportCondition.OnActuatorDifferentPort found non-matching nested conditions Management Port actual port type (SAME) did not match required type (DIFFERENT); NestedCondition on MultipleOpenApiSupportCondition.OnMultipleOpenApiSupportCondition AnyNestedCondition 1 matched 2 did not; NestedCondition on MultipleOpenApiGroupsCondition.OnListGroupedOpenApiBean @ConditionalOnBean (types: org.springdoc.core.models.GroupedOpenApi; SearchStrategy: all) did not find any beans of type org.springdoc.core.models.GroupedOpenApi; NestedCondition on MultipleOpenApiGroupsCondition.OnGroupConfigProperty @ConditionalOnProperty (springdoc.group-configs[0].group) matched; NestedCondition on MultipleOpenApiGroupsCondition.OnGroupedOpenApiBean @ConditionalOnBean (types: org.springdoc.core.models.GroupedOpenApi; SearchStrategy: all) did not find any beans of type org.springdoc.core.models.GroupedOpenApi
2025-04-18 22:31:35 TRACE o.s.c.c.CacheOrGroupedOpenApiCondition - Condition CacheOrGroupedOpenApiCondition on org.springdoc.core.configuration.SpringDocConfiguration#springdocBeanFactoryPostProcessor matched due to AnyNestedCondition 1 matched 1 did not; NestedCondition on CacheOrGroupedOpenApiCondition.OnCacheDisabled found non-matching nested conditions @ConditionalOnProperty (springdoc.cache.disabled) did not find property 'springdoc.cache.disabled'; NestedCondition on CacheOrGroupedOpenApiCondition.OnMultipleOpenApiSupportCondition AnyNestedCondition 1 matched 1 did not; NestedCondition on MultipleOpenApiSupportCondition.OnActuatorDifferentPort found non-matching nested conditions Management Port actual port type (SAME) did not match required type (DIFFERENT); NestedCondition on MultipleOpenApiSupportCondition.OnMultipleOpenApiSupportCondition AnyNestedCondition 1 matched 2 did not; NestedCondition on MultipleOpenApiGroupsCondition.OnListGroupedOpenApiBean @ConditionalOnBean (types: org.springdoc.core.models.GroupedOpenApi; SearchStrategy: all) did not find any beans of type org.springdoc.core.models.GroupedOpenApi; NestedCondition on MultipleOpenApiGroupsCondition.OnGroupConfigProperty @ConditionalOnProperty (springdoc.group-configs[0].group) matched; NestedCondition on MultipleOpenApiGroupsCondition.OnGroupedOpenApiBean @ConditionalOnBean (types: org.springdoc.core.models.GroupedOpenApi; SearchStrategy: all) did not find any beans of type org.springdoc.core.models.GroupedOpenApi
2025-04-18 22:31:35 TRACE o.s.c.c.MultipleOpenApiSupportCondition - Condition MultipleOpenApiSupportCondition on org.springdoc.webmvc.core.configuration.MultipleOpenApiSupportConfiguration matched due to AnyNestedCondition 1 matched 1 did not; NestedCondition on MultipleOpenApiSupportCondition.OnActuatorDifferentPort found non-matching nested conditions Management Port actual port type (SAME) did not match required type (DIFFERENT); NestedCondition on MultipleOpenApiSupportCondition.OnMultipleOpenApiSupportCondition AnyNestedCondition 1 matched 2 did not; NestedCondition on MultipleOpenApiGroupsCondition.OnListGroupedOpenApiBean @ConditionalOnBean (types: org.springdoc.core.models.GroupedOpenApi; SearchStrategy: all) did not find any beans of type org.springdoc.core.models.GroupedOpenApi; NestedCondition on MultipleOpenApiGroupsCondition.OnGroupConfigProperty @ConditionalOnProperty (springdoc.group-configs[0].group) matched; NestedCondition on MultipleOpenApiGroupsCondition.OnGroupedOpenApiBean @ConditionalOnBean (types: org.springdoc.core.models.GroupedOpenApi; SearchStrategy: all) did not find any beans of type org.springdoc.core.models.GroupedOpenApi
2025-04-18 22:31:36 INFO  o.a.c.c.StandardService - Starting service [Tomcat]
2025-04-18 22:31:36 INFO  o.a.c.c.StandardEngine - Starting Servlet engine: [Apache Tomcat/10.1.39]
2025-04-18 22:31:36 INFO  o.a.c.c.C.[.[.[/api] - Initializing Spring embedded WebApplicationContext
2025-04-18 22:31:36 INFO  c.a.c.WebConfig - Створення CORS фільтра
2025-04-18 22:31:36 DEBUG o.s.w.f.ServerHttpObservationFilter - Filter 'webMvcObservationFilter' configured for use
2025-04-18 22:31:36 DEBUG o.s.w.f.CorsFilter - Filter 'corsFilter' configured for use
2025-04-18 22:31:36 DEBUG o.s.w.f.CorsFilter - Filter 'corsFilterRegistration' configured for use
2025-04-18 22:31:36 INFO  c.z.h.HikariDataSource - HikariPool-1 - Starting...
2025-04-18 22:31:36 INFO  c.z.h.p.HikariPool - HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection@1b841e7d
2025-04-18 22:31:36 INFO  c.z.h.HikariDataSource - HikariPool-1 - Start completed.
2025-04-18 22:31:36 INFO  l.lockservice - Successfully acquired change log lock
2025-04-18 22:31:36 INFO  l.command - Clearing database change log checksums for database postgresql
2025-04-18 22:31:36 INFO  l.lockservice - Successfully released change log lock
2025-04-18 22:31:36 INFO  l.command - Command execution complete
2025-04-18 22:31:37 INFO  l.changelog - Reading from public.databasechangelog
2025-04-18 22:31:37 INFO  l.changelog - Reading from public.databasechangelog
2025-04-18 22:31:37 INFO  liquibase.ui - Database is up to date, no changesets to execute
2025-04-18 22:31:37 INFO  l.changelog - Reading from public.databasechangelog
2025-04-18 22:31:37 INFO  liquibase.util - UPDATE SUMMARY
2025-04-18 22:31:37 INFO  liquibase.util - Run:                          0
2025-04-18 22:31:37 INFO  liquibase.util - Previously run:               5
2025-04-18 22:31:37 INFO  liquibase.util - Filtered out:                 0
2025-04-18 22:31:37 INFO  liquibase.util - -------------------------------
2025-04-18 22:31:37 INFO  liquibase.util - Total change sets:            5
2025-04-18 22:31:37 INFO  liquibase.util - Update summary generated
2025-04-18 22:31:37 INFO  l.command - Command execution complete
2025-04-18 22:31:37 INFO  o.h.j.i.u.LogHelper - HHH000204: Processing PersistenceUnitInfo [name: default]
2025-04-18 22:31:37 INFO  o.h.Version - HHH000412: Hibernate ORM core version 6.6.11.Final
2025-04-18 22:31:37 INFO  o.h.c.i.RegionFactoryInitiator - HHH000026: Second-level cache disabled
2025-04-18 22:31:37 WARN  o.h.o.deprecation - HHH90000025: PostgreSQLDialect does not need to be specified explicitly using 'hibernate.dialect' (remove the property setting and it will be selected by default)
2025-04-18 22:31:37 INFO  o.h.o.c.pooling - HHH10001005: Database info:
	Database JDBC URL [Connecting through datasource 'HikariDataSource (HikariPool-1)']
	Database driver: undefined/unknown
	Database version: 17.4
	Autocommit mode: undefined/unknown
	Isolation level: undefined/unknown
	Minimum pool size: undefined/unknown
	Maximum pool size: undefined/unknown
2025-04-18 22:31:38 INFO  o.h.e.t.j.p.i.JtaPlatformInitiator - HHH000489: No JTA platform available (set 'hibernate.transaction.jta.platform' to enable JTA platform integration)
2025-04-18 22:31:38 INFO  o.s.s.c.a.a.c.InitializeAuthenticationProviderBeanManagerConfigurer$InitializeAuthenticationProviderManagerConfigurer - Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2025-04-18 22:31:38 WARN  o.s.s.c.a.a.c.InitializeUserDetailsBeanManagerConfigurer$InitializeUserDetailsManagerConfigurer - Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2025-04-18 22:31:39 WARN  o.s.b.a.o.j.JpaBaseConfiguration$JpaWebConfiguration - spring.jpa.open-in-view is enabled by default. Therefore, database queries may be performed during view rendering. Explicitly configure spring.jpa.open-in-view to disable this warning
2025-04-18 22:31:39 INFO  c.a.c.WebConfig - Налаштування CORS для всіх шляхів
2025-04-18 22:31:39 DEBUG o.s.w.s.m.m.a.RequestMappingHandlerMapping - 19 mappings in 'requestMappingHandlerMapping'
2025-04-18 22:31:39 INFO  c.a.c.WebConfig - Налаштування контролерів для перенаправлення
2025-04-18 22:31:39 DEBUG o.s.w.s.h.SimpleUrlHandlerMapping - Patterns [/swagger-ui] in 'viewControllerHandlerMapping'
2025-04-18 22:31:39 INFO  c.a.c.WebConfig - Налаштування статичних ресурсів для Swagger UI
2025-04-18 22:31:39 DEBUG o.s.w.s.h.SimpleUrlHandlerMapping - Patterns [/webjars/**, /**, /swagger-ui/**, /swagger-ui.html, /v3/api-docs/**, /swagger-ui*/*swagger-initializer.js, /swagger-ui*/**] in 'resourceHandlerMapping'
2025-04-18 22:31:40 INFO  c.a.c.SecurityConfig - Налаштування SecurityFilterChain
2025-04-18 22:31:40 INFO  c.a.c.SecurityConfig - SecurityFilterChain успішно налаштовано
2025-04-18 22:31:40 DEBUG o.s.s.w.DefaultSecurityFilterChain - Will secure any request with filters: DisableEncodeUrlFilter, WebAsyncManagerIntegrationFilter, SecurityContextHolderFilter, HeaderWriterFilter, CorsFilter, LogoutFilter, JwtAuthenticationFilter, RequestCacheAwareFilter, SecurityContextHolderAwareRequestFilter, AnonymousAuthenticationFilter, SessionManagementFilter, ExceptionTranslationFilter, AuthorizationFilter
2025-04-18 22:31:40 DEBUG o.s.w.s.m.m.a.RequestMappingHandlerAdapter - ControllerAdvice beans: 0 @ModelAttribute, 0 @InitBinder, 1 RequestBodyAdvice, 1 ResponseBodyAdvice
2025-04-18 22:31:40 DEBUG o.s.w.s.m.m.a.ExceptionHandlerExceptionResolver - ControllerAdvice beans: 3 @ExceptionHandler, 1 ResponseBodyAdvice
2025-04-18 22:31:40 INFO  c.a.c.OpenApiConfig - Ініціалізація OpenAPI конфігурації
2025-04-18 22:31:40 DEBUG c.a.c.OpenApiConfig - Використання контекстного шляху: /api
2025-04-18 22:31:40 INFO  c.a.c.OpenApiConfig - Ініціалізація OpenAPI конфігурації
2025-04-18 22:31:40 DEBUG c.a.c.OpenApiConfig - Використання контекстного шляху: /api
2025-04-18 22:31:40 INFO  c.a.c.OpenApiConfig - Ініціалізація OpenAPI конфігурації
2025-04-18 22:31:40 DEBUG c.a.c.OpenApiConfig - Використання контекстного шляху: /api
2025-04-18 22:31:40 INFO  c.a.AksiApplication - Started AksiApplication in 7.007 seconds (process running for 7.409)
2025-04-18 22:31:43 INFO  o.a.c.c.C.[.[.[/api] - Initializing Spring DispatcherServlet 'dispatcherServlet'
2025-04-18 22:31:43 INFO  o.s.w.s.DispatcherServlet - Initializing Servlet 'dispatcherServlet'
2025-04-18 22:31:43 DEBUG o.s.w.s.DispatcherServlet - Detected StandardServletMultipartResolver
2025-04-18 22:31:43 DEBUG o.s.w.s.DispatcherServlet - Detected AcceptHeaderLocaleResolver
2025-04-18 22:31:43 DEBUG o.s.w.s.DispatcherServlet - Detected FixedThemeResolver
2025-04-18 22:31:43 DEBUG o.s.w.s.DispatcherServlet - Detected org.springframework.web.servlet.view.DefaultRequestToViewNameTranslator@459dad43
2025-04-18 22:31:43 DEBUG o.s.w.s.DispatcherServlet - Detected org.springframework.web.servlet.support.SessionFlashMapManager@7f6f4644
2025-04-18 22:31:43 DEBUG o.s.w.s.DispatcherServlet - enableLoggingRequestDetails='false': request parameters and headers will be masked to prevent unsafe logging of potentially sensitive data
2025-04-18 22:31:43 INFO  o.s.w.s.DispatcherServlet - Completed initialization in 1 ms
2025-04-18 22:31:43 DEBUG o.s.s.w.FilterChainProxy - Securing GET /actuator/loggers
2025-04-18 22:31:43 DEBUG o.s.s.w.a.AnonymousAuthenticationFilter - Set SecurityContextHolder to anonymous SecurityContext
2025-04-18 22:31:43 DEBUG o.s.s.w.FilterChainProxy - Secured GET /actuator/loggers
2025-04-18 22:31:43 DEBUG o.s.w.s.DispatcherServlet - GET "/api/actuator/loggers", parameters={}
2025-04-18 22:31:43 DEBUG o.s.w.s.m.m.a.RequestResponseBodyMethodProcessor - Read "application/octet-stream" to []
2025-04-18 22:31:43 DEBUG o.s.w.s.m.m.a.RequestResponseBodyMethodProcessor - Using 'application/vnd.spring-boot.actuator.v3+json;q=0.8', given [text/html, application/xhtml+xml, image/avif, image/webp, image/apng, application/xml;q=0.9, */*;q=0.8, application/signed-exchange;v=b3;q=0.7] and supported [application/vnd.spring-boot.actuator.v3+json, application/vnd.spring-boot.actuator.v2+json, application/json]
2025-04-18 22:31:43 DEBUG o.s.w.s.m.m.a.RequestResponseBodyMethodProcessor - Writing [org.springframework.boot.actuate.logging.LoggersEndpoint$LoggersDescriptor@b57273f]
2025-04-18 22:31:43 DEBUG o.s.w.s.DispatcherServlet - Completed 200 OK
2025-04-18 22:31:50 DEBUG o.s.s.w.FilterChainProxy - Securing POST /auth/login
2025-04-18 22:31:50 DEBUG o.s.s.w.a.AnonymousAuthenticationFilter - Set SecurityContextHolder to anonymous SecurityContext
2025-04-18 22:31:50 DEBUG o.s.s.w.FilterChainProxy - Secured POST /auth/login
2025-04-18 22:31:50 DEBUG o.s.w.s.DispatcherServlet - POST "/api/auth/login", parameters={}
2025-04-18 22:31:50 DEBUG o.s.w.s.m.m.a.RequestMappingHandlerMapping - Mapped to com.aksi.api.AuthController#login(LoginRequest)
2025-04-18 22:31:50 DEBUG o.s.w.s.m.m.a.RequestResponseBodyMethodProcessor - Read "application/json;charset=UTF-8" to [LoginRequest(username=admin, password=Aksi1911)]
2025-04-18 22:31:50 INFO  c.a.a.AuthController - Запит на логін користувача: admin
2025-04-18 22:31:50 DEBUG o.s.s.a.d.DaoAuthenticationProvider - Authenticated user
2025-04-18 22:31:50 DEBUG o.s.w.s.m.m.a.HttpEntityMethodProcessor - Using 'application/json', given [application/json, text/plain, */*] and supported [application/json, application/*+json, application/yaml]
2025-04-18 22:31:50 DEBUG o.s.w.s.m.m.a.HttpEntityMethodProcessor - Writing [AuthResponse(id=1165836f-32d6-432e-9629-fcadc13fca7a, name=Адміністратор, username=admin, email=admi (truncated)...]
2025-04-18 22:31:50 DEBUG o.s.w.s.DispatcherServlet - Completed 200 OK
2025-04-18 22:36:34 DEBUG o.s.s.w.FilterChainProxy - Securing GET /auth/login
2025-04-18 22:36:34 ERROR c.a.c.JwtAuthenticationFilter - Помилка аутентифікації: Invalid compact JWT string: Compact JWSs must contain exactly 2 period characters, and compact JWEs must contain exactly 4.  Found: 0
2025-04-18 22:36:34 DEBUG o.s.s.w.a.AnonymousAuthenticationFilter - Set SecurityContextHolder to anonymous SecurityContext
2025-04-18 22:36:34 DEBUG o.s.s.w.FilterChainProxy - Secured GET /auth/login
2025-04-18 22:36:34 DEBUG o.s.w.s.DispatcherServlet - GET "/api/auth/login", parameters={}
2025-04-18 22:36:34 DEBUG o.s.w.s.m.m.a.ExceptionHandlerExceptionResolver - Using @ExceptionHandler com.aksi.api.advice.GlobalExceptionHandler#handleException(Exception)
2025-04-18 22:36:34 ERROR c.a.a.a.GlobalExceptionHandler - Внутрішня помилка сервера [11755e45]: Request method 'GET' is not supported
org.springframework.web.HttpRequestMethodNotSupportedException: Request method 'GET' is not supported
	at org.springframework.web.servlet.mvc.method.RequestMappingInfoHandlerMapping.handleNoMatch(RequestMappingInfoHandlerMapping.java:267)
	at org.springframework.web.servlet.handler.AbstractHandlerMethodMapping.lookupHandlerMethod(AbstractHandlerMethodMapping.java:441)
	at org.springframework.web.servlet.handler.AbstractHandlerMethodMapping.getHandlerInternal(AbstractHandlerMethodMapping.java:382)
	at org.springframework.web.servlet.mvc.method.RequestMappingInfoHandlerMapping.getHandlerInternal(RequestMappingInfoHandlerMapping.java:127)
	at org.springframework.web.servlet.mvc.method.RequestMappingInfoHandlerMapping.getHandlerInternal(RequestMappingInfoHandlerMapping.java:68)
	at org.springframework.web.servlet.handler.AbstractHandlerMapping.getHandler(AbstractHandlerMapping.java:509)
	at org.springframework.web.servlet.DispatcherServlet.getHandler(DispatcherServlet.java:1284)
	at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1065)
	at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:979)
	at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1014)
	at org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:903)
	at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
	at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:885)
	at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:195)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
	at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:51)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
	at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:91)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:108)
	at org.springframework.security.web.FilterChainProxy.lambda$doFilterInternal$3(FilterChainProxy.java:231)
	at org.springframework.security.web.ObservationFilterChainDecorator$FilterObservation$SimpleFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:479)
	at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:340)
	at org.springframework.security.web.ObservationFilterChainDecorator.lambda$wrapSecured$0(ObservationFilterChainDecorator.java:82)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:128)
	at org.springframework.security.web.access.intercept.AuthorizationFilter.doFilter(AuthorizationFilter.java:101)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:126)
	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:120)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:131)
	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:85)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.authentication.AnonymousAuthenticationFilter.doFilter(AnonymousAuthenticationFilter.java:100)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter.doFilter(SecurityContextHolderAwareRequestFilter.java:179)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.savedrequest.RequestCacheAwareFilter.doFilter(RequestCacheAwareFilter.java:63)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at com.aksi.config.JwtAuthenticationFilter.doFilterInternal(JwtAuthenticationFilter.java:68)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:107)
	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:93)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:91)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.header.HeaderWriterFilter.doHeadersAfter(HeaderWriterFilter.java:90)
	at org.springframework.security.web.header.HeaderWriterFilter.doFilterInternal(HeaderWriterFilter.java:75)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:82)
	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:69)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter.doFilterInternal(WebAsyncManagerIntegrationFilter.java:62)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.session.DisableEncodeUrlFilter.doFilterInternal(DisableEncodeUrlFilter.java:42)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$0(ObservationFilterChainDecorator.java:323)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:224)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.FilterChainProxy.doFilterInternal(FilterChainProxy.java:233)
	at org.springframework.security.web.FilterChainProxy.doFilter(FilterChainProxy.java:191)
	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
	at org.springframework.web.servlet.handler.HandlerMappingIntrospector.lambda$createCacheFilter$3(HandlerMappingIntrospector.java:243)
	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
	at org.springframework.web.filter.CompositeFilter.doFilter(CompositeFilter.java:74)
	at org.springframework.security.config.annotation.web.configuration.WebMvcSecurityConfiguration$CompositeFilterChainProxy.doFilter(WebMvcSecurityConfiguration.java:238)
	at org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:362)
	at org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:278)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
	at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
	at org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
	at org.springframework.web.filter.ServerHttpObservationFilter.doFilterInternal(ServerHttpObservationFilter.java:114)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
	at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
	at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:91)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
	at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:167)
	at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:90)
	at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:483)
	at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:115)
	at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:93)
	at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:74)
	at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:344)
	at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:397)
	at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:63)
	at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:905)
	at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1743)
	at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52)
	at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1190)
	at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)
	at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:63)
	at java.base/java.lang.Thread.run(Unknown Source)
2025-04-18 22:36:34 ERROR c.a.a.a.GlobalExceptionHandler - Стек помилки [11755e45]: 
org.springframework.web.HttpRequestMethodNotSupportedException: Request method 'GET' is not supported
	at org.springframework.web.servlet.mvc.method.RequestMappingInfoHandlerMapping.handleNoMatch(RequestMappingInfoHandlerMapping.java:267)
	at org.springframework.web.servlet.handler.AbstractHandlerMethodMapping.lookupHandlerMethod(AbstractHandlerMethodMapping.java:441)
	at org.springframework.web.servlet.handler.AbstractHandlerMethodMapping.getHandlerInternal(AbstractHandlerMethodMapping.java:382)
	at org.springframework.web.servlet.mvc.method.RequestMappingInfoHandlerMapping.getHandlerInternal(RequestMappingInfoHandlerMapping.java:127)
	at org.springframework.web.servlet.mvc.method.RequestMappingInfoHandlerMapping.getHandlerInternal(RequestMappingInfoHandlerMapping.java:68)
	at org.springframework.web.servlet.handler.AbstractHandlerMapping.getHandler(AbstractHandlerMapping.java:509)
	at org.springframework.web.servlet.DispatcherServlet.getHandler(DispatcherServlet.java:1284)
	at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1065)
	at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:979)
	at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1014)
	at org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:903)
	at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
	at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:885)
	at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:195)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
	at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:51)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
	at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:91)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:108)
	at org.springframework.security.web.FilterChainProxy.lambda$doFilterInternal$3(FilterChainProxy.java:231)
	at org.springframework.security.web.ObservationFilterChainDecorator$FilterObservation$SimpleFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:479)
	at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:340)
	at org.springframework.security.web.ObservationFilterChainDecorator.lambda$wrapSecured$0(ObservationFilterChainDecorator.java:82)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:128)
	at org.springframework.security.web.access.intercept.AuthorizationFilter.doFilter(AuthorizationFilter.java:101)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:126)
	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:120)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:131)
	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:85)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.authentication.AnonymousAuthenticationFilter.doFilter(AnonymousAuthenticationFilter.java:100)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter.doFilter(SecurityContextHolderAwareRequestFilter.java:179)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.savedrequest.RequestCacheAwareFilter.doFilter(RequestCacheAwareFilter.java:63)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at com.aksi.config.JwtAuthenticationFilter.doFilterInternal(JwtAuthenticationFilter.java:68)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:107)
	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:93)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:91)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.header.HeaderWriterFilter.doHeadersAfter(HeaderWriterFilter.java:90)
	at org.springframework.security.web.header.HeaderWriterFilter.doFilterInternal(HeaderWriterFilter.java:75)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:82)
	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:69)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter.doFilterInternal(WebAsyncManagerIntegrationFilter.java:62)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.session.DisableEncodeUrlFilter.doFilterInternal(DisableEncodeUrlFilter.java:42)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240)
	at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$0(ObservationFilterChainDecorator.java:323)
	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:224)
	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137)
	at org.springframework.security.web.FilterChainProxy.doFilterInternal(FilterChainProxy.java:233)
	at org.springframework.security.web.FilterChainProxy.doFilter(FilterChainProxy.java:191)
	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
	at org.springframework.web.servlet.handler.HandlerMappingIntrospector.lambda$createCacheFilter$3(HandlerMappingIntrospector.java:243)
	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)
	at org.springframework.web.filter.CompositeFilter.doFilter(CompositeFilter.java:74)
	at org.springframework.security.config.annotation.web.configuration.WebMvcSecurityConfiguration$CompositeFilterChainProxy.doFilter(WebMvcSecurityConfiguration.java:238)
	at org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:362)
	at org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:278)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
	at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
	at org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
	at org.springframework.web.filter.ServerHttpObservationFilter.doFilterInternal(ServerHttpObservationFilter.java:114)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
	at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
	at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:91)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140)
	at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:167)
	at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:90)
	at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:483)
	at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:115)
	at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:93)
	at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:74)
	at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:344)
	at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:397)
	at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:63)
	at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:905)
	at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1743)
	at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52)
	at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1190)
	at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)
	at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:63)
	at java.base/java.lang.Thread.run(Unknown Source)
2025-04-18 22:36:34 ERROR c.a.a.a.GlobalExceptionHandler - Викликано з [11755e45]: org.springframework.web.servlet.mvc.method.RequestMappingInfoHandlerMapping.handleNoMatch(RequestMappingInfoHandlerMapping.java:267)
2025-04-18 22:36:34 DEBUG o.s.w.s.m.m.a.HttpEntityMethodProcessor - Using 'application/json', given [*/*] and supported [application/json, application/*+json, application/yaml]
2025-04-18 22:36:34 DEBUG o.s.w.s.m.m.a.HttpEntityMethodProcessor - Writing [ErrorResponse(timestamp=2025-04-18T22:36:34.340692846, status=500, message=Внутрішня помилка сервера (truncated)...]
2025-04-18 22:36:34 DEBUG o.s.w.s.m.m.a.ExceptionHandlerExceptionResolver - Resolved [org.springframework.web.HttpRequestMethodNotSupportedException: Request method 'GET' is not supported]
2025-04-18 22:36:34 DEBUG o.s.w.s.DispatcherServlet - Completed 500 INTERNAL_SERVER_ERROR
