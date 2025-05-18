backend-dev       | 2025-05-18 12:44:03 ERROR c.a.a.GlobalExceptionHandler - Стек помилки:
backend-dev       |   1) org.springframework.web.servlet.resource.ResourceHttpRequestHandler.handleRequest(ResourceHttpRequestHandler.java:585)
backend-dev       |   2) org.springframework.web.servlet.mvc.HttpRequestHandlerAdapter.handle(HttpRequestHandlerAdapter.java:52)
backend-dev       |   3) org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1089)
backend-dev       |   4) org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:979)
backend-dev       |   5) org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1014)
backend-dev       | 
backend-dev       | 2025-05-18 12:44:03 ERROR c.a.a.GlobalExceptionHandler - Деталі запиту:
backend-dev       |   URI: /api/login
backend-dev       |   Method: GET
backend-dev       |   Query: null
backend-dev       |   Remote IP: 172.19.0.1
backend-dev       |   User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36
backend-dev       | 
backend-dev       | 2025-05-18 12:44:03 DEBUG o.s.w.s.m.m.a.HttpEntityMethodProcessor - Using 'application/json;q=0.8', given [text/html, application/xhtml+xml, image/avif, image/webp, image/apng, application/xml;q=0.9, */*;q=0.8, application/signed-exchange;v=b3;q=0.7] and supported [application/json, application/*+json, application/yaml]
backend-dev       | 2025-05-18 12:44:03 DEBUG o.s.w.s.m.m.a.HttpEntityMethodProcessor - Writing [ErrorResponse(timestamp=2025-05-18T12:44:03.140705541, status=500, message=Внутрішня помилка сервера (truncated)...]
backend-dev       | 2025-05-18 12:44:03 WARN  o.s.w.s.m.m.a.ExceptionHandlerExceptionResolver - Resolved [org.springframework.web.servlet.resource.NoResourceFoundException: No static resource login.]
backend-dev       | 2025-05-18 12:44:03 DEBUG o.s.w.s.DispatcherServlet - Completed 500 INTERNAL_SERVER_ERROR
backend-dev       | 2025-05-18 12:44:04 DEBUG o.s.s.w.FilterChainProxy - Securing GET /
backend-dev       | 2025-05-18 12:44:04 DEBUG o.s.s.w.a.AnonymousAuthenticationFilter - Set SecurityContextHolder to anonymous SecurityContext
backend-dev       | 2025-05-18 12:44:04 DEBUG o.s.s.w.s.SessionManagementFilter - Request requested invalid session id 50D450B5942842515E708C25FAC307DB
backend-dev       | 2025-05-18 12:44:04 DEBUG o.s.s.w.FilterChainProxy - Secured GET /
backend-dev       | 2025-05-18 12:44:04 DEBUG o.s.w.s.DispatcherServlet - GET "/api/", parameters={}
backend-dev       | 2025-05-18 12:44:04 DEBUG o.s.w.s.h.SimpleUrlHandlerMapping - Mapped to ResourceHttpRequestHandler [classpath [META-INF/resources/], classpath [resources/], classpath [static/], classpath [public/], ServletContext [/]]
backend-dev       | 2025-05-18 12:44:04 DEBUG o.s.w.s.r.ResourceHttpRequestHandler - Resource not found
backend-dev       | 2025-05-18 12:44:04 DEBUG o.s.w.s.m.m.a.ExceptionHandlerExceptionResolver - Using @ExceptionHandler com.aksi.api.GlobalExceptionHandler#handleException(Exception)
backend-dev       | 2025-05-18 12:44:04 ERROR c.a.a.GlobalExceptionHandler - Внутрішня помилка сервера для запиту GET /api/
backend-dev       | org.springframework.web.servlet.resource.NoResourceFoundException: No static resource .
backend-dev       | 	at org.springframework.web.servlet.resource.ResourceHttpRequestHandler.handleRequest(ResourceHttpRequestHandler.java:585) ~[spring-webmvc-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.web.servlet.mvc.HttpRequestHandlerAdapter.handle(HttpRequestHandlerAdapter.java:52) ~[spring-webmvc-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1089) ~[spring-webmvc-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:979) ~[spring-webmvc-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1014) ~[spring-webmvc-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:903) ~[spring-webmvc-6.2.5.jar:6.2.5]
backend-dev       | 	at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564) ~[tomcat-embed-core-10.1.39.jar:6.0]
backend-dev       | 	at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:885) ~[spring-webmvc-6.2.5.jar:6.2.5]
backend-dev       | 	at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658) ~[tomcat-embed-core-10.1.39.jar:6.0]
backend-dev       | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:195) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:51) ~[tomcat-embed-websocket-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:91) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:108) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.security.web.FilterChainProxy.lambda$doFilterInternal$3(FilterChainProxy.java:231) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$FilterObservation$SimpleFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:479) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$1(ObservationFilterChainDecorator.java:340) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator.lambda$wrapSecured$0(ObservationFilterChainDecorator.java:82) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:128) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.access.intercept.AuthorizationFilter.doFilter(AuthorizationFilter.java:101) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:126) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:120) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:131) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:85) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.authentication.AnonymousAuthenticationFilter.doFilter(AnonymousAuthenticationFilter.java:100) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter.doFilter(SecurityContextHolderAwareRequestFilter.java:179) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.savedrequest.RequestCacheAwareFilter.doFilter(RequestCacheAwareFilter.java:63) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at com.aksi.config.JwtAuthenticationFilter.doFilterInternal(JwtAuthenticationFilter.java:72) ~[classes/:na]
backend-dev       | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:107) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:93) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:91) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.header.HeaderWriterFilter.doHeadersAfter(HeaderWriterFilter.java:90) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.header.HeaderWriterFilter.doFilterInternal(HeaderWriterFilter.java:75) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:82) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:69) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter.doFilterInternal(WebAsyncManagerIntegrationFilter.java:62) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:227) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.session.DisableEncodeUrlFilter.doFilterInternal(DisableEncodeUrlFilter.java:42) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.wrapFilter(ObservationFilterChainDecorator.java:240) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$AroundFilterObservation$SimpleAroundFilterObservation.lambda$wrap$0(ObservationFilterChainDecorator.java:323) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$ObservationFilter.doFilter(ObservationFilterChainDecorator.java:224) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.ObservationFilterChainDecorator$VirtualFilterChain.doFilter(ObservationFilterChainDecorator.java:137) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.FilterChainProxy.doFilterInternal(FilterChainProxy.java:233) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.security.web.FilterChainProxy.doFilter(FilterChainProxy.java:191) ~[spring-security-web-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.web.servlet.handler.HandlerMappingIntrospector.lambda$createCacheFilter$3(HandlerMappingIntrospector.java:243) ~[spring-webmvc-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.web.filter.CompositeFilter.doFilter(CompositeFilter.java:74) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.security.config.annotation.web.configuration.WebMvcSecurityConfiguration$CompositeFilterChainProxy.doFilter(WebMvcSecurityConfiguration.java:238) ~[spring-security-config-6.4.4.jar:6.4.4]
backend-dev       | 	at org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:362) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:278) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.springframework.web.filter.ServerHttpObservationFilter.doFilterInternal(ServerHttpObservationFilter.java:114) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:91) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-6.2.5.jar:6.2.5]
backend-dev       | 	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:164) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:140) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:167) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:90) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:483) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:115) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:93) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:74) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:344) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:397) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:63) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:905) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1743) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1190) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:63) ~[tomcat-embed-core-10.1.39.jar:10.1.39]
backend-dev       | 	at java.base/java.lang.Thread.run(Thread.java:1583) ~[na:na]
backend-dev       | 2025-05-18 12:44:04 ERROR c.a.a.GlobalExceptionHandler - Стек помилки:
backend-dev       |   1) org.springframework.web.servlet.resource.ResourceHttpRequestHandler.handleRequest(ResourceHttpRequestHandler.java:585)
backend-dev       |   2) org.springframework.web.servlet.mvc.HttpRequestHandlerAdapter.handle(HttpRequestHandlerAdapter.java:52)
backend-dev       |   3) org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1089)
backend-dev       |   4) org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:979)
backend-dev       |   5) org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1014)
backend-dev       | 
backend-dev       | 2025-05-18 12:44:04 ERROR c.a.a.GlobalExceptionHandler - Деталі запиту:
backend-dev       |   URI: /api/
backend-dev       |   Method: GET
backend-dev       |   Query: null
backend-dev       |   Remote IP: 172.19.0.1
backend-dev       |   User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36
backend-dev       | 
backend-dev       | 2025-05-18 12:44:04 DEBUG o.s.w.s.m.m.a.HttpEntityMethodProcessor - Using 'application/json;q=0.8', given [text/html, application/xhtml+xml, image/avif, image/webp, image/apng, application/xml;q=0.9, */*;q=0.8, application/signed-exchange;v=b3;q=0.7] and supported [application/json, application/*+json, application/yaml]
backend-dev       | 2025-05-18 12:44:04 DEBUG o.s.w.s.m.m.a.HttpEntityMethodProcessor - Writing [ErrorResponse(timestamp=2025-05-18T12:44:04.550110476, status=500, message=Внутрішня помилка сервера (truncated)...]
backend-dev       | 2025-05-18 12:44:04 WARN  o.s.w.s.m.m.a.ExceptionHandlerExceptionResolver - Resolved [org.springframework.web.servlet.resource.NoResourceFoundException: No static resource .]
backend-dev       | 2025-05-18 12:44:04 DEBUG o.s.w.s.DispatcherServlet - Completed 500 INTERNAL_SERVER_ERROR
backend-dev       | 2025-05-18 12:44:11 DEBUG o.s.s.w.FilterChainProxy - Securing HEAD /actuator/health
backend-dev       | 2025-05-18 12:44:11 DEBUG o.s.s.w.a.AnonymousAuthenticationFilter - Set SecurityContextHolder to anonymous SecurityContext
backend-dev       | 2025-05-18 12:44:11 DEBUG o.s.s.w.FilterChainProxy - Secured HEAD /actuator/health
backend-dev       | 2025-05-18 12:44:11 DEBUG o.s.w.s.DispatcherServlet - HEAD "/api/actuator/health", parameters={}
backend-dev       | 2025-05-18 12:44:11 DEBUG o.s.w.s.m.m.a.RequestResponseBodyMethodProcessor - Read "application/octet-stream" to []
backend-dev       | 2025-05-18 12:44:11 DEBUG o.s.w.s.m.m.a.HttpEntityMethodProcessor - Using 'application/vnd.spring-boot.actuator.v3+json', given [*/*] and supported [application/vnd.spring-boot.actuator.v3+json, application/vnd.spring-boot.actuator.v2+json, application/json]
backend-dev       | 2025-05-18 12:44:11 DEBUG o.s.w.s.m.m.a.HttpEntityMethodProcessor - Writing [org.springframework.boot.actuate.health.SystemHealth@40fa288d]
backend-dev       | 2025-05-18 12:44:11 DEBUG o.s.w.s.DispatcherServlet - Completed 200 OK
aksi-pgadmin-dev  | ::ffff:172.19.0.1 - - [18/May/2025:12:44:23 +0000] "GET /dashboard/dashboard_stats/1/16384?chart_names=session_stats,tps_stats,ti_stats,to_stats,bio_stats HTTP/1.1" 401 127 "http://localhost:5050/browser/" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
