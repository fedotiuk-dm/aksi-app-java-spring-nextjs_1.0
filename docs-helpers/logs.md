iddqd at dima1911 in ~/I/J/J/backend
↪ mvn clean generate-resources
[INFO] Scanning for projects...
[INFO]
[INFO] -----------------< com.aksi:dry-cleaning-order-system >-----------------
[INFO] Building AKSI Dry Cleaning Order System 1.0.0
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- clean:3.4.1:clean (default-clean) @ dry-cleaning-order-system ---
[INFO] Deleting /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target
[INFO]
[INFO] --- build-helper:3.6.0:add-source (add-generated-source) @ dry-cleaning-order-system ---
[INFO] Source directory: /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java added.
[INFO]
[INFO] --- openapi-generator:7.13.0:generate (generate-client-api) @ dry-cleaning-order-system ---
[INFO] Generating with dryRun=false
[INFO] Output directory (/home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi) does not exist, or is inaccessible. No file (.openapi-generator-ignore) will be evaluated.
[INFO] OpenAPI Generator: spring (server)
[INFO] Generator 'spring' is considered stable.
[INFO] ----------------------------------
[INFO] Environment variable JAVA_POST_PROCESS_FILE not defined so the Java code may not be properly formatted. To define it, try 'export JAVA_POST_PROCESS_FILE="/usr/local/bin/clang-format -i"' (Linux/Mac)
[INFO] NOTE: To enable file post-processing, 'enablePostProcessFile' must be set to `true` (--enable-post-process-file for CLI).
[INFO] Invoker Package Name, originally not set, is now derived from api package name: com.aksi.api
[INFO] Processing operation getClients
[INFO] Processing operation createClient
[INFO] Processing operation getClientById
[INFO] Processing operation updateClient
[INFO] Processing operation deleteClient
[INFO] Processing operation searchClients
[INFO] Processing operation advancedSearchClients
[INFO] Processing operation getClientContacts
[INFO] Processing operation updateClientContacts
[INFO] Processing operation getClientStatistics
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/dto/AddressDto.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/dto/ClientContactsResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/dto/ClientPageResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/dto/ClientResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/dto/ClientSearchRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/dto/ClientSearchResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/dto/ClientSearchResult.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/dto/ClientSourceType.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/dto/ClientStatistics.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/dto/CommunicationMethod.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/dto/CreateAddressRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/dto/CreateClientRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/dto/ErrorResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/dto/FieldError.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/dto/PageableInfo.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/dto/UpdateAddressRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/dto/UpdateClientContactsRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/dto/UpdateClientRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/dto/ValidationErrorResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/ClientContactsApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/ClientContactsApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/ClientContactsApiDelegate.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/ClientSearchApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/ClientSearchApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/ClientSearchApiDelegate.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/ClientsApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/ClientsApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/ClientsApiDelegate.java
[INFO] Skipping generation of Webhooks.
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/pom.xml
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/README.md
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/OpenApiGeneratorApplication.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/test/java/org/openapitools/OpenApiGeneratorApplicationTests.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/RFC3339DateFormat.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/resources/application.properties
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/configuration/HomeController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/resources/openapi.yaml
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/configuration/SpringDocConfiguration.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/client/ApiUtil.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/configuration/EnumConverterConfiguration.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/.openapi-generator-ignore
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/.openapi-generator/VERSION
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/.openapi-generator/FILES
################################################################################
# Thanks for using OpenAPI Generator.                                          #
# Please consider donation to help us maintain this project 🙏                 #
# https://opencollective.com/openapi_generator/donate                          #
################################################################################
[INFO]
[INFO] --- openapi-generator:7.13.0:generate (generate-order-api) @ dry-cleaning-order-system ---
[INFO] Generating with dryRun=false
[INFO] OpenAPI Generator: spring (server)
[INFO] Generator 'spring' is considered stable.
[INFO] ----------------------------------
[INFO] Environment variable JAVA_POST_PROCESS_FILE not defined so the Java code may not be properly formatted. To define it, try 'export JAVA_POST_PROCESS_FILE="/usr/local/bin/clang-format -i"' (Linux/Mac)
[INFO] NOTE: To enable file post-processing, 'enablePostProcessFile' must be set to `true` (--enable-post-process-file for CLI).
[INFO] Invoker Package Name, originally not set, is now derived from api package name: com.aksi.api
[INFO] Inline schema created as generateOrderReceipt_200_response. To have complete control of the model name, set the `title` field or use the modelNameMapping option (e.g. --model-name-mappings generateOrderReceipt_200_response=NewModel,ModelA=NewModelA in CLI) or inlineSchemaNameMapping option (--inline-schema-name-mappings generateOrderReceipt_200_response=NewModel,ModelA=NewModelA in CLI).
[INFO] Processing operation getOrders
[INFO] Processing operation createOrder
[INFO] Processing operation getOrderById
[INFO] Processing operation updateOrder
[INFO] Processing operation deleteOrder
[INFO] Processing operation getOrderItems
[INFO] Processing operation addOrderItem
[INFO] Processing operation getOrderItem
[INFO] Processing operation updateOrderItem
[INFO] Processing operation deleteOrderItem
[INFO] Processing operation calculateOrder
[INFO] Processing operation previewOrderCalculation
[INFO] Processing operation updateOrderPayment
[INFO] Processing operation completeOrder
[INFO] Processing operation generateOrderReceipt
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/AppliedModifier.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/BranchSummary.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/CalculateOrderRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/CalculationStep.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/ClientSummary.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/CompleteOrderRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/CompletedOrderResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/CreateOrderItemRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/CreateOrderRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/DiscountInfo.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/DiscountRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/DiscountType.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/ErrorResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/FieldError.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/GenerateOrderReceipt200Response.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/ItemCalculationDetails.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/ModifierType.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/OrderCalculationResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/OrderCalculationSummary.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/OrderItemResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/OrderPageResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/OrderResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/OrderStatus.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/PageableInfo.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/PaymentInfo.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/PaymentMethod.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/PriceModifierRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/UpdateOrderItemRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/UpdateOrderRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/UpdatePaymentRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/UrgencyType.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/dto/ValidationErrorResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/OrderCalculationsApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/OrderCalculationsApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/OrderCalculationsApiDelegate.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/OrderCompletionApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/OrderCompletionApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/OrderCompletionApiDelegate.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/OrderItemsApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/OrderItemsApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/OrderItemsApiDelegate.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/OrdersApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/OrdersApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/OrdersApiDelegate.java
[INFO] Skipping generation of Webhooks.
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/pom.xml
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/README.md
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/OpenApiGeneratorApplication.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/test/java/org/openapitools/OpenApiGeneratorApplicationTests.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/RFC3339DateFormat.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/resources/application.properties
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/configuration/HomeController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/resources/openapi.yaml
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/configuration/SpringDocConfiguration.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/order/ApiUtil.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/configuration/EnumConverterConfiguration.java
[INFO] Skipped /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/.openapi-generator-ignore (Skipped by supportingFiles options supplied by user.)
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/.openapi-generator/VERSION
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/.openapi-generator/FILES
################################################################################
# Thanks for using OpenAPI Generator.                                          #
# Please consider donation to help us maintain this project 🙏                 #
# https://opencollective.com/openapi_generator/donate                          #
################################################################################
[INFO]
[INFO] --- openapi-generator:7.13.0:generate (generate-item-api) @ dry-cleaning-order-system ---
[INFO] Generating with dryRun=false
[INFO] OpenAPI Generator: spring (server)
[INFO] Generator 'spring' is considered stable.
[INFO] ----------------------------------
[INFO] Environment variable JAVA_POST_PROCESS_FILE not defined so the Java code may not be properly formatted. To define it, try 'export JAVA_POST_PROCESS_FILE="/usr/local/bin/clang-format -i"' (Linux/Mac)
[INFO] NOTE: To enable file post-processing, 'enablePostProcessFile' must be set to `true` (--enable-post-process-file for CLI).
[INFO] Invoker Package Name, originally not set, is now derived from api package name: com.aksi.api
[INFO] Inline schema created as createPhoto_request. To have complete control of the model name, set the `title` field or use the modelNameMapping option (e.g. --model-name-mappings createPhoto_request=NewModel,ModelA=NewModelA in CLI) or inlineSchemaNameMapping option (--inline-schema-name-mappings createPhoto_request=NewModel,ModelA=NewModelA in CLI).
[INFO] Inline schema created as getPhotoById_200_response. To have complete control of the model name, set the `title` field or use the modelNameMapping option (e.g. --model-name-mappings getPhotoById_200_response=NewModel,ModelA=NewModelA in CLI) or inlineSchemaNameMapping option (--inline-schema-name-mappings getPhotoById_200_response=NewModel,ModelA=NewModelA in CLI).
[INFO] Processing operation getServiceCategories
[INFO] Processing operation getServiceCategoryById
[INFO] Processing operation getCategoryItems
[INFO] Processing operation getPriceList
[INFO] Processing operation getPriceListById
[INFO] Processing operation getMaterials
[INFO] Processing operation getColors
[INFO] Processing operation getFillings
[INFO] Processing operation getStains
[INFO] Processing operation getDefects
[INFO] Processing operation getPriceModifiers
[INFO] Processing operation getPriceModifierById
[INFO] Processing operation createCalculate
[INFO] Processing operation previewCalculation
[INFO] Processing operation createPhoto
[INFO] Processing operation getPhotoById
[INFO] Processing operation deletePhoto
[INFO] Processing operation getPhotos
[INFO] Model createPhoto_request not generated since it's marked as unused (due to form parameters) and `skipFormModel` (global property) set to true (default)
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/AppliedModifierResult.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/CalculationStep.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/ColorOption.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/DefectType.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/ErrorResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/FieldError.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/FillingOption.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/GetPhotoById200Response.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/ItemCalculationRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/ItemCalculationResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/ItemCharacteristicsRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/MaterialOption.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/ModifierType.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/PageableInfo.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/PhotoResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/PriceListItemResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/PriceListPageResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/PriceModifierResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/ServiceCategoryResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/ServiceCategorySummary.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/StainType.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/dto/ValidationErrorResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/ItemCharacteristicsApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/ItemCharacteristicsApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/ItemCharacteristicsApiDelegate.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/PhotoManagementApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/PhotoManagementApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/PhotoManagementApiDelegate.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/PriceCalculatorApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/PriceCalculatorApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/PriceCalculatorApiDelegate.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/PriceListApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/PriceListApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/PriceListApiDelegate.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/PriceModifiersApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/PriceModifiersApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/PriceModifiersApiDelegate.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/ServiceCategoriesApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/ServiceCategoriesApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/ServiceCategoriesApiDelegate.java
[INFO] Skipping generation of Webhooks.
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/pom.xml
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/README.md
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/OpenApiGeneratorApplication.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/test/java/org/openapitools/OpenApiGeneratorApplicationTests.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/RFC3339DateFormat.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/resources/application.properties
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/configuration/HomeController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/resources/openapi.yaml
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/configuration/SpringDocConfiguration.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/item/ApiUtil.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/configuration/EnumConverterConfiguration.java
[INFO] Skipped /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/.openapi-generator-ignore (Skipped by supportingFiles options supplied by user.)
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/.openapi-generator/VERSION
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/.openapi-generator/FILES
################################################################################
# Thanks for using OpenAPI Generator.                                          #
# Please consider donation to help us maintain this project 🙏                 #
# https://opencollective.com/openapi_generator/donate                          #
################################################################################
[INFO]
[INFO] --- openapi-generator:7.13.0:generate (generate-branch-api) @ dry-cleaning-order-system ---
[INFO] Generating with dryRun=false
[INFO] OpenAPI Generator: spring (server)
[INFO] Generator 'spring' is considered stable.
[INFO] ----------------------------------
[INFO] Environment variable JAVA_POST_PROCESS_FILE not defined so the Java code may not be properly formatted. To define it, try 'export JAVA_POST_PROCESS_FILE="/usr/local/bin/clang-format -i"' (Linux/Mac)
[INFO] NOTE: To enable file post-processing, 'enablePostProcessFile' must be set to `true` (--enable-post-process-file for CLI).
[INFO] Invoker Package Name, originally not set, is now derived from api package name: com.aksi.api
[INFO] Inline schema created as validateReceiptNumber_request. To have complete control of the model name, set the `title` field or use the modelNameMapping option (e.g. --model-name-mappings validateReceiptNumber_request=NewModel,ModelA=NewModelA in CLI) or inlineSchemaNameMapping option (--inline-schema-name-mappings validateReceiptNumber_request=NewModel,ModelA=NewModelA in CLI).
[INFO] Inline schema created as parseReceiptNumber_request. To have complete control of the model name, set the `title` field or use the modelNameMapping option (e.g. --model-name-mappings parseReceiptNumber_request=NewModel,ModelA=NewModelA in CLI) or inlineSchemaNameMapping option (--inline-schema-name-mappings parseReceiptNumber_request=NewModel,ModelA=NewModelA in CLI).
[INFO] Inline schema created as NextWorkingDayResponse_workingHours. To have complete control of the model name, set the `title` field or use the modelNameMapping option (e.g. --model-name-mappings NextWorkingDayResponse_workingHours=NewModel,ModelA=NewModelA in CLI) or inlineSchemaNameMapping option (--inline-schema-name-mappings NextWorkingDayResponse_workingHours=NewModel,ModelA=NewModelA in CLI).
[INFO] Inline schema created as BranchStatisticsResponse_period. To have complete control of the model name, set the `title` field or use the modelNameMapping option (e.g. --model-name-mappings BranchStatisticsResponse_period=NewModel,ModelA=NewModelA in CLI) or inlineSchemaNameMapping option (--inline-schema-name-mappings BranchStatisticsResponse_period=NewModel,ModelA=NewModelA in CLI).
[INFO] Processing operation getBranches
[INFO] Processing operation createBranche
[INFO] Processing operation getBrancheById
[INFO] Processing operation updateBranche
[INFO] Processing operation deleteBranche
[INFO] Processing operation getBranchByCode
[INFO] Processing operation getNearbyBranches
[INFO] Processing operation getBranchSchedule
[INFO] Processing operation updateBranchSchedule
[INFO] Processing operation getBranchOpenStatus
[INFO] Processing operation getBranchNextWorkingDay
[INFO] Processing operation generateQrCode
[INFO] Processing operation validateReceiptNumber
[INFO] Processing operation parseReceiptNumber
[INFO] Processing operation getBrancheStatistics
[INFO] Processing operation compareBranchesStatistics
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/AddressRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/AddressResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/BranchComparisonResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/BranchOpenStatusResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/BranchResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/BranchStatisticsResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/BranchStatisticsResponsePeriod.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/BranchStatus.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/BranchSummaryResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/BranchWithDistanceResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/ContactInfoRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/ContactInfoResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/CoordinatesRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/CoordinatesResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/CreateBranchRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/DailyStatisticResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/ErrorResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/FieldError.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/GenerateReceiptNumberRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/HolidayRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/HolidayResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/NextWorkingDayResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/NextWorkingDayResponseWorkingHours.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/ParseReceiptNumberRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/ReceiptNumberParseResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/ReceiptNumberResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/ReceiptValidationResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/ServiceStatisticResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/UpdateBranchRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/UpdateWorkingScheduleRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/ValidateReceiptNumberRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/ValidationErrorResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/WorkingDayRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/WorkingDayResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/WorkingScheduleRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/dto/WorkingScheduleResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/BranchStatisticsApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/BranchStatisticsApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/BranchStatisticsApiDelegate.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/BranchesApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/BranchesApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/BranchesApiDelegate.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/ReceiptNumbersApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/ReceiptNumbersApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/ReceiptNumbersApiDelegate.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/WorkingScheduleApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/WorkingScheduleApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/WorkingScheduleApiDelegate.java
[INFO] Skipping generation of Webhooks.
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/pom.xml
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/README.md
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/OpenApiGeneratorApplication.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/test/java/org/openapitools/OpenApiGeneratorApplicationTests.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/RFC3339DateFormat.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/resources/application.properties
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/configuration/HomeController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/resources/openapi.yaml
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/configuration/SpringDocConfiguration.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/branch/ApiUtil.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/configuration/EnumConverterConfiguration.java
[INFO] Skipped /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/.openapi-generator-ignore (Skipped by supportingFiles options supplied by user.)
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/.openapi-generator/VERSION
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/.openapi-generator/FILES
################################################################################
# Thanks for using OpenAPI Generator.                                          #
# Please consider donation to help us maintain this project 🙏                 #
# https://opencollective.com/openapi_generator/donate                          #
################################################################################
[INFO]
[INFO] --- openapi-generator:7.13.0:generate (generate-document-api) @ dry-cleaning-order-system ---
[INFO] Generating with dryRun=false
[INFO] OpenAPI Generator: spring (server)
[INFO] Generator 'spring' is considered stable.
[INFO] ----------------------------------
[INFO] Environment variable JAVA_POST_PROCESS_FILE not defined so the Java code may not be properly formatted. To define it, try 'export JAVA_POST_PROCESS_FILE="/usr/local/bin/clang-format -i"' (Linux/Mac)
[INFO] NOTE: To enable file post-processing, 'enablePostProcessFile' must be set to `true` (--enable-post-process-file for CLI).
[INFO] Invoker Package Name, originally not set, is now derived from api package name: com.aksi.api
[INFO] Inline schema created as getReceiptPdf_200_response. To have complete control of the model name, set the `title` field or use the modelNameMapping option (e.g. --model-name-mappings getReceiptPdf_200_response=NewModel,ModelA=NewModelA in CLI) or inlineSchemaNameMapping option (--inline-schema-name-mappings getReceiptPdf_200_response=NewModel,ModelA=NewModelA in CLI).
[INFO] Inline schema created as generateReceiptPdf_request. To have complete control of the model name, set the `title` field or use the modelNameMapping option (e.g. --model-name-mappings generateReceiptPdf_request=NewModel,ModelA=NewModelA in CLI) or inlineSchemaNameMapping option (--inline-schema-name-mappings generateReceiptPdf_request=NewModel,ModelA=NewModelA in CLI).
[INFO] Inline schema created as getQrCodeById_200_response. To have complete control of the model name, set the `title` field or use the modelNameMapping option (e.g. --model-name-mappings getQrCodeById_200_response=NewModel,ModelA=NewModelA in CLI) or inlineSchemaNameMapping option (--inline-schema-name-mappings getQrCodeById_200_response=NewModel,ModelA=NewModelA in CLI).
[INFO] Inline schema created as getDigitalSignatureById1_200_response. To have complete control of the model name, set the `title` field or use the modelNameMapping option (e.g. --model-name-mappings getDigitalSignatureById1_200_response=NewModel,ModelA=NewModelA in CLI) or inlineSchemaNameMapping option (--inline-schema-name-mappings getDigitalSignatureById1_200_response=NewModel,ModelA=NewModelA in CLI).
[INFO] Inline schema created as downloadDocument_200_response. To have complete control of the model name, set the `title` field or use the modelNameMapping option (e.g. --model-name-mappings downloadDocument_200_response=NewModel,ModelA=NewModelA in CLI) or inlineSchemaNameMapping option (--inline-schema-name-mappings downloadDocument_200_response=NewModel,ModelA=NewModelA in CLI).
[INFO] Processing operation getReceipts
[INFO] Processing operation createReceipt
[INFO] Processing operation getReceiptById
[INFO] Processing operation updateReceipt
[INFO] Processing operation getReceiptPdf
[INFO] Processing operation generateReceiptPdf
[INFO] Processing operation printReceipt
[INFO] Processing operation getReceiptByNumber
[INFO] Processing operation generateQrCode
[INFO] Processing operation getQrCodeById
[INFO] Processing operation createDigitalSignature
[INFO] Processing operation getDigitalSignatureById
[INFO] Processing operation getDigitalSignatureById1
[INFO] Processing operation getDocuments
[INFO] Processing operation getDocumentById
[INFO] Processing operation deleteDocument
[INFO] Processing operation downloadDocument
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/BranchInfoResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/ClientInfoResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/CompanyInfoRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/CompanyInfoResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/CreateDigitalSignatureRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/DigitalSignatureResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/DigitalSignatureSummaryResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/DocumentMetadataResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/DocumentPageResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/DocumentResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/DocumentStatus.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/DocumentSummaryResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/DocumentType.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/DownloadDocument200Response.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/ErrorResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/FieldError.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/FinancialSummaryResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/GenerateQRCodeRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/GenerateReceiptPdfRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/GenerateReceiptRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/GetDigitalSignatureById1200Response.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/GetQrCodeById200Response.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/GetReceiptPdf200Response.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/ItemDetailResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/LegalInfoRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/LegalInfoResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/ModifierDetailResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/OperatorInfoRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/OperatorInfoResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/OrderInfoResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/PageableInfo.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/PhotoSummaryResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/QRCodeResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/QRCodeSummaryResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/ReceiptDataRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/ReceiptDataResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/ReceiptPageResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/ReceiptResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/SignatureMetadataRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/SignatureMetadataResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/SignatureType.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/UpdateReceiptRequest.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/dto/ValidationErrorResponse.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/DigitalSignaturesApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/DigitalSignaturesApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/DigitalSignaturesApiDelegate.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/DocumentsApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/DocumentsApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/DocumentsApiDelegate.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/PdfGenerationApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/PdfGenerationApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/PdfGenerationApiDelegate.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/QrCodesApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/QrCodesApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/QrCodesApiDelegate.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/ReceiptsApiController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/ReceiptsApi.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/ReceiptsApiDelegate.java
[INFO] Skipping generation of Webhooks.
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/pom.xml
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/README.md
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/OpenApiGeneratorApplication.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/test/java/org/openapitools/OpenApiGeneratorApplicationTests.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/RFC3339DateFormat.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/resources/application.properties
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/configuration/HomeController.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/resources/openapi.yaml
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/configuration/SpringDocConfiguration.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/com/aksi/api/document/ApiUtil.java
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/src/main/java/org/openapitools/configuration/EnumConverterConfiguration.java
[INFO] Skipped /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/.openapi-generator-ignore (Skipped by supportingFiles options supplied by user.)
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/.openapi-generator/VERSION
[INFO] writing file /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/generated-sources/openapi/.openapi-generator/FILES
################################################################################
# Thanks for using OpenAPI Generator.                                          #
# Please consider donation to help us maintain this project 🙏                 #
# https://opencollective.com/openapi_generator/donate                          #
################################################################################
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  3.124 s
[INFO] Finished at: 2025-06-21T18:54:08+02:00
[INFO] ------------------------------------------------------------------------
iddqd at dima1911 in ~/I/J/J/backend
↪
