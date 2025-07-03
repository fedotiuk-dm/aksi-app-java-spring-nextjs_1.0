backend-dev  | Standard Commons Logging discovery in action with spring-jcl: please remove commons-logging.jar from classpath in order to avoid potential conflicts
backend-dev  | 20:57:06.371 ERROR [restartedMain] liquibase.changelog                      : ChangeSet db/changelog/item/013-create-item-colors-table.yaml::013-insert-item-colors-data::system encountered an exception.
backend-dev  | -
backend-dev  | liquibase.exception.DatabaseException: ERROR: new row for relation "item_colors" violates check constraint "chk_item_colors_hex_format"
backend-dev  |   Detail: Failing row contains (3dcb9e12-d1a8-45f4-b68c-d4344bc26ebc, MULTICOLOR, Різнокольоровий, Multicolor, , t, 14, t, 2025-07-03 20:57:06.364509, 2025-07-03 20:57:06.364509). [Failed SQL: (0) INSERT INTO public.item_colors (code, name_uk, name_en, hex_color, affects_price, sort_order, is_active) VALUES ('BLACK', 'Чорний', 'Black', '#000000', TRUE, 1, TRUE),('WHITE', 'Білий', 'White', '#FFFFFF', FALSE, 2, TRUE),('GRAY', 'Сірий', 'Gray', '#808080', FALSE, 3, TRUE),('BROWN', 'Коричневий', 'Brown', '#8B4513', FALSE, 4, TRUE),('NAVY', 'Темно-синій', 'Navy', '#000080', FALSE, 5, TRUE),('BLUE', 'Синій', 'Blue', '#0000FF', FALSE, 6, TRUE),('GREEN', 'Зелений', 'Green', '#008000', FALSE, 7, TRUE),('RED', 'Червоний', 'Red', '#FF0000', FALSE, 8, TRUE),('BEIGE', 'Бежевий', 'Beige', '#F5F5DC', FALSE, 9, TRUE),('CREAM', 'Кремовий', 'Cream', '#FFFDD0', FALSE, 10, TRUE),('PINK', 'Рожевий', 'Pink', '#FFC0CB', FALSE, 11, TRUE),('YELLOW', 'Жовтий', 'Yellow', '#FFFF00', FALSE, 12, TRUE),('PURPLE', 'Фіолетовий', 'Purple', '#800080', FALSE, 13, TRUE),('MULTICOLOR', 'Різнокольоровий', 'Multicolor', '', TRUE, 14, TRUE),('OTHER', 'Інший', 'Other', '', FALSE, 15, TRUE);]
backend-dev  | 	at liquibase.executor.jvm.JdbcExecutor$ExecuteStatementCallback.doInStatement(JdbcExecutor.java:497) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.executor.jvm.JdbcExecutor.execute(JdbcExecutor.java:83) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.executor.jvm.JdbcExecutor.execute(JdbcExecutor.java:185) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.executor.AbstractExecutor.execute(AbstractExecutor.java:141) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.database.AbstractJdbcDatabase.executeStatements(AbstractJdbcDatabase.java:1189) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.changelog.ChangeSet.execute(ChangeSet.java:776) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.changelog.visitor.UpdateVisitor.executeAcceptedChange(UpdateVisitor.java:126) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.changelog.visitor.UpdateVisitor.visit(UpdateVisitor.java:70) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.changelog.ChangeLogIterator.lambda$run$0(ChangeLogIterator.java:131) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.lambda$child$0(Scope.java:191) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:200) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:190) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:169) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.changelog.ChangeLogIterator.lambda$run$1(ChangeLogIterator.java:120) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.lambda$child$0(Scope.java:191) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:200) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:190) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:169) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:257) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:261) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.changelog.ChangeLogIterator.run(ChangeLogIterator.java:89) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.command.core.AbstractUpdateCommandStep.lambda$run$0(AbstractUpdateCommandStep.java:114) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.lambda$child$0(Scope.java:191) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:200) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:190) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:169) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.command.core.AbstractUpdateCommandStep.run(AbstractUpdateCommandStep.java:112) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.command.core.UpdateCommandStep.run(UpdateCommandStep.java:105) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.command.CommandScope.execute(CommandScope.java:220) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Liquibase.lambda$update$0(Liquibase.java:216) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.lambda$child$0(Scope.java:191) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:200) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:190) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:169) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Liquibase.runInScope(Liquibase.java:1329) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Liquibase.update(Liquibase.java:205) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Liquibase.update(Liquibase.java:188) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.integration.spring.SpringLiquibase.performUpdate(SpringLiquibase.java:305) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.integration.spring.SpringLiquibase.lambda$afterPropertiesSet$0(SpringLiquibase.java:257) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.lambda$child$0(Scope.java:191) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:200) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:190) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:169) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:257) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.integration.spring.SpringLiquibase.afterPropertiesSet(SpringLiquibase.java:250) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1859) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1808) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:601) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:523) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:347) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:315) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:207) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.context.support.AbstractApplicationContext.finishBeanFactoryInitialization(AbstractApplicationContext.java:970) ~[spring-context-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:627) ~[spring-context-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.refresh(ServletWebServerApplicationContext.java:146) ~[spring-boot-3.4.4.jar:3.4.4]
backend-dev  | 	at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:752) ~[spring-boot-3.4.4.jar:3.4.4]
backend-dev  | 	at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:439) ~[spring-boot-3.4.4.jar:3.4.4]
backend-dev  | 	at org.springframework.boot.SpringApplication.run(SpringApplication.java:318) ~[spring-boot-3.4.4.jar:3.4.4]
backend-dev  | 	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1361) ~[spring-boot-3.4.4.jar:3.4.4]
backend-dev  | 	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1350) ~[spring-boot-3.4.4.jar:3.4.4]
backend-dev  | 	at com.aksi.DryCleaningOrderSystemApplication.main(DryCleaningOrderSystemApplication.java:18) ~[classes/:na]
backend-dev  | 	at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:103) ~[na:na]
backend-dev  | 	at java.base/java.lang.reflect.Method.invoke(Method.java:580) ~[na:na]
backend-dev  | 	at org.springframework.boot.devtools.restart.RestartLauncher.run(RestartLauncher.java:50) ~[spring-boot-devtools-3.4.4.jar:3.4.4]
backend-dev  | Caused by: org.postgresql.util.PSQLException: ERROR: new row for relation "item_colors" violates check constraint "chk_item_colors_hex_format"
backend-dev  |   Detail: Failing row contains (3dcb9e12-d1a8-45f4-b68c-d4344bc26ebc, MULTICOLOR, Різнокольоровий, Multicolor, , t, 14, t, 2025-07-03 20:57:06.364509, 2025-07-03 20:57:06.364509).
backend-dev  | 	at org.postgresql.core.v3.QueryExecutorImpl.receiveErrorResponse(QueryExecutorImpl.java:2733) ~[postgresql-42.7.5.jar:42.7.5]
backend-dev  | 	at org.postgresql.core.v3.QueryExecutorImpl.processResults(QueryExecutorImpl.java:2420) ~[postgresql-42.7.5.jar:42.7.5]
backend-dev  | 	at org.postgresql.core.v3.QueryExecutorImpl.execute(QueryExecutorImpl.java:372) ~[postgresql-42.7.5.jar:42.7.5]
backend-dev  | 	at org.postgresql.jdbc.PgStatement.executeInternal(PgStatement.java:517) ~[postgresql-42.7.5.jar:42.7.5]
backend-dev  | 	at org.postgresql.jdbc.PgStatement.execute(PgStatement.java:434) ~[postgresql-42.7.5.jar:42.7.5]
backend-dev  | 	at org.postgresql.jdbc.PgStatement.executeWithFlags(PgStatement.java:356) ~[postgresql-42.7.5.jar:42.7.5]
backend-dev  | 	at org.postgresql.jdbc.PgStatement.executeCachedSql(PgStatement.java:341) ~[postgresql-42.7.5.jar:42.7.5]
backend-dev  | 	at org.postgresql.jdbc.PgStatement.executeWithFlags(PgStatement.java:317) ~[postgresql-42.7.5.jar:42.7.5]
backend-dev  | 	at org.postgresql.jdbc.PgStatement.execute(PgStatement.java:312) ~[postgresql-42.7.5.jar:42.7.5]
backend-dev  | 	at com.zaxxer.hikari.pool.ProxyStatement.execute(ProxyStatement.java:94) ~[HikariCP-5.1.0.jar:na]
backend-dev  | 	at com.zaxxer.hikari.pool.HikariProxyStatement.execute(HikariProxyStatement.java) ~[HikariCP-5.1.0.jar:na]
backend-dev  | 	at liquibase.executor.jvm.JdbcExecutor$ExecuteStatementCallback.doInStatement(JdbcExecutor.java:491) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	... 66 common frames omitted
backend-dev  |
backend-dev  | 20:57:06.421 ERROR [restartedMain] o.s.boot.SpringApplication               : Application run failed
backend-dev  | -
backend-dev  | org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'entityManagerFactory' defined in class path resource [org/springframework/boot/autoconfigure/orm/jpa/HibernateJpaConfiguration.class]: Failed to initialize dependency 'liquibase' of LoadTimeWeaverAware bean 'entityManagerFactory': Error creating bean with name 'liquibase' defined in class path resource [org/springframework/boot/autoconfigure/liquibase/LiquibaseAutoConfiguration$LiquibaseConfiguration.class]: liquibase.exception.CommandExecutionException: liquibase.exception.LiquibaseException: liquibase.exception.MigrationFailedException: Migration failed for changeset db/changelog/item/013-create-item-colors-table.yaml::013-insert-item-colors-data::system:
backend-dev  |      Reason: liquibase.exception.DatabaseException: ERROR: new row for relation "item_colors" violates check constraint "chk_item_colors_hex_format"
backend-dev  |   Detail: Failing row contains (3dcb9e12-d1a8-45f4-b68c-d4344bc26ebc, MULTICOLOR, Різнокольоровий, Multicolor, , t, 14, t, 2025-07-03 20:57:06.364509, 2025-07-03 20:57:06.364509). [Failed SQL: (0) INSERT INTO public.item_colors (code, name_uk, name_en, hex_color, affects_price, sort_order, is_active) VALUES ('BLACK', 'Чорний', 'Black', '#000000', TRUE, 1, TRUE),('WHITE', 'Білий', 'White', '#FFFFFF', FALSE, 2, TRUE),('GRAY', 'Сірий', 'Gray', '#808080', FALSE, 3, TRUE),('BROWN', 'Коричневий', 'Brown', '#8B4513', FALSE, 4, TRUE),('NAVY', 'Темно-синій', 'Navy', '#000080', FALSE, 5, TRUE),('BLUE', 'Синій', 'Blue', '#0000FF', FALSE, 6, TRUE),('GREEN', 'Зелений', 'Green', '#008000', FALSE, 7, TRUE),('RED', 'Червоний', 'Red', '#FF0000', FALSE, 8, TRUE),('BEIGE', 'Бежевий', 'Beige', '#F5F5DC', FALSE, 9, TRUE),('CREAM', 'Кремовий', 'Cream', '#FFFDD0', FALSE, 10, TRUE),('PINK', 'Рожевий', 'Pink', '#FFC0CB', FALSE, 11, TRUE),('YELLOW', 'Жовтий', 'Yellow', '#FFFF00', FALSE, 12, TRUE),('PURPLE', 'Фіолетовий', 'Purple', '#800080', FALSE, 13, TRUE),('MULTICOLOR', 'Різнокольоровий', 'Multicolor', '', TRUE, 14, TRUE),('OTHER', 'Інший', 'Other', '', FALSE, 15, TRUE);]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:328) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:207) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.context.support.AbstractApplicationContext.finishBeanFactoryInitialization(AbstractApplicationContext.java:970) ~[spring-context-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:627) ~[spring-context-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.refresh(ServletWebServerApplicationContext.java:146) ~[spring-boot-3.4.4.jar:3.4.4]
backend-dev  | 	at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:752) ~[spring-boot-3.4.4.jar:3.4.4]
backend-dev  | 	at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:439) ~[spring-boot-3.4.4.jar:3.4.4]
backend-dev  | 	at org.springframework.boot.SpringApplication.run(SpringApplication.java:318) ~[spring-boot-3.4.4.jar:3.4.4]
backend-dev  | 	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1361) ~[spring-boot-3.4.4.jar:3.4.4]
backend-dev  | 	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1350) ~[spring-boot-3.4.4.jar:3.4.4]
backend-dev  | 	at com.aksi.DryCleaningOrderSystemApplication.main(DryCleaningOrderSystemApplication.java:18) ~[classes/:na]
backend-dev  | 	at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:103) ~[na:na]
backend-dev  | 	at java.base/java.lang.reflect.Method.invoke(Method.java:580) ~[na:na]
backend-dev  | 	at org.springframework.boot.devtools.restart.RestartLauncher.run(RestartLauncher.java:50) ~[spring-boot-devtools-3.4.4.jar:3.4.4]
backend-dev  | Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'liquibase' defined in class path resource [org/springframework/boot/autoconfigure/liquibase/LiquibaseAutoConfiguration$LiquibaseConfiguration.class]: liquibase.exception.CommandExecutionException: liquibase.exception.LiquibaseException: liquibase.exception.MigrationFailedException: Migration failed for changeset db/changelog/item/013-create-item-colors-table.yaml::013-insert-item-colors-data::system:
backend-dev  |      Reason: liquibase.exception.DatabaseException: ERROR: new row for relation "item_colors" violates check constraint "chk_item_colors_hex_format"
backend-dev  |   Detail: Failing row contains (3dcb9e12-d1a8-45f4-b68c-d4344bc26ebc, MULTICOLOR, Різнокольоровий, Multicolor, , t, 14, t, 2025-07-03 20:57:06.364509, 2025-07-03 20:57:06.364509). [Failed SQL: (0) INSERT INTO public.item_colors (code, name_uk, name_en, hex_color, affects_price, sort_order, is_active) VALUES ('BLACK', 'Чорний', 'Black', '#000000', TRUE, 1, TRUE),('WHITE', 'Білий', 'White', '#FFFFFF', FALSE, 2, TRUE),('GRAY', 'Сірий', 'Gray', '#808080', FALSE, 3, TRUE),('BROWN', 'Коричневий', 'Brown', '#8B4513', FALSE, 4, TRUE),('NAVY', 'Темно-синій', 'Navy', '#000080', FALSE, 5, TRUE),('BLUE', 'Синій', 'Blue', '#0000FF', FALSE, 6, TRUE),('GREEN', 'Зелений', 'Green', '#008000', FALSE, 7, TRUE),('RED', 'Червоний', 'Red', '#FF0000', FALSE, 8, TRUE),('BEIGE', 'Бежевий', 'Beige', '#F5F5DC', FALSE, 9, TRUE),('CREAM', 'Кремовий', 'Cream', '#FFFDD0', FALSE, 10, TRUE),('PINK', 'Рожевий', 'Pink', '#FFC0CB', FALSE, 11, TRUE),('YELLOW', 'Жовтий', 'Yellow', '#FFFF00', FALSE, 12, TRUE),('PURPLE', 'Фіолетовий', 'Purple', '#800080', FALSE, 13, TRUE),('MULTICOLOR', 'Різнокольоровий', 'Multicolor', '', TRUE, 14, TRUE),('OTHER', 'Інший', 'Other', '', FALSE, 15, TRUE);]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1812) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:601) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:523) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:347) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:315) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	... 13 common frames omitted
backend-dev  | Caused by: liquibase.exception.UnexpectedLiquibaseException: liquibase.exception.CommandExecutionException: liquibase.exception.LiquibaseException: liquibase.exception.MigrationFailedException: Migration failed for changeset db/changelog/item/013-create-item-colors-table.yaml::013-insert-item-colors-data::system:
backend-dev  |      Reason: liquibase.exception.DatabaseException: ERROR: new row for relation "item_colors" violates check constraint "chk_item_colors_hex_format"
backend-dev  |   Detail: Failing row contains (3dcb9e12-d1a8-45f4-b68c-d4344bc26ebc, MULTICOLOR, Різнокольоровий, Multicolor, , t, 14, t, 2025-07-03 20:57:06.364509, 2025-07-03 20:57:06.364509). [Failed SQL: (0) INSERT INTO public.item_colors (code, name_uk, name_en, hex_color, affects_price, sort_order, is_active) VALUES ('BLACK', 'Чорний', 'Black', '#000000', TRUE, 1, TRUE),('WHITE', 'Білий', 'White', '#FFFFFF', FALSE, 2, TRUE),('GRAY', 'Сірий', 'Gray', '#808080', FALSE, 3, TRUE),('BROWN', 'Коричневий', 'Brown', '#8B4513', FALSE, 4, TRUE),('NAVY', 'Темно-синій', 'Navy', '#000080', FALSE, 5, TRUE),('BLUE', 'Синій', 'Blue', '#0000FF', FALSE, 6, TRUE),('GREEN', 'Зелений', 'Green', '#008000', FALSE, 7, TRUE),('RED', 'Червоний', 'Red', '#FF0000', FALSE, 8, TRUE),('BEIGE', 'Бежевий', 'Beige', '#F5F5DC', FALSE, 9, TRUE),('CREAM', 'Кремовий', 'Cream', '#FFFDD0', FALSE, 10, TRUE),('PINK', 'Рожевий', 'Pink', '#FFC0CB', FALSE, 11, TRUE),('YELLOW', 'Жовтий', 'Yellow', '#FFFF00', FALSE, 12, TRUE),('PURPLE', 'Фіолетовий', 'Purple', '#800080', FALSE, 13, TRUE),('MULTICOLOR', 'Різнокольоровий', 'Multicolor', '', TRUE, 14, TRUE),('OTHER', 'Інший', 'Other', '', FALSE, 15, TRUE);]
backend-dev  | 	at liquibase.integration.spring.SpringLiquibase.afterPropertiesSet(SpringLiquibase.java:267) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1859) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1808) ~[spring-beans-6.2.5.jar:6.2.5]
backend-dev  | 	... 20 common frames omitted
backend-dev  | Caused by: liquibase.exception.CommandExecutionException: liquibase.exception.LiquibaseException: liquibase.exception.MigrationFailedException: Migration failed for changeset db/changelog/item/013-create-item-colors-table.yaml::013-insert-item-colors-data::system:
backend-dev  |      Reason: liquibase.exception.DatabaseException: ERROR: new row for relation "item_colors" violates check constraint "chk_item_colors_hex_format"
backend-dev  |   Detail: Failing row contains (3dcb9e12-d1a8-45f4-b68c-d4344bc26ebc, MULTICOLOR, Різнокольоровий, Multicolor, , t, 14, t, 2025-07-03 20:57:06.364509, 2025-07-03 20:57:06.364509). [Failed SQL: (0) INSERT INTO public.item_colors (code, name_uk, name_en, hex_color, affects_price, sort_order, is_active) VALUES ('BLACK', 'Чорний', 'Black', '#000000', TRUE, 1, TRUE),('WHITE', 'Білий', 'White', '#FFFFFF', FALSE, 2, TRUE),('GRAY', 'Сірий', 'Gray', '#808080', FALSE, 3, TRUE),('BROWN', 'Коричневий', 'Brown', '#8B4513', FALSE, 4, TRUE),('NAVY', 'Темно-синій', 'Navy', '#000080', FALSE, 5, TRUE),('BLUE', 'Синій', 'Blue', '#0000FF', FALSE, 6, TRUE),('GREEN', 'Зелений', 'Green', '#008000', FALSE, 7, TRUE),('RED', 'Червоний', 'Red', '#FF0000', FALSE, 8, TRUE),('BEIGE', 'Бежевий', 'Beige', '#F5F5DC', FALSE, 9, TRUE),('CREAM', 'Кремовий', 'Cream', '#FFFDD0', FALSE, 10, TRUE),('PINK', 'Рожевий', 'Pink', '#FFC0CB', FALSE, 11, TRUE),('YELLOW', 'Жовтий', 'Yellow', '#FFFF00', FALSE, 12, TRUE),('PURPLE', 'Фіолетовий', 'Purple', '#800080', FALSE, 13, TRUE),('MULTICOLOR', 'Різнокольоровий', 'Multicolor', '', TRUE, 14, TRUE),('OTHER', 'Інший', 'Other', '', FALSE, 15, TRUE);]
backend-dev  | 	at liquibase.command.CommandScope.execute(CommandScope.java:258) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Liquibase.lambda$update$0(Liquibase.java:216) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.lambda$child$0(Scope.java:191) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:200) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:190) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:169) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Liquibase.runInScope(Liquibase.java:1329) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Liquibase.update(Liquibase.java:205) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Liquibase.update(Liquibase.java:188) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.integration.spring.SpringLiquibase.performUpdate(SpringLiquibase.java:305) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.integration.spring.SpringLiquibase.lambda$afterPropertiesSet$0(SpringLiquibase.java:257) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.lambda$child$0(Scope.java:191) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:200) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:190) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:169) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:257) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.integration.spring.SpringLiquibase.afterPropertiesSet(SpringLiquibase.java:250) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	... 22 common frames omitted
backend-dev  | Caused by: liquibase.exception.LiquibaseException: liquibase.exception.MigrationFailedException: Migration failed for changeset db/changelog/item/013-create-item-colors-table.yaml::013-insert-item-colors-data::system:
backend-dev  |      Reason: liquibase.exception.DatabaseException: ERROR: new row for relation "item_colors" violates check constraint "chk_item_colors_hex_format"
backend-dev  |   Detail: Failing row contains (3dcb9e12-d1a8-45f4-b68c-d4344bc26ebc, MULTICOLOR, Різнокольоровий, Multicolor, , t, 14, t, 2025-07-03 20:57:06.364509, 2025-07-03 20:57:06.364509). [Failed SQL: (0) INSERT INTO public.item_colors (code, name_uk, name_en, hex_color, affects_price, sort_order, is_active) VALUES ('BLACK', 'Чорний', 'Black', '#000000', TRUE, 1, TRUE),('WHITE', 'Білий', 'White', '#FFFFFF', FALSE, 2, TRUE),('GRAY', 'Сірий', 'Gray', '#808080', FALSE, 3, TRUE),('BROWN', 'Коричневий', 'Brown', '#8B4513', FALSE, 4, TRUE),('NAVY', 'Темно-синій', 'Navy', '#000080', FALSE, 5, TRUE),('BLUE', 'Синій', 'Blue', '#0000FF', FALSE, 6, TRUE),('GREEN', 'Зелений', 'Green', '#008000', FALSE, 7, TRUE),('RED', 'Червоний', 'Red', '#FF0000', FALSE, 8, TRUE),('BEIGE', 'Бежевий', 'Beige', '#F5F5DC', FALSE, 9, TRUE),('CREAM', 'Кремовий', 'Cream', '#FFFDD0', FALSE, 10, TRUE),('PINK', 'Рожевий', 'Pink', '#FFC0CB', FALSE, 11, TRUE),('YELLOW', 'Жовтий', 'Yellow', '#FFFF00', FALSE, 12, TRUE),('PURPLE', 'Фіолетовий', 'Purple', '#800080', FALSE, 13, TRUE),('MULTICOLOR', 'Різнокольоровий', 'Multicolor', '', TRUE, 14, TRUE),('OTHER', 'Інший', 'Other', '', FALSE, 15, TRUE);]
backend-dev  | 	at liquibase.changelog.ChangeLogIterator.run(ChangeLogIterator.java:148) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.command.core.AbstractUpdateCommandStep.lambda$run$0(AbstractUpdateCommandStep.java:114) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.lambda$child$0(Scope.java:191) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:200) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:190) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:169) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.command.core.AbstractUpdateCommandStep.run(AbstractUpdateCommandStep.java:112) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.command.core.UpdateCommandStep.run(UpdateCommandStep.java:105) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.command.CommandScope.execute(CommandScope.java:220) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	... 38 common frames omitted
backend-dev  | Caused by: liquibase.exception.MigrationFailedException: Migration failed for changeset db/changelog/item/013-create-item-colors-table.yaml::013-insert-item-colors-data::system:
backend-dev  |      Reason: liquibase.exception.DatabaseException: ERROR: new row for relation "item_colors" violates check constraint "chk_item_colors_hex_format"
backend-dev  |   Detail: Failing row contains (3dcb9e12-d1a8-45f4-b68c-d4344bc26ebc, MULTICOLOR, Різнокольоровий, Multicolor, , t, 14, t, 2025-07-03 20:57:06.364509, 2025-07-03 20:57:06.364509). [Failed SQL: (0) INSERT INTO public.item_colors (code, name_uk, name_en, hex_color, affects_price, sort_order, is_active) VALUES ('BLACK', 'Чорний', 'Black', '#000000', TRUE, 1, TRUE),('WHITE', 'Білий', 'White', '#FFFFFF', FALSE, 2, TRUE),('GRAY', 'Сірий', 'Gray', '#808080', FALSE, 3, TRUE),('BROWN', 'Коричневий', 'Brown', '#8B4513', FALSE, 4, TRUE),('NAVY', 'Темно-синій', 'Navy', '#000080', FALSE, 5, TRUE),('BLUE', 'Синій', 'Blue', '#0000FF', FALSE, 6, TRUE),('GREEN', 'Зелений', 'Green', '#008000', FALSE, 7, TRUE),('RED', 'Червоний', 'Red', '#FF0000', FALSE, 8, TRUE),('BEIGE', 'Бежевий', 'Beige', '#F5F5DC', FALSE, 9, TRUE),('CREAM', 'Кремовий', 'Cream', '#FFFDD0', FALSE, 10, TRUE),('PINK', 'Рожевий', 'Pink', '#FFC0CB', FALSE, 11, TRUE),('YELLOW', 'Жовтий', 'Yellow', '#FFFF00', FALSE, 12, TRUE),('PURPLE', 'Фіолетовий', 'Purple', '#800080', FALSE, 13, TRUE),('MULTICOLOR', 'Різнокольоровий', 'Multicolor', '', TRUE, 14, TRUE),('OTHER', 'Інший', 'Other', '', FALSE, 15, TRUE);]
backend-dev  | 	at liquibase.changelog.ChangeSet.execute(ChangeSet.java:820) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.changelog.visitor.UpdateVisitor.executeAcceptedChange(UpdateVisitor.java:126) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.changelog.visitor.UpdateVisitor.visit(UpdateVisitor.java:70) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.changelog.ChangeLogIterator.lambda$run$0(ChangeLogIterator.java:131) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.lambda$child$0(Scope.java:191) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:200) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:190) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:169) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.changelog.ChangeLogIterator.lambda$run$1(ChangeLogIterator.java:120) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.lambda$child$0(Scope.java:191) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:200) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:190) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:169) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:257) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.Scope.child(Scope.java:261) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.changelog.ChangeLogIterator.run(ChangeLogIterator.java:89) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	... 46 common frames omitted
backend-dev  | Caused by: liquibase.exception.DatabaseException: ERROR: new row for relation "item_colors" violates check constraint "chk_item_colors_hex_format"
backend-dev  |   Detail: Failing row contains (3dcb9e12-d1a8-45f4-b68c-d4344bc26ebc, MULTICOLOR, Різнокольоровий, Multicolor, , t, 14, t, 2025-07-03 20:57:06.364509, 2025-07-03 20:57:06.364509). [Failed SQL: (0) INSERT INTO public.item_colors (code, name_uk, name_en, hex_color, affects_price, sort_order, is_active) VALUES ('BLACK', 'Чорний', 'Black', '#000000', TRUE, 1, TRUE),('WHITE', 'Білий', 'White', '#FFFFFF', FALSE, 2, TRUE),('GRAY', 'Сірий', 'Gray', '#808080', FALSE, 3, TRUE),('BROWN', 'Коричневий', 'Brown', '#8B4513', FALSE, 4, TRUE),('NAVY', 'Темно-синій', 'Navy', '#000080', FALSE, 5, TRUE),('BLUE', 'Синій', 'Blue', '#0000FF', FALSE, 6, TRUE),('GREEN', 'Зелений', 'Green', '#008000', FALSE, 7, TRUE),('RED', 'Червоний', 'Red', '#FF0000', FALSE, 8, TRUE),('BEIGE', 'Бежевий', 'Beige', '#F5F5DC', FALSE, 9, TRUE),('CREAM', 'Кремовий', 'Cream', '#FFFDD0', FALSE, 10, TRUE),('PINK', 'Рожевий', 'Pink', '#FFC0CB', FALSE, 11, TRUE),('YELLOW', 'Жовтий', 'Yellow', '#FFFF00', FALSE, 12, TRUE),('PURPLE', 'Фіолетовий', 'Purple', '#800080', FALSE, 13, TRUE),('MULTICOLOR', 'Різнокольоровий', 'Multicolor', '', TRUE, 14, TRUE),('OTHER', 'Інший', 'Other', '', FALSE, 15, TRUE);]
backend-dev  | 	at liquibase.executor.jvm.JdbcExecutor$ExecuteStatementCallback.doInStatement(JdbcExecutor.java:497) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.executor.jvm.JdbcExecutor.execute(JdbcExecutor.java:83) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.executor.jvm.JdbcExecutor.execute(JdbcExecutor.java:185) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.executor.AbstractExecutor.execute(AbstractExecutor.java:141) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.database.AbstractJdbcDatabase.executeStatements(AbstractJdbcDatabase.java:1189) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.changelog.ChangeSet.execute(ChangeSet.java:776) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	... 61 common frames omitted
backend-dev  | Caused by: org.postgresql.util.PSQLException: ERROR: new row for relation "item_colors" violates check constraint "chk_item_colors_hex_format"
backend-dev  |   Detail: Failing row contains (3dcb9e12-d1a8-45f4-b68c-d4344bc26ebc, MULTICOLOR, Різнокольоровий, Multicolor, , t, 14, t, 2025-07-03 20:57:06.364509, 2025-07-03 20:57:06.364509).
backend-dev  | 	at org.postgresql.core.v3.QueryExecutorImpl.receiveErrorResponse(QueryExecutorImpl.java:2733) ~[postgresql-42.7.5.jar:42.7.5]
backend-dev  | 	at org.postgresql.core.v3.QueryExecutorImpl.processResults(QueryExecutorImpl.java:2420) ~[postgresql-42.7.5.jar:42.7.5]
backend-dev  | 	at org.postgresql.core.v3.QueryExecutorImpl.execute(QueryExecutorImpl.java:372) ~[postgresql-42.7.5.jar:42.7.5]
backend-dev  | 	at org.postgresql.jdbc.PgStatement.executeInternal(PgStatement.java:517) ~[postgresql-42.7.5.jar:42.7.5]
backend-dev  | 	at org.postgresql.jdbc.PgStatement.execute(PgStatement.java:434) ~[postgresql-42.7.5.jar:42.7.5]
backend-dev  | 	at org.postgresql.jdbc.PgStatement.executeWithFlags(PgStatement.java:356) ~[postgresql-42.7.5.jar:42.7.5]
backend-dev  | 	at org.postgresql.jdbc.PgStatement.executeCachedSql(PgStatement.java:341) ~[postgresql-42.7.5.jar:42.7.5]
backend-dev  | 	at org.postgresql.jdbc.PgStatement.executeWithFlags(PgStatement.java:317) ~[postgresql-42.7.5.jar:42.7.5]
backend-dev  | 	at org.postgresql.jdbc.PgStatement.execute(PgStatement.java:312) ~[postgresql-42.7.5.jar:42.7.5]
backend-dev  | 	at com.zaxxer.hikari.pool.ProxyStatement.execute(ProxyStatement.java:94) ~[HikariCP-5.1.0.jar:na]
backend-dev  | 	at com.zaxxer.hikari.pool.HikariProxyStatement.execute(HikariProxyStatement.java) ~[HikariCP-5.1.0.jar:na]
backend-dev  | 	at liquibase.executor.jvm.JdbcExecutor$ExecuteStatementCallback.doInStatement(JdbcExecutor.java:491) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	... 66 common frames omitted
backend-dev  |
backend-dev exited with code 0


ℹ️  🔍 Перевіряємо фінальний статус міграцій...
backend-dev  | 	at liquibase.Liquibase.update(Liquibase.java:188) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.integration.spring.SpringLiquibase.performUpdate(SpringLiquibase.java:305) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.integration.spring.SpringLiquibase.lambda$afterPropertiesSet$0(SpringLiquibase.java:257) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | 	at liquibase.integration.spring.SpringLiquibase.afterPropertiesSet(SpringLiquibase.java:250) ~[liquibase-core-4.29.2.jar:na]
backend-dev  | Caused by: liquibase.exception.LiquibaseException: liquibase.exception.MigrationFailedException: Migration failed for changeset db/changelog/item/013-create-item-colors-table.yaml::013-insert-item-colors-data::system:
backend-dev  |      Reason: liquibase.exception.DatabaseException: ERROR: new row for relation "item_colors" violates check constraint "chk_item_colors_hex_format"
backend-dev  | Caused by: liquibase.exception.MigrationFailedException: Migration failed for changeset db/changelog/item/013-create-item-colors-table.yaml::013-insert-item-colors-data::system:
backend-dev  |      Reason: liquibase.exception.DatabaseException: ERROR: new row for relation "item_colors" violates check constraint "chk_item_colors_hex_format"
backend-dev  | Caused by: liquibase.exception.DatabaseException: ERROR: new row for relation "item_colors" violates check constraint "chk_item_colors_hex_format"
backend-dev  | Caused by: org.postgresql.util.PSQLException: ERROR: new row for relation "item_colors" violates check constraint "chk_item_colors_hex_format"
