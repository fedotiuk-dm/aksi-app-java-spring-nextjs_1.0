2025-04-15 15:21:19 ERROR o.s.b.SpringApplication - Application run failed
org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'entityManagerFactory' defined in class path resource [org/springframework/boot/autoconfigure/orm/jpa/HibernateJpaConfiguration.class]: Failed to initialize dependency 'liquibase' of LoadTimeWeaverAware bean 'entityManagerFactory': Error creating bean with name 'liquibase' defined in class path resource [org/springframework/boot/autoconfigure/liquibase/LiquibaseAutoConfiguration$LiquibaseConfiguration.class]: liquibase.exception.CommandExecutionException: liquibase.exception.ChangeLogParseException: Error parsing classpath:db/changelog/db.changelog-master.yaml : Syntax error in file db/changelog/db.changelog-1.5.yaml: while parsing a block collection
 in 'reader', line 8, column 13:
                - tableExists:
                ^
expected <block end>, but found '?'
 in 'reader', line 14, column 13:
                onFail: MARK_RAN
                ^

	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:328)
	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:207)
	at org.springframework.context.support.AbstractApplicationContext.finishBeanFactoryInitialization(AbstractApplicationContext.java:970)
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:627)
	at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.refresh(ServletWebServerApplicationContext.java:146)
	at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:752)
	at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:439)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:318)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1361)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1350)
	at com.aksi.AksiApplication.main(AksiApplication.java:10)
	at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(Unknown Source)
	at java.base/java.lang.reflect.Method.invoke(Unknown Source)
	at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:102)
	at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:64)
	at org.springframework.boot.loader.launch.JarLauncher.main(JarLauncher.java:40)
Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'liquibase' defined in class path resource [org/springframework/boot/autoconfigure/liquibase/LiquibaseAutoConfiguration$LiquibaseConfiguration.class]: liquibase.exception.CommandExecutionException: liquibase.exception.ChangeLogParseException: Error parsing classpath:db/changelog/db.changelog-master.yaml : Syntax error in file db/changelog/db.changelog-1.5.yaml: while parsing a block collection
 in 'reader', line 8, column 13:
                - tableExists:
                ^
expected <block end>, but found '?'
 in 'reader', line 14, column 13:
                onFail: MARK_RAN
                ^

	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1812)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:601)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:523)
	at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339)
	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:347)
	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337)
	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202)
	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:315)
	... 15 common frames omitted
Caused by: liquibase.exception.LiquibaseException: liquibase.exception.CommandExecutionException: liquibase.exception.ChangeLogParseException: Error parsing classpath:db/changelog/db.changelog-master.yaml : Syntax error in file db/changelog/db.changelog-1.5.yaml: while parsing a block collection
 in 'reader', line 8, column 13:
                - tableExists:
                ^
expected <block end>, but found '?'
 in 'reader', line 14, column 13:
                onFail: MARK_RAN
                ^

	at liquibase.integration.spring.SpringLiquibase.afterPropertiesSet(SpringLiquibase.java:288)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1859)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1808)
	... 22 common frames omitted
Caused by: liquibase.exception.CommandExecutionException: liquibase.exception.ChangeLogParseException: Error parsing classpath:db/changelog/db.changelog-master.yaml : Syntax error in file db/changelog/db.changelog-1.5.yaml: while parsing a block collection
 in 'reader', line 8, column 13:
                - tableExists:
                ^
expected <block end>, but found '?'
 in 'reader', line 14, column 13:
                onFail: MARK_RAN
                ^

	at liquibase.command.CommandScope.lambda$execute$6(CommandScope.java:300)
	at liquibase.Scope.child(Scope.java:210)
	at liquibase.Scope.child(Scope.java:186)
	at liquibase.command.CommandScope.execute(CommandScope.java:241)
	at liquibase.Liquibase.lambda$update$0(Liquibase.java:216)
	at liquibase.Scope.lambda$child$0(Scope.java:201)
	at liquibase.Scope.child(Scope.java:210)
	at liquibase.Scope.child(Scope.java:200)
	at liquibase.Scope.child(Scope.java:179)
	at liquibase.Liquibase.runInScope(Liquibase.java:1333)
	at liquibase.Liquibase.update(Liquibase.java:205)
	at liquibase.Liquibase.update(Liquibase.java:188)
	at liquibase.integration.spring.SpringLiquibase.performUpdate(SpringLiquibase.java:326)
	at liquibase.integration.spring.SpringLiquibase.lambda$afterPropertiesSet$0(SpringLiquibase.java:278)
	at liquibase.Scope.lambda$child$0(Scope.java:201)
	at liquibase.Scope.child(Scope.java:210)
	at liquibase.Scope.child(Scope.java:200)
	at liquibase.Scope.child(Scope.java:179)
	at liquibase.integration.spring.SpringLiquibase.afterPropertiesSet(SpringLiquibase.java:271)
	... 24 common frames omitted
Caused by: liquibase.exception.ChangeLogParseException: Error parsing classpath:db/changelog/db.changelog-master.yaml : Syntax error in file db/changelog/db.changelog-1.5.yaml: while parsing a block collection
 in 'reader', line 8, column 13:
                - tableExists:
                ^
expected <block end>, but found '?'
 in 'reader', line 14, column 13:
                onFail: MARK_RAN
                ^

	at liquibase.parser.core.yaml.YamlChangeLogParser.parse(YamlChangeLogParser.java:98)
	at liquibase.command.core.helpers.DatabaseChangelogCommandStep.lambda$getDatabaseChangeLog$0(DatabaseChangelogCommandStep.java:125)
	at liquibase.Scope.child(Scope.java:210)
	at liquibase.Scope.child(Scope.java:186)
	at liquibase.command.core.helpers.DatabaseChangelogCommandStep.getDatabaseChangeLog(DatabaseChangelogCommandStep.java:124)
	at liquibase.command.core.helpers.DatabaseChangelogCommandStep.run(DatabaseChangelogCommandStep.java:83)
	at liquibase.command.CommandScope.lambda$execute$6(CommandScope.java:253)
	... 42 common frames omitted
Caused by: liquibase.exception.SetupException: Syntax error in file db/changelog/db.changelog-1.5.yaml: while parsing a block collection
 in 'reader', line 8, column 13:
                - tableExists:
                ^
expected <block end>, but found '?'
 in 'reader', line 14, column 13:
                onFail: MARK_RAN
                ^

	at liquibase.changelog.DatabaseChangeLog.handleInclude(DatabaseChangeLog.java:655)
	at liquibase.changelog.DatabaseChangeLog.handleChildNodeHelper(DatabaseChangeLog.java:477)
	at liquibase.changelog.DatabaseChangeLog.handleChildNode(DatabaseChangeLog.java:462)
	at liquibase.changelog.DatabaseChangeLog.load(DatabaseChangeLog.java:429)
	at liquibase.parser.core.yaml.YamlChangeLogParser.parse(YamlChangeLogParser.java:92)
	... 48 common frames omitted
Caused by: liquibase.exception.LiquibaseException: Syntax error in file db/changelog/db.changelog-1.5.yaml: while parsing a block collection
 in 'reader', line 8, column 13:
                - tableExists:
                ^
expected <block end>, but found '?'
 in 'reader', line 14, column 13:
                onFail: MARK_RAN
                ^

	at liquibase.changelog.DatabaseChangeLog.include(DatabaseChangeLog.java:1110)
	at liquibase.changelog.DatabaseChangeLog.handleInclude(DatabaseChangeLog.java:644)
	... 52 common frames omitted
Caused by: liquibase.exception.ChangeLogParseException: Syntax error in file db/changelog/db.changelog-1.5.yaml: while parsing a block collection
 in 'reader', line 8, column 13:
                - tableExists:
                ^
expected <block end>, but found '?'
 in 'reader', line 14, column 13:
                onFail: MARK_RAN
                ^

	at liquibase.parser.core.yaml.YamlChangeLogParser.parseYamlStream(YamlChangeLogParser.java:107)
	at liquibase.parser.core.yaml.YamlChangeLogParser.parse(YamlChangeLogParser.java:42)
	at liquibase.changelog.DatabaseChangeLog.include(DatabaseChangeLog.java:1082)
	... 53 common frames omitted
Caused by: org.yaml.snakeyaml.parser.ParserException: while parsing a block collection
 in 'reader', line 8, column 13:
                - tableExists:
                ^
expected <block end>, but found '?'
 in 'reader', line 14, column 13:
                onFail: MARK_RAN
                ^

	at org.yaml.snakeyaml.parser.ParserImpl$ParseBlockSequenceEntryKey.produce(ParserImpl.java:548)
	at org.yaml.snakeyaml.parser.ParserImpl.peekEvent(ParserImpl.java:161)
	at org.yaml.snakeyaml.comments.CommentEventsCollector$1.peek(CommentEventsCollector.java:57)
	at org.yaml.snakeyaml.comments.CommentEventsCollector$1.peek(CommentEventsCollector.java:43)
	at org.yaml.snakeyaml.comments.CommentEventsCollector.collectEvents(CommentEventsCollector.java:136)
	at org.yaml.snakeyaml.comments.CommentEventsCollector.collectEvents(CommentEventsCollector.java:116)
	at org.yaml.snakeyaml.composer.Composer.composeMappingNode(Composer.java:336)
	at org.yaml.snakeyaml.composer.Composer.composeNode(Composer.java:218)
	at org.yaml.snakeyaml.composer.Composer.composeSequenceNode(Composer.java:284)
	at org.yaml.snakeyaml.composer.Composer.composeNode(Composer.java:216)
	at org.yaml.snakeyaml.composer.Composer.composeValueNode(Composer.java:396)
	at org.yaml.snakeyaml.composer.Composer.composeMappingChildren(Composer.java:361)
	at org.yaml.snakeyaml.composer.Composer.composeMappingNode(Composer.java:329)
	at org.yaml.snakeyaml.composer.Composer.composeNode(Composer.java:218)
	at org.yaml.snakeyaml.composer.Composer.composeSequenceNode(Composer.java:284)
	at org.yaml.snakeyaml.composer.Composer.composeNode(Composer.java:216)
	at org.yaml.snakeyaml.composer.Composer.composeValueNode(Composer.java:396)
	at org.yaml.snakeyaml.composer.Composer.composeMappingChildren(Composer.java:361)
	at org.yaml.snakeyaml.composer.Composer.composeMappingNode(Composer.java:329)
	at org.yaml.snakeyaml.composer.Composer.composeNode(Composer.java:218)
	at org.yaml.snakeyaml.composer.Composer.composeValueNode(Composer.java:396)
	at org.yaml.snakeyaml.composer.Composer.composeMappingChildren(Composer.java:361)
	at org.yaml.snakeyaml.composer.Composer.composeMappingNode(Composer.java:329)
	at org.yaml.snakeyaml.composer.Composer.composeNode(Composer.java:218)
	at org.yaml.snakeyaml.composer.Composer.composeSequenceNode(Composer.java:284)
	at org.yaml.snakeyaml.composer.Composer.composeNode(Composer.java:216)
	at org.yaml.snakeyaml.composer.Composer.composeValueNode(Composer.java:396)
	at org.yaml.snakeyaml.composer.Composer.composeMappingChildren(Composer.java:361)
	at org.yaml.snakeyaml.composer.Composer.composeMappingNode(Composer.java:329)
	at org.yaml.snakeyaml.composer.Composer.composeNode(Composer.java:218)
	at org.yaml.snakeyaml.composer.Composer.getNode(Composer.java:141)
	at org.yaml.snakeyaml.composer.Composer.getSingleNode(Composer.java:167)
	at org.yaml.snakeyaml.constructor.BaseConstructor.getSingleData(BaseConstructor.java:178)
	at org.yaml.snakeyaml.Yaml.loadFromReader(Yaml.java:507)
	at org.yaml.snakeyaml.Yaml.load(Yaml.java:448)
	at liquibase.parser.core.yaml.YamlChangeLogParser.parseYamlStream(YamlChangeLogParser.java:105)
	... 55 common frames omitted

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

 :: Spring Boot ::                (v3.4.4)

2025-04-15 15:21:20 INFO  c.a.AksiApplication - Starting AksiApplication v1.0.0 using Java 21.0.6 with PID 1 (/app/app.jar started by spring in /app)
2025-04-15 15:21:20 INFO  c.a.AksiApplication - The following 1 profile is active: "prod"
2025-04-15 15:21:21 TRACE o.s.c.c.MultipleOpenApiSupportCondition - Condition MultipleOpenApiSupportCondition on org.springdoc.core.configuration.SpringDocConfiguration$SpringDocActuatorConfiguration#springdocBeanFactoryPostProcessor3 matched due to AnyNestedCondition 1 matched 1 did not; NestedCondition on MultipleOpenApiSupportCondition.OnActuatorDifferentPort found non-matching nested conditions Management Port actual port type (SAME) did not match required type (DIFFERENT); NestedCondition on MultipleOpenApiSupportCondition.OnMultipleOpenApiSupportCondition AnyNestedCondition 1 matched 2 did not; NestedCondition on MultipleOpenApiGroupsCondition.OnListGroupedOpenApiBean @ConditionalOnBean (types: org.springdoc.core.models.GroupedOpenApi; SearchStrategy: all) did not find any beans of type org.springdoc.core.models.GroupedOpenApi; NestedCondition on MultipleOpenApiGroupsCondition.OnGroupConfigProperty @ConditionalOnProperty (springdoc.group-configs[0].group) matched; NestedCondition on MultipleOpenApiGroupsCondition.OnGroupedOpenApiBean @ConditionalOnBean (types: org.springdoc.core.models.GroupedOpenApi; SearchStrategy: all) did not find any beans of type org.springdoc.core.models.GroupedOpenApi
2025-04-15 15:21:21 TRACE o.s.c.c.CacheOrGroupedOpenApiCondition - Condition CacheOrGroupedOpenApiCondition on org.springdoc.core.configuration.SpringDocConfiguration#springdocBeanFactoryPostProcessor matched due to AnyNestedCondition 1 matched 1 did not; NestedCondition on CacheOrGroupedOpenApiCondition.OnCacheDisabled found non-matching nested conditions @ConditionalOnProperty (springdoc.cache.disabled) did not find property 'springdoc.cache.disabled'; NestedCondition on CacheOrGroupedOpenApiCondition.OnMultipleOpenApiSupportCondition AnyNestedCondition 1 matched 1 did not; NestedCondition on MultipleOpenApiSupportCondition.OnActuatorDifferentPort found non-matching nested conditions Management Port actual port type (SAME) did not match required type (DIFFERENT); NestedCondition on MultipleOpenApiSupportCondition.OnMultipleOpenApiSupportCondition AnyNestedCondition 1 matched 2 did not; NestedCondition on MultipleOpenApiGroupsCondition.OnListGroupedOpenApiBean @ConditionalOnBean (types: org.springdoc.core.models.GroupedOpenApi; SearchStrategy: all) did not find any beans of type org.springdoc.core.models.GroupedOpenApi; NestedCondition on MultipleOpenApiGroupsCondition.OnGroupConfigProperty @ConditionalOnProperty (springdoc.group-configs[0].group) matched; NestedCondition on MultipleOpenApiGroupsCondition.OnGroupedOpenApiBean @ConditionalOnBean (types: org.springdoc.core.models.GroupedOpenApi; SearchStrategy: all) did not find any beans of type org.springdoc.core.models.GroupedOpenApi
2025-04-15 15:21:21 TRACE o.s.c.c.MultipleOpenApiSupportCondition - Condition MultipleOpenApiSupportCondition on org.springdoc.webmvc.core.configuration.MultipleOpenApiSupportConfiguration matched due to AnyNestedCondition 1 matched 1 did not; NestedCondition on MultipleOpenApiSupportCondition.OnActuatorDifferentPort found non-matching nested conditions Management Port actual port type (SAME) did not match required type (DIFFERENT); NestedCondition on MultipleOpenApiSupportCondition.OnMultipleOpenApiSupportCondition AnyNestedCondition 1 matched 2 did not; NestedCondition on MultipleOpenApiGroupsCondition.OnListGroupedOpenApiBean @ConditionalOnBean (types: org.springdoc.core.models.GroupedOpenApi; SearchStrategy: all) did not find any beans of type org.springdoc.core.models.GroupedOpenApi; NestedCondition on MultipleOpenApiGroupsCondition.OnGroupConfigProperty @ConditionalOnProperty (springdoc.group-configs[0].group) matched; NestedCondition on MultipleOpenApiGroupsCondition.OnGroupedOpenApiBean @ConditionalOnBean (types: org.springdoc.core.models.GroupedOpenApi; SearchStrategy: all) did not find any beans of type org.springdoc.core.models.GroupedOpenApi
2025-04-15 15:21:22 INFO  o.a.c.c.StandardService - Starting service [Tomcat]
2025-04-15 15:21:22 INFO  o.a.c.c.StandardEngine - Starting Servlet engine: [Apache Tomcat/10.1.39]
2025-04-15 15:21:22 INFO  o.a.c.c.C.[.[.[/api] - Initializing Spring embedded WebApplicationContext
2025-04-15 15:21:23 INFO  c.a.c.WebConfig - Створення CORS фільтра
2025-04-15 15:21:23 DEBUG o.s.w.f.ServerHttpObservationFilter - Filter 'webMvcObservationFilter' configured for use
2025-04-15 15:21:23 DEBUG o.s.w.f.CorsFilter - Filter 'corsFilter' configured for use
2025-04-15 15:21:23 DEBUG o.s.w.f.CorsFilter - Filter 'corsFilterRegistration' configured for use
