# OpenAPI Structure

## Files Organization

- `auth-api.yaml` - Authentication endpoints
- `user-api.yaml` - User management endpoints
- `customer-api.yaml` - Customer management endpoints
- `serviceCatalog-itemCatalog-api.yaml` - Service and itemCatalog catalog endpoints
- `common/` - Shared components (schemas, parameters, responses)

## Usage with OpenAPI Generator

Since OpenAPI 3.x doesn't support direct $ref under paths object, use one of these approaches:

### Option 1: Generate each API separately

```bash
# Generate Auth API
openapi-generator generate -i auth-api.yaml -g spring -o target/auth

# Generate User API
openapi-generator generate -i user-api.yaml -g spring -o target/user

# etc...
```

### Option 2: Use a bundler tool

Tools like `swagger-cli bundle` or `openapi-merge-cli` can combine multiple files:

```bash
# Install swagger-cli
npm install -g @apidevtools/swagger-cli

# Bundle files
swagger-cli bundle auth-api.yaml -o bundled/auth-api.yaml
```

### Option 3: Maven Plugin Configuration

Configure maven plugin to generate from multiple files:

```xml
<plugin>
    <groupId>org.openapitools</groupId>
    <artifactId>openapi-generator-maven-plugin</artifactId>
    <version>7.0.1</version>
    <executions>
        <execution>
            <id>generate-auth-api</id>
            <goals>
                <goal>generate</goal>
            </goals>
            <configuration>
                <inputSpec>${project.basedir}/src/main/resources/openapi/auth-api.yaml</inputSpec>
                <generatorName>spring</generatorName>
                <apiPackage>com.dryclean.api.auth</apiPackage>
                <modelPackage>com.dryclean.model.auth</modelPackage>
                <generateApiTests>false</generateApiTests>
                <generateModelTests>false</generateModelTests>
            </configuration>
        </execution>
        <execution>
            <id>generate-user-api</id>
            <goals>
                <goal>generate</goal>
            </goals>
            <configuration>
                <inputSpec>${project.basedir}/src/main/resources/openapi/user-api.yaml</inputSpec>
                <generatorName>spring</generatorName>
                <apiPackage>com.dryclean.api.user</apiPackage>
                <modelPackage>com.dryclean.model.user</modelPackage>
                <generateApiTests>false</generateApiTests>
                <generateModelTests>false</generateModelTests>
            </configuration>
        </execution>
        <!-- Add more executions for other APIs -->
    </executions>
</plugin>
```

## Notes

- Each API file is self-contained with its own paths, schemas, and security
- Common components are shared via relative references
- The modular structure allows independent development and versioning
