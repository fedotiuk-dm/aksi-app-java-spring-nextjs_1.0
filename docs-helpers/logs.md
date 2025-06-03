backend-dev       | 	Database JDBC URL [Connecting through datasource 'HikariDataSource (HikariPool-1)']
backend-dev       | 	Database driver: undefined/unknown
backend-dev       | 	Database version: 17.5
backend-dev       | 	Autocommit mode: undefined/unknown
backend-dev       | 	Isolation level: undefined/unknown
backend-dev       | 	Minimum pool size: undefined/unknown
backend-dev       | 	Maximum pool size: undefined/unknown
backend-dev       | 2025-06-03 21:20:04 INFO  o.h.e.t.j.p.i.JtaPlatformInitiator - HHH000489: No JTA platform available (set 'hibernate.transaction.jta.platform' to enable JTA platform integration)
backend-dev       | 2025-06-03 21:20:04 ERROR o.s.o.j.LocalContainerEntityManagerFactoryBean - Failed to initialize JPA EntityManagerFactory: [PersistenceUnit: default] Unable to build Hibernate SessionFactory; nested exception is org.hibernate.tool.schema.spi.SchemaManagementException: Schema-validation: missing column [created_at] in table [order_items]
backend-dev       | 2025-06-03 21:20:04 ERROR o.s.b.w.e.t.TomcatStarter - Error starting Tomcat context. Exception: org.springframework.beans.factory.UnsatisfiedDependencyException. Message: Error creating bean with name 'jwtAuthenticationFilter' defined in file [/app/target/classes/com/aksi/config/JwtAuthenticationFilter.class]: Unsatisfied dependency expressed through constructor parameter 1: Error creating bean with name 'userDetailsConfig' defined in file [/app/target/classes/com/aksi/config/UserDetailsConfig.class]: Unsatisfied dependency expressed through constructor parameter 0: Error creating bean with name 'userRepository' defined in com.aksi.domain.user.repository.UserRepository defined in @EnableJpaRepositories declared on AksiApplication: Cannot resolve reference to bean 'jpaSharedEM_entityManagerFactory' while setting bean property 'entityManager'
backend-dev       | 2025-06-03 21:20:04 INFO  o.a.c.c.StandardService - Stopping service [Tomcat]
backend-dev       | 2025-06-03 21:20:04 WARN  o.a.c.l.WebappClassLoaderBase - The web application [api] appears to have started a thread named [HikariPool-1 housekeeper] but has failed to stop it. This is very likely to create a memory leak. Stack trace of thread:
backend-dev       |  java.base/jdk.internal.misc.Unsafe.park(Native Method)
backend-dev       |  java.base/java.util.concurrent.locks.LockSupport.parkNanos(LockSupport.java:269)
backend-dev       |  java.base/java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.awaitNanos(AbstractQueuedSynchronizer.java:1763)
backend-dev       |  java.base/java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(ScheduledThreadPoolExecutor.java:1182)
backend-dev       |  java.base/java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(ScheduledThreadPoolExecutor.java:899)
backend-dev       |  java.base/java.util.concurrent.ThreadPoolExecutor.getTask(ThreadPoolExecutor.java:1070)
backend-dev       |  java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1130)
backend-dev       |  java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:642)
backend-dev       |  java.base/java.lang.Thread.run(Thread.java:1583)
backend-dev       | 2025-06-03 21:20:04 WARN  o.a.c.l.WebappClassLoaderBase - The web application [api] appears to have started a thread named [HikariPool-1 connection adder] but has failed to stop it. This is very likely to create a memory leak. Stack trace of thread:
backend-dev       |  java.base/jdk.internal.misc.Unsafe.park(Native Method)
backend-dev       |  java.base/java.util.concurrent.locks.LockSupport.parkNanos(LockSupport.java:269)
backend-dev       |  java.base/java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.awaitNanos(AbstractQueuedSynchronizer.java:1763)
backend-dev       |  java.base/java.util.concurrent.LinkedBlockingQueue.poll(LinkedBlockingQueue.java:460)
backend-dev       |  java.base/java.util.concurrent.ThreadPoolExecutor.getTask(ThreadPoolExecutor.java:1069)
backend-dev       |  java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1130)
backend-dev       |  java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:642)
backend-dev       |  java.base/java.lang.Thread.run(Thread.java:1583)
backend-dev       | 2025-06-03 21:20:04 WARN  o.s.b.w.s.c.AnnotationConfigServletWebServerApplicationContext - Exception encountered during context initialization - cancelling refresh attempt: org.springframework.context.ApplicationContextException: Unable to start web server
backend-dev       | 2025-06-03 21:20:04 INFO  c.z.h.HikariDataSource - HikariPool-1 - Shutdown initiated...
backend-dev       | 2025-06-03 21:20:04 INFO  c.z.h.HikariDataSource - HikariPool-1 - Shutdown completed.
backend-dev       | 2025-06-03 21:20:05 INFO  o.s.b.a.l.ConditionEvaluationReportLogger -
backend-dev       |
backend-dev       | Error starting ApplicationContext. To display the condition evaluation report re-run your application with 'debug' enabled.
backend-dev       | 2025-06-03 21:20:05 ERROR o.s.b.SpringApplication - Application run failed
backend-dev       | org.springframework.context.ApplicationContextException: Unable to start web server
backend-dev       | 	at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.onRefresh(ServletWebServerApplicationContext.java:170)
backend-dev       | 	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:621)
backend-dev       | 	at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.refresh(ServletWebServerApplicationContext.java:146)
backend-dev       | 	at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:752)
backend-dev       | 	at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:439)
backend-dev       | 	at org.springframework.boot.SpringApplication.run(SpringApplication.java:318)
backend-dev       | 	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1361)
backend-dev       | 	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1350)
backend-dev       | 	at com.aksi.AksiApplication.main(AksiApplication.java:16)
backend-dev       | 	at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:103)
backend-dev       | 	at java.base/java.lang.reflect.Method.invoke(Method.java:580)
backend-dev       | 	at org.springframework.boot.devtools.restart.RestartLauncher.run(RestartLauncher.java:50)
backend-dev       | Caused by: org.springframework.boot.web.server.WebServerException: Unable to start embedded Tomcat
backend-dev       | 	at org.springframework.boot.web.embedded.tomcat.TomcatWebServer.initialize(TomcatWebServer.java:147)
backend-dev       | 	at org.springframework.boot.web.embedded.tomcat.TomcatWebServer.<init>(TomcatWebServer.java:107)
backend-dev       | 	at org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory.getTomcatWebServer(TomcatServletWebServerFactory.java:517)
backend-dev       | 	at org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory.getWebServer(TomcatServletWebServerFactory.java:219)
backend-dev       | 	at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.createWebServer(ServletWebServerApplicationContext.java:193)
backend-dev       | 	at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.onRefresh(ServletWebServerApplicationContext.java:167)
backend-dev       | 	... 11 common frames omitted
backend-dev       | Caused by: org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name 'jwtAuthenticationFilter' defined in file [/app/target/classes/com/aksi/config/JwtAuthenticationFilter.class]: Unsatisfied dependency expressed through constructor parameter 1: Error creating bean with name 'userDetailsConfig' defined in file [/app/target/classes/com/aksi/config/UserDetailsConfig.class]: Unsatisfied dependency expressed through constructor parameter 0: Error creating bean with name 'userRepository' defined in com.aksi.domain.user.repository.UserRepository defined in @EnableJpaRepositories declared on AksiApplication: Cannot resolve reference to bean 'jpaSharedEM_entityManagerFactory' while setting bean property 'entityManager'
backend-dev       | 	at org.springframework.beans.factory.support.ConstructorResolver.createArgumentArray(ConstructorResolver.java:804)
backend-dev       | 	at org.springframework.beans.factory.support.ConstructorResolver.autowireConstructor(ConstructorResolver.java:240)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.autowireConstructor(AbstractAutowireCapableBeanFactory.java:1381)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1218)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:563)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:523)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339)
backend-dev       | 	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:347)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:207)
backend-dev       | 	at org.springframework.boot.web.servlet.ServletContextInitializerBeans.getOrderedBeansOfType(ServletContextInitializerBeans.java:211)
backend-dev       | 	at org.springframework.boot.web.servlet.ServletContextInitializerBeans.addAsRegistrationBean(ServletContextInitializerBeans.java:174)
backend-dev       | 	at org.springframework.boot.web.servlet.ServletContextInitializerBeans.addAsRegistrationBean(ServletContextInitializerBeans.java:169)
backend-dev       | 	at org.springframework.boot.web.servlet.ServletContextInitializerBeans.addAdaptableBeans(ServletContextInitializerBeans.java:154)
backend-dev       | 	at org.springframework.boot.web.servlet.ServletContextInitializerBeans.<init>(ServletContextInitializerBeans.java:87)
backend-dev       | 	at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.getServletContextInitializerBeans(ServletWebServerApplicationContext.java:271)
backend-dev       | 	at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.selfInitialize(ServletWebServerApplicationContext.java:245)
backend-dev       | 	at org.springframework.boot.web.embedded.tomcat.TomcatStarter.onStartup(TomcatStarter.java:52)
backend-dev       | 	at org.apache.catalina.core.StandardContext.startInternal(StandardContext.java:4467)
backend-dev       | 	at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164)
backend-dev       | 	at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1203)
backend-dev       | 	at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1193)
backend-dev       | 	at java.base/java.util.concurrent.FutureTask.run(FutureTask.java:317)
backend-dev       | 	at org.apache.tomcat.util.threads.InlineExecutorService.execute(InlineExecutorService.java:75)
backend-dev       | 	at java.base/java.util.concurrent.AbstractExecutorService.submit(AbstractExecutorService.java:145)
backend-dev       | 	at org.apache.catalina.core.ContainerBase.startInternal(ContainerBase.java:749)
backend-dev       | 	at org.apache.catalina.core.StandardHost.startInternal(StandardHost.java:772)
backend-dev       | 	at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164)
backend-dev       | 	at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1203)
backend-dev       | 	at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1193)
backend-dev       | 	at java.base/java.util.concurrent.FutureTask.run(FutureTask.java:317)
backend-dev       | 	at org.apache.tomcat.util.threads.InlineExecutorService.execute(InlineExecutorService.java:75)
backend-dev       | 	at java.base/java.util.concurrent.AbstractExecutorService.submit(AbstractExecutorService.java:145)
backend-dev       | 	at org.apache.catalina.core.ContainerBase.startInternal(ContainerBase.java:749)
backend-dev       | 	at org.apache.catalina.core.StandardEngine.startInternal(StandardEngine.java:203)
backend-dev       | 	at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164)
backend-dev       | 	at org.apache.catalina.core.StandardService.startInternal(StandardService.java:415)
backend-dev       | 	at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164)
backend-dev       | 	at org.apache.catalina.core.StandardServer.startInternal(StandardServer.java:870)
backend-dev       | 	at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164)
backend-dev       | 	at org.apache.catalina.startup.Tomcat.start(Tomcat.java:437)
backend-dev       | 	at org.springframework.boot.web.embedded.tomcat.TomcatWebServer.initialize(TomcatWebServer.java:128)
backend-dev       | 	... 16 common frames omitted
backend-dev       | Caused by: org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name 'userDetailsConfig' defined in file [/app/target/classes/com/aksi/config/UserDetailsConfig.class]: Unsatisfied dependency expressed through constructor parameter 0: Error creating bean with name 'userRepository' defined in com.aksi.domain.user.repository.UserRepository defined in @EnableJpaRepositories declared on AksiApplication: Cannot resolve reference to bean 'jpaSharedEM_entityManagerFactory' while setting bean property 'entityManager'
backend-dev       | 	at org.springframework.beans.factory.support.ConstructorResolver.createArgumentArray(ConstructorResolver.java:804)
backend-dev       | 	at org.springframework.beans.factory.support.ConstructorResolver.autowireConstructor(ConstructorResolver.java:240)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.autowireConstructor(AbstractAutowireCapableBeanFactory.java:1381)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1218)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:563)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:523)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339)
backend-dev       | 	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:347)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202)
backend-dev       | 	at org.springframework.beans.factory.support.ConstructorResolver.instantiateUsingFactoryMethod(ConstructorResolver.java:413)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.instantiateUsingFactoryMethod(AbstractAutowireCapableBeanFactory.java:1361)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1191)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:563)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:523)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339)
backend-dev       | 	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:347)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202)
backend-dev       | 	at org.springframework.beans.factory.support.DefaultListableBeanFactory.doResolveDependency(DefaultListableBeanFactory.java:1609)
backend-dev       | 	at org.springframework.beans.factory.support.DefaultListableBeanFactory.resolveDependency(DefaultListableBeanFactory.java:1555)
backend-dev       | 	at org.springframework.beans.factory.support.ConstructorResolver.resolveAutowiredArgument(ConstructorResolver.java:913)
backend-dev       | 	at org.springframework.beans.factory.support.ConstructorResolver.createArgumentArray(ConstructorResolver.java:791)
backend-dev       | 	... 57 common frames omitted
backend-dev       | Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'userRepository' defined in com.aksi.domain.user.repository.UserRepository defined in @EnableJpaRepositories declared on AksiApplication: Cannot resolve reference to bean 'jpaSharedEM_entityManagerFactory' while setting bean property 'entityManager'
backend-dev       | 	at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:377)
backend-dev       | 	at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveValueIfNecessary(BeanDefinitionValueResolver.java:135)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.applyPropertyValues(AbstractAutowireCapableBeanFactory.java:1711)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.populateBean(AbstractAutowireCapableBeanFactory.java:1460)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:600)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:523)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339)
backend-dev       | 	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:347)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202)
backend-dev       | 	at org.springframework.beans.factory.support.DefaultListableBeanFactory.doResolveDependency(DefaultListableBeanFactory.java:1609)
backend-dev       | 	at org.springframework.beans.factory.support.DefaultListableBeanFactory.resolveDependency(DefaultListableBeanFactory.java:1555)
backend-dev       | 	at org.springframework.beans.factory.support.ConstructorResolver.resolveAutowiredArgument(ConstructorResolver.java:913)
backend-dev       | 	at org.springframework.beans.factory.support.ConstructorResolver.createArgumentArray(ConstructorResolver.java:791)
backend-dev       | 	... 79 common frames omitted
backend-dev       | Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'jpaSharedEM_entityManagerFactory': Cannot resolve reference to bean 'entityManagerFactory' while setting constructor argument
backend-dev       | 	at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:377)
backend-dev       | 	at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveValueIfNecessary(BeanDefinitionValueResolver.java:135)
backend-dev       | 	at org.springframework.beans.factory.support.ConstructorResolver.resolveConstructorArguments(ConstructorResolver.java:691)
backend-dev       | 	at org.springframework.beans.factory.support.ConstructorResolver.instantiateUsingFactoryMethod(ConstructorResolver.java:513)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.instantiateUsingFactoryMethod(AbstractAutowireCapableBeanFactory.java:1361)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1191)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:563)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:523)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339)
backend-dev       | 	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:347)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202)
backend-dev       | 	at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:365)
backend-dev       | 	... 92 common frames omitted
backend-dev       | Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'entityManagerFactory' defined in class path resource [org/springframework/boot/autoconfigure/orm/jpa/HibernateJpaConfiguration.class]: [PersistenceUnit: default] Unable to build Hibernate SessionFactory; nested exception is org.hibernate.tool.schema.spi.SchemaManagementException: Schema-validation: missing column [created_at] in table [order_items]
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1812)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:601)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:523)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339)
backend-dev       | 	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:347)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202)
backend-dev       | 	at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:365)
backend-dev       | 	... 104 common frames omitted
backend-dev       | Caused by: jakarta.persistence.PersistenceException: [PersistenceUnit: default] Unable to build Hibernate SessionFactory; nested exception is org.hibernate.tool.schema.spi.SchemaManagementException: Schema-validation: missing column [created_at] in table [order_items]
backend-dev       | 	at org.springframework.orm.jpa.AbstractEntityManagerFactoryBean.buildNativeEntityManagerFactory(AbstractEntityManagerFactoryBean.java:431)
backend-dev       | 	at org.springframework.orm.jpa.AbstractEntityManagerFactoryBean.afterPropertiesSet(AbstractEntityManagerFactoryBean.java:400)
backend-dev       | 	at org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean.afterPropertiesSet(LocalContainerEntityManagerFactoryBean.java:366)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1859)
backend-dev       | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1808)
backend-dev       | 	... 111 common frames omitted
backend-dev       | Caused by: org.hibernate.tool.schema.spi.SchemaManagementException: Schema-validation: missing column [created_at] in table [order_items]
backend-dev       | 	at org.hibernate.tool.schema.internal.AbstractSchemaValidator.validateTable(AbstractSchemaValidator.java:149)
backend-dev       | 	at org.hibernate.tool.schema.internal.GroupedSchemaValidatorImpl.validateTables(GroupedSchemaValidatorImpl.java:46)
backend-dev       | 	at org.hibernate.tool.schema.internal.AbstractSchemaValidator.performValidation(AbstractSchemaValidator.java:99)
backend-dev       | 	at org.hibernate.tool.schema.internal.AbstractSchemaValidator.doValidation(AbstractSchemaValidator.java:77)
backend-dev       | 	at org.hibernate.tool.schema.spi.SchemaManagementToolCoordinator.performDatabaseAction(SchemaManagementToolCoordinator.java:289)
backend-dev       | 	at org.hibernate.tool.schema.spi.SchemaManagementToolCoordinator.lambda$process$5(SchemaManagementToolCoordinator.java:144)
backend-dev       | 	at java.base/java.util.HashMap.forEach(HashMap.java:1429)
backend-dev       | 	at org.hibernate.tool.schema.spi.SchemaManagementToolCoordinator.process(SchemaManagementToolCoordinator.java:141)
backend-dev       | 	at org.hibernate.boot.internal.SessionFactoryObserverForSchemaExport.sessionFactoryCreated(SessionFactoryObserverForSchemaExport.java:37)
backend-dev       | 	at org.hibernate.internal.SessionFactoryObserverChain.sessionFactoryCreated(SessionFactoryObserverChain.java:35)
backend-dev       | 	at org.hibernate.internal.SessionFactoryImpl.<init>(SessionFactoryImpl.java:324)
backend-dev       | 	at org.hibernate.boot.internal.SessionFactoryBuilderImpl.build(SessionFactoryBuilderImpl.java:463)
backend-dev       | 	at org.hibernate.jpa.boot.internal.EntityManagerFactoryBuilderImpl.build(EntityManagerFactoryBuilderImpl.java:1517)
backend-dev       | 	at org.springframework.orm.jpa.vendor.SpringHibernateJpaPersistenceProvider.createContainerEntityManagerFactory(SpringHibernateJpaPersistenceProvider.java:66)
backend-dev       | 	at org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean.createNativeEntityManagerFactory(LocalContainerEntityManagerFactoryBean.java:390)
backend-dev       | 	at org.springframework.orm.jpa.AbstractEntityManagerFactoryBean.buildNativeEntityManagerFactory(AbstractEntityManagerFactoryBean.java:419)
backend-dev       | 	... 115 common frames omitted
backend-dev       | [INFO] ------------------------------------------------------------------------
backend-dev       | [INFO] BUILD SUCCESS
backend-dev       | [INFO] ------------------------------------------------------------------------
backend-dev       | [INFO] Total time:  21.685 s
backend-dev       | [INFO] Finished at: 2025-06-03T21:20:05Z
backend-dev       | [INFO] ------------------------------------------------------------------------
