iddqd at dima1911 in ~/I/J/J/backend
↪ mvn clean install
[INFO] Scanning for projects...
[INFO]
[INFO] -----------------------< com.aksi:aksi-backend >------------------------
[INFO] Building aksi-backend 1.0.0
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- clean:3.4.1:clean (default-clean) @ aksi-backend ---
[INFO] Deleting /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target
[INFO]
[INFO] --- checkstyle:3.6.0:check (validate) @ aksi-backend ---
[INFO] Starting audit...
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/config/JwtAuthenticationFilter.java:74: Line is longer than 120 characters (found 124). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/config/SecurityConfig.java:44:78: Expected @throws tag for 'Exception'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/config/SecurityConfig.java:125:99: Expected @throws tag for 'Exception'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/config/CacheConfig.java:20:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/config/CacheConfig.java:21:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/config/CorsConfig.java:55: Хардкодовані URL мають бути винесені в конфігурацію [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/config/CorsConfig.java:56: Хардкодовані URL мають бути винесені в конфігурацію [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/config/CurrencyConfiguration.java:14:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/config/OpenApiConfig.java:83: Хардкодовані URL мають бути винесені в конфігурацію [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/util/QRCodeGenerator.java:3:1: Illegal import - java.awt.image.BufferedImage. [IllegalImport]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/util/JwtUtils.java:45: Javadoc comment at column 28 has parse error. Missed HTML close tag 'T'. Sometimes it means that close tag missed for one of previous tags. [AtclauseOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/util/JwtUtils.java:45: Javadoc comment at column 28 has parse error. Missed HTML close tag 'T'. Sometimes it means that close tag missed for one of previous tags. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/util/JwtUtils.java:45: Javadoc comment at column 28 has parse error. Missed HTML close tag 'T'. Sometimes it means that close tag missed for one of previous tags. [JavadocTagContinuationIndentation]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/util/JwtUtils.java:45: Javadoc comment at column 28 has parse error. Missed HTML close tag 'T'. Sometimes it means that close tag missed for one of previous tags. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderPaymentController.java:88: Line is longer than 120 characters (found 122). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/UnitOfMeasureController.java:55: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderDiscountController.java:66: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderDiscountController.java:90: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceModifierController.java:112: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/StainTypeController.java:48: Line is longer than 120 characters (found 156). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/StainTypeController.java:110: Line is longer than 120 characters (found 125). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/StainTypeController.java:131: Line is longer than 120 characters (found 125). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderRequirementsController.java:31: Line is longer than 120 characters (found 131). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/CustomerSignatureController.java:87: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/CustomerSignatureController.java:91: Line is longer than 120 characters (found 121). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/CustomerSignatureController.java:103: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/FileController.java:48: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderSummaryController.java:44: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/ReceiptController.java:37: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/ReceiptController.java:51: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/ReceiptController.java:103: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/HealthCheckController.java:19: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/HealthCheckController.java:24: Не додавайте /api/ у RequestMapping - це додається автоматично [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/HealthCheckController.java:32: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/HealthCheckController.java:45: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/HealthCheckController.java:105: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceCalculationController.java:70: Line is longer than 120 characters (found 130). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceCalculationController.java:108: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceCalculationController.java:221: Line is longer than 120 characters (found 124). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceCalculationController.java:279: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceCalculationController.java:279: Line is longer than 120 characters (found 129). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceCalculationController.java:285: Line is longer than 120 characters (found 141). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceCalculationController.java:303: Line is longer than 120 characters (found 146). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceCalculationController.java:309: Line is longer than 120 characters (found 175). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceCalculationController.java:315: Line is longer than 120 characters (found 171). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceCalculationController.java:342: Line is longer than 120 characters (found 143). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceCalculationController.java:348: Line is longer than 120 characters (found 133). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceCalculationController.java:354: Line is longer than 120 characters (found 147). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceCalculationController.java:368: Line is longer than 120 characters (found 137). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceCalculationController.java:374: Line is longer than 120 characters (found 127). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceCalculationController.java:380: Line is longer than 120 characters (found 128). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/DefectTypeController.java:48: Line is longer than 120 characters (found 164). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/DefectTypeController.java:57: Line is longer than 120 characters (found 125). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/DefectTypeController.java:109: Line is longer than 120 characters (found 125). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/DefectTypeController.java:120: Line is longer than 120 characters (found 121). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/DefectTypeController.java:125: Line is longer than 120 characters (found 125). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/ModifierRecommendationController.java:24: Line is longer than 120 characters (found 137). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/ModifierRecommendationController.java:33: Line is longer than 120 characters (found 134). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/ModifierRecommendationController.java:47: Line is longer than 120 characters (found 138). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/ModifierRecommendationController.java:61: Line is longer than 120 characters (found 128). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderItemPhotoController.java:93: Line is longer than 120 characters (found 123). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderItemPhotoController.java:129: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderItemPhotoController.java:143: Line is longer than 120 characters (found 125). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderItemPhotoController.java:163: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderItemPhotoController.java:200: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderItemPhotoController.java:220: Line is longer than 120 characters (found 127). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderFinalizationController.java:82: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderFinalizationController.java:124: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceListController.java:47: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceListController.java:105: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceListController.java:129: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceListController.java:153: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceListController.java:173: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceListController.java:192: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceListController.java:211: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceListController.java:229: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceListController.java:247: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderController.java:105: Line is longer than 120 characters (found 125). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderController.java:132: Line is longer than 120 characters (found 126). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderController.java:390: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderController.java:418: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderController.java:448: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderController.java:484: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/OrderController.java:521: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/service/auth/AuthService.java:50:23: Expected @throws tag for 'UserAlreadyExistsException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/service/auth/AuthService.java:100:23: Expected @throws tag for 'AuthenticationException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/service/auth/AuthService.java:129:23: Expected @throws tag for 'AuthenticationException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/mapper/PriceListMapper.java:21:5: All overloaded methods should be placed next to each other. Previous overloaded method located at line '16'. [OverloadMethodsDeclarationOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/application/dto/common/PagedResponse.java:14:1: Type Javadoc comment is missing @param <T> tag. [JavadocType]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/application/dto/common/PagedRequest.java:29:17: Variable 'page' explicitly initialized to '0' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/exception/handler/ExceptionHandlerComponentsManager.java:48: Line is longer than 120 characters (found 137). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/exception/handler/ExceptionHandlerComponentsManager.java:69: Line is longer than 120 characters (found 133). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/exception/handler/ValidationExceptionHandlerComponent.java:51:62: Unnecessary parentheses around lambda value. [UnnecessaryParentheses]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/exception/handler/AbstractExceptionHandlerComponent.java:31:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/exception/handler/AbstractExceptionHandlerComponent.java:34:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/exception/handler/AbstractExceptionHandlerComponent.java:122: Line is longer than 120 characters (found 122). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/exception/handler/AbstractExceptionHandlerComponent.java:129: Line is longer than 120 characters (found 122). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/exception/handler/AbstractExceptionHandlerComponent.java:213: Line is longer than 120 characters (found 142). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/entity/ClientPreferenceEntity.java:33: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/entity/ClientPreferenceEntity.java:40: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/entity/ClientPreferenceEntity.java:46: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/entity/ClientPreferenceEntity.java:52: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/entity/ClientPreferenceEntity.java:59: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/enums/ClientSource.java:8:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/repository/ClientRepository.java:21:18: Репозиторії повинні закінчуватися на Repository, а реалізація сервісів - на ServiceImpl [TypeName]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientProjection.java:11:5: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientProjection.java:12:5: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientProjection.java:13:5: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientProjection.java:14:5: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientPreferenceDTO.java:20: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientPreferenceDTO.java:25: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientPreferenceDTO.java:32: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientCategoryDTO.java:16: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientCategoryDTO.java:21: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientCategoryDTO.java:26: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientCategoryDTO.java:37: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientSearchRequest.java:18: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientSearchRequest.java:24: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientSearchRequest.java:29:17: Variable 'page' explicitly initialized to '0' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientSearchRequest.java:31: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientPageResponse.java:18: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientPageResponse.java:22: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientPageResponse.java:23: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientPageResponse.java:27: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientPageResponse.java:28: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientPageResponse.java:32: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientPageResponse.java:33: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientPageResponse.java:37: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientPageResponse.java:38: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientPageResponse.java:42: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientPageResponse.java:43: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientPageResponse.java:47: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/dto/ClientPageResponse.java:48: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/service/AddressMigrationService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/service/ClientService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/service/ClientServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/service/ClientServiceImpl.java:120: Line is longer than 120 characters (found 121). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/service/ClientServiceImpl.java:138: Line is longer than 120 characters (found 132). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/service/ClientServiceImpl.java:187: Line is longer than 120 characters (found 126). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/service/ClientServiceImpl.java:204: Line is longer than 120 characters (found 122). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/service/ClientServiceImpl.java:223: Line is longer than 120 characters (found 124). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/client/mapper/ClientMapper.java:149: Line is longer than 120 characters (found 135). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/entity/AbstractItemIssueEntity.java:26:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/entity/AbstractItemIssueEntity.java:32:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/enums/ServiceCategoryCode.java:17: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/enums/ServiceCategoryCode.java:22: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/enums/ServiceCategoryCode.java:54: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/enums/ServiceCategoryCode.java:61: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/enums/ServiceCategoryCode.java:68: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/enums/ServiceCategoryCode.java:75: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/enums/ServiceCategoryCode.java:82: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/model/PriceCalculationParams.java:24: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/model/PriceCalculationParams.java:29: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/model/PriceCalculationParams.java:34: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/model/PriceCalculationParams.java:40: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/model/PriceCalculationParams.java:46: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/model/PriceCalculationParams.java:51: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/model/PriceCalculationParams.java:56: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/model/PriceCalculationParams.java:58: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/model/PriceCalculationParams.java:62: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/repository/CatalogPriceModifierRepository.java:19:18: Репозиторії повинні закінчуватися на Repository, а реалізація сервісів - на ServiceImpl [TypeName]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/repository/CatalogPriceModifierRepository.java:49:8: Unused @param tag for 'serviceCategory'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/repository/PriceListItemRepository.java:16:18: Репозиторії повинні закінчуватися на Repository, а реалізація сервісів - на ServiceImpl [TypeName]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/repository/PriceListItemRepository.java:18:5: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/repository/PriceListItemRepository.java:19:5: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/repository/PriceListItemRepository.java:20:5: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/repository/PriceListItemRepository.java:21:5: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/repository/PriceListItemRepository.java:22:5: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/repository/StainTypeRepository.java:17:18: Репозиторії повинні закінчуватися на Repository, а реалізація сервісів - на ServiceImpl [TypeName]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/repository/DefectTypeRepository.java:17:18: Репозиторії повинні закінчуватися на Repository, а реалізація сервісів - на ServiceImpl [TypeName]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/repository/ServiceCategoryRepository.java:14:18: Репозиторії повинні закінчуватися на Repository, а реалізація сервісів - на ServiceImpl [TypeName]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/repository/ServiceCategoryRepository.java:16:5: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/repository/ServiceCategoryRepository.java:17:5: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/repository/ServiceCategoryRepository.java:18:5: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/util/CurrencyFormatUtil.java:14:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/dto/BasePriceModifierDTO.java:82: Line is longer than 120 characters (found 124). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/dto/BasePriceModifierDTO.java:86: Line is longer than 120 characters (found 121). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/dto/PriceModifierDTO.java:29:12: More than 7 parameters (found 11). [ParameterNumber]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/dto/PriceModifierDefinitionDTO.java:29:12: More than 7 parameters (found 11). [ParameterNumber]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/dto/ModifierSearchRequest.java:40: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/dto/PriceCalculationRequestDTO.java:36: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/dto/PriceCalculationRequestDTO.java:40: Line is longer than 120 characters (found 124). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceRecommendationService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PricingDomainService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/CurrencyFormattingService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/CurrencyFormattingService.java:17:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/CatalogPriceModifierServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/CatalogPriceModifierServiceImpl.java:127: Line is longer than 120 characters (found 126). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationService.java:18: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationService.java:23: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationService.java:26: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationService.java:28: Block tags have to appear in the order '[@param, @return, @throws, @deprecated, @see, @since, @serial, @serialField, @serialData, @author, @version, @category, @uses, @provides, @apiNote, @implSpec, @implNote, @hidden, @index]'. [AtclauseOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationService.java:29: Block tags have to appear in the order '[@param, @return, @throws, @deprecated, @see, @since, @serial, @serialField, @serialData, @author, @version, @category, @uses, @provides, @apiNote, @implSpec, @implNote, @hidden, @index]'. [AtclauseOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationService.java:30: Block tags have to appear in the order '[@param, @return, @throws, @deprecated, @see, @since, @serial, @serialField, @serialData, @author, @version, @category, @uses, @provides, @apiNote, @implSpec, @implNote, @hidden, @index]'. [AtclauseOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationService.java:31: Block tags have to appear in the order '[@param, @return, @throws, @deprecated, @see, @since, @serial, @serialField, @serialData, @author, @version, @category, @uses, @provides, @apiNote, @implSpec, @implNote, @hidden, @index]'. [AtclauseOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationService.java:32: Block tags have to appear in the order '[@param, @return, @throws, @deprecated, @see, @since, @serial, @serialField, @serialData, @author, @version, @category, @uses, @provides, @apiNote, @implSpec, @implNote, @hidden, @index]'. [AtclauseOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationService.java:33: Block tags have to appear in the order '[@param, @return, @throws, @deprecated, @see, @since, @serial, @serialField, @serialData, @author, @version, @category, @uses, @provides, @apiNote, @implSpec, @implNote, @hidden, @index]'. [AtclauseOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationService.java:34: Block tags have to appear in the order '[@param, @return, @throws, @deprecated, @see, @since, @serial, @serialField, @serialData, @author, @version, @category, @uses, @provides, @apiNote, @implSpec, @implNote, @hidden, @index]'. [AtclauseOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationService.java:35: Block tags have to appear in the order '[@param, @return, @throws, @deprecated, @see, @since, @serial, @serialField, @serialData, @author, @version, @category, @uses, @provides, @apiNote, @implSpec, @implNote, @hidden, @index]'. [AtclauseOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationService.java:36: Block tags have to appear in the order '[@param, @return, @throws, @deprecated, @see, @since, @serial, @serialField, @serialData, @author, @version, @category, @uses, @provides, @apiNote, @implSpec, @implNote, @hidden, @index]'. [AtclauseOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationService.java:37: Block tags have to appear in the order '[@param, @return, @throws, @deprecated, @see, @since, @serial, @serialField, @serialData, @author, @version, @category, @uses, @provides, @apiNote, @implSpec, @implNote, @hidden, @index]'. [AtclauseOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationService.java:40:16: More than 7 parameters (found 9). [ParameterNumber]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/ServiceCategoryService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceListService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceCalculationServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceCalculationServiceImpl.java:54:5: Method calculatePrice length is 120 lines (max allowed is 100). [MethodLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceCalculationServiceImpl.java:56:40: More than 7 parameters (found 10). [ParameterNumber]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceCalculationServiceImpl.java:86: Line is longer than 120 characters (found 126). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceCalculationServiceImpl.java:125: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceCalculationServiceImpl.java:135: Line is longer than 120 characters (found 123). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceCalculationServiceImpl.java:163: Line is longer than 120 characters (found 132). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceCalculationServiceImpl.java:205: Line is longer than 120 characters (found 130). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceCalculationServiceImpl.java:271: Line is longer than 120 characters (found 126). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/AbstractStainTypeService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/DefectTypeServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/DefectTypeServiceImpl.java:24: Line is longer than 120 characters (found 121). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:35: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:35:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:36: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:36:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:37: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:37:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:38: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:38:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:39: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:39:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:40: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:40:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:41: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:41:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:42:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:46:5: 'STATIC_INIT' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:47: Line is longer than 120 characters (found 122). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:50: Line is longer than 120 characters (found 137). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:52: Line is longer than 120 characters (found 127). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:53: Line is longer than 120 characters (found 129). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:78: Line is longer than 120 characters (found 123). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureServiceImpl.java:156: Line is longer than 120 characters (found 132). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/AbstractItemIssueService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/AbstractItemIssueService.java:24:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/DefectTypeService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/ServiceCategoryModifierMapper.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/ServiceCategoryModifierMapper.java:33: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/ServiceCategoryModifierMapper.java:34: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/ServiceCategoryModifierMapper.java:35: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/ServiceCategoryModifierMapper.java:36: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/ServiceCategoryModifierMapper.java:37: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/ServiceCategoryModifierMapper.java:38: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/ServiceCategoryModifierMapper.java:41: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/ServiceCategoryModifierMapper.java:42: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/ServiceCategoryModifierMapper.java:110: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/ServiceCategoryModifierMapper.java:111: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/ServiceCategoryModifierMapper.java:112: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/ServiceCategoryModifierMapper.java:117: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceRecommendationServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:39: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:47: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:51: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:54: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:55: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:56: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:58: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:61: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:62: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:64: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:67: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:68: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:69: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:71: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:74: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:75: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:76: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:78: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:81: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:82: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:83: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:84: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:86: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:93: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:94: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:96: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:104: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:108: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:112: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:116: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:120: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:125: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:126: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:128: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:138: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:149: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:154:23: More than 7 parameters (found 9). [ParameterNumber]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:164: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:177: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:306: Line is longer than 120 characters (found 121). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:357: Line is longer than 120 characters (found 129). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:416:18: More than 7 parameters (found 8). [ParameterNumber]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:433: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:442: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:465: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceModifierCalculationServiceImpl.java:471:7: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceListDomainService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceListDomainService.java:27:4: <p> tag should be placed immediately before the first word, with no space after. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceListDomainService.java:27:4: <p> tag should be preceded with an empty line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/StainTypeService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/ServiceCategoryServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/ServiceCategoryServiceImpl.java:65: Line is longer than 120 characters (found 122). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/AbstractDefectTypeService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/StainTypeServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceCalculationService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceCalculationService.java:40:33: More than 7 parameters (found 10). [ParameterNumber]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/UnitOfMeasureService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceListServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/PriceListServiceImpl.java:71: Line is longer than 120 characters (found 130). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/service/CatalogPriceModifierService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/strategy/ModifierStrategy.java:12: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/strategy/ModifierStrategy.java:20: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/strategy/FixedModifierStrategy.java:11: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/strategy/FixedModifierStrategy.java:27: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/strategy/PercentageModifierStrategy.java:27: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/strategy/PriceModifierManager.java:24: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/strategy/PriceModifierManager.java:29: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/strategy/PriceModifierManager.java:41: Line is longer than 120 characters (found 128). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/strategy/PriceModifierManager.java:50: Line is longer than 120 characters (found 132). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/strategy/PriceModifierManager.java:71: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/strategy/PriceModifierManager.java:74: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/strategy/PriceModifierManager.java:76: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/strategy/PriceModifierManager.java:77: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/strategy/RangePercentageModifierStrategy.java:27: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/strategy/RangePercentageModifierStrategy.java:39: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/strategy/AdditionModifierStrategy.java:27: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/strategy/AdditionModifierStrategy.java:33: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/usecase/GetRiskWarningsUseCase.java:51:23: Expected @throws tag for 'IllegalArgumentException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/usecase/ApplyModifiersUseCase.java:63: Line is longer than 120 characters (found 125). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/usecase/ApplyModifiersUseCase.java:95:23: Expected @throws tag for 'IllegalArgumentException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/usecase/GetRecommendedModifiersUseCase.java:52:23: Expected @throws tag for 'IllegalArgumentException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/usecase/ApplyDiscountAndExpediteUseCase.java:44: Line is longer than 120 characters (found 131). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:15:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:16:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:17:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:20:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:21:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:22:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:23:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:26:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:27:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:30:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:31:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:32:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:35:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:36:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:37:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:38:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:39:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:40:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:43:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:44:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:45:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:46: Line is longer than 120 characters (found 122). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:46:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:47:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:48: Line is longer than 120 characters (found 128). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:48:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:54:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:55:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:56:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:57:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:58:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:59:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:60:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:61:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:62:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:63:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:64:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:65:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:70:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:71:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:72:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:73:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:74:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:75:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:76:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:77:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:80: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:84: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:84:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:85: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:85:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:86: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:86:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:87: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:87:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:88: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:88:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:89: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:89:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:90: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:90:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:91:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:94:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:103: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:107:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:108:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:109:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:110:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:111:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:112:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:113:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:114:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:123:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:124:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:125:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:126:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:127:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:128:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:133:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:134:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:135:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:136:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:137:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:138:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:143:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:144:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:145:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:146:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:147:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:148:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:149:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:150:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:151:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:152:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:157:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:158:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:159:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:160:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:161:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:162:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:163:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:164:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:165:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:166:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:171:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:172: Line is longer than 120 characters (found 138). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:172:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:173: Line is longer than 120 characters (found 129). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:173:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:178:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:179:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:180:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:181:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:182:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PricingConstants.java:183:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:3: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:5:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:13:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:31:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:32:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:33:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:37:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:38:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:39:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:40:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:41:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:46:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:47:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:48:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:49:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:50:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:55:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:56:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:57:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:58:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:59:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:60:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:61:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:62:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:67:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:68:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:69:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:70:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:71:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:76:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:77:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:78:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:79:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:80:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:81:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:82:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:87:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:88:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:89:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:90:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:91:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:96:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:97:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:98:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:99:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:104:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:105:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:106:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:107:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:112:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:113:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:114:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:116:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:117:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:118:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:119:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:120:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:121:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:126:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:127:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:128:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:129:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:130:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:131:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:132:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:133:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:134:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:135:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:140:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:141:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:142:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:143:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ApiConstants.java:144:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PriceCalculationConstants.java:17:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PriceCalculationConstants.java:18:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PriceCalculationConstants.java:19:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PriceCalculationConstants.java:20:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PriceCalculationConstants.java:23:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PriceCalculationConstants.java:24:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PriceCalculationConstants.java:27:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PriceCalculationConstants.java:28:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PriceCalculationConstants.java:29:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PriceCalculationConstants.java:30:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PriceCalculationConstants.java:33:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PriceCalculationConstants.java:36:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PriceCalculationConstants.java:41:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PriceCalculationConstants.java:56: Line continuation have incorrect indentation level, expected level should be 4. [JavadocTagContinuationIndentation]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PriceCalculationConstants.java:58: Block tags have to appear in the order '[@param, @return, @throws, @deprecated, @see, @since, @serial, @serialField, @serialData, @author, @version, @category, @uses, @provides, @apiNote, @implSpec, @implNote, @hidden, @index]'. [AtclauseOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PriceCalculationConstants.java:59: Block tags have to appear in the order '[@param, @return, @throws, @deprecated, @see, @since, @serial, @serialField, @serialData, @author, @version, @category, @uses, @provides, @apiNote, @implSpec, @implNote, @hidden, @index]'. [AtclauseOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/PriceCalculationConstants.java:60: Block tags have to appear in the order '[@param, @return, @throws, @deprecated, @see, @since, @serial, @serialField, @serialData, @author, @version, @category, @uses, @provides, @apiNote, @implSpec, @implNote, @hidden, @index]'. [AtclauseOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:15:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:16:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:17:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:19:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:20:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:21:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:24:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:25:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:26:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:27:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:30:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:33:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:34:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:35:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:38:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:39:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:40:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:43:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:44:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:45:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:46:5: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:50:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:51:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:52:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:53:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:54:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:55:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:56:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:61:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:62:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:63:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/ModifierFormatConstants.java:64:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:15:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:16:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:17:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:18:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:19:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:20:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:25:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:26:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:27:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:28:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:29:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:30:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:31:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:32:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:33:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:34:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:35:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:36:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:37:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:38:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:39:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:44:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:45:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:46:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:47:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:48:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:49:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:50:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:51:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:52:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:53:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:58:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:59:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:60:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:61:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:62:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:63:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:64:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:65:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:66:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:67:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:68:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:69:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:70:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:71:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:76:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:77:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:78:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:79:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:80:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:81:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:82:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:83:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:88:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:89:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:90:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:91:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:92:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:93:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:94:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:95:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:100:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:101:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:102:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:103:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:104:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:105:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:106:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:111:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:112:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:113:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:114:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:115:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:116:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:117:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:118:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:119:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:120:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:121:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:126:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:127:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:128:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:129:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:134:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:135:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:136:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:137:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:138:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:143:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:144:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/constants/LocalizationConstants.java:145:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/pricing/valueobject/package-info.java:3:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/user/repository/UserRepository.java:15:18: Репозиторії повинні закінчуватися на Repository, а реалізація сервісів - на ServiceImpl [TypeName]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/entity/OrderEntity.java:173:21: Variable 'draft' explicitly initialized to 'false' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/entity/OrderEntity.java:177: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/entity/OrderEntity.java:177:21: Variable 'isPrinted' explicitly initialized to 'false' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/entity/OrderEntity.java:181: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/entity/OrderEntity.java:181:21: Variable 'isEmailed' explicitly initialized to 'false' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/entity/OrderEntity.java:188:21: Variable 'termsAccepted' explicitly initialized to 'false' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/entity/CustomerSignatureEntity.java:47:21: Variable 'termsAccepted' explicitly initialized to 'false' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/model/NonExpeditableCategory.java:10: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/model/NonExpeditableCategory.java:15: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/model/NonExpeditableCategory.java:20: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/model/RestrictedCategory.java:17: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/model/NonDiscountableCategory.java:10: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/model/NonDiscountableCategory.java:15: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/model/NonDiscountableCategory.java:20: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/repository/OrderRepository.java:18:18: Репозиторії повинні закінчуватися на Repository, а реалізація сервісів - на ServiceImpl [TypeName]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/repository/OrderItemRepository.java:15:18: Репозиторії повинні закінчуватися на Repository, а реалізація сервісів - на ServiceImpl [TypeName]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/repository/CustomerSignatureRepository.java:16:18: Репозиторії повинні закінчуватися на Repository, а реалізація сервісів - на ServiceImpl [TypeName]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/repository/OrderItemPhotoRepository.java:15:18: Репозиторії повинні закінчуватися на Repository, а реалізація сервісів - на ServiceImpl [TypeName]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/repository/PriceModifierRepository.java:15:18: Репозиторії повинні закінчуватися на Repository, а реалізація сервісів - на ServiceImpl [TypeName]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/enums/ClientSelectionMode.java:60:19: Expected @throws tag for 'IllegalArgumentException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/actions/ClientSearchSelectAction.java:62: Line is longer than 120 characters (found 129). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/config/NewClientFormStateMachineConfig.java:63:5: Method configure length is 108 lines (max allowed is 100). [MethodLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/config/ClientSearchStateMachineConfig.java:24: Line is longer than 120 characters (found 125). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/config/ClientSearchStateMachineConfig.java:55:5: Method configure length is 104 lines (max allowed is 100). [MethodLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/config/ClientSearchStateMachineConfig.java:56: Line is longer than 120 characters (found 128). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/config/BasicOrderInfoStateMachineConfig.java:63:5: Method configure length is 136 lines (max allowed is 100). [MethodLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/dto/ClientSearchCriteriaDTO.java:42:17: Variable 'page' explicitly initialized to '0' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/BasicOrderInfoCoordinationService.java:216: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/BasicOrderInfoCoordinationService.java:224: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/ClientSearchStateService.java:29: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/ClientSearchOperationsService.java:161: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/NewClientFormValidationService.java:65: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/NewClientFormValidationService.java:76: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/ClientSearchValidationService.java:69: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/ClientSearchValidationService.java:100: Line is longer than 120 characters (found 127). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/BasicOrderInfoStateService.java:42:38: '{' at column 38 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/BasicOrderInfoStateService.java:44:54: '{' at column 54 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/BasicOrderInfoStateService.java:45:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/BasicOrderInfoStateService.java:50:54: '{' at column 54 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/BasicOrderInfoStateService.java:51:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/BasicOrderInfoStateService.java:56:47: '{' at column 47 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/BasicOrderInfoStateService.java:58:38: '{' at column 38 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/BasicOrderInfoStateService.java:59:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/BasicOrderInfoStateService.java:64:35: '{' at column 35 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/BasicOrderInfoStateService.java:65:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/ClientSearchCoordinationService.java:215: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/NewClientFormCoordinationService.java:152:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/NewClientFormCoordinationService.java:157:23: Expected @throws tag for 'IllegalArgumentException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/NewClientFormCoordinationService.java:181: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/NewClientFormCoordinationService.java:189: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/BasicOrderInfoValidationService.java:46: Line is longer than 120 characters (found 122). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/BasicOrderInfoValidationService.java:103: Line is longer than 120 characters (found 121). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/BasicOrderInfoValidationService.java:189: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/service/BasicOrderInfoValidationService.java:200: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/validator/NewClientFormValidationResult.java:14: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/validator/NewClientFormValidator.java:27: Line is longer than 120 characters (found 124). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/validator/NewClientFormValidator.java:96: Line is longer than 120 characters (found 147). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/validator/NewClientFormValidator.java:97: Line is longer than 120 characters (found 144). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/validator/NewClientFormValidator.java:98: Line is longer than 120 characters (found 144). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/validator/NewClientFormValidator.java:267: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/validator/ClientSearchValidationResult.java:12: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/mapper/NewClientFormMapper.java:33:32: More than 7 parameters (found 8). [ParameterNumber]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/mapper/NewClientFormMapper.java:191:5: All overloaded methods should be placed next to each other. Previous overloaded method located at line '122'. [OverloadMethodsDeclarationOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/mapper/NewClientFormMapper.java:208:5: All overloaded methods should be placed next to each other. Previous overloaded method located at line '96'. [OverloadMethodsDeclarationOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/NewClientFormAdapter.java:47: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/NewClientFormAdapter.java:60: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/NewClientFormAdapter.java:73: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/NewClientFormAdapter.java:89: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/NewClientFormAdapter.java:102: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/NewClientFormAdapter.java:115: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/NewClientFormAdapter.java:129: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/NewClientFormAdapter.java:146: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/NewClientFormAdapter.java:159: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/NewClientFormAdapter.java:172: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/BasicOrderInfoAdapter.java:65: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/BasicOrderInfoAdapter.java:78: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/BasicOrderInfoAdapter.java:91: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/BasicOrderInfoAdapter.java:107: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/BasicOrderInfoAdapter.java:127: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/BasicOrderInfoAdapter.java:145: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/BasicOrderInfoAdapter.java:167: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/BasicOrderInfoAdapter.java:181: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/BasicOrderInfoAdapter.java:195: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/BasicOrderInfoAdapter.java:208: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/BasicOrderInfoAdapter.java:221: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/BasicOrderInfoAdapter.java:234: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/BasicOrderInfoAdapter.java:247: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/BasicOrderInfoAdapter.java:260: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/BasicOrderInfoAdapter.java:274: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/ClientSearchAdapter.java:26:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/ClientSearchAdapter.java:30:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/ClientSearchAdapter.java:56: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/ClientSearchAdapter.java:69: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/ClientSearchAdapter.java:82: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/ClientSearchAdapter.java:99: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/ClientSearchAdapter.java:116: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/ClientSearchAdapter.java:135: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/ClientSearchAdapter.java:151: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/ClientSearchAdapter.java:167: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/ClientSearchAdapter.java:180: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/ClientSearchAdapter.java:193: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/ClientSearchAdapter.java:206: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/ClientSearchAdapter.java:219: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage1/adapter/ClientSearchAdapter.java:232: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/config/OrderWizardMainStateMachineConfig.java:43:5: Method configure length is 242 lines (max allowed is 100). [MethodLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/OrderState.java:3: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/OrderState.java:5:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/enums/Stage4Event.java:5:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/enums/Stage4State.java:5:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/config/Stage4StateMachineConfig.java:24:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/config/Stage4StateMachineConfig.java:44:12: More than 7 parameters (found 8). [ParameterNumber]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:44:36: '{' at column 36 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:45:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:45:50: '{' at column 50 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:47:34: '{' at column 34 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:48:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:48:46: '{' at column 46 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:50:46: '{' at column 46 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:51:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:51:63: '{' at column 63 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:53:60: '{' at column 60 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:54: Line is longer than 120 characters (found 128). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:54:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:54:82: '{' at column 82 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:56:56: '{' at column 56 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:57:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:57:76: '{' at column 76 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:59:66: '{' at column 66 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:60: Line is longer than 120 characters (found 143). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:60:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:60:91: '{' at column 91 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:62:56: '{' at column 56 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:63:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4StateService.java:63:76: '{' at column 76 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4CoordinationService.java:37:12: More than 7 parameters (found 8). [ParameterNumber]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4CoordinationService.java:79: Line is longer than 120 characters (found 131). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4CoordinationService.java:130: Line is longer than 120 characters (found 124). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4CoordinationService.java:138: Line is longer than 120 characters (found 157). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4CoordinationService.java:139: Line is longer than 120 characters (found 122). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4CoordinationService.java:196:5: All overloaded methods should be placed next to each other. Previous overloaded method located at line '134'. [OverloadMethodsDeclarationOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4CoordinationService.java:223:23: Expected @throws tag for 'IllegalArgumentException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4CoordinationService.java:234: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4CoordinationService.java:253: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4CoordinationService.java:303:5: '/*' has more than 1 empty lines before. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4WorkflowService.java:62:23: Expected @throws tag for 'IllegalArgumentException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4WorkflowService.java:100:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4WorkflowService.java:151:5: Method generateReceipt length is 103 lines (max allowed is 100). [MethodLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4WorkflowService.java:155:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4WorkflowService.java:187: Line is longer than 120 characters (found 133). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4WorkflowService.java:271:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4WorkflowService.java:327:5: All overloaded methods should be placed next to each other. Previous overloaded method located at line '57'. [OverloadMethodsDeclarationOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4WorkflowService.java:342:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4WorkflowService.java:370:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4WorkflowService.java:384:5: All overloaded methods should be placed next to each other. Previous overloaded method located at line '151'. [OverloadMethodsDeclarationOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4WorkflowService.java:387:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4WorkflowService.java:400:5: All overloaded methods should be placed next to each other. Previous overloaded method located at line '267'. [OverloadMethodsDeclarationOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4WorkflowService.java:403:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/service/Stage4WorkflowService.java:406: Line is longer than 120 characters (found 139). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/mapper/Stage4LegalAcceptanceMapper.java:170: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/mapper/Stage4OrderCompletionMapper.java:26: Line is longer than 120 characters (found 123). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/mapper/Stage4OrderCompletionMapper.java:154: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/mapper/Stage4OrderConfirmationMapper.java:101: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/mapper/Stage4ReceiptMapper.java:27: Line is longer than 120 characters (found 124). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/mapper/Stage4ReceiptMapper.java:152: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/adapter/Stage4StateMachineAdapter.java:34: Не додавайте /api/ у RequestMapping - це додається автоматично [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/adapter/Stage4StateMachineAdapter.java:48: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/adapter/Stage4StateMachineAdapter.java:64: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/adapter/Stage4StateMachineAdapter.java:76: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/adapter/Stage4StateMachineAdapter.java:130: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/adapter/Stage4StateMachineAdapter.java:141: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/adapter/Stage4StateMachineAdapter.java:162: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/adapter/Stage4StateMachineAdapter.java:183: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/adapter/Stage4StateMachineAdapter.java:204: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/adapter/Stage4StateMachineAdapter.java:227: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/adapter/Stage4StateMachineAdapter.java:299: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/adapter/Stage4StateMachineAdapter.java:312:5: 'RECORD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/adapter/Stage4StateMachineAdapter.java:313:5: 'RECORD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage4/adapter/Stage4StateMachineAdapter.java:314:5: 'RECORD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/util/StateMachineUtils.java:305: Line is longer than 120 characters (found 126). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/Stage3State.java:3: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/Stage3Event.java:3: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/DiscountState.java:3: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/DiscountState.java:9: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/DiscountState.java:14: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/DiscountState.java:19: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/DiscountState.java:24: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/DiscountState.java:29: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/DiscountState.java:46: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/DiscountState.java:53: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/DiscountState.java:60: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/DiscountState.java:67: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/DiscountState.java:74: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/AdditionalInfoState.java:3: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/AdditionalInfoState.java:9: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/AdditionalInfoState.java:14: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/AdditionalInfoState.java:19: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/AdditionalInfoState.java:24: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/AdditionalInfoState.java:29: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/AdditionalInfoState.java:46: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/AdditionalInfoState.java:55: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/AdditionalInfoState.java:64: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/AdditionalInfoState.java:73: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/AdditionalInfoState.java:80: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/AdditionalInfoState.java:89: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/AdditionalInfoState.java:96: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/PaymentState.java:3: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/PaymentState.java:9: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/PaymentState.java:14: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/PaymentState.java:19: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/PaymentState.java:24: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/PaymentState.java:29: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/PaymentState.java:34: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/PaymentState.java:51: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/PaymentState.java:58: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/PaymentState.java:65: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/PaymentState.java:72: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/PaymentState.java:79: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/PaymentState.java:86: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/ExecutionParamsState.java:3: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/ExecutionParamsState.java:9: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/ExecutionParamsState.java:14: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/ExecutionParamsState.java:19: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/ExecutionParamsState.java:24: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/ExecutionParamsState.java:29: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/ExecutionParamsState.java:46: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/ExecutionParamsState.java:53: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/ExecutionParamsState.java:60: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/ExecutionParamsState.java:67: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/enums/ExecutionParamsState.java:74: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/actions/CompleteStage3Action.java:18:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/actions/CompleteStage3Action.java:26:33: Name 'logger' must match pattern '^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$'. [ConstantName]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/actions/CompleteStage3Action.java:70: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/actions/InitializeStage3Action.java:18:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/actions/InitializeStage3Action.java:26:33: Name 'logger' must match pattern '^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$'. [ConstantName]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/actions/InitializeStage3Action.java:59: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/config/Stage3StateMachineConfig.java:22:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/config/Stage3StateMachineConfig.java:63:5: Method configure length is 149 lines (max allowed is 100). [MethodLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/ExecutionParamsDTO.java:12: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/ExecutionParamsDTO.java:161: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/ExecutionParamsDTO.java:168: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/ExecutionParamsDTO.java:185: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/ExecutionParamsDTO.java:200: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/ExecutionParamsDTO.java:210: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/ExecutionParamsDTO.java:220: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/ExecutionParamsDTO.java:230: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/ExecutionParamsDTO.java:247: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/ExecutionParamsDTO.java:258: Line is longer than 120 characters (found 125). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/DiscountConfigurationDTO.java:11: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/DiscountConfigurationDTO.java:186: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/DiscountConfigurationDTO.java:193: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/DiscountConfigurationDTO.java:209: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/DiscountConfigurationDTO.java:216: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/DiscountConfigurationDTO.java:232: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/DiscountConfigurationDTO.java:239: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/DiscountConfigurationDTO.java:255: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/DiscountConfigurationDTO.java:262: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/DiscountConfigurationDTO.java:271: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/DiscountConfigurationDTO.java:280: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/DiscountConfigurationDTO.java:292: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/DiscountConfigurationDTO.java:308: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/PaymentConfigurationDTO.java:10: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/PaymentConfigurationDTO.java:190: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/PaymentConfigurationDTO.java:197: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/PaymentConfigurationDTO.java:214: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/PaymentConfigurationDTO.java:221: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/PaymentConfigurationDTO.java:240: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/PaymentConfigurationDTO.java:249: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/PaymentConfigurationDTO.java:256: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/PaymentConfigurationDTO.java:266: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/PaymentConfigurationDTO.java:276: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/PaymentConfigurationDTO.java:287: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/PaymentConfigurationDTO.java:301: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/PaymentConfigurationDTO.java:316: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/AdditionalInfoDTO.java:9: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/AdditionalInfoDTO.java:160: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/AdditionalInfoDTO.java:167: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/AdditionalInfoDTO.java:184: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/AdditionalInfoDTO.java:191: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/AdditionalInfoDTO.java:208: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/AdditionalInfoDTO.java:216: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/AdditionalInfoDTO.java:223: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/AdditionalInfoDTO.java:232: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/AdditionalInfoDTO.java:243: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/AdditionalInfoDTO.java:257: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/AdditionalInfoDTO.java:260: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/dto/AdditionalInfoDTO.java:264: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3ExecutionParamsOperationsService.java:16:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3ExecutionParamsOperationsService.java:30: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3ExecutionParamsOperationsService.java:37: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3ExecutionParamsOperationsService.java:49: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3ExecutionParamsOperationsService.java:61: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3ExecutionParamsOperationsService.java:73: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3ExecutionParamsOperationsService.java:84: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3DiscountOperationsService.java:14:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3DiscountOperationsService.java:28: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3DiscountOperationsService.java:35: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3DiscountOperationsService.java:42: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3DiscountOperationsService.java:49: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3DiscountOperationsService.java:56: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3DiscountOperationsService.java:63: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3WorkflowService.java:20:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3WorkflowService.java:28: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3WorkflowService.java:58: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3WorkflowService.java:71: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3WorkflowService.java:84: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3WorkflowService.java:98: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3WorkflowService.java:111: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3WorkflowService.java:131: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3WorkflowService.java:146: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3WorkflowService.java:169: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3WorkflowService.java:188: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3WorkflowService.java:207: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3WorkflowService.java:222: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3WorkflowService.java:229: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3WorkflowService.java:236: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3WorkflowService.java:243: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:27:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:43:12: More than 7 parameters (found 8). [ParameterNumber]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:204: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:213: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:222: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:231: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:240: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:257: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:272: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:287: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:308: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:315: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:322: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:329: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:336: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:343: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:350: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:357: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:364: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:371: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:378: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:385: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:392: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3CoordinationService.java:399: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:16: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:25: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:42: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:135: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:142: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:149: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:156: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:163: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:170: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:177: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:187: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:199: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:210: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:221: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:230: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:237: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:244: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:254: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:265: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:276: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:287: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:295: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:303: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:311: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:319: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:326: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:337: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:344: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:352: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:360: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:378: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:385: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:396: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3StateService.java:410: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3PaymentOperationsService.java:14:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3PaymentOperationsService.java:28: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3PaymentOperationsService.java:35: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3PaymentOperationsService.java:42: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3PaymentOperationsService.java:49: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3PaymentOperationsService.java:64: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3SessionService.java:16:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3SessionService.java:30: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3SessionService.java:39: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3SessionService.java:49: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3SessionService.java:56: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3SessionService.java:63: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3SessionService.java:70: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3SessionService.java:80: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3SessionService.java:87: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3SessionService.java:94: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3SessionService.java:104: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3SessionService.java:112: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3SessionService.java:122: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3SessionService.java:129: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3SessionService.java:136: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3SessionService.java:144: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3AdditionalInfoOperationsService.java:14:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3AdditionalInfoOperationsService.java:28: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3AdditionalInfoOperationsService.java:35: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3AdditionalInfoOperationsService.java:42: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3AdditionalInfoOperationsService.java:49: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3AdditionalInfoOperationsService.java:59: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3ValidationService.java:19:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3ValidationService.java:43: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3ValidationService.java:50: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3ValidationService.java:57: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3ValidationService.java:64: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3ValidationService.java:71: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3ValidationService.java:100: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3ValidationService.java:132: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3ValidationService.java:152: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3ValidationService.java:172: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3ValidationService.java:191: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/service/Stage3ValidationService.java:203: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/guards/ExecutionParamsReadyGuard.java:16:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/guards/ExecutionParamsReadyGuard.java:42: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/guards/DiscountConfigReadyGuard.java:16:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/guards/DiscountConfigReadyGuard.java:42: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/guards/PaymentConfigReadyGuard.java:16:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/guards/PaymentConfigReadyGuard.java:42: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/guards/Stage3CompleteGuard.java:16:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/guards/Stage3CompleteGuard.java:42: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/DiscountConfigurationValidator.java:11: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/DiscountConfigurationValidator.java:18: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/DiscountConfigurationValidator.java:41: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/DiscountConfigurationValidator.java:83: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/DiscountConfigurationValidator.java:135: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/DiscountConfigurationValidator.java:163: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/DiscountConfigurationValidator.java:194: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/DiscountConfigurationValidator.java:223: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/DiscountConfigurationValidator.java:252: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/DiscountConfigurationValidator.java:273: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/DiscountConfigurationValidator.java:299: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ExecutionParamsValidator.java:12: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ExecutionParamsValidator.java:19: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ExecutionParamsValidator.java:50: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ExecutionParamsValidator.java:67: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ExecutionParamsValidator.java:110: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ExecutionParamsValidator.java:147: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ExecutionParamsValidator.java:187: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ExecutionParamsValidator.java:215: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ExecutionParamsValidator.java:236: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ExecutionParamsValidator.java:262: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/AdditionalInfoValidator.java:9: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/AdditionalInfoValidator.java:19: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/AdditionalInfoValidator.java:42: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/AdditionalInfoValidator.java:76: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/AdditionalInfoValidator.java:110: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/AdditionalInfoValidator.java:159: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/AdditionalInfoValidator.java:188: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/AdditionalInfoValidator.java:230: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/AdditionalInfoValidator.java:257: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/AdditionalInfoValidator.java:275: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/AdditionalInfoValidator.java:297: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/AdditionalInfoValidator.java:332: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/AdditionalInfoValidator.java:345: Line is longer than 120 characters (found 131). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/AdditionalInfoValidator.java:351: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/AdditionalInfoValidator.java:364: Line is longer than 120 characters (found 131). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/AdditionalInfoValidator.java:370: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/PaymentConfigurationValidator.java:11: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/PaymentConfigurationValidator.java:18: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/PaymentConfigurationValidator.java:41: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/PaymentConfigurationValidator.java:59: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/PaymentConfigurationValidator.java:113: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/PaymentConfigurationValidator.java:143: Line is longer than 120 characters (found 122). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/PaymentConfigurationValidator.java:152: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/PaymentConfigurationValidator.java:183: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/PaymentConfigurationValidator.java:220: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/PaymentConfigurationValidator.java:249: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/PaymentConfigurationValidator.java:274: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/PaymentConfigurationValidator.java:296: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/PaymentConfigurationValidator.java:328: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:6: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:70: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:81: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:91: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:103: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:117: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:124: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:131: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:138: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:145: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:152: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:159: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:186: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:217: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:228: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:238: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:249: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:256: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:263: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:272: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/validator/ValidationResult.java:281: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3DiscountMapper.java:11: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3DiscountMapper.java:17: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3DiscountMapper.java:26: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3DiscountMapper.java:41: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3DiscountMapper.java:57: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3DiscountMapper.java:75: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3DiscountMapper.java:89: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3DiscountMapper.java:106: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3DiscountMapper.java:120: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3DiscountMapper.java:134: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3DiscountMapper.java:146: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3DiscountMapper.java:167: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3DiscountMapper.java:189: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3DiscountMapper.java:235: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3DiscountMapper.java:249: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3DiscountMapper.java:263: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3ExecutionParamsMapper.java:13: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3ExecutionParamsMapper.java:19: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3ExecutionParamsMapper.java:28: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3ExecutionParamsMapper.java:43: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3ExecutionParamsMapper.java:57: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3ExecutionParamsMapper.java:71: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3ExecutionParamsMapper.java:85: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3ExecutionParamsMapper.java:99: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3ExecutionParamsMapper.java:112: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3ExecutionParamsMapper.java:126: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3ExecutionParamsMapper.java:138: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3ExecutionParamsMapper.java:158: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3ExecutionParamsMapper.java:182: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3ExecutionParamsMapper.java:194: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3ExecutionParamsMapper.java:230: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3PaymentMapper.java:12: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3PaymentMapper.java:18: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3PaymentMapper.java:27: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3PaymentMapper.java:42: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3PaymentMapper.java:57: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3PaymentMapper.java:75: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3PaymentMapper.java:89: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3PaymentMapper.java:103: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3PaymentMapper.java:115: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3PaymentMapper.java:127: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3PaymentMapper.java:141: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3PaymentMapper.java:153: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3PaymentMapper.java:173: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3PaymentMapper.java:192: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3PaymentMapper.java:243: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3PaymentMapper.java:257: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3PaymentMapper.java:278: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3PaymentMapper.java:294: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:9: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:15: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:24: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:39: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:54: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:72: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:86: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:100: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:116: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:129: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:143: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:155: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:175: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:202: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:233: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:253: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:276: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:294: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:310: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/mapper/Stage3AdditionalInfoMapper.java:317: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:26:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:32: Не додавайте /api/ у RequestMapping - це додається автоматично [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:43: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:52: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:55: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:65: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:68: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:79: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:82: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:93: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:96: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:106: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:109: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:121: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:124: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:144: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:147: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:159: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:162: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:182: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:185: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:197: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:200: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:220: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:223: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:235: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:238: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:258: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:261: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:273: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:276: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:286: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:289: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:299: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage3/adapter/Stage3StateMachineAdapter.java:302: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/enums/Stage2State.java:7: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/enums/Stage2State.java:12: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/enums/Stage2State.java:17: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/enums/Stage2State.java:22: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/enums/Stage2State.java:27: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/enums/Stage2State.java:32: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/enums/Stage2State.java:37: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/enums/Stage2Event.java:7: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/enums/Stage2Event.java:12: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/enums/Stage2Event.java:17: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/enums/Stage2Event.java:22: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/enums/Stage2Event.java:27: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/enums/Stage2Event.java:32: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/enums/Stage2Event.java:37: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/enums/Stage2Event.java:42: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/enums/Stage2Event.java:47: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/enums/Stage2Event.java:52: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/enums/Stage2Event.java:57: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/enums/Stage2Event.java:62: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep5/config/PhotoDocumentationStateMachineConfig.java:27: Line is longer than 120 characters (found 139). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep5/config/PhotoDocumentationStateMachineConfig.java:73: Line is longer than 120 characters (found 121). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep5/service/PhotoDocumentationCoordinationService.java:167: Line is longer than 120 characters (found 124). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep5/service/PhotoDocumentationCoordinationService.java:193: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep5/service/PhotoDocumentationCoordinationService.java:200: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep5/service/PhotoDocumentationBusinessService.java:60: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep5/service/PhotoDocumentationBusinessService.java:73: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep5/service/PhotoDocumentationOperationsService.java:29:61: Expected @throws tag for 'IOException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep5/adapter/PhotoDocumentationAdapter.java:36: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep5/adapter/PhotoDocumentationAdapter.java:45: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep5/adapter/PhotoDocumentationAdapter.java:66: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep5/adapter/PhotoDocumentationAdapter.java:78: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep5/adapter/PhotoDocumentationAdapter.java:96: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep5/adapter/PhotoDocumentationAdapter.java:109: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep5/adapter/PhotoDocumentationAdapter.java:123: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/config/Stage2StateMachineConfig.java:74:5: Method configure length is 125 lines (max allowed is 100). [MethodLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsEvent.java:3: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsEvent.java:7: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsEvent.java:12: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsEvent.java:17: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsEvent.java:22: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsEvent.java:27: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsEvent.java:32: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsEvent.java:37: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsEvent.java:42: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsEvent.java:47: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsEvent.java:52: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsEvent.java:57: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsEvent.java:62: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsState.java:3: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsState.java:7: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsState.java:12: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsState.java:17: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsState.java:22: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsState.java:27: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsState.java:32: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsState.java:37: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/enums/ItemCharacteristicsState.java:42: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/actions/CompleteCharacteristicsAction.java:66: Line is longer than 120 characters (found 123). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/actions/InitializeCharacteristicsAction.java:61: Line is longer than 120 characters (found 126). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/actions/UpdateCharacteristicsAction.java:59: Line is longer than 120 characters (found 122). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/config/ItemCharacteristicsStateMachineConfig.java:63:5: Method configure length is 132 lines (max allowed is 100). [MethodLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/config/ItemCharacteristicsStateMachineConfig.java:64: Line is longer than 120 characters (found 129). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/dto/ItemCharacteristicsDTO.java:29:21: Variable 'materialSelectionCompleted' explicitly initialized to 'false' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/dto/ItemCharacteristicsDTO.java:35:21: Variable 'colorSelectionCompleted' explicitly initialized to 'false' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/dto/ItemCharacteristicsDTO.java:41:21: Variable 'fillerSelectionCompleted' explicitly initialized to 'false' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/dto/ItemCharacteristicsDTO.java:47:21: Variable 'wearDegreeSelectionCompleted' explicitly initialized to 'false' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsCoordinationService.java:120: Line is longer than 120 characters (found 122). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsCoordinationService.java:236: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsCoordinationService.java:243: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsWorkflowService.java:15: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsWorkflowService.java:40: Line is longer than 120 characters (found 122). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsWorkflowService.java:69:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsWorkflowService.java:101:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsWorkflowService.java:133:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsWorkflowService.java:167:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsWorkflowService.java:199:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsWorkflowService.java:231:5: '//' has more than 1 empty lines before. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsSessionService.java:36: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsSessionService.java:43: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsSessionService.java:52: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsSessionService.java:71: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsSessionService.java:84: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsSessionService.java:103: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsSessionService.java:117: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsSessionService.java:129: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsSessionService.java:138:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsSessionService.java:153: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsSessionService.java:160: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsSessionService.java:167: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsSessionService.java:175: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsSessionService.java:189: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsSessionService.java:196: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/service/ItemCharacteristicsSessionService.java:203: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/validator/ItemCharacteristicsValidator.java:101:5: All overloaded methods should be placed next to each other. Previous overloaded method located at line '51'. [OverloadMethodsDeclarationOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/validator/ItemCharacteristicsValidator.java:113:5: All overloaded methods should be placed next to each other. Previous overloaded method located at line '60'. [OverloadMethodsDeclarationOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/validator/ItemCharacteristicsValidator.java:124:5: All overloaded methods should be placed next to each other. Previous overloaded method located at line '69'. [OverloadMethodsDeclarationOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/validator/ItemCharacteristicsValidator.java:136:5: All overloaded methods should be placed next to each other. Previous overloaded method located at line '78'. [OverloadMethodsDeclarationOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/validator/ValidationResult.java:6: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/validator/ValidationResult.java:24: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/validator/ValidationResult.java:31: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/validator/ValidationResult.java:38: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/validator/ValidationResult.java:47: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/validator/ValidationResult.java:54: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/validator/ValidationResult.java:61: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/validator/ValidationResult.java:68: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/validator/ValidationResult.java:75: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/validator/ValidationResult.java:84: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:23: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:35: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:38: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:54: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:57: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:72: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:75: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:96: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:99: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:120: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:123: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:146: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:149: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:170: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:173: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:192: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:195: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:209: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:212: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:231: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep2/adapter/ItemCharacteristicsStateMachineAdapter.java:234: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/enums/ItemBasicInfoState.java:3: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/enums/ItemBasicInfoState.java:7: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/enums/ItemBasicInfoState.java:12: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/enums/ItemBasicInfoState.java:17: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/enums/ItemBasicInfoState.java:22: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/enums/ItemBasicInfoState.java:27: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/enums/ItemBasicInfoState.java:32: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/enums/ItemBasicInfoState.java:37: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/enums/ItemBasicInfoEvent.java:3: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/enums/ItemBasicInfoEvent.java:7: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/enums/ItemBasicInfoEvent.java:12: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/enums/ItemBasicInfoEvent.java:17: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/enums/ItemBasicInfoEvent.java:22: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/enums/ItemBasicInfoEvent.java:27: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/enums/ItemBasicInfoEvent.java:32: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/enums/ItemBasicInfoEvent.java:37: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/enums/ItemBasicInfoEvent.java:42: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/enums/ItemBasicInfoEvent.java:47: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/actions/CategorySelectedAction.java:14: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/actions/InitializeBasicInfoAction.java:14: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/config/ItemBasicInfoStateMachineConfig.java:20: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/dto/ItemBasicInfoDTO.java:14: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/dto/ItemBasicInfoDTO.java:23: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/dto/ItemBasicInfoDTO.java:28: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/dto/ItemBasicInfoDTO.java:33: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/dto/ItemBasicInfoDTO.java:38: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/dto/ItemBasicInfoDTO.java:43: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/dto/ItemBasicInfoDTO.java:48: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/dto/ItemBasicInfoDTO.java:53: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/dto/ItemBasicInfoDTO.java:56: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/dto/ItemBasicInfoDTO.java:58: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/dto/ItemBasicInfoDTO.java:61: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/dto/SubstepResultDTO.java:5: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoSessionService.java:13: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoSessionService.java:32: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoSessionService.java:62: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoSessionService.java:70: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoSessionService.java:78: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoSessionService.java:90: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoSessionService.java:99: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoPricingOperationsService.java:13: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoPricingOperationsService.java:30: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoPricingOperationsService.java:37: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoPricingOperationsService.java:44: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoPricingOperationsService.java:51: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoPricingOperationsService.java:58: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoPricingOperationsService.java:65: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoPricingOperationsService.java:73: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoPricingOperationsService.java:81: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoStateService.java:12: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoStateService.java:20: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoStateService.java:60: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoStateService.java:69: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoStateService.java:76: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoStateService.java:83: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoStateService.java:91: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoStateService.java:99: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoStateService.java:108: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoStateService.java:118: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoStateService.java:125: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoStateService.java:132: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoStateService.java:140: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoStateService.java:148: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoStateService.java:155: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoCoordinationService.java:17: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoWorkflowService.java:16: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoWorkflowService.java:35: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoWorkflowService.java:48: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoWorkflowService.java:75: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoWorkflowService.java:109: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoWorkflowService.java:139: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoWorkflowService.java:146: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoWorkflowService.java:153: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoWorkflowService.java:160: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoWorkflowService.java:167: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoValidationService.java:9: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoValidationService.java:21: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoValidationService.java:28: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoValidationService.java:41: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoValidationService.java:55: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoValidationService.java:62: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/service/ItemBasicInfoValidationService.java:71: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/guards/ServiceCategorySelectedGuard.java:13: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/guards/ItemNameSelectedGuard.java:13: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/guards/BasicInfoDataValidGuard.java:13: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/guards/QuantityEnteredGuard.java:13: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/validator/ItemBasicInfoValidator.java:11: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/validator/ItemBasicInfoValidator.java:20: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/validator/ItemBasicInfoValidator.java:49: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/validator/ItemBasicInfoValidator.java:72: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/validator/ItemBasicInfoValidator.java:105: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/validator/ItemBasicInfoValidator.java:131: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/validator/ValidationResult.java:6: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/validator/ValidationResult.java:19: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/validator/ValidationResult.java:26: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/validator/ValidationResult.java:33: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/validator/ValidationResult.java:42: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/validator/ValidationResult.java:49: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/validator/ValidationResult.java:56: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/validator/ValidationResult.java:63: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/mapper/ItemBasicInfoMapper.java:11: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/mapper/ItemBasicInfoMapper.java:17: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/mapper/ItemBasicInfoMapper.java:28: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/mapper/ItemBasicInfoMapper.java:43: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/mapper/ItemBasicInfoMapper.java:57: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/mapper/ItemBasicInfoMapper.java:81: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/mapper/ItemBasicInfoMapper.java:90: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/mapper/ItemBasicInfoMapper.java:99: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/mapper/ItemBasicInfoMapper.java:102: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/adapter/ItemBasicInfoAdapter.java:23: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/adapter/ItemBasicInfoAdapter.java:36: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/adapter/ItemBasicInfoAdapter.java:46: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/adapter/ItemBasicInfoAdapter.java:55: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/adapter/ItemBasicInfoAdapter.java:58: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/adapter/ItemBasicInfoAdapter.java:67: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/adapter/ItemBasicInfoAdapter.java:70: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/adapter/ItemBasicInfoAdapter.java:76: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/adapter/ItemBasicInfoAdapter.java:79: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/adapter/ItemBasicInfoAdapter.java:88: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/adapter/ItemBasicInfoAdapter.java:91: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/adapter/ItemBasicInfoAdapter.java:100: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/adapter/ItemBasicInfoAdapter.java:103: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/adapter/ItemBasicInfoAdapter.java:115: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/adapter/ItemBasicInfoAdapter.java:118: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/adapter/ItemBasicInfoAdapter.java:124: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/adapter/ItemBasicInfoAdapter.java:127: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/adapter/ItemBasicInfoAdapter.java:133: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep1/adapter/ItemBasicInfoAdapter.java:136: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/dto/ItemManagerDTO.java:24: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/dto/ItemManagerDTO.java:29: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/dto/ItemManagerDTO.java:34: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/dto/ItemManagerDTO.java:40: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/dto/ItemManagerDTO.java:46: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/dto/ItemManagerDTO.java:50:17: Variable 'itemCount' explicitly initialized to '0' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/dto/ItemManagerDTO.java:52: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/dto/ItemManagerDTO.java:56:21: Variable 'canProceedToNextStage' explicitly initialized to 'false' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/dto/ItemManagerDTO.java:58: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/dto/ItemManagerDTO.java:63: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/dto/ItemManagerDTO.java:68: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/dto/ItemManagerDTO.java:73: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/dto/ItemManagerDTO.java:80: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/dto/ItemManagerDTO.java:87: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/dto/ItemManagerDTO.java:94: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/dto/ItemManagerDTO.java:101: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/dto/ItemManagerDTO.java:115: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2WorkflowService.java:37: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2WorkflowService.java:57: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2WorkflowService.java:63:23: Expected @throws tag for 'IllegalArgumentException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2WorkflowService.java:84: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2WorkflowService.java:90:23: Expected @throws tag for 'IllegalArgumentException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2WorkflowService.java:111: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2WorkflowService.java:117:23: Expected @throws tag for 'IllegalArgumentException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2WorkflowService.java:135: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2WorkflowService.java:141:23: Expected @throws tag for 'IllegalArgumentException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2WorkflowService.java:159: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2WorkflowService.java:165:23: Expected @throws tag for 'IllegalArgumentException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2WorkflowService.java:188: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2WorkflowService.java:194:23: Expected @throws tag for 'IllegalArgumentException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2WorkflowService.java:207: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2WorkflowService.java:227: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2WorkflowService.java:233:23: Expected @throws tag for 'IllegalArgumentException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2WorkflowService.java:254: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2OperationsService.java:24: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2OperationsService.java:31: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2OperationsService.java:38: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2OperationsService.java:45: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2OperationsService.java:52: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2OperationsService.java:59: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2CoordinationService.java:197: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2CoordinationService.java:208: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2CoordinationService.java:219: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2CoordinationService.java:227: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2CoordinationService.java:235: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2CoordinationService.java:243: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2CoordinationService.java:251: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2CoordinationService.java:259: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2CoordinationService.java:267: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:41:23: Expected @throws tag for 'IllegalArgumentException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:70: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:81: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:95: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:101:23: Expected @throws tag for 'IllegalArgumentException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:113: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:124: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:155: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:162: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:180: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:198: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:222:36: '{' at column 36 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:223:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:223:34: '{' at column 34 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:224:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:224:39: '{' at column 39 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:225:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:225:48: '{' at column 48 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:226:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2SynchronizationService.java:226:36: '{' at column 36 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:20: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:40:36: '{' at column 36 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:41:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:41:34: '{' at column 34 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:42:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:42:36: '{' at column 36 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:43:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:43:46: '{' at column 46 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:44:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:44:48: '{' at column 48 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:45:9: 'METHOD_DEF' should be separated from previous line. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:45:38: '{' at column 38 should have line break after. [LeftCurly]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:63: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:73: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:80: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:90: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:100: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:107: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:114: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2StateService.java:121: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2ValidationService.java:23: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2ValidationService.java:30: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2ValidationService.java:37: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2ValidationService.java:44: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2ValidationService.java:51: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/service/Stage2ValidationService.java:58: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/validator/ItemManagerValidator.java:16: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/validator/ItemManagerValidator.java:42: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/validator/ItemManagerValidator.java:64: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/validator/ItemManagerValidator.java:93: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/validator/ItemManagerValidator.java:122: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/mapper/ItemManagerMapper.java:19: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/mapper/ItemManagerMapper.java:34: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/mapper/ItemManagerMapper.java:49: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/mapper/ItemManagerMapper.java:66: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/mapper/ItemManagerMapper.java:89: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/mapper/ItemManagerMapper.java:105: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/mapper/ItemManagerMapper.java:116: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/mapper/ItemManagerMapper.java:127: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/mapper/ItemManagerMapper.java:138: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/mapper/ItemManagerMapper.java:149: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/mapper/ItemManagerMapper.java:159: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:35: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:38: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:48: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:51: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:64: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:67: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:77: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:80: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:92: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:95: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:107: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:110: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:123: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:126: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:138: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:141: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:151: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:154: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:164: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:167: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:177: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:180: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:190: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:193: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:207: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:210: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:220: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:223: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:233: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:236: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/adapter/Stage2StateMachineAdapter.java:246: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/actions/CalculateFinalPriceAction.java:61: Line is longer than 120 characters (found 136). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/config/PriceDiscountStateMachineConfig.java:29:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/config/PriceDiscountStateMachineConfig.java:32:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/config/PriceDiscountStateMachineConfig.java:38: Line is longer than 120 characters (found 128). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/config/PriceDiscountStateMachineConfig.java:50:12: More than 7 parameters (found 8). [ParameterNumber]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/config/PriceDiscountStateMachineConfig.java:90:5: Method configure length is 102 lines (max allowed is 100). [MethodLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/config/PriceDiscountStateMachineConfig.java:202: Line is longer than 120 characters (found 127). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/config/PriceDiscountStateMachineConfig.java:203: Line is longer than 120 characters (found 125). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/config/PriceDiscountStateMachineConfig.java:215: Line is longer than 120 characters (found 141). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/dto/PriceDiscountDTO.java:62:21: Variable 'calculationCompleted' explicitly initialized to 'false' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/dto/PriceDiscountDTO.java:68:21: Variable 'hasCalculationErrors' explicitly initialized to 'false' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/dto/SubstepResultDTO.java:38:21: Variable 'success' explicitly initialized to 'false' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/dto/SubstepResultDTO.java:49:21: Variable 'hasErrors' explicitly initialized to 'false' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/dto/SubstepResultDTO.java:85:21: Variable 'completed' explicitly initialized to 'false' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/dto/SubstepResultDTO.java:91:21: Variable 'valid' explicitly initialized to 'false' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/service/PriceDiscountOperationsService.java:51:23: Expected @throws tag for 'RuntimeException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/service/PriceDiscountOperationsService.java:91:23: Expected @throws tag for 'RuntimeException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/service/PriceDiscountOperationsService.java:105:23: Expected @throws tag for 'RuntimeException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/service/PriceDiscountOperationsService.java:119:23: Expected @throws tag for 'RuntimeException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/service/PriceDiscountOperationsService.java:166:23: Expected @throws tag for 'RuntimeException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/service/PriceDiscountCoordinationService.java:186:5: All overloaded methods should be placed next to each other. Previous overloaded method located at line '98'. [OverloadMethodsDeclarationOrder]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/service/PriceDiscountCoordinationService.java:196: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/service/PriceDiscountCoordinationService.java:203: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/service/PriceDiscountCoordinationService.java:210: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/service/PriceDiscountCoordinationService.java:217: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/service/PriceDiscountCoordinationService.java:224: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/service/PriceDiscountCoordinationService.java:231: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/service/PriceDiscountCoordinationService.java:238: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/service/PriceDiscountValidationService.java:183: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/validator/PriceDiscountValidator.java:65: Line is longer than 120 characters (found 123). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/validator/PriceDiscountValidator.java:77: Line is longer than 120 characters (found 133). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/validator/PriceDiscountValidator.java:106: Line is longer than 120 characters (found 128). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/validator/PriceDiscountValidator.java:111: Line is longer than 120 characters (found 130). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/adapter/PriceDiscountAdapter.java:45: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/adapter/PriceDiscountAdapter.java:63: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/adapter/PriceDiscountAdapter.java:72: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/adapter/PriceDiscountAdapter.java:84: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/adapter/PriceDiscountAdapter.java:96: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/adapter/PriceDiscountAdapter.java:105: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/adapter/PriceDiscountAdapter.java:114: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/adapter/PriceDiscountAdapter.java:125: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/adapter/PriceDiscountAdapter.java:134: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/adapter/PriceDiscountAdapter.java:143: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/adapter/PriceDiscountAdapter.java:152: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/adapter/PriceDiscountAdapter.java:163: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/adapter/PriceDiscountAdapter.java:213: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep4/adapter/PriceDiscountAdapter.java:222: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/enums/StainsDefectsState.java:3: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/enums/StainsDefectsState.java:7: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/enums/StainsDefectsState.java:12: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/enums/StainsDefectsState.java:17: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/enums/StainsDefectsState.java:22: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/enums/StainsDefectsState.java:27: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/enums/StainsDefectsState.java:32: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/enums/StainsDefectsState.java:37: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/enums/StainsDefectsEvent.java:3: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/enums/StainsDefectsEvent.java:7: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/enums/StainsDefectsEvent.java:12: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/enums/StainsDefectsEvent.java:17: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/enums/StainsDefectsEvent.java:22: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/enums/StainsDefectsEvent.java:27: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/enums/StainsDefectsEvent.java:32: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/enums/StainsDefectsEvent.java:37: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/enums/StainsDefectsEvent.java:42: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/enums/StainsDefectsEvent.java:47: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/enums/StainsDefectsEvent.java:52: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/actions/InitializeStainsDefectsAction.java:30: Line is longer than 120 characters (found 121). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/config/StainsDefectsStateMachineConfig.java:44:12: More than 7 parameters (found 9). [ParameterNumber]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/config/StainsDefectsStateMachineConfig.java:77:5: Method configure length is 117 lines (max allowed is 100). [MethodLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/dto/StainsDefectsDTO.java:29:21: Variable 'stainsSelectionCompleted' explicitly initialized to 'false' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/dto/StainsDefectsDTO.java:35:21: Variable 'defectsSelectionCompleted' explicitly initialized to 'false' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/service/StainsDefectsWorkflowService.java:65:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/service/StainsDefectsWorkflowService.java:98:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/service/StainsDefectsWorkflowService.java:128:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/service/StainsDefectsWorkflowService.java:156:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/service/StainsDefectsWorkflowService.java:191:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/service/StainsDefectsWorkflowService.java:209:23: Expected @throws tag for 'IllegalStateException'. [JavadocMethod]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/adapter/StainsDefectsAdapter.java:41: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/adapter/StainsDefectsAdapter.java:92: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/adapter/StainsDefectsAdapter.java:115: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/adapter/StainsDefectsAdapter.java:137: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/adapter/StainsDefectsAdapter.java:156: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/adapter/StainsDefectsAdapter.java:181: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/adapter/StainsDefectsAdapter.java:200: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/stage2/substep3/adapter/StainsDefectsAdapter.java:217: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/OrderEvent.java:3: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/OrderEvent.java:5:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/adapter/OrderWizardAdapter.java:25: Не додавайте /api/ у RequestMapping - це додається автоматично [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/adapter/OrderWizardAdapter.java:47: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/adapter/OrderWizardAdapter.java:55: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/adapter/OrderWizardAdapter.java:63: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/adapter/OrderWizardAdapter.java:76: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/adapter/OrderWizardAdapter.java:89: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/adapter/OrderWizardAdapter.java:102: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/adapter/OrderWizardAdapter.java:115: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/adapter/OrderWizardAdapter.java:128: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/statemachine/adapter/OrderWizardAdapter.java:141: API URL повинні бути в kebab-case (маленькі літери з дефісами) [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/dto/receipt/EmailReceiptRequest.java:49:21: Variable 'includeSignature' explicitly initialized to 'false' (default value for its type). [ExplicitInitialization]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/dto/OrderDTO.java:94: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/dto/OrderDTO.java:95: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/OrderFinalizationService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/OrderFinalizationService.java:14: First sentence of Javadoc is missing an ending period. [SummaryJavadoc]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/OrderService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/OrderService.java:158: Line is longer than 120 characters (found 124). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/ReceiptServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/ReceiptServiceImpl.java:56: Line is longer than 120 characters (found 124). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/ReceiptServiceImpl.java:57: Line is longer than 120 characters (found 128). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/ReceiptServiceImpl.java:58: Line is longer than 120 characters (found 128). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/ReceiptServiceImpl.java:59: Line is longer than 120 characters (found 125). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/ReceiptServiceImpl.java:63:5: Method generateReceipt length is 117 lines (max allowed is 100). [MethodLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/ReceiptServiceImpl.java:173: Line is longer than 120 characters (found 122). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/ReceiptServiceImpl.java:213: Line is longer than 120 characters (found 134). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/DiscountServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/DiscountServiceImpl.java:53: Line is longer than 120 characters (found 121). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/DiscountServiceImpl.java:165: Line is longer than 120 characters (found 133). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/DiscountServiceImpl.java:238: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/DiscountServiceImpl.java:239: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/DiscountServiceImpl.java:241: Line has trailing spaces. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/ItemCharacteristicsServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/OrderSummaryService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/ModifierRecommendationServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/ModifierRecommendationServiceImpl.java:29: Line is longer than 120 characters (found 157). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/ModifierRecommendationServiceImpl.java:35: Line is longer than 120 characters (found 159). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/ModifierRecommendationServiceImpl.java:41: Line is longer than 120 characters (found 148). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/OrderRequirementsService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/OrderRequirementsServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/OrderItemPhotoServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/OrderItemPhotoServiceImpl.java:52: Line is longer than 120 characters (found 126). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/CompletionDateServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/CompletionDateServiceImpl.java:35:5: Method calculateExpectedCompletionDate length is 122 lines (max allowed is 100). [MethodLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/CompletionDateServiceImpl.java:57: Line is longer than 120 characters (found 123). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/CompletionDateServiceImpl.java:117: Line is longer than 120 characters (found 122). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/CompletionDateServiceImpl.java:134: Line is longer than 120 characters (found 123). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/ModifierRecommendationService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/OrderServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/OrderServiceImpl.java:134: Line is longer than 120 characters (found 132). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/OrderItemPhotoService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/ReceiptNumberGenerator.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/ReceiptNumberGenerator.java:16:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/ReceiptNumberGenerator.java:19:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/PaymentService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/ItemCharacteristicsService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/CustomerSignatureService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/CompletionDateService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/DiscountService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/recommendation/RecommendationBaseService.java:40:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/recommendation/RecommendationBaseService.java:41:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/recommendation/RecommendationBaseService.java:42:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/recommendation/RecommendationBaseService.java:208: Avoid using is prefix for boolean fields to prevent issues with OpenAPI and JSON serialization. [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/recommendation/RecommendationBaseService.java:227: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/recommendation/RecommendationBaseService.java:228: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/recommendation/RecommendationBaseService.java:229: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/recommendation/RecommendationBaseService.java:230: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/recommendation/RecommendationBaseService.java:235: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/recommendation/RecommendationBaseService.java:236: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/recommendation/RecommendationBaseService.java:237: Хардкод кодів категорій. Використовуйте enum або константи [Regexp]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/recommendation/RecommendationBaseService.java:246: Line is longer than 120 characters (found 150). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/recommendation/RecommendationBaseService.java:261: Line is longer than 120 characters (found 121). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/CustomerSignatureServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/ReceiptService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/OrderFinalizationServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/OrderFinalizationServiceImpl.java:84: Line is longer than 120 characters (found 121). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/OrderSummaryServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/OrderSummaryServiceImpl.java:114: Line is longer than 120 characters (found 122). [LineLength]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/service/PaymentServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:25:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:26:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:27:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:28:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:29:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:30:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:31:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:32:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:75:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:76:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:77:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:78:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:79:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:80:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:81:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:82:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:83:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:106:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:107:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:108:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:128:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:129:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:130:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:131:9: Missing a Javadoc comment. [JavadocVariable]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/order/constants/ItemCharacteristicsConstants.java:162:5: '/*' has more than 1 empty lines before. [EmptyLineSeparator]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/branch/repository/BranchLocationRepository.java:16:18: Репозиторії повинні закінчуватися на Repository, а реалізація сервісів - на ServiceImpl [TypeName]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/branch/service/BranchLocationServiceImpl.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/branch/service/BranchValidator.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/branch/service/BranchValidator.java:14:3: Empty line should be followed by <p> tag on the next line. [JavadocParagraph]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/domain/branch/service/BranchLocationService.java:1: Сервіси повинні бути в пакеті domain.[domainName].service [RegexpSingleline]
[WARN] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/resources/liquibase.properties:7: Line has trailing spaces. [RegexpSingleline]
Audit done.
[INFO] You have 0 Checkstyle violations.
[INFO]
[INFO] --- resources:3.3.1:resources (default-resources) @ aksi-backend ---
[INFO] Copying 2 resources from src/main/resources to target/classes
[INFO] Copying 56 resources from src/main/resources to target/classes
[INFO]
[INFO] --- compiler:3.14.0:compile (default-compile) @ aksi-backend ---
[INFO] Recompiling the module because of changed source code.
[INFO] Compiling 579 source files with javac [debug parameters release 21] to target/classes
[INFO] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceCalculationController.java: Some input files use or override a deprecated API.
[INFO] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceCalculationController.java: Recompile with -Xlint:deprecation for details.
[INFO]
[INFO] --- compiler:3.14.0:compile (compile) @ aksi-backend ---
[INFO] Recompiling the module because of added or removed source files.
[INFO] Compiling 579 source files with javac [debug parameters release 21] to target/classes
[INFO] MapStruct: Using accessor naming strategy: org.mapstruct.ap.spi.DefaultAccessorNamingStrategy
[INFO] MapStruct: Using builder provider: org.mapstruct.ap.spi.DefaultBuilderProvider
[INFO] MapStruct: Using enum naming strategy: org.mapstruct.ap.spi.DefaultEnumMappingStrategy
[INFO]  MapStruct: processing: com.aksi.domain.order.mapper.OrderItemPhotoMapper.
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.order.dto.OrderItemPhotoDTO toDto(com.aksi.domain.order.entity.OrderItemPhotoEntity entity).
[INFO] -- MapStruct: mapping property: entityOrderItemId( entity ) to: itemId(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: entityOrderItemId( entity ).
[INFO] -- MapStruct: mapping property: entity.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: entity.getId().
[INFO] -- MapStruct: mapping property: entity.getAnnotations() to: annotations(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getAnnotations().
[INFO] -- MapStruct: mapping property: entity.getDescription() to: description(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getDescription().
[INFO] -- MapStruct: mapping property: entity.getCreatedAt() to: createdAt(java.time.LocalDateTime).
[INFO] -- MapStruct: selecting property mapping: entity.getCreatedAt().
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.order.entity.OrderItemPhotoEntity toEntity(com.aksi.domain.order.dto.OrderItemPhotoDTO dto).
[INFO] -- MapStruct: mapping property: dto.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: dto.getId().
[INFO] -- MapStruct: mapping property: dto.getAnnotations() to: annotations(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getAnnotations().
[INFO] -- MapStruct: mapping property: dto.getDescription() to: description(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getDescription().
[INFO] -- MapStruct: mapping property: dto.getCreatedAt() to: createdAt(java.time.LocalDateTime).
[INFO] -- MapStruct: selecting property mapping: dto.getCreatedAt().
[INFO] - MapStruct: creating iterable mapping method implementation for java.util.List<com.aksi.domain.order.dto.OrderItemPhotoDTO> toDtoList(java.util.List<com.aksi.domain.order.entity.OrderItemPhotoEntity> entities).
[INFO] -- MapStruct: selecting element mapping: com.aksi.domain.order.dto.OrderItemPhotoDTO #toDto(orderItemPhotoEntity).
[INFO]  MapStruct: processing: com.aksi.mapper.PriceListMapper.
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.pricing.dto.ServiceCategoryDTO toDto(com.aksi.domain.pricing.entity.ServiceCategoryEntity category).
[INFO] -- MapStruct: mapping property: category.getServices() to: items(java.util.List<com.aksi.domain.pricing.dto.PriceListItemDTO>).
[INFO] -- MapStruct: selecting property mapping: java.util.List<com.aksi.domain.pricing.dto.PriceListItemDTO> #toItemDtoList(category.getServices()).
[INFO] -- MapStruct: mapping property: category.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: category.getId().
[INFO] -- MapStruct: mapping property: category.getCode() to: code(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: category.getCode().
[INFO] -- MapStruct: mapping property: category.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: category.getName().
[INFO] -- MapStruct: mapping property: category.getDescription() to: description(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: category.getDescription().
[INFO] -- MapStruct: mapping property: category.getSortOrder() to: sortOrder(java.lang.Integer).
[INFO] -- MapStruct: selecting property mapping: category.getSortOrder().
[INFO] -- MapStruct: mapping property: category.isActive() to: active(boolean).
[INFO] -- MapStruct: selecting property mapping: category.isActive().
[INFO] -- MapStruct: mapping property: category.getStandardProcessingDays() to: standardProcessingDays(int).
[INFO] -- MapStruct: selecting property mapping: category.getStandardProcessingDays().
[INFO] - MapStruct: creating iterable mapping method implementation for java.util.List<com.aksi.domain.pricing.dto.ServiceCategoryDTO> toCategoryDtoList(java.util.List<com.aksi.domain.pricing.entity.ServiceCategoryEntity> categories).
[INFO] -- MapStruct: selecting element mapping: com.aksi.domain.pricing.dto.ServiceCategoryDTO #toDto(serviceCategoryEntity).
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.pricing.dto.PriceListItemDTO toDto(com.aksi.domain.pricing.entity.PriceListItemEntity priceListItem).
[INFO] -- MapStruct: mapping property: priceListItemCategoryId( priceListItem ) to: categoryId(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: priceListItemCategoryId( priceListItem ).
[INFO] -- MapStruct: mapping property: priceListItem.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: priceListItem.getId().
[INFO] -- MapStruct: mapping property: priceListItem.getCatalogNumber() to: catalogNumber(java.lang.Integer).
[INFO] -- MapStruct: selecting property mapping: priceListItem.getCatalogNumber().
[INFO] -- MapStruct: mapping property: priceListItem.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: priceListItem.getName().
[INFO] -- MapStruct: mapping property: priceListItem.getUnitOfMeasure() to: unitOfMeasure(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: priceListItem.getUnitOfMeasure().
[INFO] -- MapStruct: mapping property: priceListItem.getBasePrice() to: basePrice(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: priceListItem.getBasePrice().
[INFO] -- MapStruct: mapping property: priceListItem.getPriceBlack() to: priceBlack(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: priceListItem.getPriceBlack().
[INFO] -- MapStruct: mapping property: priceListItem.getPriceColor() to: priceColor(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: priceListItem.getPriceColor().
[INFO] -- MapStruct: mapping property: priceListItem.isActive() to: active(boolean).
[INFO] -- MapStruct: selecting property mapping: priceListItem.isActive().
[INFO] - MapStruct: creating iterable mapping method implementation for java.util.List<com.aksi.domain.pricing.dto.PriceListItemDTO> toItemDtoList(java.util.List<com.aksi.domain.pricing.entity.PriceListItemEntity> items).
[INFO] -- MapStruct: selecting element mapping: com.aksi.domain.pricing.dto.PriceListItemDTO #toDto(priceListItemEntity).
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.pricing.entity.ServiceCategoryEntity toEntity(com.aksi.domain.pricing.dto.ServiceCategoryDTO dto).
[INFO] -- MapStruct: mapping property: dto.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: dto.getId().
[INFO] -- MapStruct: mapping property: dto.getCode() to: code(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getCode().
[INFO] -- MapStruct: mapping property: dto.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getName().
[INFO] -- MapStruct: mapping property: dto.getDescription() to: description(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getDescription().
[INFO] -- MapStruct: mapping property: dto.getSortOrder() to: sortOrder(int).
[INFO] -- MapStruct: selecting property mapping: dto.getSortOrder().
[INFO] -- MapStruct: mapping property: dto.isActive() to: active(boolean).
[INFO] -- MapStruct: selecting property mapping: dto.isActive().
[INFO] -- MapStruct: mapping property: dto.getStandardProcessingDays() to: standardProcessingDays(int).
[INFO] -- MapStruct: selecting property mapping: dto.getStandardProcessingDays().
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.pricing.entity.PriceListItemEntity toEntity(com.aksi.domain.pricing.dto.PriceListItemDTO dto).
[INFO] -- MapStruct: mapping property: dto.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: dto.getId().
[INFO] -- MapStruct: mapping property: dto.getCatalogNumber() to: catalogNumber(java.lang.Integer).
[INFO] -- MapStruct: selecting property mapping: dto.getCatalogNumber().
[INFO] -- MapStruct: mapping property: dto.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getName().
[INFO] -- MapStruct: mapping property: dto.getUnitOfMeasure() to: unitOfMeasure(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getUnitOfMeasure().
[INFO] -- MapStruct: mapping property: dto.getBasePrice() to: basePrice(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: dto.getBasePrice().
[INFO] -- MapStruct: mapping property: dto.getPriceBlack() to: priceBlack(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: dto.getPriceBlack().
[INFO] -- MapStruct: mapping property: dto.getPriceColor() to: priceColor(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: dto.getPriceColor().
[INFO] -- MapStruct: mapping property: dto.isActive() to: active(boolean).
[INFO] -- MapStruct: selecting property mapping: dto.isActive().
[INFO]  MapStruct: processing: com.aksi.domain.pricing.mapper.StainTypeMapper.
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.pricing.dto.StainTypeDTO toDto(com.aksi.domain.pricing.entity.StainTypeEntity entity).
[INFO] MapStruct: referred types not available (yet), deferring mapper: com.aksi.domain.pricing.mapper.StainTypeMapper
[INFO]  MapStruct: processing: com.aksi.domain.order.mapper.OrderItemPriceModifierMapper.
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.order.dto.PriceModifierDTO toDto(com.aksi.domain.order.entity.OrderItemPriceModifierEntity entity).
[INFO] -- MapStruct: mapping property: entity.getModifierType() to: type(com.aksi.domain.order.model.ModifierType).
[INFO] -- MapStruct: selecting property mapping: entity.getModifierType().
[INFO] -- MapStruct: mapping property: entity.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getName().
[INFO] -- MapStruct: mapping property: entity.getDescription() to: description(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getDescription().
[INFO] -- MapStruct: mapping property: entity.getValue() to: value(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: entity.getValue().
[INFO] -- MapStruct: mapping property: entity.getAmount() to: amount(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: entity.getAmount().
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.order.entity.OrderItemPriceModifierEntity toEntity(com.aksi.domain.order.dto.PriceModifierDTO dto).
[INFO] -- MapStruct: mapping property: dto.getType() to: modifierType(com.aksi.domain.order.model.ModifierType).
[INFO] -- MapStruct: selecting property mapping: dto.getType().
[INFO] -- MapStruct: mapping property: dto.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getName().
[INFO] -- MapStruct: mapping property: dto.getDescription() to: description(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getDescription().
[INFO] -- MapStruct: mapping property: dto.getValue() to: value(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: dto.getValue().
[INFO] -- MapStruct: mapping property: dto.getAmount() to: amount(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: dto.getAmount().
[INFO] - MapStruct: creating iterable mapping method implementation for java.util.List<com.aksi.domain.order.dto.PriceModifierDTO> toDtoList(java.util.List<com.aksi.domain.order.entity.OrderItemPriceModifierEntity> entities).
[INFO] -- MapStruct: selecting element mapping: com.aksi.domain.order.dto.PriceModifierDTO #toDto(orderItemPriceModifierEntity).
[INFO] - MapStruct: creating iterable mapping method implementation for java.util.List<com.aksi.domain.order.entity.OrderItemPriceModifierEntity> toEntityList(java.util.List<com.aksi.domain.order.dto.PriceModifierDTO> dtos).
[INFO] -- MapStruct: selecting element mapping: com.aksi.domain.order.entity.OrderItemPriceModifierEntity #toEntity(priceModifierDTO).
[INFO]  MapStruct: processing: com.aksi.domain.client.mapper.AddressMapper.
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.client.dto.AddressDTO toDto(com.aksi.domain.client.entity.AddressEntity entity).
[INFO] -- MapStruct: mapping property: entity.getCity() to: city(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getCity().
[INFO] -- MapStruct: mapping property: entity.getStreet() to: street(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getStreet().
[INFO] -- MapStruct: mapping property: entity.getBuilding() to: building(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getBuilding().
[INFO] -- MapStruct: mapping property: entity.getApartment() to: apartment(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getApartment().
[INFO] -- MapStruct: mapping property: entity.getPostalCode() to: postalCode(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getPostalCode().
[INFO] -- MapStruct: mapping property: entity.getFullAddress() to: fullAddress(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getFullAddress().
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.client.entity.AddressEntity toEntity(com.aksi.domain.client.dto.AddressDTO dto).
[INFO] -- MapStruct: mapping property: dto.getCity() to: city(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getCity().
[INFO] -- MapStruct: mapping property: dto.getStreet() to: street(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getStreet().
[INFO] -- MapStruct: mapping property: dto.getBuilding() to: building(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getBuilding().
[INFO] -- MapStruct: mapping property: dto.getApartment() to: apartment(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getApartment().
[INFO] -- MapStruct: mapping property: dto.getPostalCode() to: postalCode(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getPostalCode().
[INFO] -- MapStruct: mapping property: dto.getFullAddress() to: fullAddress(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getFullAddress().
[INFO]  MapStruct: processing: com.aksi.domain.pricing.mapper.CatalogPriceModifierMapper.
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.pricing.dto.PriceModifierDTO toDto(com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity entity).
[INFO] -- MapStruct: mapping property: entity.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: entity.getId().
[INFO] -- MapStruct: mapping property: entity.getCode() to: code(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getCode().
[INFO] -- MapStruct: mapping property: entity.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getName().
[INFO] -- MapStruct: mapping property: entity.getDescription() to: description(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getDescription().
[INFO] -- MapStruct: mapping property: entity.getModifierType() to: modifierType(com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierType).
[INFO] -- MapStruct: selecting property mapping: entity.getModifierType().
[INFO] -- MapStruct: mapping property: entity.getCategory() to: category(com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory).
[INFO] -- MapStruct: selecting property mapping: entity.getCategory().
[INFO] -- MapStruct: mapping property: entity.getValue() to: value(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: entity.getValue().
[INFO] -- MapStruct: mapping property: entity.getMinValue() to: minValue(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: entity.getMinValue().
[INFO] -- MapStruct: mapping property: entity.getMaxValue() to: maxValue(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: entity.getMaxValue().
[INFO] -- MapStruct: mapping property: entity.isActive() to: active(boolean).
[INFO] -- MapStruct: selecting property mapping: entity.isActive().
[INFO] -- MapStruct: mapping property: entity.getSortOrder() to: sortOrder(java.lang.Integer).
[INFO] -- MapStruct: selecting property mapping: entity.getSortOrder().
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity toEntity(com.aksi.domain.pricing.dto.PriceModifierDTO dto).
[INFO] -- MapStruct: mapping property: dto.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: dto.getId().
[INFO] -- MapStruct: mapping property: dto.getCode() to: code(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getCode().
[INFO] -- MapStruct: mapping property: dto.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getName().
[INFO] -- MapStruct: mapping property: dto.getDescription() to: description(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getDescription().
[INFO] -- MapStruct: mapping property: dto.getModifierType() to: modifierType(com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierType).
[INFO] -- MapStruct: selecting property mapping: dto.getModifierType().
[INFO] -- MapStruct: mapping property: dto.getCategory() to: category(com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory).
[INFO] -- MapStruct: selecting property mapping: dto.getCategory().
[INFO] -- MapStruct: mapping property: dto.getMinValue() to: minValue(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: dto.getMinValue().
[INFO] -- MapStruct: mapping property: dto.getMaxValue() to: maxValue(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: dto.getMaxValue().
[INFO] -- MapStruct: mapping property: dto.getValue() to: value(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: dto.getValue().
[INFO] -- MapStruct: mapping property: dto.isActive() to: active(boolean).
[INFO] -- MapStruct: selecting property mapping: dto.isActive().
[INFO] -- MapStruct: mapping property: dto.getSortOrder() to: sortOrder(java.lang.Integer).
[INFO] -- MapStruct: selecting property mapping: dto.getSortOrder().
[INFO]  MapStruct: processing: com.aksi.domain.pricing.mapper.DefectTypeMapper.
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.pricing.dto.DefectTypeDTO toDto(com.aksi.domain.pricing.entity.DefectTypeEntity entity).
[INFO] -- MapStruct: mapping property: entity.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: entity.getId().
[INFO] -- MapStruct: mapping property: entity.getCode() to: code(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getCode().
[INFO] -- MapStruct: mapping property: entity.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getName().
[INFO] -- MapStruct: mapping property: entity.getDescription() to: description(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getDescription().
[INFO] -- MapStruct: mapping property: entity.getRiskLevel() to: riskLevel(com.aksi.domain.pricing.enums.RiskLevel).
[INFO] -- MapStruct: selecting property mapping: entity.getRiskLevel().
[INFO] -- MapStruct: mapping property: entity.isActive() to: active(boolean).
[INFO] -- MapStruct: selecting property mapping: entity.isActive().
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.pricing.entity.DefectTypeEntity toEntity(com.aksi.domain.pricing.dto.DefectTypeDTO dto).
[INFO] MapStruct: referred types not available (yet), deferring mapper: com.aksi.domain.pricing.mapper.DefectTypeMapper
[INFO]  MapStruct: processing: com.aksi.domain.client.mapper.ClientMapper.
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.client.dto.ClientResponse toClientResponse(com.aksi.domain.client.entity.ClientEntity client).
[INFO] -- MapStruct: mapping property: client.getAddress() to: structuredAddress(com.aksi.domain.client.dto.AddressDTO).
[INFO] -- MapStruct: selecting property mapping: com.aksi.domain.client.dto.AddressDTO AddressMapper#toDto(client.getAddress()).
[INFO] -- MapStruct: mapping property: client.getAddress() to: address(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: java.lang.String AddressMapper#entityToString(client.getAddress()).
[INFO] -- MapStruct: mapping property: client.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: client.getId().
[INFO] -- MapStruct: mapping property: client.getLastName() to: lastName(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: client.getLastName().
[INFO] -- MapStruct: mapping property: client.getFirstName() to: firstName(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: client.getFirstName().
[INFO] -- MapStruct: mapping property: client.getPhone() to: phone(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: client.getPhone().
[INFO] -- MapStruct: mapping property: client.getEmail() to: email(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: client.getEmail().
[INFO] -- MapStruct: mapping property: client.getCommunicationChannels() to: communicationChannels(java.util.Set<com.aksi.domain.client.entity.CommunicationChannelEntity>).
[INFO] -- MapStruct: selecting property mapping: client.getCommunicationChannels().
[INFO] -- MapStruct: mapping property: client.getSource() to: source(com.aksi.domain.client.enums.ClientSource).
[INFO] -- MapStruct: selecting property mapping: client.getSource().
[INFO] -- MapStruct: mapping property: client.getSourceDetails() to: sourceDetails(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: client.getSourceDetails().
[INFO] -- MapStruct: mapping property: client.getCreatedAt() to: createdAt(java.time.LocalDateTime).
[INFO] -- MapStruct: selecting property mapping: client.getCreatedAt().
[INFO] -- MapStruct: mapping property: client.getUpdatedAt() to: updatedAt(java.time.LocalDateTime).
[INFO] -- MapStruct: selecting property mapping: client.getUpdatedAt().
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.client.entity.ClientEntity toEntity(com.aksi.domain.client.dto.CreateClientRequest request).
[INFO] -- MapStruct: mapping property: request.getStructuredAddress() to: address(com.aksi.domain.client.entity.AddressEntity).
[INFO] -- MapStruct: selecting property mapping: com.aksi.domain.client.entity.AddressEntity AddressMapper#toEntity(request.getStructuredAddress()).
[INFO] -- MapStruct: mapping property: request.getLastName() to: lastName(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getLastName().
[INFO] -- MapStruct: mapping property: request.getFirstName() to: firstName(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getFirstName().
[INFO] -- MapStruct: mapping property: request.getPhone() to: phone(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getPhone().
[INFO] -- MapStruct: mapping property: request.getEmail() to: email(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getEmail().
[INFO] -- MapStruct: mapping property: request.getCommunicationChannels() to: communicationChannels(java.util.Set<com.aksi.domain.client.entity.CommunicationChannelEntity>).
[INFO] -- MapStruct: selecting property mapping: request.getCommunicationChannels().
[INFO] -- MapStruct: mapping property: request.getSource() to: source(com.aksi.domain.client.enums.ClientSource).
[INFO] -- MapStruct: selecting property mapping: request.getSource().
[INFO] -- MapStruct: mapping property: request.getSourceDetails() to: sourceDetails(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getSourceDetails().
[INFO] - MapStruct: creating bean mapping method implementation for void updateFromCreateRequest(com.aksi.domain.client.dto.CreateClientRequest request, @MappingTarget com.aksi.domain.client.entity.ClientEntity entity).
[INFO] -- MapStruct: mapping property: request.getStructuredAddress() to: setAddress(com.aksi.domain.client.entity.AddressEntity).
[INFO] -- MapStruct: selecting property mapping: com.aksi.domain.client.entity.AddressEntity AddressMapper#toEntity(request.getStructuredAddress()).
[INFO] -- MapStruct: mapping property: request.getLastName() to: setLastName(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getLastName().
[INFO] -- MapStruct: mapping property: request.getFirstName() to: setFirstName(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getFirstName().
[INFO] -- MapStruct: mapping property: request.getPhone() to: setPhone(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getPhone().
[INFO] -- MapStruct: mapping property: request.getEmail() to: setEmail(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getEmail().
[INFO] -- MapStruct: mapping property: request.getCommunicationChannels() to: setCommunicationChannels(java.util.Set<com.aksi.domain.client.entity.CommunicationChannelEntity>).
[INFO] -- MapStruct: selecting property mapping: request.getCommunicationChannels().
[INFO] -- MapStruct: mapping property: request.getSource() to: setSource(com.aksi.domain.client.enums.ClientSource).
[INFO] -- MapStruct: selecting property mapping: request.getSource().
[INFO] -- MapStruct: mapping property: request.getSourceDetails() to: setSourceDetails(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getSourceDetails().
[INFO] - MapStruct: creating bean mapping method implementation for void updateFromUpdateRequest(com.aksi.domain.client.dto.UpdateClientRequest request, @MappingTarget com.aksi.domain.client.entity.ClientEntity entity).
[INFO] -- MapStruct: mapping property: request.getStructuredAddress() to: setAddress(com.aksi.domain.client.entity.AddressEntity).
[INFO] -- MapStruct: selecting property mapping: com.aksi.domain.client.entity.AddressEntity AddressMapper#toEntity(request.getStructuredAddress()).
[INFO] -- MapStruct: mapping property: request.getLastName() to: setLastName(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getLastName().
[INFO] -- MapStruct: mapping property: request.getFirstName() to: setFirstName(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getFirstName().
[INFO] -- MapStruct: mapping property: request.getPhone() to: setPhone(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getPhone().
[INFO] -- MapStruct: mapping property: request.getEmail() to: setEmail(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getEmail().
[INFO] -- MapStruct: mapping property: request.getCommunicationChannels() to: setCommunicationChannels(java.util.Set<com.aksi.domain.client.entity.CommunicationChannelEntity>).
[INFO] -- MapStruct: selecting property mapping: request.getCommunicationChannels().
[INFO] -- MapStruct: mapping property: request.getSource() to: setSource(com.aksi.domain.client.enums.ClientSource).
[INFO] -- MapStruct: selecting property mapping: request.getSource().
[INFO] -- MapStruct: mapping property: request.getSourceDetails() to: setSourceDetails(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getSourceDetails().
[INFO]  MapStruct: processing: com.aksi.domain.order.mapper.CustomerSignatureMapper.
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.order.dto.CustomerSignatureResponse toResponse(com.aksi.domain.order.entity.CustomerSignatureEntity entity).
[INFO] -- MapStruct: mapping property: entityOrderId( entity ) to: orderId(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: entityOrderId( entity ).
[INFO] -- MapStruct: mapping property: entity.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: entity.getId().
[INFO] -- MapStruct: mapping property: entity.getSignatureData() to: signatureData(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getSignatureData().
[INFO] -- MapStruct: mapping property: entity.isTermsAccepted() to: termsAccepted(boolean).
[INFO] -- MapStruct: selecting property mapping: entity.isTermsAccepted().
[INFO] -- MapStruct: mapping property: entity.getSignatureType() to: signatureType(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getSignatureType().
[INFO] -- MapStruct: mapping property: entity.getCreatedAt() to: createdAt(java.time.LocalDateTime).
[INFO] -- MapStruct: selecting property mapping: entity.getCreatedAt().
[INFO] -- MapStruct: mapping property: entity.getUpdatedAt() to: updatedAt(java.time.LocalDateTime).
[INFO] -- MapStruct: selecting property mapping: entity.getUpdatedAt().
[INFO]  MapStruct: processing: com.aksi.domain.order.mapper.OrderMapper.
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.order.dto.OrderDTO toDTO(com.aksi.domain.order.entity.OrderEntity order).
[INFO] -- MapStruct: mapping property: orderClientId( order ) to: clientId(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: orderClientId( order ).
[INFO] -- MapStruct: mapping property: orderBranchLocationId( order ) to: branchLocationId(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: orderBranchLocationId( order ).
[INFO] -- MapStruct: mapping property: order.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: order.getId().
[INFO] -- MapStruct: mapping property: order.getReceiptNumber() to: receiptNumber(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: order.getReceiptNumber().
[INFO] -- MapStruct: mapping property: order.getTagNumber() to: tagNumber(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: order.getTagNumber().
[INFO] -- MapStruct: mapping property: order.getClient() to: client(com.aksi.domain.client.dto.ClientResponse).
[INFO] -- MapStruct: selecting property mapping: com.aksi.domain.client.dto.ClientResponse ClientMapper#toClientResponse(order.getClient()).
[INFO] -- MapStruct: mapping property: order.getItems() to: items(java.util.List<com.aksi.domain.order.dto.OrderItemDTO>).
[INFO] -- MapStruct: selecting element mapping: com.aksi.domain.order.dto.OrderItemDTO #toOrderItemDTO(orderItemEntity).
[INFO] -- MapStruct: creating property mapping: java.util.List<com.aksi.domain.order.dto.OrderItemDTO> #orderItemEntityListToOrderItemDTOList(order.getItems()).
[INFO] -- MapStruct: selecting property mapping: java.util.List<com.aksi.domain.order.dto.OrderItemDTO> #orderItemEntityListToOrderItemDTOList(order.getItems()).
[INFO] -- MapStruct: mapping property: order.getTotalAmount() to: totalAmount(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: order.getTotalAmount().
[INFO] -- MapStruct: mapping property: order.getDiscountAmount() to: discountAmount(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: order.getDiscountAmount().
[INFO] -- MapStruct: mapping property: order.getFinalAmount() to: finalAmount(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: order.getFinalAmount().
[INFO] -- MapStruct: mapping property: order.getPrepaymentAmount() to: prepaymentAmount(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: order.getPrepaymentAmount().
[INFO] -- MapStruct: mapping property: order.getBalanceAmount() to: balanceAmount(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: order.getBalanceAmount().
[INFO] -- MapStruct: mapping property: order.getBranchLocation() to: branchLocation(com.aksi.domain.branch.dto.BranchLocationDTO).
[INFO] -- MapStruct: selecting property mapping: com.aksi.domain.branch.dto.BranchLocationDTO BranchLocationMapper#toDto(order.getBranchLocation()).
[INFO] -- MapStruct: mapping property: order.getStatus() to: status(com.aksi.domain.order.model.OrderStatusEnum).
[INFO] -- MapStruct: selecting property mapping: order.getStatus().
[INFO] -- MapStruct: mapping property: order.getCreatedDate() to: createdDate(java.time.LocalDateTime).
[INFO] -- MapStruct: selecting property mapping: order.getCreatedDate().
[INFO] -- MapStruct: mapping property: order.getUpdatedDate() to: updatedDate(java.time.LocalDateTime).
[INFO] -- MapStruct: selecting property mapping: order.getUpdatedDate().
[INFO] -- MapStruct: mapping property: order.getExpectedCompletionDate() to: expectedCompletionDate(java.time.LocalDateTime).
[INFO] -- MapStruct: selecting property mapping: order.getExpectedCompletionDate().
[INFO] -- MapStruct: mapping property: order.getCompletedDate() to: completedDate(java.time.LocalDateTime).
[INFO] -- MapStruct: selecting property mapping: order.getCompletedDate().
[INFO] -- MapStruct: mapping property: order.getCustomerNotes() to: customerNotes(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: order.getCustomerNotes().
[INFO] -- MapStruct: mapping property: order.getInternalNotes() to: internalNotes(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: order.getInternalNotes().
[INFO] -- MapStruct: mapping property: order.getExpediteType() to: expediteType(com.aksi.domain.order.model.ExpediteType).
[INFO] -- MapStruct: selecting property mapping: order.getExpediteType().
[INFO] -- MapStruct: mapping property: order.getCompletionComments() to: completionComments(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: order.getCompletionComments().
[INFO] -- MapStruct: mapping property: order.isTermsAccepted() to: termsAccepted(boolean).
[INFO] -- MapStruct: selecting property mapping: order.isTermsAccepted().
[INFO] -- MapStruct: mapping property: order.getFinalizedAt() to: finalizedAt(java.time.LocalDateTime).
[INFO] -- MapStruct: selecting property mapping: order.getFinalizedAt().
[INFO] -- MapStruct: mapping property: order.isDraft() to: draft(boolean).
[INFO] -- MapStruct: selecting property mapping: order.isDraft().
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.order.entity.OrderEntity toEntity(com.aksi.domain.order.dto.CreateOrderRequest orderRequest).
[INFO] -- MapStruct: mapping property: orderRequest.getDiscountAmount() to: discountAmount(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: orderRequest.getDiscountAmount().
[INFO] -- MapStruct: mapping property: orderRequest.getPrepaymentAmount() to: prepaymentAmount(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: orderRequest.getPrepaymentAmount().
[INFO] -- MapStruct: mapping property: orderRequest.getExpectedCompletionDate() to: expectedCompletionDate(java.time.LocalDateTime).
[INFO] -- MapStruct: selecting property mapping: orderRequest.getExpectedCompletionDate().
[INFO] -- MapStruct: mapping property: orderRequest.getCustomerNotes() to: customerNotes(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: orderRequest.getCustomerNotes().
[INFO] -- MapStruct: mapping property: orderRequest.getInternalNotes() to: internalNotes(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: orderRequest.getInternalNotes().
[INFO] -- MapStruct: mapping property: orderRequest.getExpediteType() to: expediteType(com.aksi.domain.order.model.ExpediteType).
[INFO] -- MapStruct: selecting property mapping: orderRequest.getExpediteType().
[INFO] -- MapStruct: mapping property: orderRequest.isDraft() to: draft(boolean).
[INFO] -- MapStruct: selecting property mapping: orderRequest.isDraft().
[INFO] - MapStruct: creating bean mapping method implementation for void updateOrderFromRequest(com.aksi.domain.order.dto.CreateOrderRequest orderRequest, @MappingTarget com.aksi.domain.order.entity.OrderEntity order).
[INFO] -- MapStruct: mapping property: orderRequest.getDiscountAmount() to: setDiscountAmount(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: orderRequest.getDiscountAmount().
[INFO] -- MapStruct: mapping property: orderRequest.getPrepaymentAmount() to: setPrepaymentAmount(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: orderRequest.getPrepaymentAmount().
[INFO] -- MapStruct: mapping property: orderRequest.getExpectedCompletionDate() to: setExpectedCompletionDate(java.time.LocalDateTime).
[INFO] -- MapStruct: selecting property mapping: orderRequest.getExpectedCompletionDate().
[INFO] -- MapStruct: mapping property: orderRequest.getCustomerNotes() to: setCustomerNotes(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: orderRequest.getCustomerNotes().
[INFO] -- MapStruct: mapping property: orderRequest.getInternalNotes() to: setInternalNotes(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: orderRequest.getInternalNotes().
[INFO] -- MapStruct: mapping property: orderRequest.getExpediteType() to: setExpediteType(com.aksi.domain.order.model.ExpediteType).
[INFO] -- MapStruct: selecting property mapping: orderRequest.getExpediteType().
[INFO] -- MapStruct: mapping property: orderRequest.isDraft() to: setDraft(boolean).
[INFO] -- MapStruct: selecting property mapping: orderRequest.isDraft().
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.order.dto.OrderItemDTO toOrderItemDTO(com.aksi.domain.order.entity.OrderItemEntity item).
[INFO] -- MapStruct: mapping property: item.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: item.getId().
[INFO] -- MapStruct: mapping property: item.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: item.getName().
[INFO] -- MapStruct: mapping property: item.getDescription() to: description(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: item.getDescription().
[INFO] -- MapStruct: mapping property: item.getQuantity() to: quantity(java.lang.Integer).
[INFO] -- MapStruct: selecting property mapping: item.getQuantity().
[INFO] -- MapStruct: mapping property: item.getUnitPrice() to: unitPrice(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: item.getUnitPrice().
[INFO] -- MapStruct: mapping property: item.getTotalPrice() to: totalPrice(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: item.getTotalPrice().
[INFO] -- MapStruct: mapping property: item.getCategory() to: category(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: item.getCategory().
[INFO] -- MapStruct: mapping property: item.getColor() to: color(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: item.getColor().
[INFO] -- MapStruct: mapping property: item.getMaterial() to: material(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: item.getMaterial().
[INFO] -- MapStruct: mapping property: item.getUnitOfMeasure() to: unitOfMeasure(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: item.getUnitOfMeasure().
[INFO] -- MapStruct: mapping property: item.getDefects() to: defects(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: item.getDefects().
[INFO] -- MapStruct: mapping property: item.getSpecialInstructions() to: specialInstructions(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: item.getSpecialInstructions().
[INFO] -- MapStruct: mapping property: item.getFillerType() to: fillerType(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: item.getFillerType().
[INFO] -- MapStruct: mapping property: item.getFillerCompressed() to: fillerCompressed(java.lang.Boolean).
[INFO] -- MapStruct: selecting property mapping: item.getFillerCompressed().
[INFO] -- MapStruct: mapping property: item.getWearDegree() to: wearDegree(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: item.getWearDegree().
[INFO] -- MapStruct: mapping property: item.getStains() to: stains(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: item.getStains().
[INFO] -- MapStruct: mapping property: item.getOtherStains() to: otherStains(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: item.getOtherStains().
[INFO] -- MapStruct: mapping property: item.getDefectsAndRisks() to: defectsAndRisks(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: item.getDefectsAndRisks().
[INFO] -- MapStruct: mapping property: item.getNoGuaranteeReason() to: noGuaranteeReason(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: item.getNoGuaranteeReason().
[INFO] -- MapStruct: mapping property: item.getDefectsNotes() to: defectsNotes(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: item.getDefectsNotes().
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.order.entity.OrderItemEntity toOrderItemEntity(com.aksi.domain.order.dto.OrderItemDTO dto).
[INFO] -- MapStruct: mapping property: dto.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: dto.getId().
[INFO] -- MapStruct: mapping property: dto.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getName().
[INFO] -- MapStruct: mapping property: dto.getDescription() to: description(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getDescription().
[INFO] -- MapStruct: mapping property: dto.getQuantity() to: quantity(java.lang.Integer).
[INFO] -- MapStruct: selecting property mapping: dto.getQuantity().
[INFO] -- MapStruct: mapping property: dto.getUnitPrice() to: unitPrice(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: dto.getUnitPrice().
[INFO] -- MapStruct: mapping property: dto.getTotalPrice() to: totalPrice(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: dto.getTotalPrice().
[INFO] -- MapStruct: mapping property: dto.getCategory() to: category(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getCategory().
[INFO] -- MapStruct: mapping property: dto.getColor() to: color(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getColor().
[INFO] -- MapStruct: mapping property: dto.getMaterial() to: material(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getMaterial().
[INFO] -- MapStruct: mapping property: dto.getUnitOfMeasure() to: unitOfMeasure(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getUnitOfMeasure().
[INFO] -- MapStruct: mapping property: dto.getDefects() to: defects(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getDefects().
[INFO] -- MapStruct: mapping property: dto.getSpecialInstructions() to: specialInstructions(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getSpecialInstructions().
[INFO] -- MapStruct: mapping property: dto.getFillerType() to: fillerType(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getFillerType().
[INFO] -- MapStruct: mapping property: dto.getFillerCompressed() to: fillerCompressed(java.lang.Boolean).
[INFO] -- MapStruct: selecting property mapping: dto.getFillerCompressed().
[INFO] -- MapStruct: mapping property: dto.getWearDegree() to: wearDegree(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getWearDegree().
[INFO] -- MapStruct: mapping property: dto.getStains() to: stains(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getStains().
[INFO] -- MapStruct: mapping property: dto.getOtherStains() to: otherStains(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getOtherStains().
[INFO] -- MapStruct: mapping property: dto.getDefectsAndRisks() to: defectsAndRisks(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getDefectsAndRisks().
[INFO] -- MapStruct: mapping property: dto.getNoGuaranteeReason() to: noGuaranteeReason(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getNoGuaranteeReason().
[INFO] -- MapStruct: mapping property: dto.getDefectsNotes() to: defectsNotes(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getDefectsNotes().
[INFO] - MapStruct: creating bean mapping method implementation for void mapOrderCommonFields(com.aksi.domain.order.dto.CreateOrderRequest orderRequest, @MappingTarget com.aksi.domain.order.entity.OrderEntity order).
[INFO] -- MapStruct: mapping property: orderRequest.getDiscountAmount() to: setDiscountAmount(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: orderRequest.getDiscountAmount().
[INFO] -- MapStruct: mapping property: orderRequest.getPrepaymentAmount() to: setPrepaymentAmount(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: orderRequest.getPrepaymentAmount().
[INFO] -- MapStruct: mapping property: orderRequest.getExpectedCompletionDate() to: setExpectedCompletionDate(java.time.LocalDateTime).
[INFO] -- MapStruct: selecting property mapping: orderRequest.getExpectedCompletionDate().
[INFO] -- MapStruct: mapping property: orderRequest.getCustomerNotes() to: setCustomerNotes(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: orderRequest.getCustomerNotes().
[INFO] -- MapStruct: mapping property: orderRequest.getInternalNotes() to: setInternalNotes(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: orderRequest.getInternalNotes().
[INFO] -- MapStruct: mapping property: orderRequest.getExpediteType() to: setExpediteType(com.aksi.domain.order.model.ExpediteType).
[INFO] -- MapStruct: selecting property mapping: orderRequest.getExpediteType().
[INFO] -- MapStruct: mapping property: orderRequest.isDraft() to: setDraft(boolean).
[INFO] -- MapStruct: selecting property mapping: orderRequest.isDraft().
[INFO]  MapStruct: processing: com.aksi.domain.pricing.mapper.PriceModifierDefinitionMapper.
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.pricing.dto.PriceModifierDefinitionDTO toDto(com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity entity).
[INFO] -- MapStruct: mapping property: entity.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: entity.getId().
[INFO] -- MapStruct: mapping property: entity.getCode() to: code(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getCode().
[INFO] -- MapStruct: mapping property: entity.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getName().
[INFO] -- MapStruct: mapping property: entity.getDescription() to: description(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getDescription().
[INFO] -- MapStruct: mapping property: entity.getModifierType() to: modifierType(com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierType).
[INFO] -- MapStruct: selecting property mapping: entity.getModifierType().
[INFO] -- MapStruct: mapping property: entity.getCategory() to: category(com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory).
[INFO] -- MapStruct: selecting property mapping: entity.getCategory().
[INFO] -- MapStruct: mapping property: entity.getValue() to: value(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: entity.getValue().
[INFO] -- MapStruct: mapping property: entity.getMinValue() to: minValue(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: entity.getMinValue().
[INFO] -- MapStruct: mapping property: entity.getMaxValue() to: maxValue(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: entity.getMaxValue().
[INFO] -- MapStruct: mapping property: entity.isActive() to: active(boolean).
[INFO] -- MapStruct: selecting property mapping: entity.isActive().
[INFO] -- MapStruct: mapping property: entity.getSortOrder() to: sortOrder(java.lang.Integer).
[INFO] -- MapStruct: selecting property mapping: entity.getSortOrder().
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity toEntity(com.aksi.domain.pricing.dto.PriceModifierDefinitionDTO dto).
[INFO] -- MapStruct: mapping property: dto.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: dto.getId().
[INFO] -- MapStruct: mapping property: dto.getCode() to: code(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getCode().
[INFO] -- MapStruct: mapping property: dto.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getName().
[INFO] -- MapStruct: mapping property: dto.getDescription() to: description(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getDescription().
[INFO] -- MapStruct: mapping property: dto.getModifierType() to: modifierType(com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierType).
[INFO] -- MapStruct: selecting property mapping: dto.getModifierType().
[INFO] -- MapStruct: mapping property: dto.getCategory() to: category(com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory).
[INFO] -- MapStruct: selecting property mapping: dto.getCategory().
[INFO] -- MapStruct: mapping property: dto.getMinValue() to: minValue(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: dto.getMinValue().
[INFO] -- MapStruct: mapping property: dto.getMaxValue() to: maxValue(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: dto.getMaxValue().
[INFO] -- MapStruct: mapping property: dto.getValue() to: value(java.math.BigDecimal).
[INFO] -- MapStruct: selecting property mapping: dto.getValue().
[INFO] -- MapStruct: mapping property: dto.isActive() to: active(boolean).
[INFO] -- MapStruct: selecting property mapping: dto.isActive().
[INFO] -- MapStruct: mapping property: dto.getSortOrder() to: sortOrder(java.lang.Integer).
[INFO] -- MapStruct: selecting property mapping: dto.getSortOrder().
[INFO]  MapStruct: processing: com.aksi.domain.branch.mapper.BranchLocationMapper.
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.branch.dto.BranchLocationDTO toDto(com.aksi.domain.branch.entity.BranchLocationEntity entity).
[INFO] -- MapStruct: mapping property: entity.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: entity.getId().
[INFO] -- MapStruct: mapping property: entity.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getName().
[INFO] -- MapStruct: mapping property: entity.getAddress() to: address(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getAddress().
[INFO] -- MapStruct: mapping property: entity.getPhone() to: phone(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getPhone().
[INFO] -- MapStruct: mapping property: entity.getCode() to: code(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getCode().
[INFO] -- MapStruct: mapping property: entity.getActive() to: active(java.lang.Boolean).
[INFO] -- MapStruct: selecting property mapping: entity.getActive().
[INFO] -- MapStruct: mapping property: entity.getCreatedAt() to: createdAt(java.time.LocalDateTime).
[INFO] -- MapStruct: selecting property mapping: entity.getCreatedAt().
[INFO] -- MapStruct: mapping property: entity.getUpdatedAt() to: updatedAt(java.time.LocalDateTime).
[INFO] -- MapStruct: selecting property mapping: entity.getUpdatedAt().
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.branch.entity.BranchLocationEntity toEntity(com.aksi.domain.branch.dto.BranchLocationDTO dto).
[INFO] -- MapStruct: mapping property: dto.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: dto.getId().
[INFO] -- MapStruct: mapping property: dto.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getName().
[INFO] -- MapStruct: mapping property: dto.getAddress() to: address(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getAddress().
[INFO] -- MapStruct: mapping property: dto.getPhone() to: phone(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getPhone().
[INFO] -- MapStruct: mapping property: dto.getCode() to: code(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getCode().
[INFO] -- MapStruct: mapping property: dto.getActive() to: active(java.lang.Boolean).
[INFO] -- MapStruct: selecting property mapping: dto.getActive().
[INFO] -- MapStruct: mapping property: dto.getCreatedAt() to: createdAt(java.time.LocalDateTime).
[INFO] -- MapStruct: selecting property mapping: dto.getCreatedAt().
[INFO] -- MapStruct: mapping property: dto.getUpdatedAt() to: updatedAt(java.time.LocalDateTime).
[INFO] -- MapStruct: selecting property mapping: dto.getUpdatedAt().
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.branch.entity.BranchLocationEntity toEntity(com.aksi.domain.branch.dto.BranchLocationCreateRequest request).
[INFO] -- MapStruct: mapping property: request.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getName().
[INFO] -- MapStruct: mapping property: request.getAddress() to: address(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getAddress().
[INFO] -- MapStruct: mapping property: request.getPhone() to: phone(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getPhone().
[INFO] -- MapStruct: mapping property: request.getCode() to: code(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getCode().
[INFO] -- MapStruct: mapping property: request.getActive() to: active(java.lang.Boolean).
[INFO] -- MapStruct: selecting property mapping: request.getActive().
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.branch.entity.BranchLocationEntity updateEntity(com.aksi.domain.branch.dto.BranchLocationUpdateRequest request, @MappingTarget com.aksi.domain.branch.entity.BranchLocationEntity entity).
[INFO] -- MapStruct: mapping property: request.getName() to: setName(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getName().
[INFO] -- MapStruct: mapping property: request.getAddress() to: setAddress(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getAddress().
[INFO] -- MapStruct: mapping property: request.getPhone() to: setPhone(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getPhone().
[INFO] -- MapStruct: mapping property: request.getCode() to: setCode(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: request.getCode().
[INFO] -- MapStruct: mapping property: request.getActive() to: setActive(java.lang.Boolean).
[INFO] -- MapStruct: selecting property mapping: request.getActive().
[INFO]  MapStruct: processing: com.aksi.domain.pricing.mapper.StainTypeMapper.
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.pricing.dto.StainTypeDTO toDto(com.aksi.domain.pricing.entity.StainTypeEntity entity).
[INFO] -- MapStruct: mapping property: entity.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: entity.getId().
[INFO] -- MapStruct: mapping property: entity.getCode() to: code(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getCode().
[INFO] -- MapStruct: mapping property: entity.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getName().
[INFO] -- MapStruct: mapping property: entity.getDescription() to: description(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getDescription().
[INFO] -- MapStruct: mapping property: entity.getRiskLevel() to: riskLevel(com.aksi.domain.pricing.enums.RiskLevel).
[INFO] -- MapStruct: selecting property mapping: entity.getRiskLevel().
[INFO] -- MapStruct: mapping property: entity.isActive() to: active(boolean).
[INFO] -- MapStruct: selecting property mapping: entity.isActive().
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.pricing.entity.StainTypeEntity toEntity(com.aksi.domain.pricing.dto.StainTypeDTO dto).
[INFO] -- MapStruct: mapping property: dto.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: dto.getId().
[INFO] -- MapStruct: mapping property: dto.getCode() to: code(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getCode().
[INFO] -- MapStruct: mapping property: dto.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getName().
[INFO] -- MapStruct: mapping property: dto.getDescription() to: description(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getDescription().
[INFO] -- MapStruct: mapping property: dto.getRiskLevel() to: riskLevel(com.aksi.domain.pricing.enums.RiskLevel).
[INFO] -- MapStruct: selecting property mapping: dto.getRiskLevel().
[INFO] -- MapStruct: mapping property: dto.isActive() to: active(boolean).
[INFO] -- MapStruct: selecting property mapping: dto.isActive().
[INFO] - MapStruct: creating iterable mapping method implementation for java.util.List<com.aksi.domain.pricing.dto.StainTypeDTO> toDtoList(java.util.List<com.aksi.domain.pricing.entity.StainTypeEntity> entities).
[INFO] -- MapStruct: selecting element mapping: com.aksi.domain.pricing.dto.StainTypeDTO #toDto(stainTypeEntity).
[INFO]  MapStruct: processing: com.aksi.domain.pricing.mapper.DefectTypeMapper.
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.pricing.dto.DefectTypeDTO toDto(com.aksi.domain.pricing.entity.DefectTypeEntity entity).
[INFO] -- MapStruct: mapping property: entity.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: entity.getId().
[INFO] -- MapStruct: mapping property: entity.getCode() to: code(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getCode().
[INFO] -- MapStruct: mapping property: entity.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getName().
[INFO] -- MapStruct: mapping property: entity.getDescription() to: description(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: entity.getDescription().
[INFO] -- MapStruct: mapping property: entity.getRiskLevel() to: riskLevel(com.aksi.domain.pricing.enums.RiskLevel).
[INFO] -- MapStruct: selecting property mapping: entity.getRiskLevel().
[INFO] -- MapStruct: mapping property: entity.isActive() to: active(boolean).
[INFO] -- MapStruct: selecting property mapping: entity.isActive().
[INFO] - MapStruct: creating bean mapping method implementation for com.aksi.domain.pricing.entity.DefectTypeEntity toEntity(com.aksi.domain.pricing.dto.DefectTypeDTO dto).
[INFO] -- MapStruct: mapping property: dto.getId() to: id(java.util.UUID).
[INFO] -- MapStruct: selecting property mapping: dto.getId().
[INFO] -- MapStruct: mapping property: dto.getCode() to: code(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getCode().
[INFO] -- MapStruct: mapping property: dto.getName() to: name(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getName().
[INFO] -- MapStruct: mapping property: dto.getDescription() to: description(java.lang.String).
[INFO] -- MapStruct: selecting property mapping: dto.getDescription().
[INFO] -- MapStruct: mapping property: dto.getRiskLevel() to: riskLevel(com.aksi.domain.pricing.enums.RiskLevel).
[INFO] -- MapStruct: selecting property mapping: dto.getRiskLevel().
[INFO] -- MapStruct: mapping property: dto.isActive() to: active(boolean).
[INFO] -- MapStruct: selecting property mapping: dto.isActive().
[INFO] - MapStruct: creating iterable mapping method implementation for java.util.List<com.aksi.domain.pricing.dto.DefectTypeDTO> toDtoList(java.util.List<com.aksi.domain.pricing.entity.DefectTypeEntity> entities).
[INFO] -- MapStruct: selecting element mapping: com.aksi.domain.pricing.dto.DefectTypeDTO #toDto(defectTypeEntity).
[INFO] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceCalculationController.java: Some input files use or override a deprecated API.
[INFO] /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/main/java/com/aksi/api/PriceCalculationController.java: Recompile with -Xlint:deprecation for details.
[INFO]
[INFO] --- resources:3.3.1:testResources (default-testResources) @ aksi-backend ---
[INFO] skip non existing resourceDirectory /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/src/test/resources
[INFO]
[INFO] --- compiler:3.14.0:testCompile (default-testCompile) @ aksi-backend ---
[INFO] Recompiling the module because of changed dependency.
[INFO] Compiling 2 source files with javac [debug parameters release 21] to target/test-classes
[INFO]
[INFO] --- compiler:3.14.0:testCompile (testCompile) @ aksi-backend ---
[INFO] Recompiling the module because of changed dependency.
[INFO] Compiling 2 source files with javac [debug parameters release 21] to target/test-classes
[INFO]
[INFO] --- surefire:3.5.3:test (default-test) @ aksi-backend ---
[INFO] Using auto detected provider org.apache.maven.surefire.junitplatform.JUnitPlatformProvider
[INFO]
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.aksi.domain.order.statemachine.OrderWizardStateMachineTest
[INFO] Tests run: 7, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.045 s -- in com.aksi.domain.order.statemachine.OrderWizardStateMachineTest
[INFO] Running com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest
[ERROR] Tests run: 65, Failures: 15, Errors: 0, Skipped: 0, Time elapsed: 0.204 s <<< FAILURE! -- in com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest
[ERROR] com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldEnsureAllEventsAreUsed -- Time elapsed: 0.005 s <<< FAILURE!
org.opentest4j.AssertionFailedError: Подія GO_FORWARD не використовується жодним станом ==> expected: <false> but was: <true>
	at org.junit.jupiter.api.AssertionFailureBuilder.build(AssertionFailureBuilder.java:151)
	at org.junit.jupiter.api.AssertionFailureBuilder.buildAndThrow(AssertionFailureBuilder.java:132)
	at org.junit.jupiter.api.AssertFalse.failNotFalse(AssertFalse.java:63)
	at org.junit.jupiter.api.AssertFalse.assertFalse(AssertFalse.java:36)
	at org.junit.jupiter.api.Assertions.assertFalse(Assertions.java:239)
	at com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldEnsureAllEventsAreUsed(OrderWizardStateMachineAdvancedTest.java:52)
	at java.base/java.lang.reflect.Method.invoke(Method.java:580)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)

[ERROR] com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderEvent)[21] -- Time elapsed: 0.002 s <<< FAILURE!
org.opentest4j.AssertionFailedError: Подія GO_FORWARD повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
	at org.junit.jupiter.api.AssertionFailureBuilder.build(AssertionFailureBuilder.java:151)
	at org.junit.jupiter.api.AssertionFailureBuilder.buildAndThrow(AssertionFailureBuilder.java:132)
	at org.junit.jupiter.api.AssertFalse.failNotFalse(AssertFalse.java:63)
	at org.junit.jupiter.api.AssertFalse.assertFalse(AssertFalse.java:36)
	at org.junit.jupiter.api.Assertions.assertFalse(Assertions.java:239)
	at com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderWizardStateMachineAdvancedTest.java:170)
	at java.base/java.lang.reflect.Method.invoke(Method.java:580)
	at java.base/java.util.Optional.ifPresent(Optional.java:178)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.Iterator.forEachRemaining(Iterator.java:133)
	at java.base/java.util.Spliterators$IteratorSpliterator.forEachRemaining(Spliterators.java:1939)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)

[ERROR] com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderEvent)[22] -- Time elapsed: 0.002 s <<< FAILURE!
org.opentest4j.AssertionFailedError: Подія JUMP_TO_STEP повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
	at org.junit.jupiter.api.AssertionFailureBuilder.build(AssertionFailureBuilder.java:151)
	at org.junit.jupiter.api.AssertionFailureBuilder.buildAndThrow(AssertionFailureBuilder.java:132)
	at org.junit.jupiter.api.AssertFalse.failNotFalse(AssertFalse.java:63)
	at org.junit.jupiter.api.AssertFalse.assertFalse(AssertFalse.java:36)
	at org.junit.jupiter.api.Assertions.assertFalse(Assertions.java:239)
	at com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderWizardStateMachineAdvancedTest.java:170)
	at java.base/java.lang.reflect.Method.invoke(Method.java:580)
	at java.base/java.util.Optional.ifPresent(Optional.java:178)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.Iterator.forEachRemaining(Iterator.java:133)
	at java.base/java.util.Spliterators$IteratorSpliterator.forEachRemaining(Spliterators.java:1939)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)

[ERROR] com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderEvent)[23] -- Time elapsed: 0.001 s <<< FAILURE!
org.opentest4j.AssertionFailedError: Подія AUTO_SAVE повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
	at org.junit.jupiter.api.AssertionFailureBuilder.build(AssertionFailureBuilder.java:151)
	at org.junit.jupiter.api.AssertionFailureBuilder.buildAndThrow(AssertionFailureBuilder.java:132)
	at org.junit.jupiter.api.AssertFalse.failNotFalse(AssertFalse.java:63)
	at org.junit.jupiter.api.AssertFalse.assertFalse(AssertFalse.java:36)
	at org.junit.jupiter.api.Assertions.assertFalse(Assertions.java:239)
	at com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderWizardStateMachineAdvancedTest.java:170)
	at java.base/java.lang.reflect.Method.invoke(Method.java:580)
	at java.base/java.util.Optional.ifPresent(Optional.java:178)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.Iterator.forEachRemaining(Iterator.java:133)
	at java.base/java.util.Spliterators$IteratorSpliterator.forEachRemaining(Spliterators.java:1939)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)

[ERROR] com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderEvent)[24] -- Time elapsed: 0.001 s <<< FAILURE!
org.opentest4j.AssertionFailedError: Подія VALIDATION_ERROR повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
	at org.junit.jupiter.api.AssertionFailureBuilder.build(AssertionFailureBuilder.java:151)
	at org.junit.jupiter.api.AssertionFailureBuilder.buildAndThrow(AssertionFailureBuilder.java:132)
	at org.junit.jupiter.api.AssertFalse.failNotFalse(AssertFalse.java:63)
	at org.junit.jupiter.api.AssertFalse.assertFalse(AssertFalse.java:36)
	at org.junit.jupiter.api.Assertions.assertFalse(Assertions.java:239)
	at com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderWizardStateMachineAdvancedTest.java:170)
	at java.base/java.lang.reflect.Method.invoke(Method.java:580)
	at java.base/java.util.Optional.ifPresent(Optional.java:178)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.Iterator.forEachRemaining(Iterator.java:133)
	at java.base/java.util.Spliterators$IteratorSpliterator.forEachRemaining(Spliterators.java:1939)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)

[ERROR] com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderEvent)[25] -- Time elapsed: 0.002 s <<< FAILURE!
org.opentest4j.AssertionFailedError: Подія SYSTEM_ERROR повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
	at org.junit.jupiter.api.AssertionFailureBuilder.build(AssertionFailureBuilder.java:151)
	at org.junit.jupiter.api.AssertionFailureBuilder.buildAndThrow(AssertionFailureBuilder.java:132)
	at org.junit.jupiter.api.AssertFalse.failNotFalse(AssertFalse.java:63)
	at org.junit.jupiter.api.AssertFalse.assertFalse(AssertFalse.java:36)
	at org.junit.jupiter.api.Assertions.assertFalse(Assertions.java:239)
	at com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderWizardStateMachineAdvancedTest.java:170)
	at java.base/java.lang.reflect.Method.invoke(Method.java:580)
	at java.base/java.util.Optional.ifPresent(Optional.java:178)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.Iterator.forEachRemaining(Iterator.java:133)
	at java.base/java.util.Spliterators$IteratorSpliterator.forEachRemaining(Spliterators.java:1939)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)

[ERROR] com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderEvent)[26] -- Time elapsed: 0.001 s <<< FAILURE!
org.opentest4j.AssertionFailedError: Подія TIMEOUT повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
	at org.junit.jupiter.api.AssertionFailureBuilder.build(AssertionFailureBuilder.java:151)
	at org.junit.jupiter.api.AssertionFailureBuilder.buildAndThrow(AssertionFailureBuilder.java:132)
	at org.junit.jupiter.api.AssertFalse.failNotFalse(AssertFalse.java:63)
	at org.junit.jupiter.api.AssertFalse.assertFalse(AssertFalse.java:36)
	at org.junit.jupiter.api.Assertions.assertFalse(Assertions.java:239)
	at com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderWizardStateMachineAdvancedTest.java:170)
	at java.base/java.lang.reflect.Method.invoke(Method.java:580)
	at java.base/java.util.Optional.ifPresent(Optional.java:178)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.Iterator.forEachRemaining(Iterator.java:133)
	at java.base/java.util.Spliterators$IteratorSpliterator.forEachRemaining(Spliterators.java:1939)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)

[ERROR] com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderEvent)[27] -- Time elapsed: 0.002 s <<< FAILURE!
org.opentest4j.AssertionFailedError: Подія RESTART_ITEM_WIZARD повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
	at org.junit.jupiter.api.AssertionFailureBuilder.build(AssertionFailureBuilder.java:151)
	at org.junit.jupiter.api.AssertionFailureBuilder.buildAndThrow(AssertionFailureBuilder.java:132)
	at org.junit.jupiter.api.AssertFalse.failNotFalse(AssertFalse.java:63)
	at org.junit.jupiter.api.AssertFalse.assertFalse(AssertFalse.java:36)
	at org.junit.jupiter.api.Assertions.assertFalse(Assertions.java:239)
	at com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderWizardStateMachineAdvancedTest.java:170)
	at java.base/java.lang.reflect.Method.invoke(Method.java:580)
	at java.base/java.util.Optional.ifPresent(Optional.java:178)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.Iterator.forEachRemaining(Iterator.java:133)
	at java.base/java.util.Spliterators$IteratorSpliterator.forEachRemaining(Spliterators.java:1939)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)

[ERROR] com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderEvent)[28] -- Time elapsed: 0.002 s <<< FAILURE!
org.opentest4j.AssertionFailedError: Подія SKIP_PHOTOS повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
	at org.junit.jupiter.api.AssertionFailureBuilder.build(AssertionFailureBuilder.java:151)
	at org.junit.jupiter.api.AssertionFailureBuilder.buildAndThrow(AssertionFailureBuilder.java:132)
	at org.junit.jupiter.api.AssertFalse.failNotFalse(AssertFalse.java:63)
	at org.junit.jupiter.api.AssertFalse.assertFalse(AssertFalse.java:36)
	at org.junit.jupiter.api.Assertions.assertFalse(Assertions.java:239)
	at com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderWizardStateMachineAdvancedTest.java:170)
	at java.base/java.lang.reflect.Method.invoke(Method.java:580)
	at java.base/java.util.Optional.ifPresent(Optional.java:178)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.Iterator.forEachRemaining(Iterator.java:133)
	at java.base/java.util.Spliterators$IteratorSpliterator.forEachRemaining(Spliterators.java:1939)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)

[ERROR] com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderEvent)[29] -- Time elapsed: 0.001 s <<< FAILURE!
org.opentest4j.AssertionFailedError: Подія RECALCULATE_PRICE повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
	at org.junit.jupiter.api.AssertionFailureBuilder.build(AssertionFailureBuilder.java:151)
	at org.junit.jupiter.api.AssertionFailureBuilder.buildAndThrow(AssertionFailureBuilder.java:132)
	at org.junit.jupiter.api.AssertFalse.failNotFalse(AssertFalse.java:63)
	at org.junit.jupiter.api.AssertFalse.assertFalse(AssertFalse.java:36)
	at org.junit.jupiter.api.Assertions.assertFalse(Assertions.java:239)
	at com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderWizardStateMachineAdvancedTest.java:170)
	at java.base/java.lang.reflect.Method.invoke(Method.java:580)
	at java.base/java.util.Optional.ifPresent(Optional.java:178)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.Iterator.forEachRemaining(Iterator.java:133)
	at java.base/java.util.Spliterators$IteratorSpliterator.forEachRemaining(Spliterators.java:1939)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)

[ERROR] com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderEvent)[30] -- Time elapsed: 0.001 s <<< FAILURE!
org.opentest4j.AssertionFailedError: Подія VALIDATE_STEP повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
	at org.junit.jupiter.api.AssertionFailureBuilder.build(AssertionFailureBuilder.java:151)
	at org.junit.jupiter.api.AssertionFailureBuilder.buildAndThrow(AssertionFailureBuilder.java:132)
	at org.junit.jupiter.api.AssertFalse.failNotFalse(AssertFalse.java:63)
	at org.junit.jupiter.api.AssertFalse.assertFalse(AssertFalse.java:36)
	at org.junit.jupiter.api.Assertions.assertFalse(Assertions.java:239)
	at com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderWizardStateMachineAdvancedTest.java:170)
	at java.base/java.lang.reflect.Method.invoke(Method.java:580)
	at java.base/java.util.Optional.ifPresent(Optional.java:178)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.Iterator.forEachRemaining(Iterator.java:133)
	at java.base/java.util.Spliterators$IteratorSpliterator.forEachRemaining(Spliterators.java:1939)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)

[ERROR] com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderEvent)[31] -- Time elapsed: 0.001 s <<< FAILURE!
org.opentest4j.AssertionFailedError: Подія FORCE_NEXT повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
	at org.junit.jupiter.api.AssertionFailureBuilder.build(AssertionFailureBuilder.java:151)
	at org.junit.jupiter.api.AssertionFailureBuilder.buildAndThrow(AssertionFailureBuilder.java:132)
	at org.junit.jupiter.api.AssertFalse.failNotFalse(AssertFalse.java:63)
	at org.junit.jupiter.api.AssertFalse.assertFalse(AssertFalse.java:36)
	at org.junit.jupiter.api.Assertions.assertFalse(Assertions.java:239)
	at com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderWizardStateMachineAdvancedTest.java:170)
	at java.base/java.lang.reflect.Method.invoke(Method.java:580)
	at java.base/java.util.Optional.ifPresent(Optional.java:178)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.Iterator.forEachRemaining(Iterator.java:133)
	at java.base/java.util.Spliterators$IteratorSpliterator.forEachRemaining(Spliterators.java:1939)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)

[ERROR] com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderEvent)[32] -- Time elapsed: 0.001 s <<< FAILURE!
org.opentest4j.AssertionFailedError: Подія SAVE_DRAFT повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
	at org.junit.jupiter.api.AssertionFailureBuilder.build(AssertionFailureBuilder.java:151)
	at org.junit.jupiter.api.AssertionFailureBuilder.buildAndThrow(AssertionFailureBuilder.java:132)
	at org.junit.jupiter.api.AssertFalse.failNotFalse(AssertFalse.java:63)
	at org.junit.jupiter.api.AssertFalse.assertFalse(AssertFalse.java:36)
	at org.junit.jupiter.api.Assertions.assertFalse(Assertions.java:239)
	at com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderWizardStateMachineAdvancedTest.java:170)
	at java.base/java.lang.reflect.Method.invoke(Method.java:580)
	at java.base/java.util.Optional.ifPresent(Optional.java:178)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.Iterator.forEachRemaining(Iterator.java:133)
	at java.base/java.util.Spliterators$IteratorSpliterator.forEachRemaining(Spliterators.java:1939)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)

[ERROR] com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderEvent)[33] -- Time elapsed: 0.001 s <<< FAILURE!
org.opentest4j.AssertionFailedError: Подія LOAD_DRAFT повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
	at org.junit.jupiter.api.AssertionFailureBuilder.build(AssertionFailureBuilder.java:151)
	at org.junit.jupiter.api.AssertionFailureBuilder.buildAndThrow(AssertionFailureBuilder.java:132)
	at org.junit.jupiter.api.AssertFalse.failNotFalse(AssertFalse.java:63)
	at org.junit.jupiter.api.AssertFalse.assertFalse(AssertFalse.java:36)
	at org.junit.jupiter.api.Assertions.assertFalse(Assertions.java:239)
	at com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderWizardStateMachineAdvancedTest.java:170)
	at java.base/java.lang.reflect.Method.invoke(Method.java:580)
	at java.base/java.util.Optional.ifPresent(Optional.java:178)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.Iterator.forEachRemaining(Iterator.java:133)
	at java.base/java.util.Spliterators$IteratorSpliterator.forEachRemaining(Spliterators.java:1939)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)

[ERROR] com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderEvent)[34] -- Time elapsed: 0.002 s <<< FAILURE!
org.opentest4j.AssertionFailedError: Подія CLEAR_DRAFT повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
	at org.junit.jupiter.api.AssertionFailureBuilder.build(AssertionFailureBuilder.java:151)
	at org.junit.jupiter.api.AssertionFailureBuilder.buildAndThrow(AssertionFailureBuilder.java:132)
	at org.junit.jupiter.api.AssertFalse.failNotFalse(AssertFalse.java:63)
	at org.junit.jupiter.api.AssertFalse.assertFalse(AssertFalse.java:36)
	at org.junit.jupiter.api.Assertions.assertFalse(Assertions.java:239)
	at com.aksi.domain.order.statemachine.OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents(OrderWizardStateMachineAdvancedTest.java:170)
	at java.base/java.lang.reflect.Method.invoke(Method.java:580)
	at java.base/java.util.Optional.ifPresent(Optional.java:178)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:184)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.Iterator.forEachRemaining(Iterator.java:133)
	at java.base/java.util.Spliterators$IteratorSpliterator.forEachRemaining(Spliterators.java:1939)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.stream.ReferencePipeline$7$1.accept(ReferencePipeline.java:276)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
	at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)

[INFO]
[INFO] Results:
[INFO]
[ERROR] Failures:
[ERROR]   OrderWizardStateMachineAdvancedTest.shouldEnsureAllEventsAreUsed:52 Подія GO_FORWARD не використовується жодним станом ==> expected: <false> but was: <true>
[ERROR]   OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents:170 Подія GO_FORWARD повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
[ERROR]   OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents:170 Подія JUMP_TO_STEP повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
[ERROR]   OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents:170 Подія AUTO_SAVE повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
[ERROR]   OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents:170 Подія VALIDATION_ERROR повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
[ERROR]   OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents:170 Подія SYSTEM_ERROR повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
[ERROR]   OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents:170 Подія TIMEOUT повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
[ERROR]   OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents:170 Подія RESTART_ITEM_WIZARD повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
[ERROR]   OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents:170 Подія SKIP_PHOTOS повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
[ERROR]   OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents:170 Подія RECALCULATE_PRICE повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
[ERROR]   OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents:170 Подія VALIDATE_STEP повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
[ERROR]   OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents:170 Подія FORCE_NEXT повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
[ERROR]   OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents:170 Подія SAVE_DRAFT повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
[ERROR]   OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents:170 Подія LOAD_DRAFT повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
[ERROR]   OrderWizardStateMachineAdvancedTest.shouldHaveAtLeastOneStateForAllEvents:170 Подія CLEAR_DRAFT повинна бути доступна хоча б з одного стану ==> expected: <false> but was: <true>
[INFO]
[ERROR] Tests run: 72, Failures: 15, Errors: 0, Skipped: 0
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD FAILURE
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  24.037 s
[INFO] Finished at: 2025-06-10T23:36:55+02:00
[INFO] ------------------------------------------------------------------------
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-surefire-plugin:3.5.3:test (default-test) on project aksi-backend: There are test failures.
[ERROR]
[ERROR] See /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/surefire-reports for the individual test results.
[ERROR] See dump files (if any exist) [date].dump, [date]-jvmRun[N].dump and [date].dumpstream.
[ERROR] -> [Help 1]
[ERROR]
[ERROR] To see the full stack trace of the errors, re-run Maven with the -e switch.
[ERROR] Re-run Maven using the -X switch to enable full debug logging.
[ERROR]
[ERROR] For more information about the errors and possible solutions, please read the following articles:
[ERROR] [Help 1] http://cwiki.apache.org/confluence/display/MAVEN/MojoFailureException
iddqd at dima1911 in ~/I/J/J/backend
↪
