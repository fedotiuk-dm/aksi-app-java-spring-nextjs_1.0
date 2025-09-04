/usr/lib/jvm/default/bin/java -javaagent:/home/iddqd/.local/share/JetBrains/Toolbox/apps/intellij-idea-ultimate/plugins/java/lib/rt/debugger-agent.jar=file:///tmp/capture2715649155576837517.props -ea -Didea.test.cyclic.buffer.size=1048576 -javaagent:/home/iddqd/.local/share/JetBrains/Toolbox/apps/intellij-idea-ultimate/lib/idea_rt.jar=34061 -Dkotlinx.coroutines.debug.enable.creation.stack.trace=false -Ddebugger.agent.enable.coroutines=true -Dkotlinx.coroutines.debug.enable.flows.stack.trace=true -Dkotlinx.coroutines.debug.enable.mutable.state.flows.stack.trace=true -Dfile.encoding=UTF-8 -Dsun.stdout.encoding=UTF-8 -Dsun.stderr.encoding=UTF-8 -classpath /home/iddqd/.m2/repository/org/junit/platform/junit-platform-launcher/1.12.2/junit-platform-launcher-1.12.2.jar:/home/iddqd/.m2/repository/org/junit/vintage/junit-vintage-engine/5.12.2/junit-vintage-engine-5.12.2.jar:/home/iddqd/.local/share/JetBrains/Toolbox/apps/intellij-idea-ultimate/lib/idea_rt.jar:/home/iddqd/.local/share/JetBrains/Toolbox/apps/intellij-idea-ultimate/plugins/junit/lib/junit5-rt.jar:/home/iddqd/.local/share/JetBrains/Toolbox/apps/intellij-idea-ultimate/plugins/junit/lib/junit-rt.jar:/home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/test-classes:/home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/classes:/home/iddqd/.m2/repository/org/apache/commons/commons-lang3/3.18.0/commons-lang3-3.18.0.jar:/home/iddqd/.m2/repository/org/apache/commons/commons-compress/1.28.0/commons-compress-1.28.0.jar:/home/iddqd/.m2/repository/commons-codec/commons-codec/1.18.0/commons-codec-1.18.0.jar:/home/iddqd/.m2/repository/commons-io/commons-io/2.20.0/commons-io-2.20.0.jar:/home/iddqd/.m2/repository/org/apache/pdfbox/pdfbox/3.0.5/pdfbox-3.0.5.jar:/home/iddqd/.m2/repository/org/apache/pdfbox/pdfbox-io/3.0.5/pdfbox-io-3.0.5.jar:/home/iddqd/.m2/repository/org/apache/pdfbox/fontbox/3.0.5/fontbox-3.0.5.jar:/home/iddqd/.m2/repository/org/springframework/boot/spring-boot-starter-web/3.5.5/spring-boot-starter-web-3.5.5.jar:/home/iddqd/.m2/repository/org/springframework/boot/spring-boot-starter/3.5.5/spring-boot-starter-3.5.5.jar:/home/iddqd/.m2/repository/org/springframework/boot/spring-boot-starter-logging/3.5.5/spring-boot-starter-logging-3.5.5.jar:/home/iddqd/.m2/repository/ch/qos/logback/logback-classic/1.5.18/logback-classic-1.5.18.jar:/home/iddqd/.m2/repository/ch/qos/logback/logback-core/1.5.18/logback-core-1.5.18.jar:/home/iddqd/.m2/repository/org/apache/logging/log4j/log4j-to-slf4j/2.24.3/log4j-to-slf4j-2.24.3.jar:/home/iddqd/.m2/repository/org/apache/logging/log4j/log4j-api/2.24.3/log4j-api-2.24.3.jar:/home/iddqd/.m2/repository/org/slf4j/jul-to-slf4j/2.0.17/jul-to-slf4j-2.0.17.jar:/home/iddqd/.m2/repository/jakarta/annotation/jakarta.annotation-api/2.1.1/jakarta.annotation-api-2.1.1.jar:/home/iddqd/.m2/repository/org/springframework/boot/spring-boot-starter-json/3.5.5/spring-boot-starter-json-3.5.5.jar:/home/iddqd/.m2/repository/com/fasterxml/jackson/datatype/jackson-datatype-jdk8/2.19.2/jackson-datatype-jdk8-2.19.2.jar:/home/iddqd/.m2/repository/com/fasterxml/jackson/datatype/jackson-datatype-jsr310/2.19.2/jackson-datatype-jsr310-2.19.2.jar:/home/iddqd/.m2/repository/com/fasterxml/jackson/module/jackson-module-parameter-names/2.19.2/jackson-module-parameter-names-2.19.2.jar:/home/iddqd/.m2/repository/org/springframework/boot/spring-boot-starter-tomcat/3.5.5/spring-boot-starter-tomcat-3.5.5.jar:/home/iddqd/.m2/repository/org/apache/tomcat/embed/tomcat-embed-core/10.1.44/tomcat-embed-core-10.1.44.jar:/home/iddqd/.m2/repository/org/apache/tomcat/embed/tomcat-embed-websocket/10.1.44/tomcat-embed-websocket-10.1.44.jar:/home/iddqd/.m2/repository/org/springframework/spring-web/6.2.10/spring-web-6.2.10.jar:/home/iddqd/.m2/repository/org/springframework/spring-beans/6.2.10/spring-beans-6.2.10.jar:/home/iddqd/.m2/repository/org/springframework/spring-webmvc/6.2.10/spring-webmvc-6.2.10.jar:/home/iddqd/.m2/repository/org/springframework/spring-context/6.2.10/spring-context-6.2.10.jar:/home/iddqd/.m2/repository/org/springframework/spring-expression/6.2.10/spring-expression-6.2.10.jar:/home/iddqd/.m2/repository/org/springframework/boot/spring-boot-starter-data-jpa/3.5.5/spring-boot-starter-data-jpa-3.5.5.jar:/home/iddqd/.m2/repository/org/springframework/boot/spring-boot-starter-jdbc/3.5.5/spring-boot-starter-jdbc-3.5.5.jar:/home/iddqd/.m2/repository/com/zaxxer/HikariCP/6.3.2/HikariCP-6.3.2.jar:/home/iddqd/.m2/repository/org/springframework/spring-jdbc/6.2.10/spring-jdbc-6.2.10.jar:/home/iddqd/.m2/repository/org/hibernate/orm/hibernate-core/6.6.26.Final/hibernate-core-6.6.26.Final.jar:/home/iddqd/.m2/repository/jakarta/persistence/jakarta.persistence-api/3.1.0/jakarta.persistence-api-3.1.0.jar:/home/iddqd/.m2/repository/jakarta/transaction/jakarta.transaction-api/2.0.1/jakarta.transaction-api-2.0.1.jar:/home/iddqd/.m2/repository/org/jboss/logging/jboss-logging/3.6.1.Final/jboss-logging-3.6.1.Final.jar:/home/iddqd/.m2/repository/org/hibernate/common/hibernate-commons-annotations/7.0.3.Final/hibernate-commons-annotations-7.0.3.Final.jar:/home/iddqd/.m2/repository/io/smallrye/jandex/3.2.0/jandex-3.2.0.jar:/home/iddqd/.m2/repository/com/fasterxml/classmate/1.7.0/classmate-1.7.0.jar:/home/iddqd/.m2/repository/net/bytebuddy/byte-buddy/1.17.7/byte-buddy-1.17.7.jar:/home/iddqd/.m2/repository/org/glassfish/jaxb/jaxb-runtime/4.0.5/jaxb-runtime-4.0.5.jar:/home/iddqd/.m2/repository/org/glassfish/jaxb/jaxb-core/4.0.5/jaxb-core-4.0.5.jar:/home/iddqd/.m2/repository/org/eclipse/angus/angus-activation/2.0.2/angus-activation-2.0.2.jar:/home/iddqd/.m2/repository/org/glassfish/jaxb/txw2/4.0.5/txw2-4.0.5.jar:/home/iddqd/.m2/repository/com/sun/istack/istack-commons-runtime/4.1.2/istack-commons-runtime-4.1.2.jar:/home/iddqd/.m2/repository/jakarta/inject/jakarta.inject-api/2.0.1/jakarta.inject-api-2.0.1.jar:/home/iddqd/.m2/repository/org/antlr/antlr4-runtime/4.13.0/antlr4-runtime-4.13.0.jar:/home/iddqd/.m2/repository/org/springframework/data/spring-data-jpa/3.5.3/spring-data-jpa-3.5.3.jar:/home/iddqd/.m2/repository/org/springframework/data/spring-data-commons/3.5.3/spring-data-commons-3.5.3.jar:/home/iddqd/.m2/repository/org/springframework/spring-orm/6.2.10/spring-orm-6.2.10.jar:/home/iddqd/.m2/repository/org/springframework/spring-tx/6.2.10/spring-tx-6.2.10.jar:/home/iddqd/.m2/repository/org/slf4j/slf4j-api/2.0.17/slf4j-api-2.0.17.jar:/home/iddqd/.m2/repository/org/springframework/spring-aspects/6.2.10/spring-aspects-6.2.10.jar:/home/iddqd/.m2/repository/org/aspectj/aspectjweaver/1.9.24/aspectjweaver-1.9.24.jar:/home/iddqd/.m2/repository/org/springframework/boot/spring-boot-starter-validation/3.5.5/spring-boot-starter-validation-3.5.5.jar:/home/iddqd/.m2/repository/org/apache/tomcat/embed/tomcat-embed-el/10.1.44/tomcat-embed-el-10.1.44.jar:/home/iddqd/.m2/repository/org/hibernate/validator/hibernate-validator/8.0.3.Final/hibernate-validator-8.0.3.Final.jar:/home/iddqd/.m2/repository/jakarta/validation/jakarta.validation-api/3.0.2/jakarta.validation-api-3.0.2.jar:/home/iddqd/.m2/repository/org/springframework/boot/spring-boot-starter-security/3.5.5/spring-boot-starter-security-3.5.5.jar:/home/iddqd/.m2/repository/org/springframework/spring-aop/6.2.10/spring-aop-6.2.10.jar:/home/iddqd/.m2/repository/org/springframework/security/spring-security-config/6.5.3/spring-security-config-6.5.3.jar:/home/iddqd/.m2/repository/org/springframework/security/spring-security-web/6.5.3/spring-security-web-6.5.3.jar:/home/iddqd/.m2/repository/org/springframework/boot/spring-boot-starter-data-redis/3.5.5/spring-boot-starter-data-redis-3.5.5.jar:/home/iddqd/.m2/repository/io/lettuce/lettuce-core/6.6.0.RELEASE/lettuce-core-6.6.0.RELEASE.jar:/home/iddqd/.m2/repository/redis/clients/authentication/redis-authx-core/0.1.1-beta2/redis-authx-core-0.1.1-beta2.jar:/home/iddqd/.m2/repository/io/netty/netty-common/4.1.124.Final/netty-common-4.1.124.Final.jar:/home/iddqd/.m2/repository/io/netty/netty-handler/4.1.124.Final/netty-handler-4.1.124.Final.jar:/home/iddqd/.m2/repository/io/netty/netty-resolver/4.1.124.Final/netty-resolver-4.1.124.Final.jar:/home/iddqd/.m2/repository/io/netty/netty-buffer/4.1.124.Final/netty-buffer-4.1.124.Final.jar:/home/iddqd/.m2/repository/io/netty/netty-transport-native-unix-common/4.1.124.Final/netty-transport-native-unix-common-4.1.124.Final.jar:/home/iddqd/.m2/repository/io/netty/netty-codec/4.1.124.Final/netty-codec-4.1.124.Final.jar:/home/iddqd/.m2/repository/io/netty/netty-transport/4.1.124.Final/netty-transport-4.1.124.Final.jar:/home/iddqd/.m2/repository/io/projectreactor/reactor-core/3.7.9/reactor-core-3.7.9.jar:/home/iddqd/.m2/repository/org/reactivestreams/reactive-streams/1.0.4/reactive-streams-1.0.4.jar:/home/iddqd/.m2/repository/org/springframework/data/spring-data-redis/3.5.3/spring-data-redis-3.5.3.jar:/home/iddqd/.m2/repository/org/springframework/data/spring-data-keyvalue/3.5.3/spring-data-keyvalue-3.5.3.jar:/home/iddqd/.m2/repository/org/springframework/spring-oxm/6.2.10/spring-oxm-6.2.10.jar:/home/iddqd/.m2/repository/org/springframework/spring-context-support/6.2.10/spring-context-support-6.2.10.jar:/home/iddqd/.m2/repository/org/springframework/session/spring-session-data-redis/3.5.2/spring-session-data-redis-3.5.2.jar:/home/iddqd/.m2/repository/org/springframework/session/spring-session-core/3.5.2/spring-session-core-3.5.2.jar:/home/iddqd/.m2/repository/org/springframework/spring-jcl/6.2.10/spring-jcl-6.2.10.jar:/home/iddqd/.m2/repository/org/springframework/boot/spring-boot-starter-actuator/3.5.5/spring-boot-starter-actuator-3.5.5.jar:/home/iddqd/.m2/repository/org/springframework/boot/spring-boot-actuator-autoconfigure/3.5.5/spring-boot-actuator-autoconfigure-3.5.5.jar:/home/iddqd/.m2/repository/org/springframework/boot/spring-boot-actuator/3.5.5/spring-boot-actuator-3.5.5.jar:/home/iddqd/.m2/repository/io/micrometer/micrometer-observation/1.15.3/micrometer-observation-1.15.3.jar:/home/iddqd/.m2/repository/io/micrometer/micrometer-commons/1.15.3/micrometer-commons-1.15.3.jar:/home/iddqd/.m2/repository/io/micrometer/micrometer-jakarta9/1.15.3/micrometer-jakarta9-1.15.3.jar:/home/iddqd/.m2/repository/io/micrometer/micrometer-core/1.15.3/micrometer-core-1.15.3.jar:/home/iddqd/.m2/repository/org/hdrhistogram/HdrHistogram/2.2.2/HdrHistogram-2.2.2.jar:/home/iddqd/.m2/repository/org/latencyutils/LatencyUtils/2.0.3/LatencyUtils-2.0.3.jar:/home/iddqd/.m2/repository/org/postgresql/postgresql/42.7.7/postgresql-42.7.7.jar:/home/iddqd/.m2/repository/org/checkerframework/checker-qual/3.49.3/checker-qual-3.49.3.jar:/home/iddqd/.m2/repository/org/liquibase/liquibase-core/4.33.0/liquibase-core-4.33.0.jar:/home/iddqd/.m2/repository/com/opencsv/opencsv/5.11.2/opencsv-5.11.2.jar:/home/iddqd/.m2/repository/org/yaml/snakeyaml/2.5/snakeyaml-2.5.jar:/home/iddqd/.m2/repository/javax/xml/bind/jaxb-api/2.3.1/jaxb-api-2.3.1.jar:/home/iddqd/.m2/repository/org/apache/commons/commons-collections4/4.5.0/commons-collections4-4.5.0.jar:/home/iddqd/.m2/repository/org/apache/commons/commons-text/1.13.1/commons-text-1.13.1.jar:/home/iddqd/.m2/repository/org/mapstruct/mapstruct/1.6.3/mapstruct-1.6.3.jar:/home/iddqd/.m2/repository/org/mapstruct/mapstruct-processor/1.6.3/mapstruct-processor-1.6.3.jar:/home/iddqd/.m2/repository/org/projectlombok/lombok/1.18.38/lombok-1.18.38.jar:/home/iddqd/.m2/repository/com/itextpdf/itextpdf/5.5.13.4/itextpdf-5.5.13.4.jar:/home/iddqd/.m2/repository/com/google/zxing/core/3.5.3/core-3.5.3.jar:/home/iddqd/.m2/repository/com/google/zxing/javase/3.5.3/javase-3.5.3.jar:/home/iddqd/.m2/repository/com/beust/jcommander/1.82/jcommander-1.82.jar:/home/iddqd/.m2/repository/com/github/jai-imageio/jai-imageio-core/1.4.0/jai-imageio-core-1.4.0.jar:/home/iddqd/.m2/repository/org/springdoc/springdoc-openapi-starter-webmvc-ui/2.8.12/springdoc-openapi-starter-webmvc-ui-2.8.12.jar:/home/iddqd/.m2/repository/org/springdoc/springdoc-openapi-starter-webmvc-api/2.8.12/springdoc-openapi-starter-webmvc-api-2.8.12.jar:/home/iddqd/.m2/repository/org/springdoc/springdoc-openapi-starter-common/2.8.12/springdoc-openapi-starter-common-2.8.12.jar:/home/iddqd/.m2/repository/io/swagger/core/v3/swagger-core-jakarta/2.2.36/swagger-core-jakarta-2.2.36.jar:/home/iddqd/.m2/repository/io/swagger/core/v3/swagger-annotations-jakarta/2.2.36/swagger-annotations-jakarta-2.2.36.jar:/home/iddqd/.m2/repository/io/swagger/core/v3/swagger-models-jakarta/2.2.36/swagger-models-jakarta-2.2.36.jar:/home/iddqd/.m2/repository/com/fasterxml/jackson/dataformat/jackson-dataformat-yaml/2.19.2/jackson-dataformat-yaml-2.19.2.jar:/home/iddqd/.m2/repository/org/webjars/swagger-ui/5.28.0/swagger-ui-5.28.0.jar:/home/iddqd/.m2/repository/org/webjars/webjars-locator-lite/1.1.0/webjars-locator-lite-1.1.0.jar:/home/iddqd/.m2/repository/org/jspecify/jspecify/1.0.0/jspecify-1.0.0.jar:/home/iddqd/.m2/repository/org/openapitools/jackson-databind-nullable/0.2.7/jackson-databind-nullable-0.2.7.jar:/home/iddqd/.m2/repository/com/fasterxml/jackson/core/jackson-databind/2.19.2/jackson-databind-2.19.2.jar:/home/iddqd/.m2/repository/com/fasterxml/jackson/core/jackson-annotations/2.19.2/jackson-annotations-2.19.2.jar:/home/iddqd/.m2/repository/com/fasterxml/jackson/core/jackson-core/2.19.2/jackson-core-2.19.2.jar:/home/iddqd/.m2/repository/org/apache/commons/commons-jexl3/3.5.0/commons-jexl3-3.5.0.jar:/home/iddqd/.m2/repository/org/springframework/boot/spring-boot-starter-test/3.5.5/spring-boot-starter-test-3.5.5.jar:/home/iddqd/.m2/repository/org/springframework/boot/spring-boot-test/3.5.5/spring-boot-test-3.5.5.jar:/home/iddqd/.m2/repository/org/springframework/boot/spring-boot-test-autoconfigure/3.5.5/spring-boot-test-autoconfigure-3.5.5.jar:/home/iddqd/.m2/repository/com/jayway/jsonpath/json-path/2.9.0/json-path-2.9.0.jar:/home/iddqd/.m2/repository/jakarta/xml/bind/jakarta.xml.bind-api/4.0.2/jakarta.xml.bind-api-4.0.2.jar:/home/iddqd/.m2/repository/jakarta/activation/jakarta.activation-api/2.1.3/jakarta.activation-api-2.1.3.jar:/home/iddqd/.m2/repository/net/minidev/json-smart/2.5.2/json-smart-2.5.2.jar:/home/iddqd/.m2/repository/net/minidev/accessors-smart/2.5.2/accessors-smart-2.5.2.jar:/home/iddqd/.m2/repository/org/ow2/asm/asm/9.7.1/asm-9.7.1.jar:/home/iddqd/.m2/repository/org/assertj/assertj-core/3.27.4/assertj-core-3.27.4.jar:/home/iddqd/.m2/repository/org/awaitility/awaitility/4.2.2/awaitility-4.2.2.jar:/home/iddqd/.m2/repository/org/hamcrest/hamcrest/3.0/hamcrest-3.0.jar:/home/iddqd/.m2/repository/org/junit/jupiter/junit-jupiter/5.12.2/junit-jupiter-5.12.2.jar:/home/iddqd/.m2/repository/org/junit/jupiter/junit-jupiter-api/5.12.2/junit-jupiter-api-5.12.2.jar:/home/iddqd/.m2/repository/org/opentest4j/opentest4j/1.3.0/opentest4j-1.3.0.jar:/home/iddqd/.m2/repository/org/junit/platform/junit-platform-commons/1.12.2/junit-platform-commons-1.12.2.jar:/home/iddqd/.m2/repository/org/apiguardian/apiguardian-api/1.1.2/apiguardian-api-1.1.2.jar:/home/iddqd/.m2/repository/org/junit/jupiter/junit-jupiter-params/5.12.2/junit-jupiter-params-5.12.2.jar:/home/iddqd/.m2/repository/org/junit/jupiter/junit-jupiter-engine/5.12.2/junit-jupiter-engine-5.12.2.jar:/home/iddqd/.m2/repository/org/junit/platform/junit-platform-engine/1.12.2/junit-platform-engine-1.12.2.jar:/home/iddqd/.m2/repository/org/mockito/mockito-core/5.17.0/mockito-core-5.17.0.jar:/home/iddqd/.m2/repository/net/bytebuddy/byte-buddy-agent/1.17.7/byte-buddy-agent-1.17.7.jar:/home/iddqd/.m2/repository/org/objenesis/objenesis/3.3/objenesis-3.3.jar:/home/iddqd/.m2/repository/org/mockito/mockito-junit-jupiter/5.17.0/mockito-junit-jupiter-5.17.0.jar:/home/iddqd/.m2/repository/org/skyscreamer/jsonassert/1.5.3/jsonassert-1.5.3.jar:/home/iddqd/.m2/repository/com/vaadin/external/google/android-json/0.0.20131108.vaadin1/android-json-0.0.20131108.vaadin1.jar:/home/iddqd/.m2/repository/org/springframework/spring-core/6.2.10/spring-core-6.2.10.jar:/home/iddqd/.m2/repository/org/springframework/spring-test/6.2.10/spring-test-6.2.10.jar:/home/iddqd/.m2/repository/org/xmlunit/xmlunit-core/2.10.3/xmlunit-core-2.10.3.jar:/home/iddqd/.m2/repository/org/springframework/security/spring-security-test/6.5.3/spring-security-test-6.5.3.jar:/home/iddqd/.m2/repository/org/springframework/security/spring-security-core/6.5.3/spring-security-core-6.5.3.jar:/home/iddqd/.m2/repository/org/springframework/security/spring-security-crypto/6.5.3/spring-security-crypto-6.5.3.jar:/home/iddqd/.m2/repository/org/testcontainers/junit-jupiter/1.21.3/junit-jupiter-1.21.3.jar:/home/iddqd/.m2/repository/org/testcontainers/testcontainers/1.21.3/testcontainers-1.21.3.jar:/home/iddqd/.m2/repository/junit/junit/4.13.2/junit-4.13.2.jar:/home/iddqd/.m2/repository/org/hamcrest/hamcrest-core/3.0/hamcrest-core-3.0.jar:/home/iddqd/.m2/repository/org/rnorth/duct-tape/duct-tape/1.0.8/duct-tape-1.0.8.jar:/home/iddqd/.m2/repository/org/jetbrains/annotations/17.0.0/annotations-17.0.0.jar:/home/iddqd/.m2/repository/com/github/docker-java/docker-java-api/3.4.2/docker-java-api-3.4.2.jar:/home/iddqd/.m2/repository/com/github/docker-java/docker-java-transport-zerodep/3.4.2/docker-java-transport-zerodep-3.4.2.jar:/home/iddqd/.m2/repository/com/github/docker-java/docker-java-transport/3.4.2/docker-java-transport-3.4.2.jar:/home/iddqd/.m2/repository/net/java/dev/jna/jna/5.13.0/jna-5.13.0.jar:/home/iddqd/.m2/repository/org/testcontainers/postgresql/1.21.3/postgresql-1.21.3.jar:/home/iddqd/.m2/repository/org/testcontainers/jdbc/1.21.3/jdbc-1.21.3.jar:/home/iddqd/.m2/repository/org/testcontainers/database-commons/1.21.3/database-commons-1.21.3.jar:/home/iddqd/.m2/repository/com/h2database/h2/2.3.232/h2-2.3.232.jar:/home/iddqd/.m2/repository/org/springframework/boot/spring-boot-devtools/3.5.5/spring-boot-devtools-3.5.5.jar:/home/iddqd/.m2/repository/org/springframework/boot/spring-boot/3.5.5/spring-boot-3.5.5.jar:/home/iddqd/.m2/repository/org/springframework/boot/spring-boot-autoconfigure/3.5.5/spring-boot-autoconfigure-3.5.5.jar com.intellij.rt.junit.JUnitStarter -ideVersion5 -junit5 com.aksi.integration.CalculationIntegrationTest
20:20:57.178 [main] INFO org.springframework.test.context.support.AnnotationConfigContextLoaderUtils -- Could not detect default configuration classes for test class [com.aksi.integration.CalculationIntegrationTest]: CalculationIntegrationTest does not declare any static, non-private, non-final, nested classes annotated with @Configuration.
20:20:57.260 [main] INFO org.springframework.boot.test.context.SpringBootTestContextBootstrapper -- Found @SpringBootConfiguration com.aksi.DryCleaningOrderSystemApplication for test class com.aksi.integration.CalculationIntegrationTest
20:20:57.349 [main] INFO org.springframework.boot.devtools.restart.RestartApplicationListener -- Restart disabled due to context in which it is running

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

 :: Spring Boot ::                (v3.5.5)

2025-09-04 20:20:57 - Starting CalculationIntegrationTest using Java 21.0.8 with PID 322955 (started by iddqd in /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend)
2025-09-04 20:20:57 - Running with Spring Boot v3.5.5, Spring v6.2.10
2025-09-04 20:20:57 - The following 1 profile is active: "test"
2025-09-04 20:20:58 - Multiple Spring Data modules found, entering strict repository configuration mode
2025-09-04 20:20:58 - Bootstrapping Spring Data JPA repositories in DEFAULT mode.
2025-09-04 20:20:58 - Finished Spring Data repository scanning in 138 ms. Found 14 JPA repository interfaces.
2025-09-04 20:20:58 - Multiple Spring Data modules found, entering strict repository configuration mode
2025-09-04 20:20:58 - Bootstrapping Spring Data Redis repositories in DEFAULT mode.
2025-09-04 20:20:58 - Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.aksi.repository.BoosterRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2025-09-04 20:20:58 - Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.aksi.repository.BranchRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2025-09-04 20:20:58 - Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.aksi.repository.CartRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2025-09-04 20:20:58 - Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.aksi.repository.CustomerRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2025-09-04 20:20:58 - Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.aksi.repository.DifficultyLevelRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2025-09-04 20:20:58 - Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.aksi.repository.DiscountRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2025-09-04 20:20:58 - Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.aksi.repository.GameModifierRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2025-09-04 20:20:58 - Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.aksi.repository.GameRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2025-09-04 20:20:58 - Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.aksi.repository.OrderRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2025-09-04 20:20:58 - Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.aksi.repository.PriceConfigurationRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2025-09-04 20:20:58 - Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.aksi.repository.PriceListItemRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2025-09-04 20:20:58 - Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.aksi.repository.PriceModifierRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2025-09-04 20:20:58 - Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.aksi.repository.ServiceTypeRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2025-09-04 20:20:58 - Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.aksi.repository.UserRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2025-09-04 20:20:58 - Finished Spring Data repository scanning in 10 ms. Found 0 Redis repository interfaces.
2025-09-04 20:20:59 - Building JPA container EntityManagerFactory for persistence unit 'default'
2025-09-04 20:20:59 - HHH000204: Processing PersistenceUnitInfo [name: default]
2025-09-04 20:20:59 - HHH000412: Hibernate ORM core version 6.6.26.Final
2025-09-04 20:20:59 - HHH000026: Second-level cache disabled
2025-09-04 20:20:59 - No LoadTimeWeaver setup: ignoring JPA class transformer
2025-09-04 20:20:59 - HikariPool-1 - Starting...
2025-09-04 20:20:59 - HikariPool-1 - Added connection conn0: url=jdbc:h2:mem:testdb user=SA
2025-09-04 20:20:59 - HikariPool-1 - Start completed.
2025-09-04 20:20:59 - HHH90000025: H2Dialect does not need to be specified explicitly using 'hibernate.dialect' (remove the property setting and it will be selected by default)
2025-09-04 20:20:59 - HHH10001005: Database info:
	Database JDBC URL [Connecting through datasource 'HikariDataSource (HikariPool-1)']
	Database driver: undefined/unknown
	Database version: 2.3.232
	Autocommit mode: undefined/unknown
	Isolation level: undefined/unknown
	Minimum pool size: undefined/unknown
	Maximum pool size: undefined/unknown
2025-09-04 20:21:00 - HHH000489: No JTA platform available (set 'hibernate.transaction.jta.platform' to enable JTA platform integration)
2025-09-04 20:21:00 - drop table if exists booster_game_specializations cascade
2025-09-04 20:21:00 - drop table if exists boosters cascade
2025-09-04 20:21:00 - drop table if exists branches cascade
2025-09-04 20:21:00 - drop table if exists cart_item_characteristics cascade
2025-09-04 20:21:00 - drop table if exists cart_item_modifiers cascade
2025-09-04 20:21:00 - drop table if exists cart_items cascade
2025-09-04 20:21:00 - drop table if exists carts cascade
2025-09-04 20:21:00 - drop table if exists customer_contact_preferences cascade
2025-09-04 20:21:00 - drop table if exists customers cascade
2025-09-04 20:21:00 - drop table if exists difficulty_levels cascade
2025-09-04 20:21:00 - drop table if exists discount_excluded_categories cascade
2025-09-04 20:21:00 - drop table if exists discounts cascade
2025-09-04 20:21:00 - drop table if exists game_modifier_service_types cascade
2025-09-04 20:21:00 - drop table if exists game_modifiers cascade
2025-09-04 20:21:00 - drop table if exists games cascade
2025-09-04 20:21:00 - drop table if exists item_characteristics cascade
2025-09-04 20:21:00 - drop table if exists item_defects cascade
2025-09-04 20:21:00 - drop table if exists item_modifiers cascade
2025-09-04 20:21:00 - drop table if exists item_photos cascade
2025-09-04 20:21:00 - drop table if exists item_risks cascade
2025-09-04 20:21:00 - drop table if exists item_stains cascade
2025-09-04 20:21:00 - drop table if exists modifier_category_restrictions cascade
2025-09-04 20:21:00 - drop table if exists order_items cascade
2025-09-04 20:21:00 - drop table if exists order_payments cascade
2025-09-04 20:21:00 - drop table if exists orders cascade
2025-09-04 20:21:00 - drop table if exists price_configurations cascade
2025-09-04 20:21:00 - drop table if exists price_list_items cascade
2025-09-04 20:21:00 - drop table if exists price_modifiers cascade
2025-09-04 20:21:00 - drop table if exists service_types cascade
2025-09-04 20:21:00 - drop table if exists user_branch_assignments cascade
2025-09-04 20:21:00 - drop table if exists user_roles cascade
2025-09-04 20:21:00 - drop table if exists users cascade
2025-09-04 20:21:00 - create table booster_game_specializations (active boolean not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, booster_id uuid not null, game_id uuid not null, id uuid not null, primary key (id), unique (booster_id, game_id))
2025-09-04 20:21:00 - create table boosters (active boolean not null, rating integer not null, total_orders integer not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, id uuid not null, discord_username varchar(100) not null unique, display_name varchar(100) not null, contact_email varchar(255), primary key (id))
2025-09-04 20:21:00 - create table branches (active boolean not null, sort_order integer not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, id uuid not null, phone varchar(20) not null, address TEXT not null, description TEXT, email varchar(255), name varchar(255) not null, working_hours varchar(255), primary key (id))
2025-09-04 20:21:00 - create table cart_item_characteristics (created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, cart_item_id uuid not null unique, id uuid not null, color varchar(255), filler varchar(255), material varchar(255), filler_condition enum ('COMPRESSED','NORMAL'), wear_level enum ('NUMBER_10','NUMBER_30','NUMBER_50','NUMBER_75'), primary key (id))
2025-09-04 20:21:00 - create table cart_item_modifiers (value integer not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, cart_item_id uuid not null, id uuid not null, type varchar(20) not null, code varchar(50) not null, name varchar(255) not null, primary key (id))
2025-09-04 20:21:00 - GenerationTarget encountered exception accepting command : Error executing DDL "create table cart_item_modifiers (value integer not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, cart_item_id uuid not null, id uuid not null, type varchar(20) not null, code varchar(50) not null, name varchar(255) not null, primary key (id))" via JDBC [Syntax error in SQL statement "create table cart_item_modifiers ([*]value integer not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, cart_item_id uuid not null, id uuid not null, type varchar(20) not null, code varchar(50) not null, name varchar(255) not null, primary key (id))"; expected "identifier";]
org.hibernate.tool.schema.spi.CommandAcceptanceException: Error executing DDL "create table cart_item_modifiers (value integer not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, cart_item_id uuid not null, id uuid not null, type varchar(20) not null, code varchar(50) not null, name varchar(255) not null, primary key (id))" via JDBC [Syntax error in SQL statement "create table cart_item_modifiers ([*]value integer not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, cart_item_id uuid not null, id uuid not null, type varchar(20) not null, code varchar(50) not null, name varchar(255) not null, primary key (id))"; expected "identifier";]
	at org.hibernate.tool.schema.internal.exec.GenerationTargetToDatabase.accept(GenerationTargetToDatabase.java:94)
	at org.hibernate.tool.schema.internal.Helper.applySqlString(Helper.java:233)
	at org.hibernate.tool.schema.internal.Helper.applySqlStrings(Helper.java:217)
	at org.hibernate.tool.schema.internal.SchemaCreatorImpl.createTables(SchemaCreatorImpl.java:430)
	at org.hibernate.tool.schema.internal.SchemaCreatorImpl.createSequencesTablesConstraints(SchemaCreatorImpl.java:346)
	at org.hibernate.tool.schema.internal.SchemaCreatorImpl.createFromMetadata(SchemaCreatorImpl.java:241)
	at org.hibernate.tool.schema.internal.SchemaCreatorImpl.performCreation(SchemaCreatorImpl.java:174)
	at org.hibernate.tool.schema.internal.SchemaCreatorImpl.doCreation(SchemaCreatorImpl.java:144)
	at org.hibernate.tool.schema.internal.SchemaCreatorImpl.doCreation(SchemaCreatorImpl.java:120)
	at org.hibernate.tool.schema.spi.SchemaManagementToolCoordinator.performDatabaseAction(SchemaManagementToolCoordinator.java:250)
	at org.hibernate.tool.schema.spi.SchemaManagementToolCoordinator.lambda$process$5(SchemaManagementToolCoordinator.java:144)
	at java.base/java.util.HashMap.forEach(HashMap.java:1429)
	at org.hibernate.tool.schema.spi.SchemaManagementToolCoordinator.process(SchemaManagementToolCoordinator.java:141)
	at org.hibernate.boot.internal.SessionFactoryObserverForSchemaExport.sessionFactoryCreated(SessionFactoryObserverForSchemaExport.java:37)
	at org.hibernate.internal.SessionFactoryObserverChain.sessionFactoryCreated(SessionFactoryObserverChain.java:35)
	at org.hibernate.internal.SessionFactoryImpl.<init>(SessionFactoryImpl.java:324)
	at org.hibernate.boot.internal.SessionFactoryBuilderImpl.build(SessionFactoryBuilderImpl.java:463)
	at org.hibernate.jpa.boot.internal.EntityManagerFactoryBuilderImpl.build(EntityManagerFactoryBuilderImpl.java:1517)
	at org.springframework.orm.jpa.vendor.SpringHibernateJpaPersistenceProvider.createContainerEntityManagerFactory(SpringHibernateJpaPersistenceProvider.java:66)
	at org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean.createNativeEntityManagerFactory(LocalContainerEntityManagerFactoryBean.java:390)
	at org.springframework.orm.jpa.AbstractEntityManagerFactoryBean.buildNativeEntityManagerFactory(AbstractEntityManagerFactoryBean.java:419)
	at org.springframework.orm.jpa.AbstractEntityManagerFactoryBean.afterPropertiesSet(AbstractEntityManagerFactoryBean.java:400)
	at org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean.afterPropertiesSet(LocalContainerEntityManagerFactoryBean.java:366)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1873)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1822)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:607)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:529)
	at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339)
	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:373)
	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337)
	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:207)
	at org.springframework.context.support.AbstractApplicationContext.finishBeanFactoryInitialization(AbstractApplicationContext.java:970)
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:627)
	at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:752)
	at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:439)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:318)
	at org.springframework.boot.test.context.SpringBootContextLoader.lambda$loadContext$3(SpringBootContextLoader.java:144)
	at org.springframework.util.function.ThrowingSupplier.get(ThrowingSupplier.java:58)
	at org.springframework.util.function.ThrowingSupplier.get(ThrowingSupplier.java:46)
	at org.springframework.boot.SpringApplication.withHook(SpringApplication.java:1461)
	at org.springframework.boot.test.context.SpringBootContextLoader$ContextLoaderHook.run(SpringBootContextLoader.java:563)
	at org.springframework.boot.test.context.SpringBootContextLoader.loadContext(SpringBootContextLoader.java:144)
	at org.springframework.boot.test.context.SpringBootContextLoader.loadContext(SpringBootContextLoader.java:110)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContextInternal(DefaultCacheAwareContextLoaderDelegate.java:225)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContext(DefaultCacheAwareContextLoaderDelegate.java:152)
	at org.springframework.test.context.support.DefaultTestContext.getApplicationContext(DefaultTestContext.java:130)
	at org.springframework.test.context.web.ServletTestExecutionListener.setUpRequestContextIfNecessary(ServletTestExecutionListener.java:200)
	at org.springframework.test.context.web.ServletTestExecutionListener.prepareTestInstance(ServletTestExecutionListener.java:139)
	at org.springframework.test.context.TestContextManager.prepareTestInstance(TestContextManager.java:260)
	at org.springframework.test.context.junit.jupiter.SpringExtension.postProcessTestInstance(SpringExtension.java:159)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$invokeTestInstancePostProcessors$10(ClassBasedTestDescriptor.java:383)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.executeAndMaskThrowable(ClassBasedTestDescriptor.java:388)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$invokeTestInstancePostProcessors$11(ClassBasedTestDescriptor.java:382)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$2$1.accept(ReferencePipeline.java:179)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.invokeTestInstancePostProcessors(ClassBasedTestDescriptor.java:382)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$instantiateAndPostProcessTestInstance$6(ClassBasedTestDescriptor.java:293)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.instantiateAndPostProcessTestInstance(ClassBasedTestDescriptor.java:292)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$testInstancesProvider$4(ClassBasedTestDescriptor.java:281)
	at java.base/java.util.Optional.orElseGet(Optional.java:364)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$testInstancesProvider$5(ClassBasedTestDescriptor.java:280)
	at org.junit.jupiter.engine.execution.TestInstancesProvider.getTestInstances(TestInstancesProvider.java:27)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$prepare$0(TestMethodTestDescriptor.java:112)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.prepare(TestMethodTestDescriptor.java:111)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.prepare(TestMethodTestDescriptor.java:69)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$prepare$2(NodeTestTask.java:128)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.prepare(NodeTestTask.java:128)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:160)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:146)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:144)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:100)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:160)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:146)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:144)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:100)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.submit(SameThreadHierarchicalTestExecutorService.java:35)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestExecutor.execute(HierarchicalTestExecutor.java:57)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestEngine.execute(HierarchicalTestEngine.java:54)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:201)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:170)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:94)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.lambda$execute$0(EngineExecutionOrchestrator.java:59)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.withInterceptedStreams(EngineExecutionOrchestrator.java:142)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:58)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:103)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:85)
	at org.junit.platform.launcher.core.DelegatingLauncher.execute(DelegatingLauncher.java:47)
	at org.junit.platform.launcher.core.InterceptingLauncher.lambda$execute$1(InterceptingLauncher.java:39)
	at org.junit.platform.launcher.core.ClasspathAlignmentCheckingLauncherInterceptor.intercept(ClasspathAlignmentCheckingLauncherInterceptor.java:25)
	at org.junit.platform.launcher.core.InterceptingLauncher.execute(InterceptingLauncher.java:38)
	at org.junit.platform.launcher.core.DelegatingLauncher.execute(DelegatingLauncher.java:47)
	at org.junit.platform.launcher.core.SessionPerRequestLauncher.execute(SessionPerRequestLauncher.java:63)
	at com.intellij.junit5.JUnit5IdeaTestRunner.startRunnerWithArgs(JUnit5IdeaTestRunner.java:66)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater$1.execute(IdeaTestRunner.java:38)
	at com.intellij.rt.execution.junit.TestsRepeater.repeat(TestsRepeater.java:11)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater.startRunnerWithArgs(IdeaTestRunner.java:35)
	at com.intellij.rt.junit.JUnitStarter.prepareStreamsAndStart(JUnitStarter.java:231)
	at com.intellij.rt.junit.JUnitStarter.main(JUnitStarter.java:55)
Caused by: org.h2.jdbc.JdbcSQLSyntaxErrorException: Syntax error in SQL statement "create table cart_item_modifiers ([*]value integer not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, cart_item_id uuid not null, id uuid not null, type varchar(20) not null, code varchar(50) not null, name varchar(255) not null, primary key (id))"; expected "identifier"; SQL statement:
create table cart_item_modifiers (value integer not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, cart_item_id uuid not null, id uuid not null, type varchar(20) not null, code varchar(50) not null, name varchar(255) not null, primary key (id)) [42001-232]
	at org.h2.message.DbException.getJdbcSQLException(DbException.java:514)
	at org.h2.message.DbException.getJdbcSQLException(DbException.java:489)
	at org.h2.message.DbException.getSyntaxError(DbException.java:261)
	at org.h2.command.Parser.readIdentifier(Parser.java:5527)
	at org.h2.command.Parser.parseTableColumnDefinition(Parser.java:8871)
	at org.h2.command.Parser.parseCreateTable(Parser.java:8819)
	at org.h2.command.Parser.parseCreate(Parser.java:6398)
	at org.h2.command.Parser.parsePrepared(Parser.java:645)
	at org.h2.command.Parser.parse(Parser.java:581)
	at org.h2.command.Parser.parse(Parser.java:556)
	at org.h2.command.Parser.prepareCommand(Parser.java:484)
	at org.h2.engine.SessionLocal.prepareLocal(SessionLocal.java:645)
	at org.h2.engine.SessionLocal.prepareCommand(SessionLocal.java:561)
	at org.h2.jdbc.JdbcConnection.prepareCommand(JdbcConnection.java:1164)
	at org.h2.jdbc.JdbcStatement.executeInternal(JdbcStatement.java:245)
	at org.h2.jdbc.JdbcStatement.execute(JdbcStatement.java:231)
	at com.zaxxer.hikari.pool.ProxyStatement.execute(ProxyStatement.java:95)
	at com.zaxxer.hikari.pool.HikariProxyStatement.execute(HikariProxyStatement.java)
	at org.hibernate.tool.schema.internal.exec.GenerationTargetToDatabase.accept(GenerationTargetToDatabase.java:80)
	... 122 common frames omitted
2025-09-04 20:21:00 - create table cart_items (quantity integer not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, cart_id uuid not null, id uuid not null, price_list_item_id uuid not null, primary key (id))
2025-09-04 20:21:00 - create table carts (discount_percentage integer, created_at timestamp(6) with time zone not null, expected_completion_date timestamp(6) with time zone, expires_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, customer_id uuid not null, id uuid not null, discount_type enum ('EVERCARD','MILITARY','NONE','OTHER','SOCIAL_MEDIA'), urgency_type enum ('EXPRESS_24_H','EXPRESS_48_H','NORMAL'), primary key (id))
2025-09-04 20:21:00 - create table customer_contact_preferences (customer_id uuid not null, preference enum ('PHONE','SMS','VIBER'))
2025-09-04 20:21:00 - create table customers (active boolean not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, id uuid not null, discount_card_number varchar(20) unique, phone_primary varchar(20) not null, first_name varchar(100) not null, last_name varchar(100) not null, address TEXT, email varchar(255), info_source_other varchar(255), notes TEXT, info_source enum ('GOOGLE','INSTAGRAM','OTHER','RECOMMENDATION'), primary key (id))
2025-09-04 20:21:00 - create table difficulty_levels (active boolean not null, level_value integer not null, sort_order integer not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, game_id uuid not null, id uuid not null, code varchar(50) not null, name varchar(100) not null, primary key (id))
2025-09-04 20:21:00 - create table discount_excluded_categories (discount_id uuid not null, category_code varchar(30))
2025-09-04 20:21:00 - create table discounts (active boolean not null, percentage integer not null, sort_order integer not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, id uuid not null, code varchar(50) not null unique, description TEXT, name varchar(255) not null, primary key (id))
2025-09-04 20:21:00 - create table game_modifier_service_types (game_modifier_id uuid not null, service_type_code varchar(255))
2025-09-04 20:21:00 - create table game_modifiers (active boolean not null, max_uses integer, modifier_value integer not null, priority integer, sort_order integer, color varchar(7), created_at timestamp(6) with time zone not null, effective_date timestamp(6) with time zone, expiration_date timestamp(6) with time zone, updated_at timestamp(6) with time zone not null, version bigint, icon varchar(10), id uuid not null, game_code varchar(20) not null, code varchar(50) not null, conditions TEXT, description TEXT, name varchar(255) not null, modifier_type enum ('ACHIEVEMENT','COSMETIC','EXTRA','GUIDANCE','MODE','PROGRESSION','PROMOTIONAL','QUALITY','RANK','SEASONAL','SERVICE','SOCIAL','SPELLS','SUPPORT','TIMING') not null, operation_type enum ('ADD','DIVIDE','MULTIPLY','SUBTRACT') not null, primary key (id), unique (code, game_code))
2025-09-04 20:21:00 - create table games (active boolean not null, sort_order integer not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, id uuid not null, code varchar(50) not null unique, name varchar(100) not null, description varchar(500), category enum ('ACTION','BATTLE_ROYALE','FPS','MMORPG','MOBA','OTHER','PUZZLE','RACING','SIMULATION','SPORTS','STRATEGY') not null, primary key (id))
2025-09-04 20:21:00 - create table item_characteristics (created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, id uuid not null, order_item_id uuid not null unique, color varchar(50), filler varchar(100), material varchar(100), filler_condition enum ('COMPRESSED','NORMAL'), wear_level enum ('NUMBER_10','NUMBER_30','NUMBER_50','NUMBER_75'), primary key (id))
2025-09-04 20:21:00 - create table item_defects (created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, id uuid not null, order_item_id uuid not null, description TEXT, defect_type enum ('DAMAGED_ACCESSORIES','MISSING_ACCESSORIES','OTHER','TORN','WORN') not null, primary key (id))
2025-09-04 20:21:00 - create table item_modifiers (applied_amount integer not null, modifier_value integer not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, id uuid not null, order_item_id uuid not null, modifier_code varchar(50) not null, jexl_formula TEXT, modifier_name varchar(255) not null, modifier_type enum ('FIXED','FORMULA','PERCENTAGE') not null, primary key (id))
2025-09-04 20:21:00 - create table item_photos (created_at timestamp(6) with time zone not null, file_size bigint, updated_at timestamp(6) with time zone not null, uploaded_at timestamp(6) with time zone not null, version bigint, id uuid not null, order_item_id uuid not null, uploaded_by uuid, content_type varchar(100), url varchar(500) not null, description TEXT, original_filename varchar(255), photo_type enum ('DEFECT','GENERAL','LABEL','STAIN') not null, primary key (id))
2025-09-04 20:21:00 - create table item_risks (created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, id uuid not null, order_item_id uuid not null, description TEXT, risk_type enum ('COLOR_CHANGE','DEFORMATION','NO_WARRANTY') not null, primary key (id))
2025-09-04 20:21:00 - create table item_stains (created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, id uuid not null, order_item_id uuid not null, description TEXT, stain_type enum ('BLOOD','COFFEE','COSMETICS','GRASS','GREASE','INK','OTHER','PROTEIN','WINE') not null, primary key (id))
2025-09-04 20:21:00 - create table modifier_category_restrictions (modifier_id uuid not null, category_code varchar(30))
2025-09-04 20:21:00 - create table order_items (base_price integer not null, discount_amount integer not null, discount_eligible boolean not null, modifiers_total_amount integer not null, quantity integer not null, subtotal integer not null, total_amount integer not null, urgency_amount integer not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, id uuid not null, order_id uuid not null, price_list_item_id uuid not null, primary key (id))
2025-09-04 20:21:00 - create table order_payments (amount integer not null, created_at timestamp(6) with time zone not null, paid_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, id uuid not null, order_id uuid not null, paid_by uuid, reference_number varchar(100), notes TEXT, payment_method enum ('BANK_TRANSFER','CASH','TERMINAL') not null, primary key (id))
2025-09-04 20:21:00 - create table orders (discount_amount integer not null, discount_applicable_amount integer not null, items_subtotal integer not null, terms_accepted boolean not null, total_amount integer not null, urgency_amount integer not null, actual_completion_date timestamp(6) with time zone, created_at timestamp(6) with time zone not null, expected_completion_date timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, branch_id uuid not null, created_by uuid, customer_id uuid not null, id uuid not null, status varchar(20) not null, order_number varchar(50) not null unique, unique_label varchar(100), customer_signature TEXT, notes TEXT, primary key (id))
2025-09-04 20:21:00 - create table price_configurations (active boolean, base_price integer not null, price_per_level integer, sort_order integer, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, difficulty_level_id uuid not null, game_id uuid not null, id uuid not null, service_type_id uuid not null, calculation_formula TEXT, calculation_type varchar(255), currency varchar(255), primary key (id))
2025-09-04 20:21:00 - create table price_list_items (active boolean not null, base_price integer not null, catalog_number integer not null, express_available boolean not null, express_price integer, express_time_hours integer, price_black integer, price_color integer, processing_time_days integer, sort_order integer, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, id uuid not null, description TEXT, name varchar(255) not null, name_ua varchar(255), category_code enum ('ADDITIONAL_SERVICES','CLOTHING','DYEING','FUR','IRONING','LAUNDRY','LEATHER','OTHER','PADDING','SHEEPSKIN') not null, unit_of_measure enum ('KILOGRAM','PAIR','PIECE','SQUARE_METER') not null, primary key (id), unique (category_code, catalog_number))
2025-09-04 20:21:00 - create table price_modifiers (active boolean not null, modifier_value integer not null, sort_order integer not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, id uuid not null, code varchar(50) not null unique, description TEXT, jexl_formula TEXT, name varchar(255) not null, modifier_type enum ('DISCOUNT','FIXED','FORMULA','MULTIPLIER','PERCENTAGE') not null, operation_type enum ('ADD','DIVIDE','MULTIPLY','SUBTRACT') not null, primary key (id))
2025-09-04 20:21:00 - create table service_types (active boolean not null, sort_order integer not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, game_id uuid not null, id uuid not null, code varchar(50) not null unique, name varchar(100) not null, description varchar(500), primary key (id))
2025-09-04 20:21:00 - create table user_branch_assignments (active boolean not null, is_primary boolean not null, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, branch_id uuid not null, id uuid not null, user_id uuid not null, primary key (id), unique (user_id, branch_id))
2025-09-04 20:21:00 - create table user_roles (user_id uuid not null, role enum ('ADMIN','CLEANER','DRIVER','MANAGER','OPERATOR'))
2025-09-04 20:21:00 - create table users (active boolean not null, email_verified boolean not null, failed_login_attempts integer, created_at timestamp(6) with time zone not null, updated_at timestamp(6) with time zone not null, version bigint, id uuid not null, phone varchar(20), username varchar(50) not null unique, first_name varchar(100) not null, last_name varchar(100) not null, email varchar(255) not null unique, password_hash varchar(255) not null, primary key (id))
2025-09-04 20:21:00 - create index idx_branch_name on branches (name)
2025-09-04 20:21:00 - create index idx_branch_active on branches (active)
2025-09-04 20:21:00 - create index idx_branch_sort_order on branches (sort_order)
2025-09-04 20:21:00 - create index idx_cart_item_modifier_code on cart_item_modifiers (cart_item_id, code)
2025-09-04 20:21:00 - GenerationTarget encountered exception accepting command : Error executing DDL "create index idx_cart_item_modifier_code on cart_item_modifiers (cart_item_id, code)" via JDBC [Table "CART_ITEM_MODIFIERS" not found;]
org.hibernate.tool.schema.spi.CommandAcceptanceException: Error executing DDL "create index idx_cart_item_modifier_code on cart_item_modifiers (cart_item_id, code)" via JDBC [Table "CART_ITEM_MODIFIERS" not found;]
	at org.hibernate.tool.schema.internal.exec.GenerationTargetToDatabase.accept(GenerationTargetToDatabase.java:94)
	at org.hibernate.tool.schema.internal.Helper.applySqlString(Helper.java:233)
	at org.hibernate.tool.schema.internal.Helper.applySqlStrings(Helper.java:217)
	at org.hibernate.tool.schema.internal.SchemaCreatorImpl.createTableConstraints(SchemaCreatorImpl.java:392)
	at org.hibernate.tool.schema.internal.SchemaCreatorImpl.createSequencesTablesConstraints(SchemaCreatorImpl.java:358)
	at org.hibernate.tool.schema.internal.SchemaCreatorImpl.createFromMetadata(SchemaCreatorImpl.java:241)
	at org.hibernate.tool.schema.internal.SchemaCreatorImpl.performCreation(SchemaCreatorImpl.java:174)
	at org.hibernate.tool.schema.internal.SchemaCreatorImpl.doCreation(SchemaCreatorImpl.java:144)
	at org.hibernate.tool.schema.internal.SchemaCreatorImpl.doCreation(SchemaCreatorImpl.java:120)
	at org.hibernate.tool.schema.spi.SchemaManagementToolCoordinator.performDatabaseAction(SchemaManagementToolCoordinator.java:250)
	at org.hibernate.tool.schema.spi.SchemaManagementToolCoordinator.lambda$process$5(SchemaManagementToolCoordinator.java:144)
	at java.base/java.util.HashMap.forEach(HashMap.java:1429)
	at org.hibernate.tool.schema.spi.SchemaManagementToolCoordinator.process(SchemaManagementToolCoordinator.java:141)
	at org.hibernate.boot.internal.SessionFactoryObserverForSchemaExport.sessionFactoryCreated(SessionFactoryObserverForSchemaExport.java:37)
	at org.hibernate.internal.SessionFactoryObserverChain.sessionFactoryCreated(SessionFactoryObserverChain.java:35)
	at org.hibernate.internal.SessionFactoryImpl.<init>(SessionFactoryImpl.java:324)
	at org.hibernate.boot.internal.SessionFactoryBuilderImpl.build(SessionFactoryBuilderImpl.java:463)
	at org.hibernate.jpa.boot.internal.EntityManagerFactoryBuilderImpl.build(EntityManagerFactoryBuilderImpl.java:1517)
	at org.springframework.orm.jpa.vendor.SpringHibernateJpaPersistenceProvider.createContainerEntityManagerFactory(SpringHibernateJpaPersistenceProvider.java:66)
	at org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean.createNativeEntityManagerFactory(LocalContainerEntityManagerFactoryBean.java:390)
	at org.springframework.orm.jpa.AbstractEntityManagerFactoryBean.buildNativeEntityManagerFactory(AbstractEntityManagerFactoryBean.java:419)
	at org.springframework.orm.jpa.AbstractEntityManagerFactoryBean.afterPropertiesSet(AbstractEntityManagerFactoryBean.java:400)
	at org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean.afterPropertiesSet(LocalContainerEntityManagerFactoryBean.java:366)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1873)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1822)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:607)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:529)
	at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339)
	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:373)
	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337)
	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:207)
	at org.springframework.context.support.AbstractApplicationContext.finishBeanFactoryInitialization(AbstractApplicationContext.java:970)
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:627)
	at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:752)
	at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:439)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:318)
	at org.springframework.boot.test.context.SpringBootContextLoader.lambda$loadContext$3(SpringBootContextLoader.java:144)
	at org.springframework.util.function.ThrowingSupplier.get(ThrowingSupplier.java:58)
	at org.springframework.util.function.ThrowingSupplier.get(ThrowingSupplier.java:46)
	at org.springframework.boot.SpringApplication.withHook(SpringApplication.java:1461)
	at org.springframework.boot.test.context.SpringBootContextLoader$ContextLoaderHook.run(SpringBootContextLoader.java:563)
	at org.springframework.boot.test.context.SpringBootContextLoader.loadContext(SpringBootContextLoader.java:144)
	at org.springframework.boot.test.context.SpringBootContextLoader.loadContext(SpringBootContextLoader.java:110)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContextInternal(DefaultCacheAwareContextLoaderDelegate.java:225)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContext(DefaultCacheAwareContextLoaderDelegate.java:152)
	at org.springframework.test.context.support.DefaultTestContext.getApplicationContext(DefaultTestContext.java:130)
	at org.springframework.test.context.web.ServletTestExecutionListener.setUpRequestContextIfNecessary(ServletTestExecutionListener.java:200)
	at org.springframework.test.context.web.ServletTestExecutionListener.prepareTestInstance(ServletTestExecutionListener.java:139)
	at org.springframework.test.context.TestContextManager.prepareTestInstance(TestContextManager.java:260)
	at org.springframework.test.context.junit.jupiter.SpringExtension.postProcessTestInstance(SpringExtension.java:159)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$invokeTestInstancePostProcessors$10(ClassBasedTestDescriptor.java:383)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.executeAndMaskThrowable(ClassBasedTestDescriptor.java:388)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$invokeTestInstancePostProcessors$11(ClassBasedTestDescriptor.java:382)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$2$1.accept(ReferencePipeline.java:179)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.invokeTestInstancePostProcessors(ClassBasedTestDescriptor.java:382)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$instantiateAndPostProcessTestInstance$6(ClassBasedTestDescriptor.java:293)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.instantiateAndPostProcessTestInstance(ClassBasedTestDescriptor.java:292)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$testInstancesProvider$4(ClassBasedTestDescriptor.java:281)
	at java.base/java.util.Optional.orElseGet(Optional.java:364)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$testInstancesProvider$5(ClassBasedTestDescriptor.java:280)
	at org.junit.jupiter.engine.execution.TestInstancesProvider.getTestInstances(TestInstancesProvider.java:27)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$prepare$0(TestMethodTestDescriptor.java:112)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.prepare(TestMethodTestDescriptor.java:111)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.prepare(TestMethodTestDescriptor.java:69)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$prepare$2(NodeTestTask.java:128)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.prepare(NodeTestTask.java:128)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:160)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:146)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:144)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:100)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:160)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:146)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:144)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:100)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.submit(SameThreadHierarchicalTestExecutorService.java:35)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestExecutor.execute(HierarchicalTestExecutor.java:57)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestEngine.execute(HierarchicalTestEngine.java:54)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:201)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:170)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:94)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.lambda$execute$0(EngineExecutionOrchestrator.java:59)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.withInterceptedStreams(EngineExecutionOrchestrator.java:142)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:58)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:103)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:85)
	at org.junit.platform.launcher.core.DelegatingLauncher.execute(DelegatingLauncher.java:47)
	at org.junit.platform.launcher.core.InterceptingLauncher.lambda$execute$1(InterceptingLauncher.java:39)
	at org.junit.platform.launcher.core.ClasspathAlignmentCheckingLauncherInterceptor.intercept(ClasspathAlignmentCheckingLauncherInterceptor.java:25)
	at org.junit.platform.launcher.core.InterceptingLauncher.execute(InterceptingLauncher.java:38)
	at org.junit.platform.launcher.core.DelegatingLauncher.execute(DelegatingLauncher.java:47)
	at org.junit.platform.launcher.core.SessionPerRequestLauncher.execute(SessionPerRequestLauncher.java:63)
	at com.intellij.junit5.JUnit5IdeaTestRunner.startRunnerWithArgs(JUnit5IdeaTestRunner.java:66)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater$1.execute(IdeaTestRunner.java:38)
	at com.intellij.rt.execution.junit.TestsRepeater.repeat(TestsRepeater.java:11)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater.startRunnerWithArgs(IdeaTestRunner.java:35)
	at com.intellij.rt.junit.JUnitStarter.prepareStreamsAndStart(JUnitStarter.java:231)
	at com.intellij.rt.junit.JUnitStarter.main(JUnitStarter.java:55)
Caused by: org.h2.jdbc.JdbcSQLSyntaxErrorException: Table "CART_ITEM_MODIFIERS" not found; SQL statement:
create index idx_cart_item_modifier_code on cart_item_modifiers (cart_item_id, code) [42102-232]
	at org.h2.message.DbException.getJdbcSQLException(DbException.java:514)
	at org.h2.message.DbException.getJdbcSQLException(DbException.java:489)
	at org.h2.message.DbException.get(DbException.java:223)
	at org.h2.message.DbException.get(DbException.java:199)
	at org.h2.command.ddl.CreateIndex.update(CreateIndex.java:70)
	at org.h2.command.CommandContainer.update(CommandContainer.java:139)
	at org.h2.command.Command.executeUpdate(Command.java:304)
	at org.h2.command.Command.executeUpdate(Command.java:248)
	at org.h2.jdbc.JdbcStatement.executeInternal(JdbcStatement.java:262)
	at org.h2.jdbc.JdbcStatement.execute(JdbcStatement.java:231)
	at com.zaxxer.hikari.pool.ProxyStatement.execute(ProxyStatement.java:95)
	at com.zaxxer.hikari.pool.HikariProxyStatement.execute(HikariProxyStatement.java)
	at org.hibernate.tool.schema.internal.exec.GenerationTargetToDatabase.accept(GenerationTargetToDatabase.java:80)
	... 122 common frames omitted
2025-09-04 20:21:00 - create index idx_cart_customer on carts (customer_id)
2025-09-04 20:21:00 - create index idx_cart_expires_at on carts (expires_at)
2025-09-04 20:21:00 - create index idx_cart_active on carts (expires_at, customer_id)
2025-09-04 20:21:00 - create index idx_customer_phone on customers (phone_primary)
2025-09-04 20:21:00 - create index idx_customer_email on customers (email)
2025-09-04 20:21:00 - create index idx_customer_name on customers (first_name, last_name)
2025-09-04 20:21:00 - create index idx_discount_excluded on discount_excluded_categories (discount_id, category_code)
2025-09-04 20:21:00 - create index idx_discount_code on discounts (code)
2025-09-04 20:21:00 - create index idx_discount_active on discounts (active)
2025-09-04 20:21:00 - create index idx_game_modifier_code on game_modifiers (code)
2025-09-04 20:21:00 - create index idx_game_modifier_game_code on game_modifiers (game_code)
2025-09-04 20:21:00 - create index idx_game_modifier_type on game_modifiers (modifier_type)
2025-09-04 20:21:00 - create index idx_game_modifier_active on game_modifiers (active)
2025-09-04 20:21:00 - create index idx_game_modifier_sort_order on game_modifiers (sort_order)
2025-09-04 20:21:00 - create index idx_item_characteristics_order_item on item_characteristics (order_item_id)
2025-09-04 20:21:00 - create index idx_item_defect_order_item on item_defects (order_item_id)
2025-09-04 20:21:00 - create index idx_item_defect_type on item_defects (defect_type)
2025-09-04 20:21:00 - create index idx_item_modifier_order_item on item_modifiers (order_item_id)
2025-09-04 20:21:00 - create index idx_item_modifier_code on item_modifiers (modifier_code)
2025-09-04 20:21:00 - create index idx_item_photo_order_item on item_photos (order_item_id)
2025-09-04 20:21:00 - create index idx_item_photo_type on item_photos (photo_type)
2025-09-04 20:21:00 - create index idx_item_photo_uploaded_at on item_photos (uploaded_at)
2025-09-04 20:21:00 - create index idx_item_risk_order_item on item_risks (order_item_id)
2025-09-04 20:21:00 - create index idx_item_risk_type on item_risks (risk_type)
2025-09-04 20:21:00 - create index idx_item_stain_order_item on item_stains (order_item_id)
2025-09-04 20:21:00 - create index idx_item_stain_type on item_stains (stain_type)
2025-09-04 20:21:00 - create index idx_modifier_category on modifier_category_restrictions (modifier_id, category_code)
2025-09-04 20:21:00 - create index idx_order_item_order on order_items (order_id)
2025-09-04 20:21:00 - create index idx_order_item_price_list on order_items (price_list_item_id)
2025-09-04 20:21:00 - create index idx_order_payment_order on order_payments (order_id)
2025-09-04 20:21:00 - create index idx_order_payment_method on order_payments (payment_method)
2025-09-04 20:21:00 - create index idx_order_payment_paid_at on order_payments (paid_at)
2025-09-04 20:21:00 - create index idx_order_number on orders (order_number)
2025-09-04 20:21:00 - create index idx_order_customer on orders (customer_id)
2025-09-04 20:21:00 - create index idx_order_branch on orders (branch_id)
2025-09-04 20:21:00 - create index idx_order_status on orders (status)
2025-09-04 20:21:00 - create index idx_order_created_at on orders (created_at)
2025-09-04 20:21:00 - create index idx_order_expected_completion on orders (expected_completion_date)
2025-09-04 20:21:00 - create index idx_order_unique_label on orders (unique_label)
2025-09-04 20:21:00 - create index idx_price_list_category on price_list_items (category_code)
2025-09-04 20:21:00 - create index idx_price_list_catalog_number on price_list_items (catalog_number)
2025-09-04 20:21:00 - create index idx_price_list_active on price_list_items (active)
2025-09-04 20:21:00 - create index idx_modifier_code on price_modifiers (code)
2025-09-04 20:21:00 - create index idx_modifier_active on price_modifiers (active)
2025-09-04 20:21:00 - create index idx_modifier_type on price_modifiers (modifier_type)
2025-09-04 20:21:00 - create index idx_assignment_user on user_branch_assignments (user_id)
2025-09-04 20:21:00 - create index idx_assignment_branch on user_branch_assignments (branch_id)
2025-09-04 20:21:00 - create index idx_assignment_primary on user_branch_assignments (is_primary)
2025-09-04 20:21:00 - create index idx_user_active on users (active)
2025-09-04 20:21:00 - alter table if exists booster_game_specializations add constraint FK4e0kg7xa1a82bk8d74eqwe29b foreign key (booster_id) references boosters
2025-09-04 20:21:00 - alter table if exists booster_game_specializations add constraint FKojt7wtsw0f2v7tql201em6ne3 foreign key (game_id) references games
2025-09-04 20:21:00 - alter table if exists cart_item_characteristics add constraint FKje3x7bgglmp7lqbnqnn6p2rg3 foreign key (cart_item_id) references cart_items
2025-09-04 20:21:00 - alter table if exists cart_item_modifiers add constraint FKk273dw7aliks0bapw4clfvlny foreign key (cart_item_id) references cart_items
2025-09-04 20:21:00 - alter table if exists cart_items add constraint FKpcttvuq4mxppo8sxggjtn5i2c foreign key (cart_id) references carts
2025-09-04 20:21:00 - alter table if exists cart_items add constraint FK8dh6h52ub907h232l6fg3adb7 foreign key (price_list_item_id) references price_list_items
2025-09-04 20:21:00 - alter table if exists carts add constraint FK8ba3sryid5k8a9kidpkvqipyt foreign key (customer_id) references customers
2025-09-04 20:21:00 - alter table if exists customer_contact_preferences add constraint FK4b9i9nfu019afem1qdajjngru foreign key (customer_id) references customers
2025-09-04 20:21:00 - alter table if exists difficulty_levels add constraint FK92r135ef6h3jy3xoo03i1lq8f foreign key (game_id) references games
2025-09-04 20:21:00 - alter table if exists discount_excluded_categories add constraint FK1mv7io64johfq6u7f5lwqc5y5 foreign key (discount_id) references discounts
2025-09-04 20:21:00 - alter table if exists game_modifier_service_types add constraint FKh5pxefw93vxfgilai2lpaf74d foreign key (game_modifier_id) references game_modifiers
2025-09-04 20:21:00 - alter table if exists item_characteristics add constraint FKr88m7f53f78borwb2c7m466yc foreign key (order_item_id) references order_items
2025-09-04 20:21:00 - alter table if exists item_defects add constraint FKtqmainr1tr0rlb0sh4gm0skgu foreign key (order_item_id) references order_items
2025-09-04 20:21:00 - alter table if exists item_modifiers add constraint FKmd1ae3byjmi9tgqphq77191t foreign key (order_item_id) references order_items
2025-09-04 20:21:00 - alter table if exists item_photos add constraint FK68p7sw42jqyy7jyb70gb42l2u foreign key (order_item_id) references order_items
2025-09-04 20:21:00 - alter table if exists item_photos add constraint FK5npldyqmj1i56p3ws513qj4ji foreign key (uploaded_by) references users
2025-09-04 20:21:00 - alter table if exists item_risks add constraint FKfxnda67we6iirjmeh5chm9d33 foreign key (order_item_id) references order_items
2025-09-04 20:21:00 - alter table if exists item_stains add constraint FKdy9w0mh0t5x8kclbcdrmyn3jh foreign key (order_item_id) references order_items
2025-09-04 20:21:00 - alter table if exists modifier_category_restrictions add constraint FKgacp203j8dayg7nc5vx0tr9ih foreign key (modifier_id) references price_modifiers
2025-09-04 20:21:00 - alter table if exists order_items add constraint FKbioxgbv59vetrxe0ejfubep1w foreign key (order_id) references orders
2025-09-04 20:21:00 - alter table if exists order_items add constraint FKj9xtd1t0yctuycasut2sc42em foreign key (price_list_item_id) references price_list_items
2025-09-04 20:21:00 - alter table if exists order_payments add constraint FK3s9vxneb3dk3plhpv9s213so0 foreign key (order_id) references orders
2025-09-04 20:21:00 - alter table if exists order_payments add constraint FKoxvv5v7jmkg0rvciab394f46n foreign key (paid_by) references users
2025-09-04 20:21:00 - alter table if exists orders add constraint FKjcfql8n80mxan8of04c8sd8k2 foreign key (branch_id) references branches
2025-09-04 20:21:00 - alter table if exists orders add constraint FKtjwuphstqm46uffgc7l1r27a9 foreign key (created_by) references users
2025-09-04 20:21:00 - alter table if exists orders add constraint FKpxtb8awmi0dk6smoh2vp1litg foreign key (customer_id) references customers
2025-09-04 20:21:00 - alter table if exists price_configurations add constraint FK8wex6wyp6f76s7f27n9dqusl2 foreign key (difficulty_level_id) references difficulty_levels
2025-09-04 20:21:00 - alter table if exists price_configurations add constraint FKglofyrgvwkx85l0cg57g8wc14 foreign key (game_id) references games
2025-09-04 20:21:00 - alter table if exists price_configurations add constraint FKa3w2sp0sgpmmkvpd69s7p8jn4 foreign key (service_type_id) references service_types
2025-09-04 20:21:00 - alter table if exists service_types add constraint FKiplqee1ktm04mn5berpqqaf3b foreign key (game_id) references games
2025-09-04 20:21:00 - alter table if exists user_branch_assignments add constraint FKexkxar0f8twgt8t87wejwveka foreign key (user_id) references users
2025-09-04 20:21:00 - alter table if exists user_roles add constraint FKhfh9dx7w3ubf1co1vdev94g3f foreign key (user_id) references users
2025-09-04 20:21:00 - Initialized JPA EntityManagerFactory for persistence unit 'default'
2025-09-04 20:21:00 - Hibernate is in classpath; If applicable, HQL parser will be used.
2025-09-04 20:21:01 - 🔐 Configuring SecurityConfig with UserDetailsService: UserQueryService$$SpringCGLIB$$0
2025-09-04 20:21:01 - Initialized file storage directory: /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/uploads
2025-09-04 20:21:01 - spring.jpa.open-in-view is enabled by default. Therefore, database queries may be performed during view rendering. Explicitly configure spring.jpa.open-in-view to disable this warning
2025-09-04 20:21:02 - Exposing 1 endpoint beneath base path '/actuator'
2025-09-04 20:21:02 - Global AuthenticationManager configured with UserDetailsService bean with name userQueryService
2025-09-04 20:21:02 - 🔒 PROD Security: Authentication required for protected endpoints
2025-09-04 20:21:02 - 🔐 Using UserDetailsService: UserQueryService$$SpringCGLIB$$0
2025-09-04 20:21:02 - 🌐 CORS configured for origins: [http://localhost:3000]
2025-09-04 20:21:02 - 🍪 CORS allows credentials: true
2025-09-04 20:21:02 - Will secure any request with filters: DisableEncodeUrlFilter, WebAsyncManagerIntegrationFilter, SecurityContextHolderFilter, HeaderWriterFilter, CorsFilter, CsrfFilter, LogoutFilter, ConcurrentSessionFilter, RequestCacheAwareFilter, SecurityContextHolderAwareRequestFilter, AnonymousAuthenticationFilter, SessionManagementFilter, ExceptionTranslationFilter, AuthorizationFilter
2025-09-04 20:21:02 - Exception encountered during context initialization - cancelling refresh attempt: org.springframework.context.ApplicationContextException: Failed to start bean 'springSessionRedisMessageListenerContainer'
2025-09-04 20:21:02 - Closing JPA EntityManagerFactory for persistence unit 'default'
2025-09-04 20:21:02 - drop table if exists booster_game_specializations cascade
2025-09-04 20:21:02 - drop table if exists boosters cascade
2025-09-04 20:21:02 - drop table if exists branches cascade
2025-09-04 20:21:02 - drop table if exists cart_item_characteristics cascade
2025-09-04 20:21:02 - drop table if exists cart_item_modifiers cascade
2025-09-04 20:21:02 - drop table if exists cart_items cascade
2025-09-04 20:21:02 - drop table if exists carts cascade
2025-09-04 20:21:02 - drop table if exists customer_contact_preferences cascade
2025-09-04 20:21:02 - drop table if exists customers cascade
2025-09-04 20:21:02 - drop table if exists difficulty_levels cascade
2025-09-04 20:21:02 - drop table if exists discount_excluded_categories cascade
2025-09-04 20:21:02 - drop table if exists discounts cascade
2025-09-04 20:21:02 - drop table if exists game_modifier_service_types cascade
2025-09-04 20:21:02 - drop table if exists game_modifiers cascade
2025-09-04 20:21:02 - drop table if exists games cascade
2025-09-04 20:21:02 - drop table if exists item_characteristics cascade
2025-09-04 20:21:02 - drop table if exists item_defects cascade
2025-09-04 20:21:02 - drop table if exists item_modifiers cascade
2025-09-04 20:21:02 - drop table if exists item_photos cascade
2025-09-04 20:21:02 - drop table if exists item_risks cascade
2025-09-04 20:21:02 - drop table if exists item_stains cascade
2025-09-04 20:21:02 - drop table if exists modifier_category_restrictions cascade
2025-09-04 20:21:02 - drop table if exists order_items cascade
2025-09-04 20:21:02 - drop table if exists order_payments cascade
2025-09-04 20:21:02 - drop table if exists orders cascade
2025-09-04 20:21:02 - drop table if exists price_configurations cascade
2025-09-04 20:21:02 - drop table if exists price_list_items cascade
2025-09-04 20:21:02 - drop table if exists price_modifiers cascade
2025-09-04 20:21:02 - drop table if exists service_types cascade
2025-09-04 20:21:02 - drop table if exists user_branch_assignments cascade
2025-09-04 20:21:02 - drop table if exists user_roles cascade
2025-09-04 20:21:02 - drop table if exists users cascade
2025-09-04 20:21:02 - HikariPool-1 - Shutdown initiated...
2025-09-04 20:21:02 - HikariPool-1 - Shutdown completed.



============================
CONDITIONS EVALUATION REPORT
============================


Positive matches:
-----------------

   AopAutoConfiguration matched:
      - @ConditionalOnBooleanProperty (spring.aop.auto=true) matched (OnPropertyCondition)

   AopAutoConfiguration.AspectJAutoProxyingConfiguration matched:
      - @ConditionalOnClass found required class 'org.aspectj.weaver.Advice' (OnClassCondition)

   AopAutoConfiguration.AspectJAutoProxyingConfiguration.CglibAutoProxyConfiguration matched:
      - @ConditionalOnBooleanProperty (spring.aop.proxy-target-class=true) matched (OnPropertyCondition)

   ApplicationAvailabilityAutoConfiguration#applicationAvailability matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.availability.ApplicationAvailability; SearchStrategy: all) did not find any beans (OnBeanCondition)

   CacheMeterBinderProvidersConfiguration matched:
      - @ConditionalOnClass found required class 'io.micrometer.core.instrument.binder.MeterBinder' (OnClassCondition)

   CacheMeterBinderProvidersConfiguration.RedisCacheMeterBinderProviderConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.data.redis.cache.RedisCache' (OnClassCondition)

   org.springframework.boot.autoconfigure.http.client.reactive.ClientHttpConnectorAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'org.springframework.http.client.reactive.ClientHttpConnector', 'reactor.core.publisher.Mono' (OnClassCondition)
      - Detected ClientHttpConnectorBuilder (ConditionalOnClientHttpConnectorBuilderDetection)

   ClientHttpConnectorAutoConfiguration#clientHttpConnector matched:
      - @ConditionalOnMissingBean (types: org.springframework.http.client.reactive.ClientHttpConnector; SearchStrategy: all) did not find any beans (OnBeanCondition)

   ClientHttpConnectorAutoConfiguration#clientHttpConnectorBuilder matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.http.client.reactive.ClientHttpConnectorBuilder<?>; SearchStrategy: all) did not find any beans (OnBeanCondition)

   ClientHttpConnectorAutoConfiguration#clientHttpConnectorSettings matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.http.client.reactive.ClientHttpConnectorSettings; SearchStrategy: all) did not find any beans (OnBeanCondition)

   CompositeMeterRegistryAutoConfiguration matched:
      - @ConditionalOnClass found required class 'io.micrometer.core.instrument.composite.CompositeMeterRegistry' (OnClassCondition)

   DataSourceAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'javax.sql.DataSource', 'org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType' (OnClassCondition)
      - @ConditionalOnMissingBean (types: ?; SearchStrategy: all) did not find any beans (OnBeanCondition)

   DataSourceAutoConfiguration.PooledDataSourceConfiguration matched:
      - AnyNestedCondition 1 matched 1 did not; NestedCondition on DataSourceAutoConfiguration.PooledDataSourceCondition.PooledDataSourceAvailable PooledDataSource found supported DataSource; NestedCondition on DataSourceAutoConfiguration.PooledDataSourceCondition.ExplicitType @ConditionalOnProperty (spring.datasource.type) did not find property 'spring.datasource.type' (DataSourceAutoConfiguration.PooledDataSourceCondition)
      - @ConditionalOnMissingBean (types: javax.sql.DataSource,javax.sql.XADataSource; SearchStrategy: all) did not find any beans (OnBeanCondition)

   DataSourceAutoConfiguration.PooledDataSourceConfiguration#jdbcConnectionDetails matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.autoconfigure.jdbc.JdbcConnectionDetails; SearchStrategy: all) did not find any beans (OnBeanCondition)

   DataSourceConfiguration.Hikari matched:
      - @ConditionalOnClass found required class 'com.zaxxer.hikari.HikariDataSource' (OnClassCondition)
      - @ConditionalOnProperty (spring.datasource.type=com.zaxxer.hikari.HikariDataSource) matched (OnPropertyCondition)
      - @ConditionalOnMissingBean (types: javax.sql.DataSource; SearchStrategy: all) did not find any beans (OnBeanCondition)

   DataSourceHealthContributorAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'org.springframework.jdbc.core.JdbcTemplate', 'org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource' (OnClassCondition)
      - @ConditionalOnEnabledHealthIndicator management.health.defaults.enabled is considered true (OnEnabledHealthIndicatorCondition)
      - @ConditionalOnBean (types: javax.sql.DataSource; SearchStrategy: all) found bean 'dataSource' (OnBeanCondition)

   DataSourceHealthContributorAutoConfiguration#dbHealthContributor matched:
      - @ConditionalOnMissingBean (names: dbHealthIndicator,dbHealthContributor; SearchStrategy: all) did not find any beans (OnBeanCondition)

   DataSourceInitializationConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.jdbc.datasource.init.DatabasePopulator' (OnClassCondition)
      - @ConditionalOnSingleCandidate (types: javax.sql.DataSource; SearchStrategy: all) found a single bean 'dataSource'; @ConditionalOnMissingBean (types: org.springframework.boot.autoconfigure.sql.init.SqlDataSourceScriptDatabaseInitializer,org.springframework.boot.autoconfigure.sql.init.SqlR2dbcScriptDatabaseInitializer; SearchStrategy: all) did not find any beans (OnBeanCondition)

   DataSourcePoolMetadataProvidersConfiguration.HikariPoolDataSourceMetadataProviderConfiguration matched:
      - @ConditionalOnClass found required class 'com.zaxxer.hikari.HikariDataSource' (OnClassCondition)

   DataSourcePoolMetricsAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'javax.sql.DataSource', 'io.micrometer.core.instrument.MeterRegistry' (OnClassCondition)
      - @ConditionalOnBean (types: javax.sql.DataSource,io.micrometer.core.instrument.MeterRegistry; SearchStrategy: all) found beans 'simpleMeterRegistry', 'dataSource' (OnBeanCondition)

   DataSourcePoolMetricsAutoConfiguration.DataSourcePoolMetadataMetricsConfiguration matched:
      - @ConditionalOnBean (types: org.springframework.boot.jdbc.metadata.DataSourcePoolMetadataProvider; SearchStrategy: all) found bean 'hikariPoolDataSourceMetadataProvider' (OnBeanCondition)

   DataSourcePoolMetricsAutoConfiguration.HikariDataSourceMetricsConfiguration matched:
      - @ConditionalOnClass found required class 'com.zaxxer.hikari.HikariDataSource' (OnClassCondition)

   DataSourceTransactionManagerAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'javax.sql.DataSource', 'org.springframework.jdbc.core.JdbcTemplate', 'org.springframework.transaction.TransactionManager' (OnClassCondition)

   DataSourceTransactionManagerAutoConfiguration.JdbcTransactionManagerConfiguration matched:
      - @ConditionalOnSingleCandidate (types: javax.sql.DataSource; SearchStrategy: all) found a single bean 'dataSource' (OnBeanCondition)

   DiskSpaceHealthContributorAutoConfiguration matched:
      - @ConditionalOnEnabledHealthIndicator management.health.defaults.enabled is considered true (OnEnabledHealthIndicatorCondition)

   DiskSpaceHealthContributorAutoConfiguration#diskSpaceHealthIndicator matched:
      - @ConditionalOnMissingBean (names: diskSpaceHealthIndicator; SearchStrategy: all) did not find any beans (OnBeanCondition)

   DispatcherServletAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.web.servlet.DispatcherServlet' (OnClassCondition)
      - found 'session' scope (OnWebApplicationCondition)

   DispatcherServletAutoConfiguration.DispatcherServletConfiguration matched:
      - @ConditionalOnClass found required class 'jakarta.servlet.ServletRegistration' (OnClassCondition)
      - Default DispatcherServlet did not find dispatcher servlet beans (DispatcherServletAutoConfiguration.DefaultDispatcherServletCondition)

   DispatcherServletAutoConfiguration.DispatcherServletRegistrationConfiguration matched:
      - @ConditionalOnClass found required class 'jakarta.servlet.ServletRegistration' (OnClassCondition)
      - DispatcherServlet Registration did not find servlet registration bean (DispatcherServletAutoConfiguration.DispatcherServletRegistrationCondition)

   DispatcherServletAutoConfiguration.DispatcherServletRegistrationConfiguration#dispatcherServletRegistration matched:
      - @ConditionalOnBean (names: dispatcherServlet types: org.springframework.web.servlet.DispatcherServlet; SearchStrategy: all) found bean 'dispatcherServlet' (OnBeanCondition)

   EndpointAutoConfiguration#endpointCachingOperationInvokerAdvisor matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.endpoint.invoker.cache.CachingOperationInvokerAdvisor; SearchStrategy: all) did not find any beans (OnBeanCondition)

   EndpointAutoConfiguration#endpointOperationParameterMapper matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.endpoint.invoke.ParameterValueMapper; SearchStrategy: all) did not find any beans (OnBeanCondition)

   EndpointAutoConfiguration#propertiesEndpointAccessResolver matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.endpoint.EndpointAccessResolver; SearchStrategy: all) did not find any beans (OnBeanCondition)

   ErrorMvcAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'jakarta.servlet.Servlet', 'org.springframework.web.servlet.DispatcherServlet' (OnClassCondition)
      - found 'session' scope (OnWebApplicationCondition)

   ErrorMvcAutoConfiguration#basicErrorController matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.web.servlet.error.ErrorController; SearchStrategy: current) did not find any beans (OnBeanCondition)

   ErrorMvcAutoConfiguration#errorAttributes matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.web.servlet.error.ErrorAttributes; SearchStrategy: current) did not find any beans (OnBeanCondition)

   ErrorMvcAutoConfiguration.DefaultErrorViewResolverConfiguration#conventionErrorViewResolver matched:
      - @ConditionalOnBean (types: org.springframework.web.servlet.DispatcherServlet; SearchStrategy: all) found bean 'dispatcherServlet'; @ConditionalOnMissingBean (types: org.springframework.boot.autoconfigure.web.servlet.error.ErrorViewResolver; SearchStrategy: all) did not find any beans (OnBeanCondition)

   ErrorMvcAutoConfiguration.WhitelabelErrorViewConfiguration matched:
      - @ConditionalOnBooleanProperty (server.error.whitelabel.enabled=true) matched (OnPropertyCondition)
      - ErrorTemplate Missing did not find error template view (ErrorMvcAutoConfiguration.ErrorTemplateMissingCondition)

   ErrorMvcAutoConfiguration.WhitelabelErrorViewConfiguration#beanNameViewResolver matched:
      - @ConditionalOnMissingBean (types: org.springframework.web.servlet.view.BeanNameViewResolver; SearchStrategy: all) did not find any beans (OnBeanCondition)

   ErrorMvcAutoConfiguration.WhitelabelErrorViewConfiguration#defaultErrorView matched:
      - @ConditionalOnMissingBean (names: error; SearchStrategy: all) did not find any beans (OnBeanCondition)

   GenericCacheConfiguration matched:
      - Cache org.springframework.boot.autoconfigure.cache.GenericCacheConfiguration automatic cache type (CacheCondition)

   HealthContributorAutoConfiguration#pingHealthContributor matched:
      - @ConditionalOnEnabledHealthIndicator management.health.defaults.enabled is considered true (OnEnabledHealthIndicatorCondition)

   HealthEndpointAutoConfiguration matched:
      - @ConditionalOnAvailableEndpoint marked as exposed by a 'management.endpoints.web.exposure' property (OnAvailableEndpointCondition)

   HealthEndpointConfiguration#healthContributorRegistry matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.health.HealthContributorRegistry; SearchStrategy: all) did not find any beans (OnBeanCondition)

   HealthEndpointConfiguration#healthEndpoint matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.health.HealthEndpoint; SearchStrategy: all) did not find any beans (OnBeanCondition)

   HealthEndpointConfiguration#healthEndpointGroupMembershipValidator matched:
      - @ConditionalOnBooleanProperty (management.endpoint.health.validate-group-membership=true) matched (OnPropertyCondition)

   HealthEndpointConfiguration#healthEndpointGroups matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.health.HealthEndpointGroups; SearchStrategy: all) did not find any beans (OnBeanCondition)

   HealthEndpointConfiguration#healthHttpCodeStatusMapper matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.health.HttpCodeStatusMapper; SearchStrategy: all) did not find any beans (OnBeanCondition)

   HealthEndpointConfiguration#healthStatusAggregator matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.health.StatusAggregator; SearchStrategy: all) did not find any beans (OnBeanCondition)

   HealthEndpointWebExtensionConfiguration matched:
      - found 'session' scope (OnWebApplicationCondition)
      - @ConditionalOnAvailableEndpoint marked as exposed by a 'management.endpoints.web.exposure' property (OnAvailableEndpointCondition)
      - @ConditionalOnBean (types: org.springframework.boot.actuate.health.HealthEndpoint; SearchStrategy: all) found bean 'healthEndpoint' (OnBeanCondition)

   HealthEndpointWebExtensionConfiguration#healthEndpointWebExtension matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.health.HealthEndpointWebExtension; SearchStrategy: all) did not find any beans (OnBeanCondition)

   HealthEndpointWebExtensionConfiguration.MvcAdditionalHealthEndpointPathsConfiguration matched:
      - @ConditionalOnBean (types: org.springframework.web.servlet.DispatcherServlet; SearchStrategy: all) found bean 'dispatcherServlet' (OnBeanCondition)

   HibernateJpaAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean', 'jakarta.persistence.EntityManager', 'org.hibernate.engine.spi.SessionImplementor' (OnClassCondition)

   HibernateJpaConfiguration matched:
      - @ConditionalOnSingleCandidate (types: javax.sql.DataSource; SearchStrategy: all) found a single bean 'dataSource' (OnBeanCondition)

   HttpClientAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.http.client.ClientHttpRequestFactory' (OnClassCondition)
      - NoneNestedConditions 0 matched 1 did not; NestedCondition on NotReactiveWebApplicationCondition.ReactiveWebApplication did not find reactive web application classes (NotReactiveWebApplicationCondition)

   HttpClientAutoConfiguration#clientHttpRequestFactoryBuilder matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.http.client.ClientHttpRequestFactoryBuilder<?>; SearchStrategy: all) did not find any beans (OnBeanCondition)

   HttpClientAutoConfiguration#clientHttpRequestFactorySettings matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.http.client.ClientHttpRequestFactorySettings; SearchStrategy: all) did not find any beans (OnBeanCondition)

   HttpClientObservationsAutoConfiguration matched:
      - @ConditionalOnClass found required class 'io.micrometer.observation.Observation' (OnClassCondition)
      - @ConditionalOnBean (types: io.micrometer.observation.ObservationRegistry; SearchStrategy: all) found bean 'observationRegistry' (OnBeanCondition)

   HttpClientObservationsAutoConfiguration.MeterFilterConfiguration matched:
      - @ConditionalOnClass found required class 'io.micrometer.core.instrument.MeterRegistry' (OnClassCondition)
      - @ConditionalOnBean (types: io.micrometer.core.instrument.MeterRegistry; SearchStrategy: all) found bean 'simpleMeterRegistry' (OnBeanCondition)

   HttpEncodingAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.web.filter.CharacterEncodingFilter' (OnClassCondition)
      - found 'session' scope (OnWebApplicationCondition)
      - @ConditionalOnBooleanProperty (server.servlet.encoding.enabled=true) matched (OnPropertyCondition)

   HttpEncodingAutoConfiguration#characterEncodingFilter matched:
      - @ConditionalOnMissingBean (types: org.springframework.web.filter.CharacterEncodingFilter; SearchStrategy: all) did not find any beans (OnBeanCondition)

   HttpMessageConvertersAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.http.converter.HttpMessageConverter' (OnClassCondition)
      - NoneNestedConditions 0 matched 1 did not; NestedCondition on HttpMessageConvertersAutoConfiguration.NotReactiveWebApplicationCondition.ReactiveWebApplication did not find reactive web application classes (HttpMessageConvertersAutoConfiguration.NotReactiveWebApplicationCondition)

   HttpMessageConvertersAutoConfiguration#messageConverters matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.autoconfigure.http.HttpMessageConverters; SearchStrategy: all) did not find any beans (OnBeanCondition)

   HttpMessageConvertersAutoConfiguration.StringHttpMessageConverterConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.http.converter.StringHttpMessageConverter' (OnClassCondition)

   HttpMessageConvertersAutoConfiguration.StringHttpMessageConverterConfiguration#stringHttpMessageConverter matched:
      - @ConditionalOnMissingBean (types: org.springframework.http.converter.StringHttpMessageConverter; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JacksonAutoConfiguration matched:
      - @ConditionalOnClass found required class 'com.fasterxml.jackson.databind.ObjectMapper' (OnClassCondition)

   JacksonAutoConfiguration.Jackson2ObjectMapperBuilderCustomizerConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.http.converter.json.Jackson2ObjectMapperBuilder' (OnClassCondition)

   JacksonAutoConfiguration.JacksonObjectMapperBuilderConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.http.converter.json.Jackson2ObjectMapperBuilder' (OnClassCondition)

   JacksonAutoConfiguration.JacksonObjectMapperBuilderConfiguration#jacksonObjectMapperBuilder matched:
      - @ConditionalOnMissingBean (types: org.springframework.http.converter.json.Jackson2ObjectMapperBuilder; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JacksonAutoConfiguration.JacksonObjectMapperConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.http.converter.json.Jackson2ObjectMapperBuilder' (OnClassCondition)

   JacksonAutoConfiguration.JacksonObjectMapperConfiguration#jacksonObjectMapper matched:
      - @ConditionalOnMissingBean (types: com.fasterxml.jackson.databind.ObjectMapper; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JacksonAutoConfiguration.ParameterNamesModuleConfiguration matched:
      - @ConditionalOnClass found required class 'com.fasterxml.jackson.module.paramnames.ParameterNamesModule' (OnClassCondition)

   JacksonAutoConfiguration.ParameterNamesModuleConfiguration#parameterNamesModule matched:
      - @ConditionalOnMissingBean (types: com.fasterxml.jackson.module.paramnames.ParameterNamesModule; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JacksonEndpointAutoConfiguration#endpointObjectMapper matched:
      - @ConditionalOnClass found required classes 'com.fasterxml.jackson.databind.ObjectMapper', 'org.springframework.http.converter.json.Jackson2ObjectMapperBuilder' (OnClassCondition)
      - @ConditionalOnBooleanProperty (management.endpoints.jackson.isolated-object-mapper=true) matched (OnPropertyCondition)

   JacksonHttpMessageConvertersConfiguration.MappingJackson2HttpMessageConverterConfiguration matched:
      - @ConditionalOnClass found required class 'com.fasterxml.jackson.databind.ObjectMapper' (OnClassCondition)
      - @ConditionalOnPreferredJsonMapper JACKSON no property was configured and Jackson is the default (OnPreferredJsonMapperCondition)
      - @ConditionalOnBean (types: com.fasterxml.jackson.databind.ObjectMapper; SearchStrategy: all) found bean 'jacksonObjectMapper' (OnBeanCondition)

   JacksonHttpMessageConvertersConfiguration.MappingJackson2HttpMessageConverterConfiguration#mappingJackson2HttpMessageConverter matched:
      - @ConditionalOnMissingBean (types: org.springframework.http.converter.json.MappingJackson2HttpMessageConverter ignored: ?; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JdbcClientAutoConfiguration matched:
      - @ConditionalOnSingleCandidate (types: org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate; SearchStrategy: all) found a single bean 'namedParameterJdbcTemplate'; @ConditionalOnMissingBean (types: org.springframework.jdbc.core.simple.JdbcClient; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JdbcTemplateAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'javax.sql.DataSource', 'org.springframework.jdbc.core.JdbcTemplate' (OnClassCondition)
      - @ConditionalOnSingleCandidate (types: javax.sql.DataSource; SearchStrategy: all) found a single bean 'dataSource' (OnBeanCondition)

   JdbcTemplateConfiguration matched:
      - @ConditionalOnMissingBean (types: org.springframework.jdbc.core.JdbcOperations; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JpaBaseConfiguration#entityManagerFactory matched:
      - @ConditionalOnMissingBean (types: org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean,jakarta.persistence.EntityManagerFactory; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JpaBaseConfiguration#entityManagerFactoryBuilder matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JpaBaseConfiguration#jpaVendorAdapter matched:
      - @ConditionalOnMissingBean (types: org.springframework.orm.jpa.JpaVendorAdapter; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JpaBaseConfiguration#transactionManager matched:
      - @ConditionalOnMissingBean (types: org.springframework.transaction.TransactionManager; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JpaBaseConfiguration.JpaWebConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.web.servlet.config.annotation.WebMvcConfigurer' (OnClassCondition)
      - found 'session' scope (OnWebApplicationCondition)
      - @ConditionalOnBooleanProperty (spring.jpa.open-in-view=true) matched (OnPropertyCondition)
      - @ConditionalOnMissingBean (types: org.springframework.orm.jpa.support.OpenEntityManagerInViewInterceptor,org.springframework.orm.jpa.support.OpenEntityManagerInViewFilter; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JpaBaseConfiguration.PersistenceManagedTypesConfiguration matched:
      - @ConditionalOnMissingBean (types: org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean,jakarta.persistence.EntityManagerFactory; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JpaBaseConfiguration.PersistenceManagedTypesConfiguration#persistenceManagedTypes matched:
      - @ConditionalOnMissingBean (types: org.springframework.orm.jpa.persistenceunit.PersistenceManagedTypes; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JpaRepositoriesAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.data.jpa.repository.JpaRepository' (OnClassCondition)
      - @ConditionalOnBooleanProperty (spring.data.jpa.repositories.enabled=true) matched (OnPropertyCondition)
      - @ConditionalOnBean (types: javax.sql.DataSource; SearchStrategy: all) found bean 'dataSource'; @ConditionalOnMissingBean (types: org.springframework.data.jpa.repository.support.JpaRepositoryFactoryBean,org.springframework.data.jpa.repository.config.JpaRepositoryConfigExtension; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JtaAutoConfiguration matched:
      - @ConditionalOnClass found required class 'jakarta.transaction.Transaction' (OnClassCondition)
      - @ConditionalOnBooleanProperty (spring.jta.enabled=true) matched (OnPropertyCondition)

   JvmMetricsAutoConfiguration matched:
      - @ConditionalOnClass found required class 'io.micrometer.core.instrument.MeterRegistry' (OnClassCondition)
      - @ConditionalOnBean (types: io.micrometer.core.instrument.MeterRegistry; SearchStrategy: all) found bean 'simpleMeterRegistry' (OnBeanCondition)

   JvmMetricsAutoConfiguration#classLoaderMetrics matched:
      - @ConditionalOnMissingBean (types: io.micrometer.core.instrument.binder.jvm.ClassLoaderMetrics; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JvmMetricsAutoConfiguration#jvmCompilationMetrics matched:
      - @ConditionalOnMissingBean (types: io.micrometer.core.instrument.binder.jvm.JvmCompilationMetrics; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JvmMetricsAutoConfiguration#jvmGcMetrics matched:
      - @ConditionalOnMissingBean (types: io.micrometer.core.instrument.binder.jvm.JvmGcMetrics; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JvmMetricsAutoConfiguration#jvmHeapPressureMetrics matched:
      - @ConditionalOnMissingBean (types: io.micrometer.core.instrument.binder.jvm.JvmHeapPressureMetrics; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JvmMetricsAutoConfiguration#jvmInfoMetrics matched:
      - @ConditionalOnMissingBean (types: io.micrometer.core.instrument.binder.jvm.JvmInfoMetrics; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JvmMetricsAutoConfiguration#jvmMemoryMetrics matched:
      - @ConditionalOnMissingBean (types: io.micrometer.core.instrument.binder.jvm.JvmMemoryMetrics; SearchStrategy: all) did not find any beans (OnBeanCondition)

   JvmMetricsAutoConfiguration#jvmThreadMetrics matched:
      - @ConditionalOnMissingBean (types: io.micrometer.core.instrument.binder.jvm.JvmThreadMetrics; SearchStrategy: all) did not find any beans (OnBeanCondition)

   LettuceConnectionConfiguration matched:
      - @ConditionalOnClass found required class 'io.lettuce.core.RedisClient' (OnClassCondition)
      - @ConditionalOnProperty (spring.data.redis.client-type=lettuce) matched (OnPropertyCondition)

   LettuceConnectionConfiguration#lettuceClientResources matched:
      - @ConditionalOnMissingBean (types: io.lettuce.core.resource.ClientResources; SearchStrategy: all) did not find any beans (OnBeanCondition)

   LettuceConnectionConfiguration#redisConnectionFactory matched:
      - @ConditionalOnMissingBean (types: org.springframework.data.redis.connection.RedisConnectionFactory; SearchStrategy: all) did not find any beans (OnBeanCondition)
      - @ConditionalOnThreading found PLATFORM (OnThreadingCondition)

   LettuceMetricsAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'io.lettuce.core.RedisClient', 'io.lettuce.core.metrics.MicrometerCommandLatencyRecorder' (OnClassCondition)
      - @ConditionalOnBean (types: io.micrometer.core.instrument.MeterRegistry; SearchStrategy: all) found bean 'simpleMeterRegistry' (OnBeanCondition)

   LettuceMetricsAutoConfiguration#micrometerOptions matched:
      - @ConditionalOnMissingBean (types: io.lettuce.core.metrics.MicrometerOptions; SearchStrategy: all) did not find any beans (OnBeanCondition)

   LifecycleAutoConfiguration#defaultLifecycleProcessor matched:
      - @ConditionalOnMissingBean (names: lifecycleProcessor; SearchStrategy: current) did not find any beans (OnBeanCondition)

   LogbackMetricsAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'io.micrometer.core.instrument.MeterRegistry', 'ch.qos.logback.classic.LoggerContext', 'org.slf4j.LoggerFactory' (OnClassCondition)
      - LogbackLoggingCondition ILoggerFactory is a Logback LoggerContext (LogbackMetricsAutoConfiguration.LogbackLoggingCondition)
      - @ConditionalOnBean (types: io.micrometer.core.instrument.MeterRegistry; SearchStrategy: all) found bean 'simpleMeterRegistry' (OnBeanCondition)

   LogbackMetricsAutoConfiguration#logbackMetrics matched:
      - @ConditionalOnMissingBean (types: io.micrometer.core.instrument.binder.logging.LogbackMetrics; SearchStrategy: all) did not find any beans (OnBeanCondition)

   ManagementContextAutoConfiguration.SameManagementContextConfiguration matched:
      - Management Port actual port type (SAME) matched required type (OnManagementPortCondition)

   MetricsAutoConfiguration matched:
      - @ConditionalOnClass found required class 'io.micrometer.core.annotation.Timed' (OnClassCondition)

   MetricsAutoConfiguration#micrometerClock matched:
      - @ConditionalOnMissingBean (types: io.micrometer.core.instrument.Clock; SearchStrategy: all) did not find any beans (OnBeanCondition)

   MultipartAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'jakarta.servlet.Servlet', 'org.springframework.web.multipart.support.StandardServletMultipartResolver', 'jakarta.servlet.MultipartConfigElement' (OnClassCondition)
      - found 'session' scope (OnWebApplicationCondition)
      - @ConditionalOnBooleanProperty (spring.servlet.multipart.enabled=true) matched (OnPropertyCondition)

   MultipartAutoConfiguration#multipartConfigElement matched:
      - @ConditionalOnMissingBean (types: jakarta.servlet.MultipartConfigElement; SearchStrategy: all) did not find any beans (OnBeanCondition)

   MultipartAutoConfiguration#multipartResolver matched:
      - @ConditionalOnMissingBean (types: org.springframework.web.multipart.MultipartResolver; SearchStrategy: all) did not find any beans (OnBeanCondition)

   MultipleOpenApiSupportConfiguration matched:
      - found 'session' scope (OnWebApplicationCondition)
      - @ConditionalOnProperty (springdoc.api-docs.enabled) matched (OnPropertyCondition)
      - AnyNestedCondition 1 matched 1 did not; NestedCondition on MultipleOpenApiSupportCondition.OnActuatorDifferentPort found non-matching nested conditions Management Port actual port type (SAME) did not match required type (DIFFERENT), @ConditionalOnProperty (springdoc.show-actuator) did not find property 'springdoc.show-actuator'; NestedCondition on MultipleOpenApiSupportCondition.OnMultipleOpenApiSupportCondition AnyNestedCondition 2 matched 1 did not; NestedCondition on MultipleOpenApiGroupsCondition.OnListGroupedOpenApiBean @ConditionalOnBean (types: org.springdoc.core.models.GroupedOpenApi; SearchStrategy: all) found beans 'allApis', 'gameServicesApi'; NestedCondition on MultipleOpenApiGroupsCondition.OnGroupConfigProperty @ConditionalOnProperty (springdoc.group-configs[0].group) did not find property 'springdoc.group-configs[0].group'; NestedCondition on MultipleOpenApiGroupsCondition.OnGroupedOpenApiBean @ConditionalOnBean (types: org.springdoc.core.models.GroupedOpenApi; SearchStrategy: all) found beans 'allApis', 'gameServicesApi' (MultipleOpenApiSupportCondition)

   MultipleOpenApiSupportConfiguration#multipleOpenApiResource matched:
      - @ConditionalOnProperty (springdoc.use-management-port=false) matched (OnPropertyCondition)
      - @ConditionalOnMissingBean (types: org.springdoc.webmvc.api.MultipleOpenApiWebMvcResource; SearchStrategy: all) did not find any beans (OnBeanCondition)

   NamedParameterJdbcTemplateConfiguration matched:
      - @ConditionalOnSingleCandidate (types: org.springframework.jdbc.core.JdbcTemplate; SearchStrategy: all) found a single bean 'jdbcTemplate'; @ConditionalOnMissingBean (types: org.springframework.jdbc.core.namedparam.NamedParameterJdbcOperations; SearchStrategy: all) did not find any beans (OnBeanCondition)

   NettyAutoConfiguration matched:
      - @ConditionalOnClass found required class 'io.netty.util.NettyRuntime' (OnClassCondition)

   NoOpCacheConfiguration matched:
      - Cache org.springframework.boot.autoconfigure.cache.NoOpCacheConfiguration automatic cache type (CacheCondition)

   ObservationAutoConfiguration matched:
      - @ConditionalOnClass found required class 'io.micrometer.observation.ObservationRegistry' (OnClassCondition)

   ObservationAutoConfiguration#observationRegistry matched:
      - @ConditionalOnMissingBean (types: io.micrometer.observation.ObservationRegistry; SearchStrategy: all) did not find any beans (OnBeanCondition)

   ObservationAutoConfiguration.MeterObservationHandlerConfiguration matched:
      - @ConditionalOnBean (types: io.micrometer.core.instrument.MeterRegistry; SearchStrategy: all) found bean 'simpleMeterRegistry'; @ConditionalOnMissingBean (types: io.micrometer.core.instrument.observation.MeterObservationHandler; SearchStrategy: all) did not find any beans (OnBeanCondition)

   ObservationAutoConfiguration.MeterObservationHandlerConfiguration.OnlyMetricsMeterObservationHandlerConfiguration matched:
      - @ConditionalOnMissingBean (types: ?; SearchStrategy: all) did not find any beans (OnBeanCondition)

   ObservationAutoConfiguration.OnlyMetricsConfiguration matched:
      - @ConditionalOnClass found required class 'io.micrometer.core.instrument.MeterRegistry'; @ConditionalOnMissingClass did not find unwanted class 'io.micrometer.tracing.Tracer' (OnClassCondition)

   PersistenceExceptionTranslationAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor' (OnClassCondition)

   PersistenceExceptionTranslationAutoConfiguration#persistenceExceptionTranslationPostProcessor matched:
      - @ConditionalOnBooleanProperty (spring.dao.exceptiontranslation.enabled=true) matched (OnPropertyCondition)
      - @ConditionalOnMissingBean (types: org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor; SearchStrategy: all) did not find any beans (OnBeanCondition)

   PropertyPlaceholderAutoConfiguration#propertySourcesPlaceholderConfigurer matched:
      - @ConditionalOnMissingBean (types: org.springframework.context.support.PropertySourcesPlaceholderConfigurer; SearchStrategy: current) did not find any beans (OnBeanCondition)

   ReactiveHealthEndpointConfiguration matched:
      - @ConditionalOnClass found required class 'reactor.core.publisher.Flux' (OnClassCondition)
      - @ConditionalOnBean (types: org.springframework.boot.actuate.health.HealthEndpoint; SearchStrategy: all) found bean 'healthEndpoint' (OnBeanCondition)

   ReactiveHealthEndpointConfiguration#reactiveHealthContributorRegistry matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.health.ReactiveHealthContributorRegistry; SearchStrategy: all) did not find any beans (OnBeanCondition)

   ReactorAutoConfiguration matched:
      - @ConditionalOnClass found required class 'reactor.core.publisher.Hooks' (OnClassCondition)

   RedisAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.data.redis.core.RedisOperations' (OnClassCondition)

   RedisAutoConfiguration#redisConnectionDetails matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.autoconfigure.data.redis.RedisConnectionDetails; SearchStrategy: all) did not find any beans (OnBeanCondition)

   RedisAutoConfiguration#redisTemplate matched:
      - @ConditionalOnSingleCandidate (types: org.springframework.data.redis.connection.RedisConnectionFactory; SearchStrategy: all) found a single bean 'redisConnectionFactory'; @ConditionalOnMissingBean (names: redisTemplate; SearchStrategy: all) did not find any beans (OnBeanCondition)

   RedisAutoConfiguration#stringRedisTemplate matched:
      - @ConditionalOnSingleCandidate (types: org.springframework.data.redis.connection.RedisConnectionFactory; SearchStrategy: all) found a single bean 'redisConnectionFactory'; @ConditionalOnMissingBean (types: org.springframework.data.redis.core.StringRedisTemplate; SearchStrategy: all) did not find any beans (OnBeanCondition)

   RedisCacheConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.data.redis.connection.RedisConnectionFactory' (OnClassCondition)
      - Cache org.springframework.boot.autoconfigure.cache.RedisCacheConfiguration automatic cache type (CacheCondition)

   RedisHealthContributorAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.data.redis.connection.RedisConnectionFactory' (OnClassCondition)
      - @ConditionalOnEnabledHealthIndicator management.health.defaults.enabled is considered true (OnEnabledHealthIndicatorCondition)
      - @ConditionalOnBean (types: org.springframework.data.redis.connection.RedisConnectionFactory; SearchStrategy: all) found bean 'redisConnectionFactory' (OnBeanCondition)

   RedisReactiveAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'org.springframework.data.redis.connection.ReactiveRedisConnectionFactory', 'org.springframework.data.redis.core.ReactiveRedisTemplate', 'reactor.core.publisher.Flux' (OnClassCondition)

   RedisReactiveAutoConfiguration#reactiveRedisTemplate matched:
      - @ConditionalOnBean (types: org.springframework.data.redis.connection.ReactiveRedisConnectionFactory; SearchStrategy: all) found bean 'redisConnectionFactory'; @ConditionalOnMissingBean (names: reactiveRedisTemplate; SearchStrategy: all) did not find any beans (OnBeanCondition)

   RedisReactiveAutoConfiguration#reactiveStringRedisTemplate matched:
      - @ConditionalOnBean (types: org.springframework.data.redis.connection.ReactiveRedisConnectionFactory; SearchStrategy: all) found bean 'redisConnectionFactory'; @ConditionalOnMissingBean (names: reactiveStringRedisTemplate; SearchStrategy: all) did not find any beans (OnBeanCondition)

   RedisReactiveHealthContributorAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'org.springframework.data.redis.connection.ReactiveRedisConnectionFactory', 'reactor.core.publisher.Flux' (OnClassCondition)
      - @ConditionalOnEnabledHealthIndicator management.health.defaults.enabled is considered true (OnEnabledHealthIndicatorCondition)
      - @ConditionalOnBean (types: org.springframework.data.redis.connection.ReactiveRedisConnectionFactory; SearchStrategy: all) found bean 'redisConnectionFactory' (OnBeanCondition)

   RedisReactiveHealthContributorAutoConfiguration#redisHealthContributor matched:
      - @ConditionalOnMissingBean (names: redisHealthIndicator,redisHealthContributor; SearchStrategy: all) did not find any beans (OnBeanCondition)

   RedisRepositoriesAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.data.redis.repository.configuration.EnableRedisRepositories' (OnClassCondition)
      - @ConditionalOnBooleanProperty (spring.data.redis.repositories.enabled=true) matched (OnPropertyCondition)
      - @ConditionalOnBean (types: org.springframework.data.redis.connection.RedisConnectionFactory; SearchStrategy: all) found bean 'redisConnectionFactory'; @ConditionalOnMissingBean (types: org.springframework.data.redis.repository.support.RedisRepositoryFactoryBean; SearchStrategy: all) did not find any beans (OnBeanCondition)

   RedisSessionConfiguration matched:
      - @ConditionalOnClass found required classes 'org.springframework.data.redis.core.RedisTemplate', 'org.springframework.session.data.redis.RedisIndexedSessionRepository' (OnClassCondition)

   RedisSessionConfiguration.DefaultRedisSessionConfiguration matched:
      - @ConditionalOnProperty (spring.session.redis.repository-type=default) matched (OnPropertyCondition)

   RepositoryMetricsAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.data.repository.Repository' (OnClassCondition)
      - @ConditionalOnBean (types: io.micrometer.core.instrument.MeterRegistry; SearchStrategy: all) found bean 'simpleMeterRegistry' (OnBeanCondition)

   RepositoryMetricsAutoConfiguration#metricsRepositoryMethodInvocationListener matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.metrics.data.MetricsRepositoryMethodInvocationListener; SearchStrategy: all) did not find any beans (OnBeanCondition)

   RepositoryMetricsAutoConfiguration#repositoryTagsProvider matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.metrics.data.RepositoryTagsProvider; SearchStrategy: all) did not find any beans (OnBeanCondition)

   RestClientAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.web.client.RestClient' (OnClassCondition)
      - AnyNestedCondition 1 matched 1 did not; NestedCondition on NotReactiveWebApplicationOrVirtualThreadsExecutorEnabledCondition.VirtualThreadsExecutorEnabled found non-matching nested conditions @ConditionalOnThreading did not find VIRTUAL; NestedCondition on NotReactiveWebApplicationOrVirtualThreadsExecutorEnabledCondition.NotReactiveWebApplication NoneNestedConditions 0 matched 1 did not; NestedCondition on NotReactiveWebApplicationCondition.ReactiveWebApplication did not find reactive web application classes (NotReactiveWebApplicationOrVirtualThreadsExecutorEnabledCondition)

   RestClientAutoConfiguration#httpMessageConvertersRestClientCustomizer matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.autoconfigure.web.client.HttpMessageConvertersRestClientCustomizer; SearchStrategy: all) did not find any beans (OnBeanCondition)

   RestClientAutoConfiguration#restClientBuilder matched:
      - @ConditionalOnMissingBean (types: org.springframework.web.client.RestClient$Builder; SearchStrategy: all) did not find any beans (OnBeanCondition)

   RestClientAutoConfiguration#restClientBuilderConfigurer matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.autoconfigure.web.client.RestClientBuilderConfigurer; SearchStrategy: all) did not find any beans (OnBeanCondition)

   RestClientAutoConfiguration#restClientSsl matched:
      - @ConditionalOnBean (types: org.springframework.boot.ssl.SslBundles; SearchStrategy: all) found bean 'sslBundleRegistry'; @ConditionalOnMissingBean (types: org.springframework.boot.autoconfigure.web.client.RestClientSsl; SearchStrategy: all) did not find any beans (OnBeanCondition)

   RestClientObservationConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.web.client.RestClient' (OnClassCondition)
      - @ConditionalOnBean (types: org.springframework.web.client.RestClient$Builder; SearchStrategy: all) found bean 'restClientBuilder' (OnBeanCondition)

   RestTemplateAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.web.client.RestTemplate' (OnClassCondition)
      - NoneNestedConditions 0 matched 1 did not; NestedCondition on NotReactiveWebApplicationCondition.ReactiveWebApplication did not find reactive web application classes (NotReactiveWebApplicationCondition)

   RestTemplateAutoConfiguration#restTemplateBuilder matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.web.client.RestTemplateBuilder; SearchStrategy: all) did not find any beans (OnBeanCondition)

   RestTemplateObservationConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.web.client.RestTemplate' (OnClassCondition)
      - @ConditionalOnBean (types: org.springframework.boot.web.client.RestTemplateBuilder; SearchStrategy: all) found bean 'restTemplateBuilder' (OnBeanCondition)

   ScheduledTasksObservabilityAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler' (OnClassCondition)
      - @ConditionalOnBean (types: io.micrometer.observation.ObservationRegistry; SearchStrategy: all) found bean 'observationRegistry' (OnBeanCondition)

   SecurityAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.security.authentication.DefaultAuthenticationEventPublisher' (OnClassCondition)

   SecurityAutoConfiguration#authenticationEventPublisher matched:
      - @ConditionalOnMissingBean (types: org.springframework.security.authentication.AuthenticationEventPublisher; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SecurityFilterAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'org.springframework.security.web.context.AbstractSecurityWebApplicationInitializer', 'org.springframework.security.config.http.SessionCreationPolicy' (OnClassCondition)
      - found 'session' scope (OnWebApplicationCondition)

   SecurityFilterAutoConfiguration#securityFilterChainRegistration matched:
      - @ConditionalOnBean (names: springSecurityFilterChain; SearchStrategy: all) found bean 'springSecurityFilterChain' (OnBeanCondition)

   SecurityRequestMatchersManagementContextConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.security.web.util.matcher.RequestMatcher' (OnClassCondition)
      - found 'session' scope (OnWebApplicationCondition)

   SecurityRequestMatchersManagementContextConfiguration.MvcRequestMatcherConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.web.servlet.DispatcherServlet' (OnClassCondition)
      - @ConditionalOnBean (types: org.springframework.boot.autoconfigure.web.servlet.DispatcherServletPath; SearchStrategy: all) found bean 'dispatcherServletRegistration' (OnBeanCondition)

   SecurityRequestMatchersManagementContextConfiguration.MvcRequestMatcherConfiguration#requestMatcherProvider matched:
      - @ConditionalOnClass found required class 'org.springframework.web.servlet.DispatcherServlet' (OnClassCondition)
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.autoconfigure.security.servlet.RequestMatcherProvider; SearchStrategy: all) did not find any beans (OnBeanCondition)

   ServletEndpointManagementContextConfiguration matched:
      - found 'session' scope (OnWebApplicationCondition)

   ServletEndpointManagementContextConfiguration.WebMvcServletEndpointManagementContextConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.web.servlet.DispatcherServlet' (OnClassCondition)

   ServletManagementContextAutoConfiguration matched:
      - @ConditionalOnClass found required class 'jakarta.servlet.Servlet' (OnClassCondition)
      - found 'session' scope (OnWebApplicationCondition)

   ServletWebServerFactoryAutoConfiguration matched:
      - @ConditionalOnClass found required class 'jakarta.servlet.ServletRequest' (OnClassCondition)
      - found 'session' scope (OnWebApplicationCondition)

   ServletWebServerFactoryAutoConfiguration#tomcatServletWebServerFactoryCustomizer matched:
      - @ConditionalOnClass found required class 'org.apache.catalina.startup.Tomcat' (OnClassCondition)

   ServletWebServerFactoryConfiguration.EmbeddedTomcat matched:
      - @ConditionalOnClass found required classes 'jakarta.servlet.Servlet', 'org.apache.catalina.startup.Tomcat', 'org.apache.coyote.UpgradeProtocol' (OnClassCondition)
      - @ConditionalOnMissingBean (types: org.springframework.boot.web.servlet.server.ServletWebServerFactory; SearchStrategy: current) did not find any beans (OnBeanCondition)

   SessionAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.session.Session' (OnClassCondition)
      - @ConditionalOnWebApplication (required) found 'session' scope (OnWebApplicationCondition)

   SessionAutoConfiguration.ServletSessionConfiguration matched:
      - found 'session' scope (OnWebApplicationCondition)

   SessionAutoConfiguration.ServletSessionConfiguration.RememberMeServicesConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.security.web.authentication.RememberMeServices' (OnClassCondition)

   SessionRedisConfig#sessionRedisTemplate matched:
      - @ConditionalOnProperty (app.security.rate-limiting.enabled=false) matched (OnPropertyCondition)

   SessionRepositoryFilterConfiguration matched:
      - @ConditionalOnBean (types: org.springframework.session.web.http.SessionRepositoryFilter; SearchStrategy: all) found bean 'springSessionRepositoryFilter' (OnBeanCondition)

   SimpleCacheConfiguration matched:
      - Cache org.springframework.boot.autoconfigure.cache.SimpleCacheConfiguration automatic cache type (CacheCondition)

   SimpleMetricsExportAutoConfiguration matched:
      - @ConditionalOnEnabledMetricsExport management.simple.metrics.export.enabled is true (OnMetricsExportEnabledCondition)
      - @ConditionalOnBean (types: io.micrometer.core.instrument.Clock; SearchStrategy: all) found bean 'micrometerClock'; @ConditionalOnMissingBean (types: io.micrometer.core.instrument.MeterRegistry; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SimpleMetricsExportAutoConfiguration#simpleConfig matched:
      - @ConditionalOnMissingBean (types: io.micrometer.core.instrument.simple.SimpleConfig; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringBootWebSecurityConfiguration matched:
      - found 'session' scope (OnWebApplicationCondition)

   SpringDataWebAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'org.springframework.data.web.PageableHandlerMethodArgumentResolver', 'org.springframework.web.servlet.config.annotation.WebMvcConfigurer' (OnClassCondition)
      - found 'session' scope (OnWebApplicationCondition)
      - @ConditionalOnMissingBean (types: org.springframework.data.web.PageableHandlerMethodArgumentResolver; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDataWebAutoConfiguration#pageableCustomizer matched:
      - @ConditionalOnMissingBean (types: org.springframework.data.web.config.PageableHandlerMethodArgumentResolverCustomizer; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDataWebAutoConfiguration#sortCustomizer matched:
      - @ConditionalOnMissingBean (types: org.springframework.data.web.config.SortHandlerMethodArgumentResolverCustomizer; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDataWebAutoConfiguration#springDataWebSettings matched:
      - @ConditionalOnMissingBean (types: org.springframework.data.web.config.SpringDataWebSettings; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfigProperties matched:
      - @ConditionalOnProperty (springdoc.api-docs.enabled) matched (OnPropertyCondition)
      - @ConditionalOnBean (types: org.springdoc.core.configuration.SpringDocConfiguration; SearchStrategy: all) found bean 'org.springdoc.core.configuration.SpringDocConfiguration' (OnBeanCondition)

   SpringDocConfiguration matched:
      - @ConditionalOnWebApplication (required) found 'session' scope (OnWebApplicationCondition)
      - @ConditionalOnProperty (springdoc.api-docs.enabled) matched (OnPropertyCondition)

   SpringDocConfiguration#fileSupportConverter matched:
      - @ConditionalOnMissingBean (types: org.springdoc.core.converters.FileSupportConverter; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfiguration#globalOpenApiCustomizer matched:
      - @ConditionalOnMissingBean (names: globalOpenApiCustomizer; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfiguration#initExtraSchemas matched:
      - @ConditionalOnProperty (springdoc.enable-extra-schemas) matched (OnPropertyCondition)

   SpringDocConfiguration#methodParameterPojoExtractor matched:
      - @ConditionalOnMissingBean (types: org.springdoc.core.extractor.MethodParameterPojoExtractor; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfiguration#openAPIBuilder matched:
      - @ConditionalOnMissingBean (types: org.springdoc.core.service.OpenAPIService; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfiguration#operationBuilder matched:
      - @ConditionalOnMissingBean (types: org.springdoc.core.service.OperationService; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfiguration#parameterBuilder matched:
      - @ConditionalOnMissingBean (types: org.springdoc.core.service.GenericParameterService; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfiguration#parameterObjectNamingStrategyCustomizer matched:
      - @ConditionalOnMissingBean (types: org.springdoc.core.customizers.ParameterObjectNamingStrategyCustomizer; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfiguration#polymorphicModelConverter matched:
      - @ConditionalOnProperty (springdoc.model-converters.polymorphic-converter.enabled) matched (OnPropertyCondition)
      - @ConditionalOnMissingBean (types: org.springdoc.core.converters.PolymorphicModelConverter; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfiguration#requestBodyBuilder matched:
      - @ConditionalOnMissingBean (types: org.springdoc.core.service.RequestBodyService; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfiguration#responseSupportConverter matched:
      - @ConditionalOnMissingBean (types: org.springdoc.core.converters.ResponseSupportConverter; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfiguration#schemaPropertyDeprecatingConverter matched:
      - @ConditionalOnProperty (springdoc.model-converters.deprecating-converter.enabled) matched (OnPropertyCondition)
      - @ConditionalOnMissingBean (types: org.springdoc.core.converters.SchemaPropertyDeprecatingConverter; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfiguration#schemaUtils matched:
      - @ConditionalOnMissingBean (types: org.springdoc.core.utils.SchemaUtils; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfiguration#securityParser matched:
      - @ConditionalOnMissingBean (types: org.springdoc.core.service.SecurityService; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfiguration#springDocCustomizers matched:
      - @ConditionalOnMissingBean (types: org.springdoc.core.customizers.SpringDocCustomizers; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfiguration#springDocProviders matched:
      - @ConditionalOnMissingBean (types: org.springdoc.core.providers.SpringDocProviders; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfiguration#springdocBeanFactoryPostProcessor matched:
      - @ConditionalOnClass found required class 'org.springframework.boot.context.properties.bind.BindResult' (OnClassCondition)
      - AnyNestedCondition 1 matched 1 did not; NestedCondition on CacheOrGroupedOpenApiCondition.OnCacheDisabled found non-matching nested conditions @ConditionalOnProperty (springdoc.cache.disabled) did not find property 'springdoc.cache.disabled', @ConditionalOnMissingBean (types: org.springdoc.core.models.GroupedOpenApi; SearchStrategy: all) found beans of type 'org.springdoc.core.models.GroupedOpenApi' gameServicesApi, allApis; NestedCondition on CacheOrGroupedOpenApiCondition.OnMultipleOpenApiSupportCondition AnyNestedCondition 1 matched 1 did not; NestedCondition on MultipleOpenApiSupportCondition.OnActuatorDifferentPort found non-matching nested conditions Management Port actual port type (SAME) did not match required type (DIFFERENT), @ConditionalOnProperty (springdoc.show-actuator) did not find property 'springdoc.show-actuator'; NestedCondition on MultipleOpenApiSupportCondition.OnMultipleOpenApiSupportCondition AnyNestedCondition 2 matched 1 did not; NestedCondition on MultipleOpenApiGroupsCondition.OnListGroupedOpenApiBean @ConditionalOnBean (types: org.springdoc.core.models.GroupedOpenApi; SearchStrategy: all) found beans 'allApis', 'gameServicesApi'; NestedCondition on MultipleOpenApiGroupsCondition.OnGroupConfigProperty @ConditionalOnProperty (springdoc.group-configs[0].group) did not find property 'springdoc.group-configs[0].group'; NestedCondition on MultipleOpenApiGroupsCondition.OnGroupedOpenApiBean @ConditionalOnBean (types: org.springdoc.core.models.GroupedOpenApi; SearchStrategy: all) found beans 'allApis', 'gameServicesApi' (CacheOrGroupedOpenApiCondition)

   SpringDocConfiguration#springdocObjectMapperProvider matched:
      - @ConditionalOnMissingBean (types: org.springdoc.core.providers.ObjectMapperProvider; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfiguration.QuerydslProvider matched:
      - @ConditionalOnClass found required class 'org.springframework.data.querydsl.binding.QuerydslBindingsFactory' (OnClassCondition)

   SpringDocConfiguration.QuerydslProvider#queryDslQuerydslPredicateOperationCustomizer matched:
      - @ConditionalOnMissingBean (types: org.springdoc.core.customizers.QuerydslPredicateOperationCustomizer; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfiguration.SpringDocSpringDataWebPropertiesProvider matched:
      - @ConditionalOnClass found required class 'org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties' (OnClassCondition)

   SpringDocConfiguration.SpringDocSpringDataWebPropertiesProvider#springDataWebPropertiesProvider matched:
      - @ConditionalOnMissingBean (types: org.springdoc.core.providers.SpringDataWebPropertiesProvider; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfiguration.SpringDocWebFluxSupportConfiguration matched:
      - @ConditionalOnClass found required class 'reactor.core.publisher.Flux' (OnClassCondition)

   SpringDocConfiguration.SpringDocWebFluxSupportConfiguration#webFluxSupportConverter matched:
      - @ConditionalOnMissingBean (types: org.springdoc.core.converters.WebFluxSupportConverter; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocConfiguration.WebConversionServiceConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.boot.autoconfigure.web.format.WebConversionService' (OnClassCondition)

   SpringDocPageableConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.data.domain.Pageable' (OnClassCondition)
      - @ConditionalOnWebApplication (required) found 'session' scope (OnWebApplicationCondition)
      - @ConditionalOnProperty (springdoc.api-docs.enabled) matched (OnPropertyCondition)
      - @ConditionalOnBean (types: org.springdoc.core.configuration.SpringDocConfiguration; SearchStrategy: all) found bean 'org.springdoc.core.configuration.SpringDocConfiguration' (OnBeanCondition)

   SpringDocPageableConfiguration#dataRestDelegatingMethodParameterCustomizer matched:
      - @ConditionalOnMissingBean (types: org.springdoc.core.customizers.DataRestDelegatingMethodParameterCustomizer; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocPageableConfiguration#pageOpenAPIConverter matched:
      - @ConditionalOnClass found required classes 'org.springframework.data.web.PagedModel', 'org.springframework.data.web.config.SpringDataWebSettings' (OnClassCondition)
      - @ConditionalOnMissingBean (types: org.springdoc.core.converters.PageOpenAPIConverter; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocPageableConfiguration#pageableOpenAPIConverter matched:
      - @ConditionalOnProperty (springdoc.model-converters.pageable-converter.enabled) matched (OnPropertyCondition)
      - @ConditionalOnMissingBean (types: org.springdoc.core.converters.PageableOpenAPIConverter; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocSecurityConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.security.web.SecurityFilterChain' (OnClassCondition)
      - @ConditionalOnWebApplication (required) found 'session' scope (OnWebApplicationCondition)
      - @ConditionalOnExpression (#{${springdoc.api-docs.enabled:true} and ${springdoc.enable-spring-security:true}}) resulted in true (OnExpressionCondition)
      - @ConditionalOnBean (types: org.springdoc.core.configuration.SpringDocConfiguration; SearchStrategy: all) found bean 'org.springdoc.core.configuration.SpringDocConfiguration' (OnBeanCondition)

   SpringDocSecurityConfiguration.SpringSecurityLoginEndpointConfiguration matched:
      - @ConditionalOnClass found required class 'jakarta.servlet.Filter' (OnClassCondition)

   SpringDocSortConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.data.domain.Sort' (OnClassCondition)
      - @ConditionalOnWebApplication (required) found 'session' scope (OnWebApplicationCondition)
      - @ConditionalOnProperty (springdoc.api-docs.enabled) matched (OnPropertyCondition)
      - @ConditionalOnBean (types: org.springdoc.core.configuration.SpringDocConfiguration; SearchStrategy: all) found bean 'org.springdoc.core.configuration.SpringDocConfiguration' (OnBeanCondition)

   SpringDocSortConfiguration#sortOpenAPIConverter matched:
      - @ConditionalOnProperty (springdoc.sort-converter.enabled) matched (OnPropertyCondition)
      - @ConditionalOnMissingBean (types: org.springdoc.core.converters.SortOpenAPIConverter; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocWebMvcConfiguration matched:
      - found 'session' scope (OnWebApplicationCondition)
      - @ConditionalOnProperty (springdoc.api-docs.enabled) matched (OnPropertyCondition)
      - @ConditionalOnBean (types: org.springdoc.core.configuration.SpringDocConfiguration; SearchStrategy: all) found bean 'org.springdoc.core.configuration.SpringDocConfiguration' (OnBeanCondition)

   SpringDocWebMvcConfiguration#openApiResource matched:
      - @ConditionalOnExpression (#{(${springdoc.use-management-port:false} == false ) and ${springdoc.enable-default-api-docs:true}}) resulted in true (OnExpressionCondition)
      - @ConditionalOnMissingBean (types: org.springdoc.webmvc.api.OpenApiWebMvcResource; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocWebMvcConfiguration#requestBuilder matched:
      - @ConditionalOnMissingBean (types: org.springdoc.webmvc.core.service.RequestService; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocWebMvcConfiguration#responseBuilder matched:
      - @ConditionalOnMissingBean (types: org.springdoc.core.service.GenericResponseService; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocWebMvcConfiguration#springWebProvider matched:
      - @ConditionalOnMissingBean (types: org.springdoc.core.providers.SpringWebProvider; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SpringDocWebMvcConfiguration.SpringDocWebMvcActuatorConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.boot.actuate.endpoint.web.servlet.WebMvcEndpointHandlerMapping' (OnClassCondition)

   SpringDocWebMvcConfiguration.SpringDocWebMvcRouterConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.web.servlet.function.RouterFunction' (OnClassCondition)

   SpringDocWebMvcConfiguration.SpringDocWebMvcRouterConfiguration#routerFunctionProvider matched:
      - @ConditionalOnMissingBean (types: org.springdoc.webmvc.core.providers.RouterFunctionWebMvcProvider; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SqlInitializationAutoConfiguration matched:
      - @ConditionalOnBooleanProperty (spring.sql.init.enabled=true) matched (OnPropertyCondition)
      - NoneNestedConditions 0 matched 1 did not; NestedCondition on SqlInitializationAutoConfiguration.SqlInitializationModeCondition.ModeIsNever @ConditionalOnProperty (spring.sql.init.mode=never) did not find property 'spring.sql.init.mode' (SqlInitializationAutoConfiguration.SqlInitializationModeCondition)

   SslAutoConfiguration#sslBundleRegistry matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.ssl.SslBundleRegistry,org.springframework.boot.ssl.SslBundles; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SslHealthContributorAutoConfiguration matched:
      - @ConditionalOnEnabledHealthIndicator management.health.defaults.enabled is considered true (OnEnabledHealthIndicatorCondition)

   SslHealthContributorAutoConfiguration#sslHealthIndicator matched:
      - @ConditionalOnMissingBean (names: sslHealthIndicator; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SslHealthContributorAutoConfiguration#sslInfo matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.info.SslInfo; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SslObservabilityAutoConfiguration matched:
      - @ConditionalOnClass found required class 'io.micrometer.core.instrument.MeterRegistry' (OnClassCondition)
      - @ConditionalOnBean (types: io.micrometer.core.instrument.MeterRegistry,org.springframework.boot.ssl.SslBundles; SearchStrategy: all) found beans 'sslBundleRegistry', 'simpleMeterRegistry' (OnBeanCondition)

   StartupTimeMetricsListenerAutoConfiguration matched:
      - @ConditionalOnClass found required class 'io.micrometer.core.instrument.MeterRegistry' (OnClassCondition)
      - @ConditionalOnBean (types: io.micrometer.core.instrument.MeterRegistry; SearchStrategy: all) found bean 'simpleMeterRegistry' (OnBeanCondition)

   StartupTimeMetricsListenerAutoConfiguration#startupTimeMetrics matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.metrics.startup.StartupTimeMetricsListener; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SwaggerConfig matched:
      - found 'session' scope (OnWebApplicationCondition)
      - @ConditionalOnProperty (springdoc.swagger-ui.enabled) matched (OnPropertyCondition)
      - @ConditionalOnBean (types: org.springdoc.core.configuration.SpringDocConfiguration; SearchStrategy: all) found bean 'org.springdoc.core.configuration.SpringDocConfiguration' (OnBeanCondition)

   SwaggerConfig#indexPageTransformer matched:
      - @ConditionalOnMissingBean (types: org.springdoc.webmvc.ui.SwaggerIndexTransformer; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SwaggerConfig#swaggerConfigResource matched:
      - @ConditionalOnProperty (springdoc.use-management-port=false) matched (OnPropertyCondition)
      - @ConditionalOnMissingBean (types: org.springdoc.webmvc.ui.SwaggerConfigResource; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SwaggerConfig#swaggerResourceResolver matched:
      - @ConditionalOnMissingBean (types: org.springdoc.webmvc.ui.SwaggerResourceResolver; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SwaggerConfig#swaggerWebMvcConfigurer matched:
      - @ConditionalOnMissingBean (types: org.springdoc.webmvc.ui.SwaggerWebMvcConfigurer; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SwaggerConfig#swaggerWelcome matched:
      - @ConditionalOnProperty (springdoc.use-management-port=false) matched (OnPropertyCondition)
      - @ConditionalOnMissingBean (types: org.springdoc.webmvc.ui.SwaggerWelcomeWebMvc; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SwaggerUiConfigProperties matched:
      - @ConditionalOnProperty (springdoc.swagger-ui.enabled) matched (OnPropertyCondition)
      - @ConditionalOnBean (types: org.springdoc.core.configuration.SpringDocConfiguration; SearchStrategy: all) found bean 'org.springdoc.core.configuration.SpringDocConfiguration' (OnBeanCondition)

   SwaggerUiOAuthProperties matched:
      - @ConditionalOnProperty (springdoc.swagger-ui.enabled) matched (OnPropertyCondition)
      - @ConditionalOnBean (types: org.springdoc.core.configuration.SpringDocConfiguration; SearchStrategy: all) found bean 'org.springdoc.core.configuration.SpringDocConfiguration' (OnBeanCondition)

   SystemMetricsAutoConfiguration matched:
      - @ConditionalOnClass found required class 'io.micrometer.core.instrument.MeterRegistry' (OnClassCondition)
      - @ConditionalOnBean (types: io.micrometer.core.instrument.MeterRegistry; SearchStrategy: all) found bean 'simpleMeterRegistry' (OnBeanCondition)

   SystemMetricsAutoConfiguration#diskSpaceMetrics matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.metrics.system.DiskSpaceMetricsBinder; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SystemMetricsAutoConfiguration#fileDescriptorMetrics matched:
      - @ConditionalOnMissingBean (types: io.micrometer.core.instrument.binder.system.FileDescriptorMetrics; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SystemMetricsAutoConfiguration#processorMetrics matched:
      - @ConditionalOnMissingBean (types: io.micrometer.core.instrument.binder.system.ProcessorMetrics; SearchStrategy: all) did not find any beans (OnBeanCondition)

   SystemMetricsAutoConfiguration#uptimeMetrics matched:
      - @ConditionalOnMissingBean (types: io.micrometer.core.instrument.binder.system.UptimeMetrics; SearchStrategy: all) did not find any beans (OnBeanCondition)

   TaskExecutionAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor' (OnClassCondition)

   TaskExecutorConfigurations.AsyncConfigurerConfiguration matched:
      - @ConditionalOnMissingBean (types: org.springframework.scheduling.annotation.AsyncConfigurer; SearchStrategy: all) did not find any beans (OnBeanCondition)

   TaskExecutorConfigurations.AsyncConfigurerConfiguration#applicationTaskExecutorAsyncConfigurer matched:
      - @ConditionalOnMissingBean (types: org.springframework.scheduling.annotation.AsyncConfigurer; SearchStrategy: all) did not find any beans (OnBeanCondition)

   TaskExecutorConfigurations.SimpleAsyncTaskExecutorBuilderConfiguration#simpleAsyncTaskExecutorBuilder matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.task.SimpleAsyncTaskExecutorBuilder; SearchStrategy: all) did not find any beans (OnBeanCondition)
      - @ConditionalOnThreading found PLATFORM (OnThreadingCondition)

   TaskExecutorConfigurations.TaskExecutorConfiguration matched:
      - AnyNestedCondition 1 matched 1 did not; NestedCondition on TaskExecutorConfigurations.OnExecutorCondition.ModelCondition @ConditionalOnProperty (spring.task.execution.mode=force) did not find property 'spring.task.execution.mode'; NestedCondition on TaskExecutorConfigurations.OnExecutorCondition.ExecutorBeanCondition @ConditionalOnMissingBean (types: java.util.concurrent.Executor; SearchStrategy: all) did not find any beans (TaskExecutorConfigurations.OnExecutorCondition)

   TaskExecutorConfigurations.TaskExecutorConfiguration#applicationTaskExecutor matched:
      - @ConditionalOnThreading found PLATFORM (OnThreadingCondition)

   TaskExecutorConfigurations.ThreadPoolTaskExecutorBuilderConfiguration#threadPoolTaskExecutorBuilder matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.task.ThreadPoolTaskExecutorBuilder; SearchStrategy: all) did not find any beans (OnBeanCondition)

   TaskExecutorMetricsAutoConfiguration matched:
      - @ConditionalOnClass found required class 'io.micrometer.core.instrument.binder.jvm.ExecutorServiceMetrics' (OnClassCondition)
      - @ConditionalOnBean (types: java.util.concurrent.Executor,io.micrometer.core.instrument.MeterRegistry; SearchStrategy: all) found beans 'applicationTaskExecutor', 'simpleMeterRegistry', 'taskScheduler' (OnBeanCondition)

   TaskSchedulingAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler' (OnClassCondition)

   TaskSchedulingAutoConfiguration#scheduledBeanLazyInitializationExcludeFilter matched:
      - @ConditionalOnBean (names: org.springframework.context.annotation.internalScheduledAnnotationProcessor; SearchStrategy: all) found bean 'org.springframework.context.annotation.internalScheduledAnnotationProcessor' (OnBeanCondition)

   TaskSchedulingConfigurations.SimpleAsyncTaskSchedulerBuilderConfiguration#simpleAsyncTaskSchedulerBuilder matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.task.SimpleAsyncTaskSchedulerBuilder; SearchStrategy: all) did not find any beans (OnBeanCondition)
      - @ConditionalOnThreading found PLATFORM (OnThreadingCondition)

   TaskSchedulingConfigurations.TaskSchedulerConfiguration matched:
      - @ConditionalOnBean (names: org.springframework.context.annotation.internalScheduledAnnotationProcessor; SearchStrategy: all) found bean 'org.springframework.context.annotation.internalScheduledAnnotationProcessor'; @ConditionalOnMissingBean (types: org.springframework.scheduling.TaskScheduler,java.util.concurrent.ScheduledExecutorService; SearchStrategy: all) did not find any beans (OnBeanCondition)

   TaskSchedulingConfigurations.TaskSchedulerConfiguration#taskScheduler matched:
      - @ConditionalOnThreading found PLATFORM (OnThreadingCondition)

   TaskSchedulingConfigurations.ThreadPoolTaskSchedulerBuilderConfiguration#threadPoolTaskSchedulerBuilder matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.task.ThreadPoolTaskSchedulerBuilder; SearchStrategy: all) did not find any beans (OnBeanCondition)

   TomcatMetricsAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'io.micrometer.core.instrument.binder.tomcat.TomcatMetrics', 'org.apache.catalina.Manager' (OnClassCondition)
      - @ConditionalOnWebApplication (required) found 'session' scope (OnWebApplicationCondition)

   TomcatMetricsAutoConfiguration#tomcatMetricsBinder matched:
      - @ConditionalOnBean (types: io.micrometer.core.instrument.MeterRegistry; SearchStrategy: all) found bean 'simpleMeterRegistry'; @ConditionalOnMissingBean (types: io.micrometer.core.instrument.binder.tomcat.TomcatMetrics,org.springframework.boot.actuate.metrics.web.tomcat.TomcatMetricsBinder; SearchStrategy: all) did not find any beans (OnBeanCondition)

   TransactionAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.transaction.PlatformTransactionManager' (OnClassCondition)

   TransactionAutoConfiguration.EnableTransactionManagementConfiguration matched:
      - @ConditionalOnBean (types: org.springframework.transaction.TransactionManager; SearchStrategy: all) found bean 'transactionManager'; @ConditionalOnMissingBean (types: org.springframework.transaction.annotation.AbstractTransactionManagementConfiguration; SearchStrategy: all) did not find any beans (OnBeanCondition)

   TransactionAutoConfiguration.EnableTransactionManagementConfiguration.CglibAutoProxyConfiguration matched:
      - @ConditionalOnBooleanProperty (spring.aop.proxy-target-class=true) matched (OnPropertyCondition)

   TransactionAutoConfiguration.TransactionTemplateConfiguration matched:
      - @ConditionalOnSingleCandidate (types: org.springframework.transaction.PlatformTransactionManager; SearchStrategy: all) found a single bean 'transactionManager' (OnBeanCondition)

   TransactionAutoConfiguration.TransactionTemplateConfiguration#transactionTemplate matched:
      - @ConditionalOnMissingBean (types: org.springframework.transaction.support.TransactionOperations; SearchStrategy: all) did not find any beans (OnBeanCondition)

   TransactionManagerCustomizationAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.transaction.PlatformTransactionManager' (OnClassCondition)

   TransactionManagerCustomizationAutoConfiguration#platformTransactionManagerCustomizers matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.autoconfigure.transaction.TransactionManagerCustomizers; SearchStrategy: all) did not find any beans (OnBeanCondition)

   ValidationAutoConfiguration matched:
      - @ConditionalOnClass found required class 'jakarta.validation.executable.ExecutableValidator' (OnClassCondition)
      - @ConditionalOnResource found location classpath:META-INF/services/jakarta.validation.spi.ValidationProvider (OnResourceCondition)

   ValidationAutoConfiguration#defaultValidator matched:
      - @ConditionalOnMissingBean (types: jakarta.validation.Validator; SearchStrategy: all) did not find any beans (OnBeanCondition)

   ValidationAutoConfiguration#methodValidationPostProcessor matched:
      - @ConditionalOnMissingBean (types: org.springframework.validation.beanvalidation.MethodValidationPostProcessor; SearchStrategy: current) did not find any beans (OnBeanCondition)

   WebEndpointAutoConfiguration matched:
      - @ConditionalOnWebApplication (required) found 'session' scope (OnWebApplicationCondition)

   WebEndpointAutoConfiguration#controllerEndpointDiscoverer matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.endpoint.web.annotation.ControllerEndpointsSupplier; SearchStrategy: all) did not find any beans (OnBeanCondition)

   WebEndpointAutoConfiguration#endpointMediaTypes matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.endpoint.web.EndpointMediaTypes; SearchStrategy: all) did not find any beans (OnBeanCondition)

   WebEndpointAutoConfiguration#pathMappedEndpoints matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.endpoint.web.PathMappedEndpoints; SearchStrategy: all) did not find any beans (OnBeanCondition)

   WebEndpointAutoConfiguration#webEndpointDiscoverer matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.endpoint.web.WebEndpointsSupplier; SearchStrategy: all) did not find any beans (OnBeanCondition)

   WebEndpointAutoConfiguration.WebEndpointServletConfiguration matched:
      - found 'session' scope (OnWebApplicationCondition)

   WebEndpointAutoConfiguration.WebEndpointServletConfiguration#servletEndpointDiscoverer matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.endpoint.web.annotation.ServletEndpointsSupplier; SearchStrategy: all) did not find any beans (OnBeanCondition)

   WebMvcAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'jakarta.servlet.Servlet', 'org.springframework.web.servlet.DispatcherServlet', 'org.springframework.web.servlet.config.annotation.WebMvcConfigurer' (OnClassCondition)
      - found 'session' scope (OnWebApplicationCondition)
      - @ConditionalOnMissingBean (types: org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport; SearchStrategy: all) did not find any beans (OnBeanCondition)

   WebMvcAutoConfiguration#formContentFilter matched:
      - @ConditionalOnBooleanProperty (spring.mvc.formcontent.filter.enabled=true) matched (OnPropertyCondition)
      - @ConditionalOnMissingBean (types: org.springframework.web.filter.FormContentFilter; SearchStrategy: all) did not find any beans (OnBeanCondition)

   WebMvcAutoConfiguration.EnableWebMvcConfiguration#flashMapManager matched:
      - @ConditionalOnMissingBean (names: flashMapManager; SearchStrategy: all) did not find any beans (OnBeanCondition)

   WebMvcAutoConfiguration.EnableWebMvcConfiguration#localeResolver matched:
      - @ConditionalOnMissingBean (names: localeResolver; SearchStrategy: all) did not find any beans (OnBeanCondition)

   WebMvcAutoConfiguration.EnableWebMvcConfiguration#themeResolver matched:
      - @ConditionalOnMissingBean (names: themeResolver; SearchStrategy: all) did not find any beans (OnBeanCondition)

   WebMvcAutoConfiguration.EnableWebMvcConfiguration#viewNameTranslator matched:
      - @ConditionalOnMissingBean (names: viewNameTranslator; SearchStrategy: all) did not find any beans (OnBeanCondition)

   WebMvcAutoConfiguration.ResourceChainCustomizerConfiguration matched:
      - @ConditionalOnEnabledResourceChain found class org.webjars.WebJarVersionLocator (OnEnabledResourceChainCondition)

   WebMvcAutoConfiguration.WebMvcAutoConfigurationAdapter#defaultViewResolver matched:
      - @ConditionalOnMissingBean (types: org.springframework.web.servlet.view.InternalResourceViewResolver; SearchStrategy: all) did not find any beans (OnBeanCondition)

   WebMvcAutoConfiguration.WebMvcAutoConfigurationAdapter#requestContextFilter matched:
      - @ConditionalOnMissingBean (types: org.springframework.web.context.request.RequestContextListener,org.springframework.web.filter.RequestContextFilter; SearchStrategy: all) did not find any beans (OnBeanCondition)

   WebMvcAutoConfiguration.WebMvcAutoConfigurationAdapter#viewResolver matched:
      - @ConditionalOnBean (types: org.springframework.web.servlet.ViewResolver; SearchStrategy: all) found beans 'defaultViewResolver', 'beanNameViewResolver', 'mvcViewResolver'; @ConditionalOnMissingBean (names: viewResolver types: org.springframework.web.servlet.view.ContentNegotiatingViewResolver; SearchStrategy: all) did not find any beans (OnBeanCondition)

   WebMvcEndpointManagementContextConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.web.servlet.DispatcherServlet' (OnClassCondition)
      - found 'session' scope (OnWebApplicationCondition)
      - @ConditionalOnBean (types: org.springframework.web.servlet.DispatcherServlet,org.springframework.boot.actuate.endpoint.web.WebEndpointsSupplier; SearchStrategy: all) found beans 'webEndpointDiscoverer', 'dispatcherServlet' (OnBeanCondition)

   WebMvcEndpointManagementContextConfiguration#controllerEndpointHandlerMapping matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.endpoint.web.servlet.ControllerEndpointHandlerMapping; SearchStrategy: all) did not find any beans (OnBeanCondition)

   WebMvcEndpointManagementContextConfiguration#endpointObjectMapperWebMvcConfigurer matched:
      - @ConditionalOnBean (types: org.springframework.boot.actuate.endpoint.jackson.EndpointObjectMapper; SearchStrategy: all) found bean 'endpointObjectMapper' (OnBeanCondition)

   WebMvcEndpointManagementContextConfiguration#webEndpointServletHandlerMapping matched:
      - @ConditionalOnMissingBean (types: org.springframework.boot.actuate.endpoint.web.servlet.WebMvcEndpointHandlerMapping; SearchStrategy: all) did not find any beans (OnBeanCondition)

   WebMvcObservationAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'org.springframework.web.servlet.DispatcherServlet', 'io.micrometer.observation.Observation' (OnClassCondition)
      - found 'session' scope (OnWebApplicationCondition)
      - @ConditionalOnBean (types: io.micrometer.observation.ObservationRegistry; SearchStrategy: all) found bean 'observationRegistry' (OnBeanCondition)

   WebMvcObservationAutoConfiguration#webMvcObservationFilter matched:
      - @ConditionalOnMissingBean (types: org.springframework.web.filter.ServerHttpObservationFilter; SearchStrategy: all) did not find any beans (OnBeanCondition)

   WebMvcObservationAutoConfiguration.MeterFilterConfiguration matched:
      - @ConditionalOnClass found required class 'io.micrometer.core.instrument.MeterRegistry' (OnClassCondition)
      - @ConditionalOnBean (types: io.micrometer.core.instrument.MeterRegistry; SearchStrategy: all) found bean 'simpleMeterRegistry' (OnBeanCondition)

   WebSocketServletAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'jakarta.servlet.Servlet', 'jakarta.websocket.server.ServerContainer' (OnClassCondition)
      - found 'session' scope (OnWebApplicationCondition)

   WebSocketServletAutoConfiguration.TomcatWebSocketConfiguration matched:
      - @ConditionalOnClass found required classes 'org.apache.catalina.startup.Tomcat', 'org.apache.tomcat.websocket.server.WsSci' (OnClassCondition)

   WebSocketServletAutoConfiguration.TomcatWebSocketConfiguration#websocketServletWebServerCustomizer matched:
      - @ConditionalOnMissingBean (names: websocketServletWebServerCustomizer; SearchStrategy: all) did not find any beans (OnBeanCondition)


Negative matches:
-----------------

   ActiveMQAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'jakarta.jms.ConnectionFactory' (OnClassCondition)

   AopAutoConfiguration.AspectJAutoProxyingConfiguration.JdkDynamicAutoProxyConfiguration:
      Did not match:
         - @ConditionalOnBooleanProperty (spring.aop.proxy-target-class=false) did not find property 'spring.aop.proxy-target-class' (OnPropertyCondition)

   AopAutoConfiguration.ClassProxyingConfiguration:
      Did not match:
         - @ConditionalOnMissingClass found unwanted class 'org.aspectj.weaver.Advice' (OnClassCondition)

   AppOpticsMetricsExportAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.appoptics.AppOpticsMeterRegistry' (OnClassCondition)

   ArtemisAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'jakarta.jms.ConnectionFactory' (OnClassCondition)

   AtlasMetricsExportAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.atlas.AtlasMeterRegistry' (OnClassCondition)

   AuditAutoConfiguration:
      Did not match:
         - @ConditionalOnBean (types: org.springframework.boot.actuate.audit.AuditEventRepository; SearchStrategy: all) did not find any beans of type org.springframework.boot.actuate.audit.AuditEventRepository (OnBeanCondition)
      Matched:
         - @ConditionalOnBooleanProperty (management.auditevents.enabled=true) matched (OnPropertyCondition)

   AuditEventsEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnAvailableEndpoint not exposed (OnAvailableEndpointCondition)

   AvailabilityHealthContributorAutoConfiguration#livenessStateHealthIndicator:
      Did not match:
         - @ConditionalOnBooleanProperty (management.health.livenessstate.enabled=true) did not find property 'management.health.livenessstate.enabled' (OnPropertyCondition)

   AvailabilityHealthContributorAutoConfiguration#readinessStateHealthIndicator:
      Did not match:
         - @ConditionalOnBooleanProperty (management.health.readinessstate.enabled=true) did not find property 'management.health.readinessstate.enabled' (OnPropertyCondition)

   AvailabilityProbesAutoConfiguration:
      Did not match:
         - Probes availability not running on a supported cloud platform (AvailabilityProbesAutoConfiguration.ProbesCondition)

   BatchAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.batch.core.launch.JobLauncher' (OnClassCondition)

   BatchObservationAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.batch.core.configuration.annotation.BatchObservabilityBeanPostProcessor' (OnClassCondition)

   BeansEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnAvailableEndpoint not exposed (OnAvailableEndpointCondition)

   BraveAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'brave.Tracer' (OnClassCondition)

   Cache2kCacheConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.cache2k.Cache2kBuilder' (OnClassCondition)

   CacheAutoConfiguration:
      Did not match:
         - @ConditionalOnBean (types: org.springframework.cache.interceptor.CacheAspectSupport; SearchStrategy: all) did not find any beans of type org.springframework.cache.interceptor.CacheAspectSupport (OnBeanCondition)
      Matched:
         - @ConditionalOnClass found required class 'org.springframework.cache.CacheManager' (OnClassCondition)

   CacheAutoConfiguration.CacheManagerEntityManagerFactoryDependsOnPostProcessor:
      Did not match:
         - Ancestor org.springframework.boot.autoconfigure.cache.CacheAutoConfiguration did not match (ConditionEvaluationReport.AncestorsMatchedCondition)
      Matched:
         - @ConditionalOnClass found required class 'org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean' (OnClassCondition)

   CacheMeterBinderProvidersConfiguration.Cache2kCacheMeterBinderProviderConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required classes 'org.cache2k.Cache2kBuilder', 'org.cache2k.extra.spring.SpringCache2kCache', 'org.cache2k.extra.micrometer.Cache2kCacheMetrics' (OnClassCondition)

   CacheMeterBinderProvidersConfiguration.CaffeineCacheMeterBinderProviderConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.github.benmanes.caffeine.cache.Cache' (OnClassCondition)

   CacheMeterBinderProvidersConfiguration.HazelcastCacheMeterBinderProviderConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required classes 'com.hazelcast.spring.cache.HazelcastCache', 'com.hazelcast.core.Hazelcast' (OnClassCondition)

   CacheMeterBinderProvidersConfiguration.JCacheCacheMeterBinderProviderConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'javax.cache.CacheManager' (OnClassCondition)

   CacheMetricsAutoConfiguration:
      Did not match:
         - @ConditionalOnBean (types: org.springframework.cache.CacheManager; SearchStrategy: all) did not find any beans of type org.springframework.cache.CacheManager (OnBeanCondition)

   CachesEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnAvailableEndpoint not exposed (OnAvailableEndpointCondition)
      Matched:
         - @ConditionalOnClass found required class 'org.springframework.cache.CacheManager' (OnClassCondition)

   CaffeineCacheConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.github.benmanes.caffeine.cache.Caffeine' (OnClassCondition)

   CassandraAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.datastax.oss.driver.api.core.CqlSession' (OnClassCondition)

   CassandraDataAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.datastax.oss.driver.api.core.CqlSession' (OnClassCondition)

   CassandraHealthContributorAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.datastax.oss.driver.api.core.CqlSession' (OnClassCondition)

   CassandraReactiveDataAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.datastax.oss.driver.api.core.CqlSession' (OnClassCondition)

   CassandraReactiveHealthContributorAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.datastax.oss.driver.api.core.CqlSession' (OnClassCondition)

   CassandraReactiveRepositoriesAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.data.cassandra.ReactiveSession' (OnClassCondition)

   CassandraRepositoriesAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.datastax.oss.driver.api.core.CqlSession' (OnClassCondition)

   org.springframework.boot.autoconfigure.web.reactive.function.client.ClientHttpConnectorAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.web.reactive.function.client.WebClient' (OnClassCondition)

   ClientHttpConnectorAutoConfiguration.ReactorNetty:
      Did not match:
         - @ConditionalOnClass did not find required class 'reactor.netty.http.client.HttpClient' (OnClassCondition)

   CloudFoundryActuatorAutoConfiguration:
      Did not match:
         - @ConditionalOnCloudPlatform did not find CLOUD_FOUNDRY (OnCloudPlatformCondition)
      Matched:
         - @ConditionalOnClass found required class 'org.springframework.web.servlet.DispatcherServlet' (OnClassCondition)
         - found 'session' scope (OnWebApplicationCondition)
         - @ConditionalOnBooleanProperty (management.cloudfoundry.enabled=true) matched (OnPropertyCondition)

   CodecsAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.web.reactive.function.client.WebClient' (OnClassCondition)

   CompositeMeterRegistryConfiguration:
      Did not match:
         - NoneNestedConditions 1 matched 1 did not; NestedCondition on CompositeMeterRegistryConfiguration.MultipleNonPrimaryMeterRegistriesCondition.SingleInjectableMeterRegistry @ConditionalOnSingleCandidate (types: io.micrometer.core.instrument.MeterRegistry; SearchStrategy: all) found a single bean 'simpleMeterRegistry'; NestedCondition on CompositeMeterRegistryConfiguration.MultipleNonPrimaryMeterRegistriesCondition.NoMeterRegistryCondition @ConditionalOnMissingBean (types: io.micrometer.core.instrument.MeterRegistry; SearchStrategy: all) found beans of type 'io.micrometer.core.instrument.MeterRegistry' simpleMeterRegistry (CompositeMeterRegistryConfiguration.MultipleNonPrimaryMeterRegistriesCondition)

2025-09-04 20:21:02 -
   ConditionsReportEndpointAutoConfiguration:
      Did not match:

         - @ConditionalOnAvailableEndpoint not exposed (OnAvailableEndpointCondition)
Error starting ApplicationContext. To display the condition evaluation report re-run your application with 'debug' enabled.

   ConfigurationPropertiesReportEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnAvailableEndpoint not exposed (OnAvailableEndpointCondition)

   ConnectionFactoryHealthContributorAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.r2dbc.spi.ConnectionFactory' (OnClassCondition)

   ConnectionPoolMetricsAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.r2dbc.pool.ConnectionPool' (OnClassCondition)

   CouchbaseAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.couchbase.client.java.Cluster' (OnClassCondition)

   CouchbaseCacheConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.couchbase.client.java.Cluster' (OnClassCondition)

   CouchbaseDataAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.couchbase.client.java.Bucket' (OnClassCondition)

   CouchbaseHealthContributorAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.couchbase.client.java.Cluster' (OnClassCondition)

   CouchbaseReactiveDataAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.couchbase.client.java.Cluster' (OnClassCondition)

   CouchbaseReactiveHealthContributorAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.couchbase.client.java.Cluster' (OnClassCondition)

   CouchbaseReactiveRepositoriesAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.couchbase.client.java.Cluster' (OnClassCondition)

   CouchbaseRepositoriesAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.couchbase.client.java.Bucket' (OnClassCondition)

   DataSourceAutoConfiguration.EmbeddedDatabaseConfiguration:
      Did not match:
         - EmbeddedDataSource spring.datasource.url is set (DataSourceAutoConfiguration.EmbeddedDatabaseCondition)

   DataSourceCheckpointRestoreConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.crac.Resource' (OnClassCondition)

   DataSourceConfiguration.Dbcp2:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.apache.commons.dbcp2.BasicDataSource' (OnClassCondition)

   DataSourceConfiguration.Generic:
      Did not match:
         - @ConditionalOnProperty (spring.datasource.type) did not find property 'spring.datasource.type' (OnPropertyCondition)

   DataSourceConfiguration.OracleUcp:
      Did not match:
         - @ConditionalOnClass did not find required classes 'oracle.ucp.jdbc.PoolDataSourceImpl', 'oracle.jdbc.OracleConnection' (OnClassCondition)

   DataSourceConfiguration.Tomcat:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.apache.tomcat.jdbc.pool.DataSource' (OnClassCondition)

   DataSourceJmxConfiguration:
      Did not match:
         - @ConditionalOnBooleanProperty (spring.jmx.enabled=true) found different value in property 'spring.jmx.enabled' (OnPropertyCondition)

   DataSourcePoolMetadataProvidersConfiguration.CommonsDbcp2PoolDataSourceMetadataProviderConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.apache.commons.dbcp2.BasicDataSource' (OnClassCondition)

   DataSourcePoolMetadataProvidersConfiguration.OracleUcpPoolDataSourceMetadataProviderConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required classes 'oracle.ucp.jdbc.PoolDataSource', 'oracle.jdbc.OracleConnection' (OnClassCondition)

   DataSourcePoolMetadataProvidersConfiguration.TomcatDataSourcePoolMetadataProviderConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.apache.tomcat.jdbc.pool.DataSource' (OnClassCondition)

   DataSourceTransactionManagerAutoConfiguration.JdbcTransactionManagerConfiguration#transactionManager:
      Did not match:
         - @ConditionalOnMissingBean (types: org.springframework.transaction.TransactionManager; SearchStrategy: all) found beans of type 'org.springframework.transaction.TransactionManager' transactionManager (OnBeanCondition)

   DatadogMetricsExportAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.datadog.DatadogMeterRegistry' (OnClassCondition)

   DevToolsDataSourceAutoConfiguration:
      Did not match:
         - Devtools devtools is disabled for current context. (OnEnabledDevToolsCondition)
      Matched:
         - @ConditionalOnClass found required class 'javax.sql.DataSource' (OnClassCondition)

   DevToolsR2dbcAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.r2dbc.spi.ConnectionFactory' (OnClassCondition)

   DispatcherServletAutoConfiguration.DispatcherServletConfiguration#multipartResolver:
      Did not match:
         - @ConditionalOnBean (types: org.springframework.web.multipart.MultipartResolver; SearchStrategy: all) did not find any beans of type org.springframework.web.multipart.MultipartResolver (OnBeanCondition)

   DynatraceMetricsExportAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.dynatrace.DynatraceMeterRegistry' (OnClassCondition)

   ElasticMetricsExportAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.elastic.ElasticMeterRegistry' (OnClassCondition)

   ElasticsearchClientAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'co.elastic.clients.elasticsearch.ElasticsearchClient' (OnClassCondition)

   ElasticsearchDataAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate' (OnClassCondition)

   ElasticsearchReactiveHealthContributorAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.data.elasticsearch.client.elc.ReactiveElasticsearchClient' (OnClassCondition)

   ElasticsearchRepositoriesAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.data.elasticsearch.repository.ElasticsearchRepository' (OnClassCondition)

   ElasticsearchRestClientAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.elasticsearch.client.RestClientBuilder' (OnClassCondition)

   ElasticsearchRestHealthContributorAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.elasticsearch.client.RestClient' (OnClassCondition)

   EmbeddedLdapAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.unboundid.ldap.listener.InMemoryDirectoryServer' (OnClassCondition)

   EmbeddedWebServerFactoryCustomizerAutoConfiguration:
      Did not match:
         - Application is deployed as a WAR file. (OnWarDeploymentCondition)
      Matched:
         - @ConditionalOnWebApplication (required) found 'session' scope (OnWebApplicationCondition)

   EnvironmentEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnAvailableEndpoint not exposed (OnAvailableEndpointCondition)

   ErrorWebFluxAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.web.reactive.config.WebFluxConfigurer' (OnClassCondition)

   FlywayAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.flywaydb.core.Flyway' (OnClassCondition)

   FlywayEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.flywaydb.core.Flyway' (OnClassCondition)

   FreeMarkerAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'freemarker.template.Configuration' (OnClassCondition)

   GangliaMetricsExportAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.ganglia.GangliaMeterRegistry' (OnClassCondition)

   GraphQlAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'graphql.GraphQL' (OnClassCondition)

   GraphQlObservationAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'graphql.GraphQL' (OnClassCondition)

   GraphQlQueryByExampleAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'graphql.GraphQL' (OnClassCondition)

   GraphQlQuerydslAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.querydsl.core.Query' (OnClassCondition)

   GraphQlRSocketAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'graphql.GraphQL' (OnClassCondition)

   GraphQlReactiveQueryByExampleAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'graphql.GraphQL' (OnClassCondition)

   GraphQlReactiveQuerydslAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.querydsl.core.Query' (OnClassCondition)

   GraphQlWebFluxAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'graphql.GraphQL' (OnClassCondition)

   GraphQlWebFluxSecurityAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'graphql.GraphQL' (OnClassCondition)

   GraphQlWebMvcAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'graphql.GraphQL' (OnClassCondition)

   GraphQlWebMvcSecurityAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'graphql.GraphQL' (OnClassCondition)

   GraphiteMetricsExportAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.graphite.GraphiteMeterRegistry' (OnClassCondition)

   GroovyTemplateAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'groovy.text.markup.MarkupTemplateEngine' (OnClassCondition)

   GsonAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.google.gson.Gson' (OnClassCondition)

   GsonHttpMessageConvertersConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.google.gson.Gson' (OnClassCondition)

   H2ConsoleAutoConfiguration:
      Did not match:
         - @ConditionalOnBooleanProperty (spring.h2.console.enabled=true) did not find property 'spring.h2.console.enabled' (OnPropertyCondition)
      Matched:
         - @ConditionalOnClass found required class 'org.h2.server.web.JakartaWebServlet' (OnClassCondition)
         - found 'session' scope (OnWebApplicationCondition)

   HazelcastAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.hazelcast.core.HazelcastInstance' (OnClassCondition)

   HazelcastCacheConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.hazelcast.core.HazelcastInstance' (OnClassCondition)

   HazelcastHealthContributorAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.hazelcast.core.HazelcastInstance' (OnClassCondition)

   HazelcastJpaDependencyAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.hazelcast.core.HazelcastInstance' (OnClassCondition)

   HazelcastSessionConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.session.hazelcast.HazelcastIndexedSessionRepository' (OnClassCondition)

   HealthEndpointReactiveWebExtensionConfiguration:
      Did not match:
         - did not find reactive web application classes (OnWebApplicationCondition)

   HealthEndpointWebExtensionConfiguration.JerseyAdditionalHealthEndpointPathsConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.glassfish.jersey.server.ResourceConfig' (OnClassCondition)

   HeapDumpWebEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnAvailableEndpoint the configured access for endpoint 'heapdump' is NONE (OnAvailableEndpointCondition)

   HibernateMetricsAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.hibernate.stat.HibernateMetrics' (OnClassCondition)

   HttpExchangesAutoConfiguration:
      Did not match:
         - @ConditionalOnBean (types: org.springframework.boot.actuate.web.exchanges.HttpExchangeRepository; SearchStrategy: all) did not find any beans of type org.springframework.boot.actuate.web.exchanges.HttpExchangeRepository (OnBeanCondition)
      Matched:
         - @ConditionalOnWebApplication (required) found 'session' scope (OnWebApplicationCondition)
         - @ConditionalOnBooleanProperty (management.httpexchanges.recording.enabled=true) matched (OnPropertyCondition)

   HttpExchangesAutoConfiguration.ReactiveHttpExchangesConfiguration:
      Did not match:
         - did not find reactive web application classes (OnWebApplicationCondition)
         - Ancestor org.springframework.boot.actuate.autoconfigure.web.exchanges.HttpExchangesAutoConfiguration did not match (ConditionEvaluationReport.AncestorsMatchedCondition)

   HttpExchangesAutoConfiguration.ServletHttpExchangesConfiguration:
      Did not match:
         - Ancestor org.springframework.boot.actuate.autoconfigure.web.exchanges.HttpExchangesAutoConfiguration did not match (ConditionEvaluationReport.AncestorsMatchedCondition)
      Matched:
         - found 'session' scope (OnWebApplicationCondition)

   HttpExchangesEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnAvailableEndpoint not exposed (OnAvailableEndpointCondition)

   HttpHandlerAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.web.reactive.DispatcherHandler' (OnClassCondition)

   HumioMetricsExportAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.humio.HumioMeterRegistry' (OnClassCondition)

   HypermediaAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.hateoas.EntityModel' (OnClassCondition)

   InfinispanCacheConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.infinispan.spring.embedded.provider.SpringEmbeddedCacheManager' (OnClassCondition)

   InfluxMetricsExportAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.influx.InfluxMeterRegistry' (OnClassCondition)

   InfoContributorAutoConfiguration#buildInfoContributor:
      Did not match:
         - @ConditionalOnSingleCandidate (types: org.springframework.boot.info.BuildProperties; SearchStrategy: all) did not find any beans (OnBeanCondition)
      Matched:
         - @ConditionalOnEnabledInfoContributor management.info.defaults.enabled is considered true (OnEnabledInfoContributorCondition)

   InfoContributorAutoConfiguration#envInfoContributor:
      Did not match:
         - @ConditionalOnEnabledInfoContributor management.info.env.enabled is not true (OnEnabledInfoContributorCondition)

   InfoContributorAutoConfiguration#gitInfoContributor:
      Did not match:
         - @ConditionalOnSingleCandidate (types: org.springframework.boot.info.GitProperties; SearchStrategy: all) did not find any beans (OnBeanCondition)
      Matched:
         - @ConditionalOnEnabledInfoContributor management.info.defaults.enabled is considered true (OnEnabledInfoContributorCondition)

   InfoContributorAutoConfiguration#javaInfoContributor:
      Did not match:
         - @ConditionalOnEnabledInfoContributor management.info.java.enabled is not true (OnEnabledInfoContributorCondition)

   InfoContributorAutoConfiguration#osInfoContributor:
      Did not match:
         - @ConditionalOnEnabledInfoContributor management.info.os.enabled is not true (OnEnabledInfoContributorCondition)

   InfoContributorAutoConfiguration#processInfoContributor:
      Did not match:
         - @ConditionalOnEnabledInfoContributor management.info.process.enabled is not true (OnEnabledInfoContributorCondition)

   InfoContributorAutoConfiguration#sslInfo:
      Did not match:
         - @ConditionalOnEnabledInfoContributor management.info.ssl.enabled is not true (OnEnabledInfoContributorCondition)
      Matched:
         - @ConditionalOnMissingBean (types: org.springframework.boot.info.SslInfo; SearchStrategy: all) did not find any beans (OnBeanCondition)

   InfoContributorAutoConfiguration#sslInfoContributor:
      Did not match:
         - @ConditionalOnEnabledInfoContributor management.info.ssl.enabled is not true (OnEnabledInfoContributorCondition)

   InfoEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnAvailableEndpoint not exposed (OnAvailableEndpointCondition)

   IntegrationAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.integration.config.EnableIntegration' (OnClassCondition)

   IntegrationGraphEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.integration.graph.IntegrationGraphServer' (OnClassCondition)

   JCacheCacheConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'javax.cache.Caching' (OnClassCondition)

   JacksonHttpMessageConvertersConfiguration.MappingJackson2XmlHttpMessageConverterConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.fasterxml.jackson.dataformat.xml.XmlMapper' (OnClassCondition)

   JdbcRepositoriesAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.data.jdbc.repository.config.AbstractJdbcConfiguration' (OnClassCondition)

   JdbcSessionConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.session.jdbc.JdbcIndexedSessionRepository' (OnClassCondition)

   JedisConnectionConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required classes 'org.apache.commons.pool2.impl.GenericObjectPool', 'redis.clients.jedis.Jedis' (OnClassCondition)

   JerseyAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.glassfish.jersey.server.spring.SpringComponentProvider' (OnClassCondition)

   JerseySameManagementContextConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.glassfish.jersey.server.ResourceConfig' (OnClassCondition)

   JerseyServerMetricsAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.glassfish.jersey.micrometer.server.ObservationApplicationEventListener' (OnClassCondition)

   JerseyWebEndpointManagementContextConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.glassfish.jersey.server.ResourceConfig' (OnClassCondition)

   JettyMetricsAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.eclipse.jetty.server.Server' (OnClassCondition)

   JmsAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'jakarta.jms.Message' (OnClassCondition)

   JmsHealthContributorAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'jakarta.jms.ConnectionFactory' (OnClassCondition)

   JmxAutoConfiguration:
      Did not match:
         - @ConditionalOnBooleanProperty (spring.jmx.enabled=true) found different value in property 'spring.jmx.enabled' (OnPropertyCondition)
      Matched:
         - @ConditionalOnClass found required class 'org.springframework.jmx.export.MBeanExporter' (OnClassCondition)

   JmxEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnBooleanProperty (spring.jmx.enabled=true) found different value in property 'spring.jmx.enabled' (OnPropertyCondition)

   JmxMetricsExportAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.jmx.JmxMeterRegistry' (OnClassCondition)

   JndiConnectionFactoryAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.jms.core.JmsTemplate' (OnClassCondition)

   JndiDataSourceAutoConfiguration:
      Did not match:
         - @ConditionalOnProperty (spring.datasource.jndi-name) did not find property 'spring.datasource.jndi-name' (OnPropertyCondition)
      Matched:
         - @ConditionalOnClass found required classes 'javax.sql.DataSource', 'org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType' (OnClassCondition)

   JndiJtaConfiguration:
      Did not match:
         - @ConditionalOnJndi JNDI environment is not available (OnJndiCondition)
      Matched:
         - @ConditionalOnClass found required class 'org.springframework.transaction.jta.JtaTransactionManager' (OnClassCondition)

   JooqAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.jooq.DSLContext' (OnClassCondition)

   JpaRepositoriesAutoConfiguration#entityManagerFactoryBootstrapExecutorCustomizer:
      Did not match:
         - AnyNestedCondition 0 matched 2 did not; NestedCondition on JpaRepositoriesAutoConfiguration.BootstrapExecutorCondition.LazyBootstrapMode @ConditionalOnProperty (spring.data.jpa.repositories.bootstrap-mode=lazy) did not find property 'spring.data.jpa.repositories.bootstrap-mode'; NestedCondition on JpaRepositoriesAutoConfiguration.BootstrapExecutorCondition.DeferredBootstrapMode @ConditionalOnProperty (spring.data.jpa.repositories.bootstrap-mode=deferred) did not find property 'spring.data.jpa.repositories.bootstrap-mode' (JpaRepositoriesAutoConfiguration.BootstrapExecutorCondition)

   JsonbAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'jakarta.json.bind.Jsonb' (OnClassCondition)

   JsonbHttpMessageConvertersConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'jakarta.json.bind.Jsonb' (OnClassCondition)

   JvmMetricsAutoConfiguration#virtualThreadMetrics:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.java21.instrument.binder.jdk.VirtualThreadMetrics' (OnClassCondition)

   KafkaAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.kafka.core.KafkaTemplate' (OnClassCondition)

   KafkaMetricsAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.kafka.core.ProducerFactory' (OnClassCondition)

   KairosMetricsExportAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.kairos.KairosMeterRegistry' (OnClassCondition)

   LdapAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.ldap.core.ContextSource' (OnClassCondition)

   LdapHealthContributorAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.ldap.core.LdapOperations' (OnClassCondition)

   LdapRepositoriesAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.data.ldap.repository.LdapRepository' (OnClassCondition)

   LettuceConnectionConfiguration#redisConnectionFactoryVirtualThreads:
      Did not match:
         - @ConditionalOnMissingBean (types: org.springframework.data.redis.connection.RedisConnectionFactory; SearchStrategy: all) found beans of type 'org.springframework.data.redis.connection.RedisConnectionFactory' redisConnectionFactory (OnBeanCondition)

   LiquibaseAutoConfiguration:
      Did not match:
         - @ConditionalOnBooleanProperty (spring.liquibase.enabled=true) found different value in property 'spring.liquibase.enabled' (OnPropertyCondition)
      Matched:
         - @ConditionalOnClass found required classes 'liquibase.integration.spring.SpringLiquibase', 'liquibase.change.DatabaseChange' (OnClassCondition)

   LiquibaseEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnAvailableEndpoint not exposed (OnAvailableEndpointCondition)
      Matched:
         - @ConditionalOnClass found required class 'liquibase.integration.spring.SpringLiquibase' (OnClassCondition)

   LocalDevToolsAutoConfiguration:
      Did not match:
         - Initialized Restarter Condition initialized without URLs (OnInitializedRestarterCondition)

   Log4J2MetricsAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.apache.logging.log4j.core.LoggerContext' (OnClassCondition)

   LogFileWebEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnAvailableEndpoint not exposed (OnAvailableEndpointCondition)

   LoggersEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnAvailableEndpoint not exposed (OnAvailableEndpointCondition)

   MailHealthContributorAutoConfiguration:
      Did not match:
         - @ConditionalOnBean (types: org.springframework.mail.javamail.JavaMailSenderImpl; SearchStrategy: all) did not find any beans of type org.springframework.mail.javamail.JavaMailSenderImpl (OnBeanCondition)
      Matched:
         - @ConditionalOnClass found required class 'org.springframework.mail.javamail.JavaMailSenderImpl' (OnClassCondition)
         - @ConditionalOnEnabledHealthIndicator management.health.defaults.enabled is considered true (OnEnabledHealthIndicatorCondition)

   MailSenderAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'jakarta.mail.internet.MimeMessage' (OnClassCondition)

   MailSenderValidatorAutoConfiguration:
      Did not match:
         - @ConditionalOnBooleanProperty (spring.mail.test-connection=true) did not find property 'spring.mail.test-connection' (OnPropertyCondition)

   ManagementContextAutoConfiguration.DifferentManagementContextConfiguration:
      Did not match:
         - Management Port actual port type (SAME) did not match required type (DIFFERENT) (OnManagementPortCondition)

   ManagementWebSecurityAutoConfiguration:
      Did not match:
         - AllNestedConditions 1 matched 1 did not; NestedCondition on DefaultWebSecurityCondition.Beans @ConditionalOnMissingBean (types: org.springframework.security.web.SecurityFilterChain; SearchStrategy: all) found beans of type 'org.springframework.security.web.SecurityFilterChain' prodFilterChain; NestedCondition on DefaultWebSecurityCondition.Classes @ConditionalOnClass found required classes 'org.springframework.security.web.SecurityFilterChain', 'org.springframework.security.config.annotation.web.builders.HttpSecurity' (DefaultWebSecurityCondition)
      Matched:
         - found 'session' scope (OnWebApplicationCondition)

   MappingsEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnAvailableEndpoint not exposed (OnAvailableEndpointCondition)

   MessageSourceAutoConfiguration:
      Did not match:
         - ResourceBundle did not find bundle with basename messages (MessageSourceAutoConfiguration.ResourceBundleCondition)

   MetricsAspectsAutoConfiguration:
      Did not match:
         - @ConditionalOnBooleanProperty (management.observations.annotations.enabled=true) did not find property 'management.observations.annotations.enabled' (OnPropertyCondition)
      Matched:
         - @ConditionalOnClass found required classes 'io.micrometer.core.instrument.MeterRegistry', 'org.aspectj.weaver.Advice' (OnClassCondition)

   MetricsEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnAvailableEndpoint not exposed (OnAvailableEndpointCondition)
      Matched:
         - @ConditionalOnClass found required class 'io.micrometer.core.annotation.Timed' (OnClassCondition)

   MicrometerTracingAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.tracing.Tracer' (OnClassCondition)

   MongoAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.mongodb.client.MongoClient' (OnClassCondition)

   MongoDataAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.mongodb.client.MongoClient' (OnClassCondition)

   MongoHealthContributorAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.data.mongodb.core.MongoTemplate' (OnClassCondition)

   MongoMetricsAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.mongodb.MongoClientSettings' (OnClassCondition)

   MongoReactiveAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.mongodb.reactivestreams.client.MongoClient' (OnClassCondition)

   MongoReactiveDataAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.mongodb.reactivestreams.client.MongoClient' (OnClassCondition)

   MongoReactiveHealthContributorAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.data.mongodb.core.ReactiveMongoTemplate' (OnClassCondition)

   MongoReactiveRepositoriesAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.mongodb.reactivestreams.client.MongoClient' (OnClassCondition)

   MongoRepositoriesAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.mongodb.client.MongoClient' (OnClassCondition)

   MongoSessionConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required classes 'org.springframework.data.mongodb.core.MongoOperations', 'org.springframework.session.data.mongo.MongoIndexedSessionRepository' (OnClassCondition)

   MultipleOpenApiSupportConfiguration.SpringDocWebMvcActuatorDifferentConfiguration:
      Did not match:
         - Management Port actual port type (SAME) did not match required type (DIFFERENT) (OnManagementPortCondition)
      Matched:
         - @ConditionalOnClass found required class 'org.springframework.boot.actuate.endpoint.web.servlet.WebMvcEndpointHandlerMapping' (OnClassCondition)

   MustacheAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.samskivert.mustache.Mustache' (OnClassCondition)

   Neo4jAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.neo4j.driver.Driver' (OnClassCondition)

   Neo4jDataAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.neo4j.driver.Driver' (OnClassCondition)

   Neo4jHealthContributorAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.neo4j.driver.Driver' (OnClassCondition)

   Neo4jReactiveDataAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.neo4j.driver.Driver' (OnClassCondition)

   Neo4jReactiveRepositoriesAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.neo4j.driver.Driver' (OnClassCondition)

   Neo4jRepositoriesAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.neo4j.driver.Driver' (OnClassCondition)

   NewRelicMetricsExportAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.newrelic.NewRelicMeterRegistry' (OnClassCondition)

   NoOpMeterRegistryConfiguration:
      Did not match:
         - @ConditionalOnMissingBean (types: io.micrometer.core.instrument.MeterRegistry; SearchStrategy: all) found beans of type 'io.micrometer.core.instrument.MeterRegistry' simpleMeterRegistry (OnBeanCondition)

   NoopTracerAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.tracing.Tracer' (OnClassCondition)

   OAuth2AuthorizationServerAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.security.oauth2.server.authorization.OAuth2Authorization' (OnClassCondition)

   OAuth2AuthorizationServerJwtAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.nimbusds.jose.jwk.source.JWKSource' (OnClassCondition)

   OAuth2ClientAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.security.oauth2.client.registration.ClientRegistration' (OnClassCondition)

   OAuth2ClientWebSecurityAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository' (OnClassCondition)

   OAuth2ResourceServerAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthenticationToken' (OnClassCondition)

   ObservationAutoConfiguration.MeterObservationHandlerConfiguration.TracingAndMetricsObservationHandlerConfiguration:
      Did not match:
         - @ConditionalOnBean did not find required type 'io.micrometer.tracing.Tracer' (OnBeanCondition)
         - @ConditionalOnBean (types: ?; SearchStrategy: all) did not find any beans of type ? (OnBeanCondition)

   ObservationAutoConfiguration.MetricsWithTracingConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.tracing.Tracer' (OnClassCondition)

   ObservationAutoConfiguration.ObservedAspectConfiguration:
      Did not match:
         - @ConditionalOnBooleanProperty (management.observations.annotations.enabled=true) did not find property 'management.observations.annotations.enabled' (OnPropertyCondition)
      Matched:
         - @ConditionalOnClass found required class 'org.aspectj.weaver.Advice' (OnClassCondition)

   ObservationAutoConfiguration.OnlyTracingConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.tracing.Tracer' (OnClassCondition)

   OpenTelemetryAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.opentelemetry.sdk.OpenTelemetrySdk' (OnClassCondition)

   OpenTelemetryLoggingAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.opentelemetry.api.OpenTelemetry' (OnClassCondition)

   OpenTelemetryTracingAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.tracing.otel.bridge.OtelTracer' (OnClassCondition)

   OtlpLoggingAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.opentelemetry.api.OpenTelemetry' (OnClassCondition)

   OtlpMetricsExportAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.registry.otlp.OtlpMeterRegistry' (OnClassCondition)

   OtlpTracingAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.tracing.otel.bridge.OtelTracer' (OnClassCondition)

   ProjectInfoAutoConfiguration#buildProperties:
      Did not match:
         - @ConditionalOnResource did not find resource '${spring.info.build.location:classpath:META-INF/build-info.properties}' (OnResourceCondition)

   ProjectInfoAutoConfiguration#gitProperties:
      Did not match:
         - GitResource did not find git info at classpath:git.properties (ProjectInfoAutoConfiguration.GitResourceAvailableCondition)

   PrometheusExemplarsAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.tracing.Tracer' (OnClassCondition)

   PrometheusMetricsExportAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.prometheusmetrics.PrometheusMeterRegistry' (OnClassCondition)

   PulsarAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.apache.pulsar.client.api.PulsarClient' (OnClassCondition)

   PulsarReactiveAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.apache.pulsar.client.api.PulsarClient' (OnClassCondition)

   QuartzAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.quartz.Scheduler' (OnClassCondition)

   QuartzEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.quartz.Scheduler' (OnClassCondition)

   R2dbcAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.r2dbc.spi.ConnectionFactory' (OnClassCondition)

   R2dbcDataAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.data.r2dbc.core.R2dbcEntityTemplate' (OnClassCondition)

   R2dbcInitializationConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required classes 'io.r2dbc.spi.ConnectionFactory', 'org.springframework.r2dbc.connection.init.DatabasePopulator' (OnClassCondition)

   R2dbcObservationAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.r2dbc.proxy.ProxyConnectionFactory' (OnClassCondition)

   R2dbcProxyAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.r2dbc.proxy.ProxyConnectionFactory' (OnClassCondition)

   R2dbcRepositoriesAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.r2dbc.spi.ConnectionFactory' (OnClassCondition)

   R2dbcTransactionManagerAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.r2dbc.connection.R2dbcTransactionManager' (OnClassCondition)

   RSocketGraphQlClientAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'graphql.GraphQL' (OnClassCondition)

   RSocketMessagingAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.rsocket.RSocket' (OnClassCondition)

   RSocketRequesterAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.rsocket.RSocket' (OnClassCondition)

   RSocketSecurityAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.security.rsocket.core.SecuritySocketAcceptorInterceptor' (OnClassCondition)

   RSocketServerAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.rsocket.core.RSocketServer' (OnClassCondition)

   RSocketStrategiesAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.rsocket.RSocket' (OnClassCondition)

   RabbitAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.rabbitmq.client.Channel' (OnClassCondition)

   RabbitHealthContributorAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.amqp.rabbit.core.RabbitTemplate' (OnClassCondition)

   RabbitMetricsAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.rabbitmq.client.ConnectionFactory' (OnClassCondition)

   ReactiveCloudFoundryActuatorAutoConfiguration:
      Did not match:
         - @ConditionalOnWebApplication did not find reactive web application classes (OnWebApplicationCondition)

   ReactiveElasticsearchClientAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'co.elastic.clients.transport.ElasticsearchTransport' (OnClassCondition)

   ReactiveElasticsearchRepositoriesAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.data.elasticsearch.client.elc.ReactiveElasticsearchClient' (OnClassCondition)

   ReactiveManagementContextAutoConfiguration:
      Did not match:
         - @ConditionalOnWebApplication did not find reactive web application classes (OnWebApplicationCondition)

   ReactiveManagementWebSecurityAutoConfiguration:
      Did not match:
         - @ConditionalOnWebApplication did not find reactive web application classes (OnWebApplicationCondition)

   ReactiveMultipartAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.web.reactive.config.WebFluxConfigurer' (OnClassCondition)

   ReactiveOAuth2ClientAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.security.oauth2.client.registration.ClientRegistration' (OnClassCondition)

   ReactiveOAuth2ClientWebSecurityAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.security.oauth2.client.web.server.ServerOAuth2AuthorizedClientRepository' (OnClassCondition)

   ReactiveOAuth2ResourceServerAutoConfiguration:
      Did not match:
         - @ConditionalOnWebApplication did not find reactive web application classes (OnWebApplicationCondition)

   ReactiveSecurityAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.web.reactive.config.WebFluxConfigurer' (OnClassCondition)

   ReactiveUserDetailsServiceAutoConfiguration:
      Did not match:
         - AnyNestedCondition 0 matched 2 did not; NestedCondition on ReactiveUserDetailsServiceAutoConfiguration.RSocketEnabledOrReactiveWebApplication.ReactiveWebApplicationCondition did not find reactive web application classes; NestedCondition on ReactiveUserDetailsServiceAutoConfiguration.RSocketEnabledOrReactiveWebApplication.RSocketSecurityEnabledCondition @ConditionalOnBean (types: ?; SearchStrategy: all) did not find any beans of type ? (ReactiveUserDetailsServiceAutoConfiguration.RSocketEnabledOrReactiveWebApplication)
      Matched:
         - @ConditionalOnClass found required class 'org.springframework.security.authentication.ReactiveAuthenticationManager' (OnClassCondition)
         - AnyNestedCondition 1 matched 2 did not; NestedCondition on ReactiveUserDetailsServiceAutoConfiguration.MissingAlternativeOrUserPropertiesConfigured.PasswordConfigured @ConditionalOnProperty (spring.security.user.password) did not find property 'spring.security.user.password'; NestedCondition on ReactiveUserDetailsServiceAutoConfiguration.MissingAlternativeOrUserPropertiesConfigured.NameConfigured @ConditionalOnProperty (spring.security.user.name) did not find property 'spring.security.user.name'; NestedCondition on ReactiveUserDetailsServiceAutoConfiguration.MissingAlternativeOrUserPropertiesConfigured.MissingAlternative @ConditionalOnMissingClass did not find unwanted classes 'org.springframework.security.oauth2.client.registration.ClientRegistrationRepository', 'org.springframework.security.oauth2.server.resource.introspection.ReactiveOpaqueTokenIntrospector' (ReactiveUserDetailsServiceAutoConfiguration.MissingAlternativeOrUserPropertiesConfigured)

   ReactiveWebServerFactoryAutoConfiguration:
      Did not match:
         - @ConditionalOnWebApplication did not find reactive web application classes (OnWebApplicationCondition)

   RedisHealthContributorAutoConfiguration#redisHealthContributor:
      Did not match:
         - @ConditionalOnMissingBean (names: redisHealthIndicator,redisHealthContributor; SearchStrategy: all) found beans named redisHealthContributor (OnBeanCondition)

   RedisSessionConfiguration.IndexedRedisSessionConfiguration:
      Did not match:
         - @ConditionalOnProperty (spring.session.redis.repository-type=indexed) did not find property 'spring.session.redis.repository-type' (OnPropertyCondition)

   RemoteDevToolsAutoConfiguration:
      Did not match:
         - @ConditionalOnProperty (spring.devtools.remote.secret) did not find property 'spring.devtools.remote.secret' (OnPropertyCondition)
      Matched:
         - @ConditionalOnClass found required classes 'jakarta.servlet.Filter', 'org.springframework.http.server.ServerHttpRequest' (OnClassCondition)

   RepositoryRestMvcAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration' (OnClassCondition)

   Saml2RelyingPartyAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.security.saml2.provider.service.registration.RelyingPartyRegistrationRepository' (OnClassCondition)

   SbomEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnAvailableEndpoint not exposed (OnAvailableEndpointCondition)

   ScheduledTasksEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnAvailableEndpoint not exposed (OnAvailableEndpointCondition)

   SecurityDataConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.security.data.repository.query.SecurityEvaluationContextExtension' (OnClassCondition)

   SecurityRequestMatchersManagementContextConfiguration.JerseyRequestMatcherConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.glassfish.jersey.server.ResourceConfig' (OnClassCondition)

   SendGridAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.sendgrid.SendGrid' (OnClassCondition)

   ServletEndpointManagementContextConfiguration.JerseyServletEndpointManagementContextConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.glassfish.jersey.server.ResourceConfig' (OnClassCondition)

   ServletManagementContextAutoConfiguration.ApplicationContextFilterConfiguration:
      Did not match:
         - @ConditionalOnBooleanProperty (management.server.add-application-context-header=true) did not find property 'management.server.add-application-context-header' (OnPropertyCondition)

   ServletWebServerFactoryAutoConfiguration.ForwardedHeaderFilterConfiguration:
      Did not match:
         - @ConditionalOnProperty (server.forward-headers-strategy=framework) did not find property 'server.forward-headers-strategy' (OnPropertyCondition)

   ServletWebServerFactoryConfiguration.EmbeddedJetty:
      Did not match:
         - @ConditionalOnClass did not find required classes 'org.eclipse.jetty.server.Server', 'org.eclipse.jetty.util.Loader', 'org.eclipse.jetty.ee10.webapp.WebAppContext' (OnClassCondition)

   ServletWebServerFactoryConfiguration.EmbeddedUndertow:
      Did not match:
         - @ConditionalOnClass did not find required classes 'io.undertow.Undertow', 'org.xnio.SslClientAuthMode' (OnClassCondition)

   SessionAutoConfiguration.ReactiveSessionConfiguration:
      Did not match:
         - did not find reactive web application classes (OnWebApplicationCondition)

   SessionAutoConfiguration.ServletSessionConfiguration#cookieSerializer:
      Did not match:
         - AnyNestedCondition 0 matched 2 did not; NestedCondition on SessionAutoConfiguration.DefaultCookieSerializerCondition.CookieHttpSessionIdResolverAvailable found non-matching nested conditions @ConditionalOnBean (types: org.springframework.session.web.http.CookieHttpSessionIdResolver; SearchStrategy: all) did not find any beans of type org.springframework.session.web.http.CookieHttpSessionIdResolver, @ConditionalOnBean (types: org.springframework.session.web.http.CookieHttpSessionIdResolver; SearchStrategy: all) did not find any beans of type org.springframework.session.web.http.CookieHttpSessionIdResolver; NestedCondition on SessionAutoConfiguration.DefaultCookieSerializerCondition.NoComponentsAvailable @ConditionalOnMissingBean (types: org.springframework.session.web.http.HttpSessionIdResolver,org.springframework.session.web.http.CookieSerializer; SearchStrategy: all) found beans of type 'org.springframework.session.web.http.CookieSerializer' cookieSerializer (SessionAutoConfiguration.DefaultCookieSerializerCondition)

   SessionAutoConfiguration.ServletSessionConfiguration.ServletSessionRepositoryConfiguration:
      Did not match:
         - @ConditionalOnMissingBean (types: org.springframework.session.SessionRepository; SearchStrategy: all) found beans of type 'org.springframework.session.SessionRepository' sessionRepository (OnBeanCondition)

   SessionRedisConfig#redisTemplate:
      Did not match:
         - @ConditionalOnProperty (app.security.rate-limiting.enabled=true) found different value in property 'app.security.rate-limiting.enabled' (OnPropertyCondition)

   SessionsEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnAvailableEndpoint not exposed (OnAvailableEndpointCondition)
      Matched:
         - @ConditionalOnClass found required class 'org.springframework.session.Session' (OnClassCondition)

   ShutdownEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnAvailableEndpoint the configured access for endpoint 'shutdown' is NONE (OnAvailableEndpointCondition)

   SignalFxMetricsExportAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.signalfx.SignalFxMeterRegistry' (OnClassCondition)

   SpringApplicationAdminJmxAutoConfiguration:
      Did not match:
         - @ConditionalOnBooleanProperty (spring.application.admin.enabled=true) did not find property 'spring.application.admin.enabled' (OnPropertyCondition)

   SpringBootWebSecurityConfiguration.SecurityFilterChainConfiguration:
      Did not match:
         - AllNestedConditions 1 matched 1 did not; NestedCondition on DefaultWebSecurityCondition.Beans @ConditionalOnMissingBean (types: org.springframework.security.web.SecurityFilterChain; SearchStrategy: all) found beans of type 'org.springframework.security.web.SecurityFilterChain' prodFilterChain; NestedCondition on DefaultWebSecurityCondition.Classes @ConditionalOnClass found required classes 'org.springframework.security.web.SecurityFilterChain', 'org.springframework.security.config.annotation.web.builders.HttpSecurity' (DefaultWebSecurityCondition)

   SpringBootWebSecurityConfiguration.WebSecurityEnablerConfiguration:
      Did not match:
         - @ConditionalOnMissingBean (names: springSecurityFilterChain; SearchStrategy: all) found beans named springSecurityFilterChain (OnBeanCondition)
      Matched:
         - @ConditionalOnClass found required class 'org.springframework.security.config.annotation.web.configuration.EnableWebSecurity' (OnClassCondition)

   SpringDocConfiguration#oas31ModelConverter:
      Did not match:
         - @ConditionalOnProperty (springdoc.explicit-object-schema=true) did not find property 'springdoc.explicit-object-schema' (OnPropertyCondition)

   SpringDocConfiguration#propertiesResolverForSchema:
      Did not match:
         - @ConditionalOnProperty (springdoc.api-docs.resolve-schema-properties) did not find property 'springdoc.api-docs.resolve-schema-properties' (OnPropertyCondition)

   SpringDocConfiguration#propertyCustomizingConverter:
      Did not match:
         - @ConditionalOnBean (types: org.springdoc.core.customizers.PropertyCustomizer; SearchStrategy: all) did not find any beans of type org.springdoc.core.customizers.PropertyCustomizer (OnBeanCondition)

   SpringDocConfiguration#springdocBeanFactoryPostProcessor2:
      Did not match:
         - @ConditionalOnMissingClass found unwanted class 'org.springframework.boot.context.properties.bind.BindResult' (OnClassCondition)

   SpringDocConfiguration.SpringDocActuatorConfiguration:
      Did not match:
         - @ConditionalOnProperty (springdoc.show-actuator) did not find property 'springdoc.show-actuator' (OnPropertyCondition)
      Matched:
         - @ConditionalOnClass found required class 'org.springframework.boot.actuate.autoconfigure.endpoint.web.WebEndpointProperties' (OnClassCondition)

   SpringDocConfiguration.SpringDocRepositoryRestConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.data.rest.core.config.RepositoryRestConfiguration' (OnClassCondition)

   SpringDocDataRestConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.data.rest.core.config.RepositoryRestConfiguration' (OnClassCondition)

   SpringDocFunctionCatalogConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.cloud.function.web.function.FunctionEndpointInitializer' (OnClassCondition)

   SpringDocGroovyConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'groovy.lang.MetaClass' (OnClassCondition)

   SpringDocHateoasConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.hateoas.server.LinkRelationProvider' (OnClassCondition)

   SpringDocJacksonKotlinModuleConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.fasterxml.jackson.module.kotlin.KotlinModule' (OnClassCondition)

   SpringDocJavadocConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.github.therapi.runtimejavadoc.CommentFormatter' (OnClassCondition)

   SpringDocKotlinConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'kotlin.coroutines.Continuation' (OnClassCondition)

   SpringDocKotlinxConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'kotlinx.coroutines.flow.Flow' (OnClassCondition)

   SpringDocSecurityConfiguration.SpringDocSecurityOAuth2ClientConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient' (OnClassCondition)

   SpringDocSecurityConfiguration.SpringDocSecurityOAuth2Configuration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationService' (OnClassCondition)

   SpringDocSecurityConfiguration.SpringSecurityLoginEndpointConfiguration#springSecurityLoginEndpointCustomizer:
      Did not match:
         - @ConditionalOnProperty (springdoc.show-login-endpoint) did not find property 'springdoc.show-login-endpoint' (OnPropertyCondition)

   SpringDocSortConfiguration#dataRestDelegatingMethodParameterCustomizer:
      Did not match:
         - @ConditionalOnMissingBean (types: org.springdoc.core.customizers.DataRestDelegatingMethodParameterCustomizer; SearchStrategy: all) found beans of type 'org.springdoc.core.customizers.DataRestDelegatingMethodParameterCustomizer' dataRestDelegatingMethodParameterCustomizer (OnBeanCondition)

   SpringDocWebMvcConfiguration.SpringDocWebMvcActuatorConfiguration#actuatorProvider:
      Did not match:
         - @ConditionalOnExpression (#{${springdoc.show-actuator:false} or ${springdoc.use-management-port:false}}) resulted in false (OnExpressionCondition)

   SpringDocWebMvcConfiguration.SpringDocWebMvcActuatorConfiguration#openApiActuatorResource:
      Did not match:
         - @ConditionalOnExpression (#{${springdoc.use-management-port:false} and ${springdoc.enable-default-api-docs:true}}) resulted in false (OnExpressionCondition)

   SslObservabilityAutoConfiguration#sslInfoProvider:
      Did not match:
         - @ConditionalOnMissingBean (types: org.springframework.boot.info.SslInfo; SearchStrategy: all) found beans of type 'org.springframework.boot.info.SslInfo' sslInfo (OnBeanCondition)

   StackdriverMetricsExportAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.stackdriver.StackdriverMeterRegistry' (OnClassCondition)

   StartupEndpointAutoConfiguration:
      Did not match:
         - ApplicationStartup configured applicationStartup is of type class org.springframework.core.metrics.DefaultApplicationStartup, expected BufferingApplicationStartup. (StartupEndpointAutoConfiguration.ApplicationStartupCondition)

   StatsdMetricsExportAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.micrometer.statsd.StatsdMeterRegistry' (OnClassCondition)

   SwaggerConfig#springWebProvider:
      Did not match:
         - @ConditionalOnMissingBean (types: org.springdoc.core.providers.SpringWebProvider; SearchStrategy: all) found beans of type 'org.springdoc.core.providers.SpringWebProvider' springWebProvider (OnBeanCondition)

   SwaggerConfig#swaggerUiHome:
      Did not match:
         - @ConditionalOnProperty (springdoc.swagger-ui.use-root-path=true) did not find property 'springdoc.swagger-ui.use-root-path' (OnPropertyCondition)

   SwaggerConfig.SwaggerActuatorWelcomeConfiguration:
      Did not match:
         - @ConditionalOnProperty (springdoc.use-management-port) did not find property 'springdoc.use-management-port' (OnPropertyCondition)
      Matched:
         - @ConditionalOnClass found required class 'org.springframework.boot.actuate.endpoint.web.servlet.WebMvcEndpointHandlerMapping' (OnClassCondition)

   TaskExecutorConfigurations.SimpleAsyncTaskExecutorBuilderConfiguration#simpleAsyncTaskExecutorBuilderVirtualThreads:
      Did not match:
         - @ConditionalOnMissingBean (types: org.springframework.boot.task.SimpleAsyncTaskExecutorBuilder; SearchStrategy: all) found beans of type 'org.springframework.boot.task.SimpleAsyncTaskExecutorBuilder' simpleAsyncTaskExecutorBuilder (OnBeanCondition)

   TaskExecutorConfigurations.TaskExecutorConfiguration#applicationTaskExecutorVirtualThreads:
      Did not match:
         - @ConditionalOnThreading did not find VIRTUAL (OnThreadingCondition)

   TaskSchedulingConfigurations.SimpleAsyncTaskSchedulerBuilderConfiguration#simpleAsyncTaskSchedulerBuilderVirtualThreads:
      Did not match:
         - @ConditionalOnMissingBean (types: org.springframework.boot.task.SimpleAsyncTaskSchedulerBuilder; SearchStrategy: all) found beans of type 'org.springframework.boot.task.SimpleAsyncTaskSchedulerBuilder' simpleAsyncTaskSchedulerBuilder (OnBeanCondition)

   TaskSchedulingConfigurations.TaskSchedulerConfiguration#taskSchedulerVirtualThreads:
      Did not match:
         - @ConditionalOnThreading did not find VIRTUAL (OnThreadingCondition)

   TestDatabaseAutoConfiguration#dataSource:
      Did not match:
         - @ConditionalOnProperty (spring.test.database.replace=AUTO_CONFIGURED) found different value in property 'spring.test.database.replace' (OnPropertyCondition)

   TestDatabaseAutoConfiguration#embeddedDataSourceBeanFactoryPostProcessor:
      Did not match:
         - @ConditionalOnProperty (spring.test.database.replace=ANY) found different value in property 'spring.test.database.replace' (OnPropertyCondition)

   TestDatabaseAutoConfiguration#nonTestEmbeddedDataSourceBeanFactoryPostProcessor:
      Did not match:
         - @ConditionalOnProperty (spring.test.database.replace=NON_TEST) found different value in property 'spring.test.database.replace' (OnPropertyCondition)

   ThreadDumpEndpointAutoConfiguration:
      Did not match:
         - @ConditionalOnAvailableEndpoint not exposed (OnAvailableEndpointCondition)

   ThymeleafAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.thymeleaf.spring6.SpringTemplateEngine' (OnClassCondition)

   TransactionAutoConfiguration#transactionalOperator:
      Did not match:
         - @ConditionalOnSingleCandidate (types: org.springframework.transaction.ReactiveTransactionManager; SearchStrategy: all) did not find any beans (OnBeanCondition)

   TransactionAutoConfiguration.AspectJTransactionManagementConfiguration:
      Did not match:
         - @ConditionalOnBean (types: org.springframework.transaction.aspectj.AbstractTransactionAspect; SearchStrategy: all) did not find any beans of type org.springframework.transaction.aspectj.AbstractTransactionAspect (OnBeanCondition)

   TransactionAutoConfiguration.EnableTransactionManagementConfiguration.JdkDynamicAutoProxyConfiguration:
      Did not match:
         - @ConditionalOnBooleanProperty (spring.aop.proxy-target-class=false) did not find property 'spring.aop.proxy-target-class' (OnPropertyCondition)

   UserDetailsServiceAutoConfiguration:
      Did not match:
         - @ConditionalOnMissingBean (types: org.springframework.security.authentication.AuthenticationManager,org.springframework.security.authentication.AuthenticationProvider,org.springframework.security.core.userdetails.UserDetailsService,org.springframework.security.authentication.AuthenticationManagerResolver,?; SearchStrategy: all) found beans of type 'org.springframework.security.authentication.AuthenticationManager' authenticationManager and found beans of type 'org.springframework.security.core.userdetails.UserDetailsService' userQueryService (OnBeanCondition)
      Matched:
         - @ConditionalOnClass found required class 'org.springframework.security.authentication.AuthenticationManager' (OnClassCondition)
         - found 'session' scope (OnWebApplicationCondition)
         - AnyNestedCondition 1 matched 2 did not; NestedCondition on UserDetailsServiceAutoConfiguration.MissingAlternativeOrUserPropertiesConfigured.PasswordConfigured @ConditionalOnProperty (spring.security.user.password) did not find property 'spring.security.user.password'; NestedCondition on UserDetailsServiceAutoConfiguration.MissingAlternativeOrUserPropertiesConfigured.NameConfigured @ConditionalOnProperty (spring.security.user.name) did not find property 'spring.security.user.name'; NestedCondition on UserDetailsServiceAutoConfiguration.MissingAlternativeOrUserPropertiesConfigured.MissingAlternative @ConditionalOnMissingClass did not find unwanted classes 'org.springframework.security.oauth2.client.registration.ClientRegistrationRepository', 'org.springframework.security.oauth2.server.resource.introspection.OpaqueTokenIntrospector', 'org.springframework.security.saml2.provider.service.registration.RelyingPartyRegistrationRepository' (UserDetailsServiceAutoConfiguration.MissingAlternativeOrUserPropertiesConfigured)

   WavefrontAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.wavefront.sdk.common.application.ApplicationTags' (OnClassCondition)

   WavefrontMetricsExportAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.wavefront.sdk.common.WavefrontSender' (OnClassCondition)

   WavefrontTracingAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'com.wavefront.sdk.common.WavefrontSender' (OnClassCondition)

   WebClientAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.web.reactive.function.client.WebClient' (OnClassCondition)

   WebClientObservationConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.web.reactive.function.client.WebClient' (OnClassCondition)

   WebFluxAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.web.reactive.config.WebFluxConfigurer' (OnClassCondition)

   WebFluxEndpointManagementContextConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.web.reactive.DispatcherHandler' (OnClassCondition)

   WebFluxObservationAutoConfiguration:
      Did not match:
         - @ConditionalOnWebApplication did not find reactive web application classes (OnWebApplicationCondition)

   WebMvcAutoConfiguration#hiddenHttpMethodFilter:
      Did not match:
         - @ConditionalOnBooleanProperty (spring.mvc.hiddenmethod.filter.enabled=true) did not find property 'spring.mvc.hiddenmethod.filter.enabled' (OnPropertyCondition)

   WebMvcAutoConfiguration.ProblemDetailsErrorHandlingConfiguration:
      Did not match:
         - @ConditionalOnBooleanProperty (spring.mvc.problemdetails.enabled=true) did not find property 'spring.mvc.problemdetails.enabled' (OnPropertyCondition)

   WebMvcAutoConfiguration.WebMvcAutoConfigurationAdapter#beanNameViewResolver:
      Did not match:
         - @ConditionalOnMissingBean (types: org.springframework.web.servlet.view.BeanNameViewResolver; SearchStrategy: all) found beans of type 'org.springframework.web.servlet.view.BeanNameViewResolver' beanNameViewResolver (OnBeanCondition)

   WebMvcEndpointManagementContextConfiguration#managementHealthEndpointWebMvcHandlerMapping:
      Did not match:
         - Management Port actual port type (SAME) did not match required type (DIFFERENT) (OnManagementPortCondition)

   WebServiceTemplateAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.ws.client.core.WebServiceTemplate' (OnClassCondition)

   WebServicesAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.ws.transport.http.MessageDispatcherServlet' (OnClassCondition)

   WebSessionIdResolverAutoConfiguration:
      Did not match:
         - @ConditionalOnWebApplication did not find reactive web application classes (OnWebApplicationCondition)

   WebSocketMessagingAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer' (OnClassCondition)

   WebSocketReactiveAutoConfiguration:
      Did not match:
         - @ConditionalOnWebApplication did not find reactive web application classes (OnWebApplicationCondition)

   WebSocketServletAutoConfiguration.JettyWebSocketConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.eclipse.jetty.ee10.websocket.jakarta.server.config.JakartaWebSocketServletContainerInitializer' (OnClassCondition)

   WebSocketServletAutoConfiguration.UndertowWebSocketConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'io.undertow.websockets.jsr.Bootstrap' (OnClassCondition)

   XADataSourceAutoConfiguration:
      Did not match:
         - @ConditionalOnBean (types: org.springframework.boot.jdbc.XADataSourceWrapper; SearchStrategy: all) did not find any beans of type org.springframework.boot.jdbc.XADataSourceWrapper (OnBeanCondition)
      Matched:
         - @ConditionalOnClass found required classes 'javax.sql.DataSource', 'jakarta.transaction.TransactionManager', 'org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType' (OnClassCondition)

   ZipkinAutoConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'zipkin2.reporter.Encoding' (OnClassCondition)


Exclusions:
-----------

    None


Unconditional classes:
----------------------

    org.springframework.boot.autoconfigure.context.ConfigurationPropertiesAutoConfiguration

    org.springframework.boot.actuate.autoconfigure.availability.AvailabilityHealthContributorAutoConfiguration

    org.springframework.boot.autoconfigure.ssl.SslAutoConfiguration

    org.springframework.boot.actuate.autoconfigure.info.InfoContributorAutoConfiguration

    org.springframework.boot.autoconfigure.context.PropertyPlaceholderAutoConfiguration

    org.springframework.boot.autoconfigure.context.LifecycleAutoConfiguration

    org.springframework.boot.test.autoconfigure.jdbc.TestDatabaseAutoConfiguration

    org.springframework.boot.actuate.autoconfigure.metrics.integration.IntegrationMetricsAutoConfiguration

    org.springframework.boot.actuate.autoconfigure.endpoint.EndpointAutoConfiguration

    org.springframework.boot.actuate.autoconfigure.web.server.ManagementContextAutoConfiguration

    org.springframework.boot.actuate.autoconfigure.health.HealthContributorAutoConfiguration

    org.springframework.boot.actuate.autoconfigure.endpoint.jackson.JacksonEndpointAutoConfiguration

    org.springdoc.core.configuration.SpringDocSpecPropertiesConfiguration

    org.springframework.boot.autoconfigure.availability.ApplicationAvailabilityAutoConfiguration

    org.springframework.boot.autoconfigure.info.ProjectInfoAutoConfiguration



2025-09-04 20:21:02 - Application run failed
org.springframework.context.ApplicationContextException: Failed to start bean 'springSessionRedisMessageListenerContainer'
	at org.springframework.context.support.DefaultLifecycleProcessor.doStart(DefaultLifecycleProcessor.java:408)
	at org.springframework.context.support.DefaultLifecycleProcessor.doStart(DefaultLifecycleProcessor.java:394)
	at org.springframework.context.support.DefaultLifecycleProcessor$LifecycleGroup.start(DefaultLifecycleProcessor.java:586)
	at java.base/java.lang.Iterable.forEach(Iterable.java:75)
	at org.springframework.context.support.DefaultLifecycleProcessor.startBeans(DefaultLifecycleProcessor.java:364)
	at org.springframework.context.support.DefaultLifecycleProcessor.onRefresh(DefaultLifecycleProcessor.java:310)
	at org.springframework.context.support.AbstractApplicationContext.finishRefresh(AbstractApplicationContext.java:1006)
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:630)
	at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:752)
	at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:439)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:318)
	at org.springframework.boot.test.context.SpringBootContextLoader.lambda$loadContext$3(SpringBootContextLoader.java:144)
	at org.springframework.util.function.ThrowingSupplier.get(ThrowingSupplier.java:58)
	at org.springframework.util.function.ThrowingSupplier.get(ThrowingSupplier.java:46)
	at org.springframework.boot.SpringApplication.withHook(SpringApplication.java:1461)
	at org.springframework.boot.test.context.SpringBootContextLoader$ContextLoaderHook.run(SpringBootContextLoader.java:563)
	at org.springframework.boot.test.context.SpringBootContextLoader.loadContext(SpringBootContextLoader.java:144)
	at org.springframework.boot.test.context.SpringBootContextLoader.loadContext(SpringBootContextLoader.java:110)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContextInternal(DefaultCacheAwareContextLoaderDelegate.java:225)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContext(DefaultCacheAwareContextLoaderDelegate.java:152)
	at org.springframework.test.context.support.DefaultTestContext.getApplicationContext(DefaultTestContext.java:130)
	at org.springframework.test.context.web.ServletTestExecutionListener.setUpRequestContextIfNecessary(ServletTestExecutionListener.java:200)
	at org.springframework.test.context.web.ServletTestExecutionListener.prepareTestInstance(ServletTestExecutionListener.java:139)
	at org.springframework.test.context.TestContextManager.prepareTestInstance(TestContextManager.java:260)
	at org.springframework.test.context.junit.jupiter.SpringExtension.postProcessTestInstance(SpringExtension.java:159)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$invokeTestInstancePostProcessors$10(ClassBasedTestDescriptor.java:383)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.executeAndMaskThrowable(ClassBasedTestDescriptor.java:388)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$invokeTestInstancePostProcessors$11(ClassBasedTestDescriptor.java:382)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$2$1.accept(ReferencePipeline.java:179)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.invokeTestInstancePostProcessors(ClassBasedTestDescriptor.java:382)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$instantiateAndPostProcessTestInstance$6(ClassBasedTestDescriptor.java:293)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.instantiateAndPostProcessTestInstance(ClassBasedTestDescriptor.java:292)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$testInstancesProvider$4(ClassBasedTestDescriptor.java:281)
	at java.base/java.util.Optional.orElseGet(Optional.java:364)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$testInstancesProvider$5(ClassBasedTestDescriptor.java:280)
	at org.junit.jupiter.engine.execution.TestInstancesProvider.getTestInstances(TestInstancesProvider.java:27)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$prepare$0(TestMethodTestDescriptor.java:112)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.prepare(TestMethodTestDescriptor.java:111)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.prepare(TestMethodTestDescriptor.java:69)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$prepare$2(NodeTestTask.java:128)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.prepare(NodeTestTask.java:128)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:160)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:146)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:144)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:100)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:160)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:146)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:144)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:100)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.submit(SameThreadHierarchicalTestExecutorService.java:35)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestExecutor.execute(HierarchicalTestExecutor.java:57)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestEngine.execute(HierarchicalTestEngine.java:54)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:201)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:170)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:94)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.lambda$execute$0(EngineExecutionOrchestrator.java:59)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.withInterceptedStreams(EngineExecutionOrchestrator.java:142)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:58)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:103)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:85)
	at org.junit.platform.launcher.core.DelegatingLauncher.execute(DelegatingLauncher.java:47)
	at org.junit.platform.launcher.core.InterceptingLauncher.lambda$execute$1(InterceptingLauncher.java:39)
	at org.junit.platform.launcher.core.ClasspathAlignmentCheckingLauncherInterceptor.intercept(ClasspathAlignmentCheckingLauncherInterceptor.java:25)
	at org.junit.platform.launcher.core.InterceptingLauncher.execute(InterceptingLauncher.java:38)
	at org.junit.platform.launcher.core.DelegatingLauncher.execute(DelegatingLauncher.java:47)
	at org.junit.platform.launcher.core.SessionPerRequestLauncher.execute(SessionPerRequestLauncher.java:63)
	at com.intellij.junit5.JUnit5IdeaTestRunner.startRunnerWithArgs(JUnit5IdeaTestRunner.java:66)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater$1.execute(IdeaTestRunner.java:38)
	at com.intellij.rt.execution.junit.TestsRepeater.repeat(TestsRepeater.java:11)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater.startRunnerWithArgs(IdeaTestRunner.java:35)
	at com.intellij.rt.junit.JUnitStarter.prepareStreamsAndStart(JUnitStarter.java:231)
	at com.intellij.rt.junit.JUnitStarter.main(JUnitStarter.java:55)
Caused by: org.springframework.data.redis.listener.adapter.RedisListenerExecutionFailedException: org.springframework.data.redis.RedisConnectionFailureException: Unable to connect to Redis
	at org.springframework.data.redis.listener.RedisMessageListenerContainer.lazyListen(RedisMessageListenerContainer.java:383)
	at org.springframework.data.redis.listener.RedisMessageListenerContainer.start(RedisMessageListenerContainer.java:361)
	at org.springframework.context.support.DefaultLifecycleProcessor.doStart(DefaultLifecycleProcessor.java:405)
	... 97 common frames omitted
Caused by: org.springframework.data.redis.RedisConnectionFailureException: Unable to connect to Redis
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory$ExceptionTranslatingConnectionProvider.translateException(LettuceConnectionFactory.java:1866)
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory$ExceptionTranslatingConnectionProvider.getConnection(LettuceConnectionFactory.java:1797)
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory$SharedConnection.getNativeConnection(LettuceConnectionFactory.java:1594)
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory$SharedConnection.lambda$getConnection$0(LettuceConnectionFactory.java:1574)
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory.doInLock(LettuceConnectionFactory.java:1535)
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory$SharedConnection.getConnection(LettuceConnectionFactory.java:1571)
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory.getSharedConnection(LettuceConnectionFactory.java:1257)
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory.getConnection(LettuceConnectionFactory.java:1063)
	at org.springframework.data.redis.listener.RedisMessageListenerContainer$Subscriber.lambda$initialize$0(RedisMessageListenerContainer.java:1241)
	at org.springframework.data.redis.listener.RedisMessageListenerContainer$Subscriber.doInLock(RedisMessageListenerContainer.java:1455)
	at org.springframework.data.redis.listener.RedisMessageListenerContainer$Subscriber.initialize(RedisMessageListenerContainer.java:1235)
	at org.springframework.data.redis.listener.RedisMessageListenerContainer.doSubscribe(RedisMessageListenerContainer.java:428)
	at org.springframework.data.redis.listener.RedisMessageListenerContainer.lazyListen(RedisMessageListenerContainer.java:404)
	at org.springframework.data.redis.listener.RedisMessageListenerContainer.lazyListen(RedisMessageListenerContainer.java:374)
	... 99 common frames omitted
Caused by: io.lettuce.core.RedisConnectionException: Unable to connect to localhost/<unresolved>:6379
	at io.lettuce.core.RedisConnectionException.create(RedisConnectionException.java:63)
	at io.lettuce.core.RedisConnectionException.create(RedisConnectionException.java:41)
	at io.lettuce.core.AbstractRedisClient.getConnection(AbstractRedisClient.java:354)
	at io.lettuce.core.RedisClient.connect(RedisClient.java:220)
	at org.springframework.data.redis.connection.lettuce.StandaloneConnectionProvider.lambda$getConnection$1(StandaloneConnectionProvider.java:112)
	at java.base/java.util.Optional.orElseGet(Optional.java:364)
	at org.springframework.data.redis.connection.lettuce.StandaloneConnectionProvider.getConnection(StandaloneConnectionProvider.java:112)
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory$ExceptionTranslatingConnectionProvider.getConnection(LettuceConnectionFactory.java:1795)
	... 111 common frames omitted
Caused by: io.netty.channel.AbstractChannel$AnnotatedConnectException: Connection refused: localhost/127.0.0.1:6379
Caused by: java.net.ConnectException: Connection refused
	at java.base/sun.nio.ch.Net.pollConnect(Native Method)
	at java.base/sun.nio.ch.Net.pollConnectNow(Net.java:682)
	at java.base/sun.nio.ch.SocketChannelImpl.finishConnect(SocketChannelImpl.java:973)
	at io.netty.channel.socket.nio.NioSocketChannel.doFinishConnect(NioSocketChannel.java:336)
	at io.netty.channel.nio.AbstractNioChannel$AbstractNioUnsafe.finishConnect(AbstractNioChannel.java:339)
	at io.netty.channel.nio.NioEventLoop.processSelectedKey(NioEventLoop.java:784)
	at io.netty.channel.nio.NioEventLoop.processSelectedKeysOptimized(NioEventLoop.java:732)
	at io.netty.channel.nio.NioEventLoop.processSelectedKeys(NioEventLoop.java:658)
	at io.netty.channel.nio.NioEventLoop.run(NioEventLoop.java:562)
	at io.netty.util.concurrent.SingleThreadEventExecutor$4.run(SingleThreadEventExecutor.java:998)
	at io.netty.util.internal.ThreadExecutorMap$2.run(ThreadExecutorMap.java:74)
	at io.netty.util.concurrent.FastThreadLocalRunnable.run(FastThreadLocalRunnable.java:30)
	at java.base/java.lang.Thread.run(Thread.java:1583)
2025-09-04 20:21:02 - Caught exception while allowing TestExecutionListener [org.springframework.test.context.web.ServletTestExecutionListener] to prepare test instance [com.aksi.integration.CalculationIntegrationTest@7d213ae5]
java.lang.IllegalStateException: Failed to load ApplicationContext for [WebMergedContextConfiguration@1d760c33 testClass = com.aksi.integration.CalculationIntegrationTest, locations = [], classes = [com.aksi.DryCleaningOrderSystemApplication], contextInitializerClasses = [], activeProfiles = ["test"], propertySourceDescriptors = [], propertySourceProperties = ["org.springframework.boot.test.context.SpringBootTestContextBootstrapper=true"], contextCustomizers = [[ImportsContextCustomizer@5f9dac0e key = [org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration, org.springframework.boot.test.autoconfigure.jdbc.TestDatabaseAutoConfiguration]], org.springframework.boot.test.context.filter.ExcludeFilterContextCustomizer@4397ad89, org.springframework.boot.test.json.DuplicateJsonObjectContextCustomizerFactory$DuplicateJsonObjectContextCustomizer@71329995, org.springframework.boot.test.mock.mockito.MockitoContextCustomizer@0, org.springframework.boot.test.web.client.TestRestTemplateContextCustomizer@f107c50, org.springframework.boot.test.web.reactor.netty.DisableReactorResourceFactoryGlobalResourcesContextCustomizerFactory$DisableReactorResourceFactoryGlobalResourcesContextCustomizerCustomizer@3f57bcad, org.springframework.boot.test.autoconfigure.OnFailureConditionReportContextCustomizerFactory$OnFailureConditionReportContextCustomizer@71e9ebae, org.springframework.boot.test.autoconfigure.actuate.observability.ObservabilityContextCustomizerFactory$DisableObservabilityContextCustomizer@1f, org.springframework.boot.test.autoconfigure.properties.PropertyMappingContextCustomizer@fc6f628c, org.springframework.boot.test.autoconfigure.web.servlet.WebDriverContextCustomizer@6d167f58, org.springframework.test.context.support.DynamicPropertiesContextCustomizer@0, org.springframework.boot.test.context.SpringBootTestAnnotation@f365d694], resourceBasePath = "src/main/webapp", contextLoader = org.springframework.boot.test.context.SpringBootContextLoader, parent = null]
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContext(DefaultCacheAwareContextLoaderDelegate.java:180)
	at org.springframework.test.context.support.DefaultTestContext.getApplicationContext(DefaultTestContext.java:130)
	at org.springframework.test.context.web.ServletTestExecutionListener.setUpRequestContextIfNecessary(ServletTestExecutionListener.java:200)
	at org.springframework.test.context.web.ServletTestExecutionListener.prepareTestInstance(ServletTestExecutionListener.java:139)
	at org.springframework.test.context.TestContextManager.prepareTestInstance(TestContextManager.java:260)
	at org.springframework.test.context.junit.jupiter.SpringExtension.postProcessTestInstance(SpringExtension.java:159)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$invokeTestInstancePostProcessors$10(ClassBasedTestDescriptor.java:383)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.executeAndMaskThrowable(ClassBasedTestDescriptor.java:388)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$invokeTestInstancePostProcessors$11(ClassBasedTestDescriptor.java:382)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$2$1.accept(ReferencePipeline.java:179)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.invokeTestInstancePostProcessors(ClassBasedTestDescriptor.java:382)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$instantiateAndPostProcessTestInstance$6(ClassBasedTestDescriptor.java:293)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.instantiateAndPostProcessTestInstance(ClassBasedTestDescriptor.java:292)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$testInstancesProvider$4(ClassBasedTestDescriptor.java:281)
	at java.base/java.util.Optional.orElseGet(Optional.java:364)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$testInstancesProvider$5(ClassBasedTestDescriptor.java:280)
	at org.junit.jupiter.engine.execution.TestInstancesProvider.getTestInstances(TestInstancesProvider.java:27)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$prepare$0(TestMethodTestDescriptor.java:112)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.prepare(TestMethodTestDescriptor.java:111)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.prepare(TestMethodTestDescriptor.java:69)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$prepare$2(NodeTestTask.java:128)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.prepare(NodeTestTask.java:128)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:160)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:146)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:144)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:100)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:160)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:146)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:144)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:100)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.submit(SameThreadHierarchicalTestExecutorService.java:35)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestExecutor.execute(HierarchicalTestExecutor.java:57)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestEngine.execute(HierarchicalTestEngine.java:54)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:201)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:170)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:94)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.lambda$execute$0(EngineExecutionOrchestrator.java:59)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.withInterceptedStreams(EngineExecutionOrchestrator.java:142)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:58)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:103)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:85)
	at org.junit.platform.launcher.core.DelegatingLauncher.execute(DelegatingLauncher.java:47)
	at org.junit.platform.launcher.core.InterceptingLauncher.lambda$execute$1(InterceptingLauncher.java:39)
	at org.junit.platform.launcher.core.ClasspathAlignmentCheckingLauncherInterceptor.intercept(ClasspathAlignmentCheckingLauncherInterceptor.java:25)
	at org.junit.platform.launcher.core.InterceptingLauncher.execute(InterceptingLauncher.java:38)
	at org.junit.platform.launcher.core.DelegatingLauncher.execute(DelegatingLauncher.java:47)
	at org.junit.platform.launcher.core.SessionPerRequestLauncher.execute(SessionPerRequestLauncher.java:63)
	at com.intellij.junit5.JUnit5IdeaTestRunner.startRunnerWithArgs(JUnit5IdeaTestRunner.java:66)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater$1.execute(IdeaTestRunner.java:38)
	at com.intellij.rt.execution.junit.TestsRepeater.repeat(TestsRepeater.java:11)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater.startRunnerWithArgs(IdeaTestRunner.java:35)
	at com.intellij.rt.junit.JUnitStarter.prepareStreamsAndStart(JUnitStarter.java:231)
	at com.intellij.rt.junit.JUnitStarter.main(JUnitStarter.java:55)
Caused by: org.springframework.context.ApplicationContextException: Failed to start bean 'springSessionRedisMessageListenerContainer'
	at org.springframework.context.support.DefaultLifecycleProcessor.doStart(DefaultLifecycleProcessor.java:408)
	at org.springframework.context.support.DefaultLifecycleProcessor.doStart(DefaultLifecycleProcessor.java:394)
	at org.springframework.context.support.DefaultLifecycleProcessor$LifecycleGroup.start(DefaultLifecycleProcessor.java:586)
	at java.base/java.lang.Iterable.forEach(Iterable.java:75)
	at org.springframework.context.support.DefaultLifecycleProcessor.startBeans(DefaultLifecycleProcessor.java:364)
	at org.springframework.context.support.DefaultLifecycleProcessor.onRefresh(DefaultLifecycleProcessor.java:310)
	at org.springframework.context.support.AbstractApplicationContext.finishRefresh(AbstractApplicationContext.java:1006)
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:630)
	at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:752)
	at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:439)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:318)
	at org.springframework.boot.test.context.SpringBootContextLoader.lambda$loadContext$3(SpringBootContextLoader.java:144)
	at org.springframework.util.function.ThrowingSupplier.get(ThrowingSupplier.java:58)
	at org.springframework.util.function.ThrowingSupplier.get(ThrowingSupplier.java:46)
	at org.springframework.boot.SpringApplication.withHook(SpringApplication.java:1461)
	at org.springframework.boot.test.context.SpringBootContextLoader$ContextLoaderHook.run(SpringBootContextLoader.java:563)
	at org.springframework.boot.test.context.SpringBootContextLoader.loadContext(SpringBootContextLoader.java:144)
	at org.springframework.boot.test.context.SpringBootContextLoader.loadContext(SpringBootContextLoader.java:110)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContextInternal(DefaultCacheAwareContextLoaderDelegate.java:225)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContext(DefaultCacheAwareContextLoaderDelegate.java:152)
	... 78 common frames omitted
Caused by: org.springframework.data.redis.listener.adapter.RedisListenerExecutionFailedException: org.springframework.data.redis.RedisConnectionFailureException: Unable to connect to Redis
	at org.springframework.data.redis.listener.RedisMessageListenerContainer.lazyListen(RedisMessageListenerContainer.java:383)
	at org.springframework.data.redis.listener.RedisMessageListenerContainer.start(RedisMessageListenerContainer.java:361)
	at org.springframework.context.support.DefaultLifecycleProcessor.doStart(DefaultLifecycleProcessor.java:405)
	... 97 common frames omitted
Caused by: org.springframework.data.redis.RedisConnectionFailureException: Unable to connect to Redis
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory$ExceptionTranslatingConnectionProvider.translateException(LettuceConnectionFactory.java:1866)
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory$ExceptionTranslatingConnectionProvider.getConnection(LettuceConnectionFactory.java:1797)
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory$SharedConnection.getNativeConnection(LettuceConnectionFactory.java:1594)
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory$SharedConnection.lambda$getConnection$0(LettuceConnectionFactory.java:1574)
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory.doInLock(LettuceConnectionFactory.java:1535)
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory$SharedConnection.getConnection(LettuceConnectionFactory.java:1571)
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory.getSharedConnection(LettuceConnectionFactory.java:1257)
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory.getConnection(LettuceConnectionFactory.java:1063)
	at org.springframework.data.redis.listener.RedisMessageListenerContainer$Subscriber.lambda$initialize$0(RedisMessageListenerContainer.java:1241)
	at org.springframework.data.redis.listener.RedisMessageListenerContainer$Subscriber.doInLock(RedisMessageListenerContainer.java:1455)
	at org.springframework.data.redis.listener.RedisMessageListenerContainer$Subscriber.initialize(RedisMessageListenerContainer.java:1235)
	at org.springframework.data.redis.listener.RedisMessageListenerContainer.doSubscribe(RedisMessageListenerContainer.java:428)
	at org.springframework.data.redis.listener.RedisMessageListenerContainer.lazyListen(RedisMessageListenerContainer.java:404)
	at org.springframework.data.redis.listener.RedisMessageListenerContainer.lazyListen(RedisMessageListenerContainer.java:374)
	... 99 common frames omitted
Caused by: io.lettuce.core.RedisConnectionException: Unable to connect to localhost/<unresolved>:6379
	at io.lettuce.core.RedisConnectionException.create(RedisConnectionException.java:63)
	at io.lettuce.core.RedisConnectionException.create(RedisConnectionException.java:41)
	at io.lettuce.core.AbstractRedisClient.getConnection(AbstractRedisClient.java:354)
	at io.lettuce.core.RedisClient.connect(RedisClient.java:220)
	at org.springframework.data.redis.connection.lettuce.StandaloneConnectionProvider.lambda$getConnection$1(StandaloneConnectionProvider.java:112)
	at java.base/java.util.Optional.orElseGet(Optional.java:364)
	at org.springframework.data.redis.connection.lettuce.StandaloneConnectionProvider.getConnection(StandaloneConnectionProvider.java:112)
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory$ExceptionTranslatingConnectionProvider.getConnection(LettuceConnectionFactory.java:1795)
	... 111 common frames omitted
Caused by: io.netty.channel.AbstractChannel$AnnotatedConnectException: Connection refused: localhost/127.0.0.1:6379
Caused by: java.net.ConnectException: Connection refused
	at java.base/sun.nio.ch.Net.pollConnect(Native Method)
	at java.base/sun.nio.ch.Net.pollConnectNow(Net.java:682)
	at java.base/sun.nio.ch.SocketChannelImpl.finishConnect(SocketChannelImpl.java:973)
	at io.netty.channel.socket.nio.NioSocketChannel.doFinishConnect(NioSocketChannel.java:336)
	at io.netty.channel.nio.AbstractNioChannel$AbstractNioUnsafe.finishConnect(AbstractNioChannel.java:339)
	at io.netty.channel.nio.NioEventLoop.processSelectedKey(NioEventLoop.java:784)
	at io.netty.channel.nio.NioEventLoop.processSelectedKeysOptimized(NioEventLoop.java:732)
	at io.netty.channel.nio.NioEventLoop.processSelectedKeys(NioEventLoop.java:658)
	at io.netty.channel.nio.NioEventLoop.run(NioEventLoop.java:562)
	at io.netty.util.concurrent.SingleThreadEventExecutor$4.run(SingleThreadEventExecutor.java:998)
	at io.netty.util.internal.ThreadExecutorMap$2.run(ThreadExecutorMap.java:74)
	at io.netty.util.concurrent.FastThreadLocalRunnable.run(FastThreadLocalRunnable.java:30)
	at java.base/java.lang.Thread.run(Thread.java:1583)
2025-09-04 20:21:02 - Caught exception while allowing TestExecutionListener [org.springframework.test.context.web.ServletTestExecutionListener] to prepare test instance [com.aksi.integration.CalculationIntegrationTest@6c7bbf62]
java.lang.IllegalStateException: ApplicationContext failure threshold (1) exceeded: skipping repeated attempt to load context for [WebMergedContextConfiguration@1d760c33 testClass = com.aksi.integration.CalculationIntegrationTest, locations = [], classes = [com.aksi.DryCleaningOrderSystemApplication], contextInitializerClasses = [], activeProfiles = ["test"], propertySourceDescriptors = [], propertySourceProperties = ["org.springframework.boot.test.context.SpringBootTestContextBootstrapper=true"], contextCustomizers = [[ImportsContextCustomizer@5f9dac0e key = [org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration, org.springframework.boot.test.autoconfigure.jdbc.TestDatabaseAutoConfiguration]], org.springframework.boot.test.context.filter.ExcludeFilterContextCustomizer@4397ad89, org.springframework.boot.test.json.DuplicateJsonObjectContextCustomizerFactory$DuplicateJsonObjectContextCustomizer@71329995, org.springframework.boot.test.mock.mockito.MockitoContextCustomizer@0, org.springframework.boot.test.web.client.TestRestTemplateContextCustomizer@f107c50, org.springframework.boot.test.web.reactor.netty.DisableReactorResourceFactoryGlobalResourcesContextCustomizerFactory$DisableReactorResourceFactoryGlobalResourcesContextCustomizerCustomizer@3f57bcad, org.springframework.boot.test.autoconfigure.OnFailureConditionReportContextCustomizerFactory$OnFailureConditionReportContextCustomizer@71e9ebae, org.springframework.boot.test.autoconfigure.actuate.observability.ObservabilityContextCustomizerFactory$DisableObservabilityContextCustomizer@1f, org.springframework.boot.test.autoconfigure.properties.PropertyMappingContextCustomizer@fc6f628c, org.springframework.boot.test.autoconfigure.web.servlet.WebDriverContextCustomizer@6d167f58, org.springframework.test.context.support.DynamicPropertiesContextCustomizer@0, org.springframework.boot.test.context.SpringBootTestAnnotation@f365d694], resourceBasePath = "src/main/webapp", contextLoader = org.springframework.boot.test.context.SpringBootContextLoader, parent = null]
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContext(DefaultCacheAwareContextLoaderDelegate.java:145)
	at org.springframework.test.context.support.DefaultTestContext.getApplicationContext(DefaultTestContext.java:130)
	at org.springframework.test.context.web.ServletTestExecutionListener.setUpRequestContextIfNecessary(ServletTestExecutionListener.java:200)
	at org.springframework.test.context.web.ServletTestExecutionListener.prepareTestInstance(ServletTestExecutionListener.java:139)
	at org.springframework.test.context.TestContextManager.prepareTestInstance(TestContextManager.java:260)
	at org.springframework.test.context.junit.jupiter.SpringExtension.postProcessTestInstance(SpringExtension.java:159)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$invokeTestInstancePostProcessors$10(ClassBasedTestDescriptor.java:383)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.executeAndMaskThrowable(ClassBasedTestDescriptor.java:388)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$invokeTestInstancePostProcessors$11(ClassBasedTestDescriptor.java:382)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$2$1.accept(ReferencePipeline.java:179)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.invokeTestInstancePostProcessors(ClassBasedTestDescriptor.java:382)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$instantiateAndPostProcessTestInstance$6(ClassBasedTestDescriptor.java:293)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.instantiateAndPostProcessTestInstance(ClassBasedTestDescriptor.java:292)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$testInstancesProvider$4(ClassBasedTestDescriptor.java:281)
	at java.base/java.util.Optional.orElseGet(Optional.java:364)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$testInstancesProvider$5(ClassBasedTestDescriptor.java:280)
	at org.junit.jupiter.engine.execution.TestInstancesProvider.getTestInstances(TestInstancesProvider.java:27)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$prepare$0(TestMethodTestDescriptor.java:112)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.prepare(TestMethodTestDescriptor.java:111)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.prepare(TestMethodTestDescriptor.java:69)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$prepare$2(NodeTestTask.java:128)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.prepare(NodeTestTask.java:128)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:160)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:146)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:144)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:100)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:160)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:146)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:144)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:100)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.submit(SameThreadHierarchicalTestExecutorService.java:35)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestExecutor.execute(HierarchicalTestExecutor.java:57)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestEngine.execute(HierarchicalTestEngine.java:54)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:201)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:170)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:94)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.lambda$execute$0(EngineExecutionOrchestrator.java:59)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.withInterceptedStreams(EngineExecutionOrchestrator.java:142)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:58)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:103)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:85)
	at org.junit.platform.launcher.core.DelegatingLauncher.execute(DelegatingLauncher.java:47)
	at org.junit.platform.launcher.core.InterceptingLauncher.lambda$execute$1(InterceptingLauncher.java:39)
	at org.junit.platform.launcher.core.ClasspathAlignmentCheckingLauncherInterceptor.intercept(ClasspathAlignmentCheckingLauncherInterceptor.java:25)
	at org.junit.platform.launcher.core.InterceptingLauncher.execute(InterceptingLauncher.java:38)
	at org.junit.platform.launcher.core.DelegatingLauncher.execute(DelegatingLauncher.java:47)
	at org.junit.platform.launcher.core.SessionPerRequestLauncher.execute(SessionPerRequestLauncher.java:63)
	at com.intellij.junit5.JUnit5IdeaTestRunner.startRunnerWithArgs(JUnit5IdeaTestRunner.java:66)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater$1.execute(IdeaTestRunner.java:38)
	at com.intellij.rt.execution.junit.TestsRepeater.repeat(TestsRepeater.java:11)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater.startRunnerWithArgs(IdeaTestRunner.java:35)
	at com.intellij.rt.junit.JUnitStarter.prepareStreamsAndStart(JUnitStarter.java:231)
	at com.intellij.rt.junit.JUnitStarter.main(JUnitStarter.java:55)
2025-09-04 20:21:02 - Caught exception while allowing TestExecutionListener [org.springframework.test.context.web.ServletTestExecutionListener] to prepare test instance [com.aksi.integration.CalculationIntegrationTest@f1a1688]
java.lang.IllegalStateException: ApplicationContext failure threshold (1) exceeded: skipping repeated attempt to load context for [WebMergedContextConfiguration@1d760c33 testClass = com.aksi.integration.CalculationIntegrationTest, locations = [], classes = [com.aksi.DryCleaningOrderSystemApplication], contextInitializerClasses = [], activeProfiles = ["test"], propertySourceDescriptors = [], propertySourceProperties = ["org.springframework.boot.test.context.SpringBootTestContextBootstrapper=true"], contextCustomizers = [[ImportsContextCustomizer@5f9dac0e key = [org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration, org.springframework.boot.test.autoconfigure.jdbc.TestDatabaseAutoConfiguration]], org.springframework.boot.test.context.filter.ExcludeFilterContextCustomizer@4397ad89, org.springframework.boot.test.json.DuplicateJsonObjectContextCustomizerFactory$DuplicateJsonObjectContextCustomizer@71329995, org.springframework.boot.test.mock.mockito.MockitoContextCustomizer@0, org.springframework.boot.test.web.client.TestRestTemplateContextCustomizer@f107c50, org.springframework.boot.test.web.reactor.netty.DisableReactorResourceFactoryGlobalResourcesContextCustomizerFactory$DisableReactorResourceFactoryGlobalResourcesContextCustomizerCustomizer@3f57bcad, org.springframework.boot.test.autoconfigure.OnFailureConditionReportContextCustomizerFactory$OnFailureConditionReportContextCustomizer@71e9ebae, org.springframework.boot.test.autoconfigure.actuate.observability.ObservabilityContextCustomizerFactory$DisableObservabilityContextCustomizer@1f, org.springframework.boot.test.autoconfigure.properties.PropertyMappingContextCustomizer@fc6f628c, org.springframework.boot.test.autoconfigure.web.servlet.WebDriverContextCustomizer@6d167f58, org.springframework.test.context.support.DynamicPropertiesContextCustomizer@0, org.springframework.boot.test.context.SpringBootTestAnnotation@f365d694], resourceBasePath = "src/main/webapp", contextLoader = org.springframework.boot.test.context.SpringBootContextLoader, parent = null]
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContext(DefaultCacheAwareContextLoaderDelegate.java:145)
	at org.springframework.test.context.support.DefaultTestContext.getApplicationContext(DefaultTestContext.java:130)
	at org.springframework.test.context.web.ServletTestExecutionListener.setUpRequestContextIfNecessary(ServletTestExecutionListener.java:200)
	at org.springframework.test.context.web.ServletTestExecutionListener.prepareTestInstance(ServletTestExecutionListener.java:139)
	at org.springframework.test.context.TestContextManager.prepareTestInstance(TestContextManager.java:260)
	at org.springframework.test.context.junit.jupiter.SpringExtension.postProcessTestInstance(SpringExtension.java:159)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$invokeTestInstancePostProcessors$10(ClassBasedTestDescriptor.java:383)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.executeAndMaskThrowable(ClassBasedTestDescriptor.java:388)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$invokeTestInstancePostProcessors$11(ClassBasedTestDescriptor.java:382)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$2$1.accept(ReferencePipeline.java:179)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.invokeTestInstancePostProcessors(ClassBasedTestDescriptor.java:382)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$instantiateAndPostProcessTestInstance$6(ClassBasedTestDescriptor.java:293)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.instantiateAndPostProcessTestInstance(ClassBasedTestDescriptor.java:292)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$testInstancesProvider$4(ClassBasedTestDescriptor.java:281)
	at java.base/java.util.Optional.orElseGet(Optional.java:364)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$testInstancesProvider$5(ClassBasedTestDescriptor.java:280)
	at org.junit.jupiter.engine.execution.TestInstancesProvider.getTestInstances(TestInstancesProvider.java:27)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$prepare$0(TestMethodTestDescriptor.java:112)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.prepare(TestMethodTestDescriptor.java:111)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.prepare(TestMethodTestDescriptor.java:69)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$prepare$2(NodeTestTask.java:128)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.prepare(NodeTestTask.java:128)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:160)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:146)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:144)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:100)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:160)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:146)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:144)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:100)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.submit(SameThreadHierarchicalTestExecutorService.java:35)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestExecutor.execute(HierarchicalTestExecutor.java:57)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestEngine.execute(HierarchicalTestEngine.java:54)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:201)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:170)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:94)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.lambda$execute$0(EngineExecutionOrchestrator.java:59)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.withInterceptedStreams(EngineExecutionOrchestrator.java:142)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:58)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:103)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:85)
	at org.junit.platform.launcher.core.DelegatingLauncher.execute(DelegatingLauncher.java:47)
	at org.junit.platform.launcher.core.InterceptingLauncher.lambda$execute$1(InterceptingLauncher.java:39)
	at org.junit.platform.launcher.core.ClasspathAlignmentCheckingLauncherInterceptor.intercept(ClasspathAlignmentCheckingLauncherInterceptor.java:25)
	at org.junit.platform.launcher.core.InterceptingLauncher.execute(InterceptingLauncher.java:38)
	at org.junit.platform.launcher.core.DelegatingLauncher.execute(DelegatingLauncher.java:47)
	at org.junit.platform.launcher.core.SessionPerRequestLauncher.execute(SessionPerRequestLauncher.java:63)
	at com.intellij.junit5.JUnit5IdeaTestRunner.startRunnerWithArgs(JUnit5IdeaTestRunner.java:66)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater$1.execute(IdeaTestRunner.java:38)
	at com.intellij.rt.execution.junit.TestsRepeater.repeat(TestsRepeater.java:11)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater.startRunnerWithArgs(IdeaTestRunner.java:35)
	at com.intellij.rt.junit.JUnitStarter.prepareStreamsAndStart(JUnitStarter.java:231)
	at com.intellij.rt.junit.JUnitStarter.main(JUnitStarter.java:55)
2025-09-04 20:21:02 - Caught exception while allowing TestExecutionListener [org.springframework.test.context.web.ServletTestExecutionListener] to prepare test instance [com.aksi.integration.CalculationIntegrationTest@74320dce]
java.lang.IllegalStateException: ApplicationContext failure threshold (1) exceeded: skipping repeated attempt to load context for [WebMergedContextConfiguration@1d760c33 testClass = com.aksi.integration.CalculationIntegrationTest, locations = [], classes = [com.aksi.DryCleaningOrderSystemApplication], contextInitializerClasses = [], activeProfiles = ["test"], propertySourceDescriptors = [], propertySourceProperties = ["org.springframework.boot.test.context.SpringBootTestContextBootstrapper=true"], contextCustomizers = [[ImportsContextCustomizer@5f9dac0e key = [org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration, org.springframework.boot.test.autoconfigure.jdbc.TestDatabaseAutoConfiguration]], org.springframework.boot.test.context.filter.ExcludeFilterContextCustomizer@4397ad89, org.springframework.boot.test.json.DuplicateJsonObjectContextCustomizerFactory$DuplicateJsonObjectContextCustomizer@71329995, org.springframework.boot.test.mock.mockito.MockitoContextCustomizer@0, org.springframework.boot.test.web.client.TestRestTemplateContextCustomizer@f107c50, org.springframework.boot.test.web.reactor.netty.DisableReactorResourceFactoryGlobalResourcesContextCustomizerFactory$DisableReactorResourceFactoryGlobalResourcesContextCustomizerCustomizer@3f57bcad, org.springframework.boot.test.autoconfigure.OnFailureConditionReportContextCustomizerFactory$OnFailureConditionReportContextCustomizer@71e9ebae, org.springframework.boot.test.autoconfigure.actuate.observability.ObservabilityContextCustomizerFactory$DisableObservabilityContextCustomizer@1f, org.springframework.boot.test.autoconfigure.properties.PropertyMappingContextCustomizer@fc6f628c, org.springframework.boot.test.autoconfigure.web.servlet.WebDriverContextCustomizer@6d167f58, org.springframework.test.context.support.DynamicPropertiesContextCustomizer@0, org.springframework.boot.test.context.SpringBootTestAnnotation@f365d694], resourceBasePath = "src/main/webapp", contextLoader = org.springframework.boot.test.context.SpringBootContextLoader, parent = null]
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContext(DefaultCacheAwareContextLoaderDelegate.java:145)
	at org.springframework.test.context.support.DefaultTestContext.getApplicationContext(DefaultTestContext.java:130)
	at org.springframework.test.context.web.ServletTestExecutionListener.setUpRequestContextIfNecessary(ServletTestExecutionListener.java:200)
	at org.springframework.test.context.web.ServletTestExecutionListener.prepareTestInstance(ServletTestExecutionListener.java:139)
	at org.springframework.test.context.TestContextManager.prepareTestInstance(TestContextManager.java:260)
	at org.springframework.test.context.junit.jupiter.SpringExtension.postProcessTestInstance(SpringExtension.java:159)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$invokeTestInstancePostProcessors$10(ClassBasedTestDescriptor.java:383)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.executeAndMaskThrowable(ClassBasedTestDescriptor.java:388)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$invokeTestInstancePostProcessors$11(ClassBasedTestDescriptor.java:382)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$2$1.accept(ReferencePipeline.java:179)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.invokeTestInstancePostProcessors(ClassBasedTestDescriptor.java:382)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$instantiateAndPostProcessTestInstance$6(ClassBasedTestDescriptor.java:293)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.instantiateAndPostProcessTestInstance(ClassBasedTestDescriptor.java:292)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$testInstancesProvider$4(ClassBasedTestDescriptor.java:281)
	at java.base/java.util.Optional.orElseGet(Optional.java:364)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$testInstancesProvider$5(ClassBasedTestDescriptor.java:280)
	at org.junit.jupiter.engine.execution.TestInstancesProvider.getTestInstances(TestInstancesProvider.java:27)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$prepare$0(TestMethodTestDescriptor.java:112)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.prepare(TestMethodTestDescriptor.java:111)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.prepare(TestMethodTestDescriptor.java:69)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$prepare$2(NodeTestTask.java:128)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.prepare(NodeTestTask.java:128)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:160)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:146)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:144)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:100)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:160)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:146)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:144)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:100)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.submit(SameThreadHierarchicalTestExecutorService.java:35)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestExecutor.execute(HierarchicalTestExecutor.java:57)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestEngine.execute(HierarchicalTestEngine.java:54)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:201)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:170)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:94)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.lambda$execute$0(EngineExecutionOrchestrator.java:59)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.withInterceptedStreams(EngineExecutionOrchestrator.java:142)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:58)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:103)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:85)
	at org.junit.platform.launcher.core.DelegatingLauncher.execute(DelegatingLauncher.java:47)
	at org.junit.platform.launcher.core.InterceptingLauncher.lambda$execute$1(InterceptingLauncher.java:39)
	at org.junit.platform.launcher.core.ClasspathAlignmentCheckingLauncherInterceptor.intercept(ClasspathAlignmentCheckingLauncherInterceptor.java:25)
	at org.junit.platform.launcher.core.InterceptingLauncher.execute(InterceptingLauncher.java:38)
	at org.junit.platform.launcher.core.DelegatingLauncher.execute(DelegatingLauncher.java:47)
	at org.junit.platform.launcher.core.SessionPerRequestLauncher.execute(SessionPerRequestLauncher.java:63)
	at com.intellij.junit5.JUnit5IdeaTestRunner.startRunnerWithArgs(JUnit5IdeaTestRunner.java:66)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater$1.execute(IdeaTestRunner.java:38)
	at com.intellij.rt.execution.junit.TestsRepeater.repeat(TestsRepeater.java:11)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater.startRunnerWithArgs(IdeaTestRunner.java:35)
	at com.intellij.rt.junit.JUnitStarter.prepareStreamsAndStart(JUnitStarter.java:231)
	at com.intellij.rt.junit.JUnitStarter.main(JUnitStarter.java:55)

Process finished with exit code 255
