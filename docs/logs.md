[INFO] Running Changeset: src/main/resources/db/changelog/domains/users/1.0/002-create-users-indexes.yaml::users-1.0-002::fedotiuk-dm
[ERROR] ChangeSet src/main/resources/db/changelog/domains/users/1.0/002-create-users-indexes.yaml::users-1.0-002::fedotiuk-dm encountered an exception.
liquibase.exception.DatabaseException: ERROR: relation "idx_users_username" already exists [Failed SQL: (0) CREATE INDEX idx_users_username ON users(username)]
    at liquibase.executor.jvm.JdbcExecutor$ExecuteStatementCallback.doInStatement (JdbcExecutor.java:497)
    at liquibase.executor.jvm.JdbcExecutor.execute (JdbcExecutor.java:83)
    at liquibase.executor.jvm.JdbcExecutor.execute (JdbcExecutor.java:185)
    at liquibase.executor.AbstractExecutor.execute (AbstractExecutor.java:141)
    at liquibase.database.AbstractJdbcDatabase.executeStatements (AbstractJdbcDatabase.java:1189)
    at liquibase.changelog.ChangeSet.execute (ChangeSet.java:790)
    at liquibase.changelog.visitor.UpdateVisitor.executeAcceptedChange (UpdateVisitor.java:126)
    at liquibase.changelog.visitor.UpdateVisitor.visit (UpdateVisitor.java:70)
    at liquibase.changelog.ChangeLogIterator.lambda$run$0 (ChangeLogIterator.java:133)
    at liquibase.Scope.lambda$child$0 (Scope.java:201)
    at liquibase.Scope.child (Scope.java:210)
    at liquibase.Scope.child (Scope.java:200)
    at liquibase.Scope.child (Scope.java:179)
    at liquibase.changelog.ChangeLogIterator.lambda$run$1 (ChangeLogIterator.java:122)
    at liquibase.Scope.lambda$child$0 (Scope.java:201)
    at liquibase.Scope.child (Scope.java:210)
    at liquibase.Scope.child (Scope.java:200)
    at liquibase.Scope.child (Scope.java:179)
    at liquibase.Scope.child (Scope.java:267)
    at liquibase.Scope.child (Scope.java:271)
    at liquibase.changelog.ChangeLogIterator.run (ChangeLogIterator.java:91)
    at liquibase.command.core.AbstractUpdateCommandStep.lambda$run$0 (AbstractUpdateCommandStep.java:114)
    at liquibase.Scope.lambda$child$0 (Scope.java:201)
    at liquibase.Scope.child (Scope.java:210)
    at liquibase.Scope.child (Scope.java:200)
    at liquibase.Scope.child (Scope.java:179)
    at liquibase.command.core.AbstractUpdateCommandStep.run (AbstractUpdateCommandStep.java:112)
    at liquibase.command.core.UpdateCommandStep.run (UpdateCommandStep.java:100)
    at com.datical.liquibase.ext.command.ProUpdateCommandStep.run (ProUpdateCommandStep.java:46)
    at liquibase.command.CommandScope.lambda$execute$6 (CommandScope.java:253)
    at liquibase.Scope.child (Scope.java:210)
    at liquibase.Scope.child (Scope.java:186)
    at liquibase.command.CommandScope.execute (CommandScope.java:241)
    at liquibase.Liquibase.lambda$update$0 (Liquibase.java:216)
    at liquibase.Scope.lambda$child$0 (Scope.java:201)
    at liquibase.Scope.child (Scope.java:210)
    at liquibase.Scope.child (Scope.java:200)
    at liquibase.Scope.child (Scope.java:179)
    at liquibase.Liquibase.runInScope (Liquibase.java:1333)
    at liquibase.Liquibase.update (Liquibase.java:205)
    at liquibase.Liquibase.update (Liquibase.java:188)
    at liquibase.Liquibase.update (Liquibase.java:380)
    at org.liquibase.maven.plugins.LiquibaseUpdate.lambda$doUpdate$0 (LiquibaseUpdate.java:35)
    at liquibase.Scope.lambda$child$0 (Scope.java:201)
    at liquibase.Scope.child (Scope.java:210)
    at liquibase.Scope.child (Scope.java:200)
    at liquibase.Scope.child (Scope.java:179)
    at liquibase.Scope.child (Scope.java:267)
    at org.liquibase.maven.plugins.LiquibaseUpdate.doUpdate (LiquibaseUpdate.java:31)
    at org.liquibase.maven.plugins.AbstractLiquibaseUpdateMojo.performLiquibaseTask (AbstractLiquibaseUpdateMojo.java:62)
    at org.liquibase.maven.plugins.AbstractLiquibaseMojo.lambda$execute$1 (AbstractLiquibaseMojo.java:1056)
    at liquibase.Scope.lambda$child$0 (Scope.java:201)
    at liquibase.Scope.child (Scope.java:210)
    at liquibase.Scope.child (Scope.java:200)
    at liquibase.Scope.child (Scope.java:179)
    at org.liquibase.maven.plugins.AbstractLiquibaseMojo.lambda$execute$2 (AbstractLiquibaseMojo.java:1056)
    at liquibase.Scope.lambda$child$0 (Scope.java:201)
    at liquibase.Scope.child (Scope.java:210)
    at liquibase.Scope.child (Scope.java:200)
    at liquibase.Scope.child (Scope.java:179)
    at org.liquibase.maven.plugins.AbstractLiquibaseMojo.lambda$execute$3 (AbstractLiquibaseMojo.java:961)
    at liquibase.Scope.lambda$child$0 (Scope.java:201)
    at liquibase.Scope.child (Scope.java:210)
    at liquibase.Scope.child (Scope.java:200)
    at liquibase.Scope.child (Scope.java:179)
    at org.liquibase.maven.plugins.AbstractLiquibaseMojo.execute (AbstractLiquibaseMojo.java:892)
    at org.apache.maven.plugin.DefaultBuildPluginManager.executeMojo (DefaultBuildPluginManager.java:126)
    at org.apache.maven.lifecycle.internal.MojoExecutor.doExecute2 (MojoExecutor.java:328)
    at org.apache.maven.lifecycle.internal.MojoExecutor.doExecute (MojoExecutor.java:316)
    at org.apache.maven.lifecycle.internal.MojoExecutor.execute (MojoExecutor.java:212)
    at org.apache.maven.lifecycle.internal.MojoExecutor.execute (MojoExecutor.java:174)
    at org.apache.maven.lifecycle.internal.MojoExecutor.access$000 (MojoExecutor.java:75)
    at org.apache.maven.lifecycle.internal.MojoExecutor$1.run (MojoExecutor.java:162)
    at org.apache.maven.plugin.DefaultMojosExecutionStrategy.execute (DefaultMojosExecutionStrategy.java:39)
    at org.apache.maven.lifecycle.internal.MojoExecutor.execute (MojoExecutor.java:159)
    at org.apache.maven.lifecycle.internal.LifecycleModuleBuilder.buildProject (LifecycleModuleBuilder.java:105)
    at org.apache.maven.lifecycle.internal.LifecycleModuleBuilder.buildProject (LifecycleModuleBuilder.java:73)
    at org.apache.maven.lifecycle.internal.builder.singlethreaded.SingleThreadedBuilder.build (SingleThreadedBuilder.java:53)
    at org.apache.maven.lifecycle.internal.LifecycleStarter.execute (LifecycleStarter.java:118)
    at org.apache.maven.DefaultMaven.doExecute (DefaultMaven.java:261)
    at org.apache.maven.DefaultMaven.doExecute (DefaultMaven.java:173)
    at org.apache.maven.DefaultMaven.execute (DefaultMaven.java:101)
    at org.apache.maven.cli.MavenCli.execute (MavenCli.java:906)
    at org.apache.maven.cli.MavenCli.doMain (MavenCli.java:283)
    at org.apache.maven.cli.MavenCli.main (MavenCli.java:206)
    at jdk.internal.reflect.DirectMethodHandleAccessor.invoke (DirectMethodHandleAccessor.java:103)
    at java.lang.reflect.Method.invoke (Method.java:580)
    at org.codehaus.plexus.classworlds.launcher.Launcher.launchEnhanced (Launcher.java:255)
    at org.codehaus.plexus.classworlds.launcher.Launcher.launch (Launcher.java:201)
    at org.codehaus.plexus.classworlds.launcher.Launcher.mainWithExitCode (Launcher.java:361)
    at org.codehaus.plexus.classworlds.launcher.Launcher.main (Launcher.java:314)
Caused by: org.postgresql.util.PSQLException: ERROR: relation "idx_users_username" already exists
    at org.postgresql.core.v3.QueryExecutorImpl.receiveErrorResponse (QueryExecutorImpl.java:2733)
    at org.postgresql.core.v3.QueryExecutorImpl.processResults (QueryExecutorImpl.java:2420)
    at org.postgresql.core.v3.QueryExecutorImpl.execute (QueryExecutorImpl.java:372)
    at org.postgresql.jdbc.PgStatement.executeInternal (PgStatement.java:517)
    at org.postgresql.jdbc.PgStatement.execute (PgStatement.java:434)
    at org.postgresql.jdbc.PgStatement.executeWithFlags (PgStatement.java:356)
    at org.postgresql.jdbc.PgStatement.executeCachedSql (PgStatement.java:341)
    at org.postgresql.jdbc.PgStatement.executeWithFlags (PgStatement.java:317)
    at org.postgresql.jdbc.PgStatement.execute (PgStatement.java:312)
    at liquibase.executor.jvm.JdbcExecutor$ExecuteStatementCallback.doInStatement (JdbcExecutor.java:491)
    at liquibase.executor.jvm.JdbcExecutor.execute (JdbcExecutor.java:83)
    at liquibase.executor.jvm.JdbcExecutor.execute (JdbcExecutor.java:185)
    at liquibase.executor.AbstractExecutor.execute (AbstractExecutor.java:141)
    at liquibase.database.AbstractJdbcDatabase.executeStatements (AbstractJdbcDatabase.java:1189)
    at liquibase.changelog.ChangeSet.execute (ChangeSet.java:790)
    at liquibase.changelog.visitor.UpdateVisitor.executeAcceptedChange (UpdateVisitor.java:126)
    at liquibase.changelog.visitor.UpdateVisitor.visit (UpdateVisitor.java:70)
    at liquibase.changelog.ChangeLogIterator.lambda$run$0 (ChangeLogIterator.java:133)
    at liquibase.Scope.lambda$child$0 (Scope.java:201)
    at liquibase.Scope.child (Scope.java:210)
    at liquibase.Scope.child (Scope.java:200)
    at liquibase.Scope.child (Scope.java:179)
    at liquibase.changelog.ChangeLogIterator.lambda$run$1 (ChangeLogIterator.java:122)
    at liquibase.Scope.lambda$child$0 (Scope.java:201)
    at liquibase.Scope.child (Scope.java:210)
    at liquibase.Scope.child (Scope.java:200)
    at liquibase.Scope.child (Scope.java:179)
    at liquibase.Scope.child (Scope.java:267)
    at liquibase.Scope.child (Scope.java:271)
    at liquibase.changelog.ChangeLogIterator.run (ChangeLogIterator.java:91)
    at liquibase.command.core.AbstractUpdateCommandStep.lambda$run$0 (AbstractUpdateCommandStep.java:114)
    at liquibase.Scope.lambda$child$0 (Scope.java:201)
    at liquibase.Scope.child (Scope.java:210)
    at liquibase.Scope.child (Scope.java:200)
    at liquibase.Scope.child (Scope.java:179)
    at liquibase.command.core.AbstractUpdateCommandStep.run (AbstractUpdateCommandStep.java:112)
    at liquibase.command.core.UpdateCommandStep.run (UpdateCommandStep.java:100)
    at com.datical.liquibase.ext.command.ProUpdateCommandStep.run (ProUpdateCommandStep.java:46)
    at liquibase.command.CommandScope.lambda$execute$6 (CommandScope.java:253)
    at liquibase.Scope.child (Scope.java:210)
    at liquibase.Scope.child (Scope.java:186)
    at liquibase.command.CommandScope.execute (CommandScope.java:241)
    at liquibase.Liquibase.lambda$update$0 (Liquibase.java:216)
    at liquibase.Scope.lambda$child$0 (Scope.java:201)
    at liquibase.Scope.child (Scope.java:210)
    at liquibase.Scope.child (Scope.java:200)
    at liquibase.Scope.child (Scope.java:179)
    at liquibase.Liquibase.runInScope (Liquibase.java:1333)
    at liquibase.Liquibase.update (Liquibase.java:205)
    at liquibase.Liquibase.update (Liquibase.java:188)
    at liquibase.Liquibase.update (Liquibase.java:380)
    at org.liquibase.maven.plugins.LiquibaseUpdate.lambda$doUpdate$0 (LiquibaseUpdate.java:35)
    at liquibase.Scope.lambda$child$0 (Scope.java:201)
    at liquibase.Scope.child (Scope.java:210)
    at liquibase.Scope.child (Scope.java:200)
    at liquibase.Scope.child (Scope.java:179)
    at liquibase.Scope.child (Scope.java:267)
    at org.liquibase.maven.plugins.LiquibaseUpdate.doUpdate (LiquibaseUpdate.java:31)
    at org.liquibase.maven.plugins.AbstractLiquibaseUpdateMojo.performLiquibaseTask (AbstractLiquibaseUpdateMojo.java:62)
    at org.liquibase.maven.plugins.AbstractLiquibaseMojo.lambda$execute$1 (AbstractLiquibaseMojo.java:1056)
    at liquibase.Scope.lambda$child$0 (Scope.java:201)
    at liquibase.Scope.child (Scope.java:210)
    at liquibase.Scope.child (Scope.java:200)
    at liquibase.Scope.child (Scope.java:179)
    at org.liquibase.maven.plugins.AbstractLiquibaseMojo.lambda$execute$2 (AbstractLiquibaseMojo.java:1056)
    at liquibase.Scope.lambda$child$0 (Scope.java:201)
    at liquibase.Scope.child (Scope.java:210)
    at liquibase.Scope.child (Scope.java:200)
    at liquibase.Scope.child (Scope.java:179)
    at org.liquibase.maven.plugins.AbstractLiquibaseMojo.lambda$execute$3 (AbstractLiquibaseMojo.java:961)
    at liquibase.Scope.lambda$child$0 (Scope.java:201)
    at liquibase.Scope.child (Scope.java:210)
    at liquibase.Scope.child (Scope.java:200)
    at liquibase.Scope.child (Scope.java:179)
    at org.liquibase.maven.plugins.AbstractLiquibaseMojo.execute (AbstractLiquibaseMojo.java:892)
    at org.apache.maven.plugin.DefaultBuildPluginManager.executeMojo (DefaultBuildPluginManager.java:126)
    at org.apache.maven.lifecycle.internal.MojoExecutor.doExecute2 (MojoExecutor.java:328)
    at org.apache.maven.lifecycle.internal.MojoExecutor.doExecute (MojoExecutor.java:316)
    at org.apache.maven.lifecycle.internal.MojoExecutor.execute (MojoExecutor.java:212)
    at org.apache.maven.lifecycle.internal.MojoExecutor.execute (MojoExecutor.java:174)
    at org.apache.maven.lifecycle.internal.MojoExecutor.access$000 (MojoExecutor.java:75)
    at org.apache.maven.lifecycle.internal.MojoExecutor$1.run (MojoExecutor.java:162)
    at org.apache.maven.plugin.DefaultMojosExecutionStrategy.execute (DefaultMojosExecutionStrategy.java:39)
    at org.apache.maven.lifecycle.internal.MojoExecutor.execute (MojoExecutor.java:159)
    at org.apache.maven.lifecycle.internal.LifecycleModuleBuilder.buildProject (LifecycleModuleBuilder.java:105)
    at org.apache.maven.lifecycle.internal.LifecycleModuleBuilder.buildProject (LifecycleModuleBuilder.java:73)
    at org.apache.maven.lifecycle.internal.builder.singlethreaded.SingleThreadedBuilder.build (SingleThreadedBuilder.java:53)
    at org.apache.maven.lifecycle.internal.LifecycleStarter.execute (LifecycleStarter.java:118)
    at org.apache.maven.DefaultMaven.doExecute (DefaultMaven.java:261)
    at org.apache.maven.DefaultMaven.doExecute (DefaultMaven.java:173)
    at org.apache.maven.DefaultMaven.execute (DefaultMaven.java:101)
    at org.apache.maven.cli.MavenCli.execute (MavenCli.java:906)
    at org.apache.maven.cli.MavenCli.doMain (MavenCli.java:283)
    at org.apache.maven.cli.MavenCli.main (MavenCli.java:206)
    at jdk.internal.reflect.DirectMethodHandleAccessor.invoke (DirectMethodHandleAccessor.java:103)
    at java.lang.reflect.Method.invoke (Method.java:580)
    at org.codehaus.plexus.classworlds.launcher.Launcher.launchEnhanced (Launcher.java:255)
    at org.codehaus.plexus.classworlds.launcher.Launcher.launch (Launcher.java:201)
    at org.codehaus.plexus.classworlds.launcher.Launcher.mainWithExitCode (Launcher.java:361)
    at org.codehaus.plexus.classworlds.launcher.Launcher.main (Launcher.java:314)

UPDATE SUMMARY
Run:                          1
Previously run:               0
Filtered out:                 0
-------------------------------
Total change sets:           20

[INFO] UPDATE SUMMARY
[INFO] Run:                          1
[INFO] Previously run:               0
[INFO] Filtered out:                 0
[INFO] -------------------------------
[INFO] Total change sets:           20
[INFO] Update summary generated
[INFO] Update command encountered an exception.
[INFO] Successfully released change log lock
[WARNING] Potentially ignored key(s) in property file src/main/resources/liquibase.properties
 - 'changeLogFile'
[INFO] Logging exception.
[INFO] ERROR: Exception Details
[INFO] ERROR: Exception Primary Class:  PSQLException
[INFO] ERROR: Exception Primary Reason:  ERROR: relation "idx_users_username" already exists
[INFO] ERROR: Exception Primary Source:  PostgreSQL 17.5 (Debian 17.5-1.pgdg120+1)
[INFO] Command execution complete
[INFO] Logging exception.
[INFO] ERROR: Exception Details
[INFO] ERROR: Exception Primary Class:  PSQLException
[INFO] ERROR: Exception Primary Reason:  ERROR: relation "idx_users_username" already exists
[INFO] ERROR: Exception Primary Source:  PostgreSQL 17.5 (Debian 17.5-1.pgdg120+1)
[INFO] Command execution complete
[WARNING] Potentially ignored key(s) in property file src/main/resources/liquibase.properties
 - 'changeLogFile'
[INFO] Logging exception.
[INFO] ERROR: Exception Details
[INFO] ERROR: Exception Primary Class:  PSQLException
[INFO] ERROR: Exception Primary Reason:  ERROR: relation "idx_users_username" already exists
[INFO] ERROR: Exception Primary Source:  PostgreSQL 17.5 (Debian 17.5-1.pgdg120+1)
[INFO] Command execution complete
[INFO] ------------------------------------------------------------------------
[INFO] BUILD FAILURE
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  3.513 s
[INFO] Finished at: 2025-05-18T10:14:06Z
[INFO] ------------------------------------------------------------------------
[ERROR] Failed to execute goal org.liquibase:liquibase-maven-plugin:4.31.1:update (default-cli) on project aksi-backend: 
[ERROR] Error setting up or running Liquibase:
[ERROR] liquibase.exception.LiquibaseException: liquibase.exception.MigrationFailedException: Migration failed for changeset src/main/resources/db/changelog/domains/users/1.0/002-create-users-indexes.yaml::users-1.0-002::fedotiuk-dm:
[ERROR]      Reason: liquibase.exception.DatabaseException: ERROR: relation "idx_users_username" already exists [Failed SQL: (0) CREATE INDEX idx_users_username ON users(username)]
[ERROR] -> [Help 1]
[ERROR] 
[ERROR] To see the full stack trace of the errors, re-run Maven with the -e switch.
[ERROR] Re-run Maven using the -X switch to enable full debug logging.
[ERROR] 
[ERROR] For more information about the errors and possible solutions, please read the following articles:
[ERROR] [Help 1] http://cwiki.apache.org/confluence/display/MAVEN/MojoExecutionException

