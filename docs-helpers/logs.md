backend-dev       | 	at org.springframework.beans.factory.support.ConstructorResolver.instantiate(ConstructorResolver.java:321) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.beans.factory.support.ConstructorResolver.autowireConstructor(ConstructorResolver.java:309) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.autowireConstructor(AbstractAutowireCapableBeanFactory.java:1381) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1218) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:563) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:523) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:347) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.beans.factory.support.DefaultListableBeanFactory.doResolveDependency(DefaultListableBeanFactory.java:1609) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.beans.factory.support.DefaultListableBeanFactory.resolveDependency(DefaultListableBeanFactory.java:1555) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.beans.factory.support.ConstructorResolver.resolveAutowiredArgument(ConstructorResolver.java:913) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.beans.factory.support.ConstructorResolver.createArgumentArray(ConstructorResolver.java:791) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev       | 	... 37 common frames omitted
backend-dev       | Caused by: org.springframework.beans.BeanInstantiationException: Failed to instantiate [com.aksi.domain.auth.service.JwtTokenService]: Constructor threw exception
backend-dev       | 	at org.springframework.beans.BeanUtils.instantiateClass(BeanUtils.java:222) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.beans.factory.support.SimpleInstantiationStrategy.instantiate(SimpleInstantiationStrategy.java:145) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev       | 	at org.springframework.beans.factory.support.ConstructorResolver.instantiate(ConstructorResolver.java:318) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev       | 	... 50 common frames omitted
backend-dev       | Caused by: io.jsonwebtoken.security.WeakKeyException: The specified key byte array is 240 bits which is not secure enough for any JWT HMAC-SHA algorithm.  The JWT JWA Specification (RFC 7518, Section 3.2) states that keys used with HMAC-SHA algorithms MUST have a size >= 256 bits (the key size must be greater than or equal to the hash output size).  Consider using the Jwts.SIG.HS256.key() builder (or HS384.key() or HS512.key()) to create a key guaranteed to be secure enough for your preferred HMAC-SHA algorithm.  See https://tools.ietf.org/html/rfc7518#section-3.2 for more information.
backend-dev       | 	at io.jsonwebtoken.security.Keys.hmacShaKeyFor(Keys.java:83) ~[jjwt-api-0.12.6.jar:0.12.6]
backend-dev       | 	at com.aksi.domain.auth.service.JwtTokenService.<init>(JwtTokenService.java:45) ~[classes/:na]
backend-dev       | 	at java.base/jdk.internal.reflect.DirectConstructorHandleAccessor.newInstance(DirectConstructorHandleAccessor.java:62) ~[na:na]
backend-dev       | 	at java.base/java.lang.reflect.Constructor.newInstanceWithCaller(Constructor.java:502) ~[na:na]
backend-dev       | 	at java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:486) ~[na:na]
backend-dev       | 	at org.springframework.beans.BeanUtils.instantiateClass(BeanUtils.java:209) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev       | 	... 52 common frames omitted
