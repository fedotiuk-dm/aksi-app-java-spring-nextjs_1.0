package com.aksi.tools;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Stream;

import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Автоматичний генератор Domain компонентів
 *
 * <p>Сканує Entity класи та генерує: - Repository interfaces з стандартними методами - MapStruct
 * Mapper interfaces з Entity↔DTO маппінгом - Service класи що extends BaseService
 *
 * <p>Використання: java -cp ... DomainCodeGenerator --scan-entities path --output-dir path
 * --generate repositories,mappers,services
 */
public class DomainCodeGenerator {
  private static final Logger log = LoggerFactory.getLogger(DomainCodeGenerator.class);

  private final VelocityEngine velocityEngine;
  private final Map<String, EntityInfo> entities = new HashMap<>();

  public DomainCodeGenerator() {
    this.velocityEngine = initVelocityEngine();
  }

  public static void main(String[] args) {
    log.info("Запуск Domain Code Generator...");

    DomainCodeGenerator generator = new DomainCodeGenerator();
    generator.processArguments(args);
  }

  private void processArguments(String[] args) {
    Map<String, String> params = parseArguments(args);

    String entitiesPath = params.getOrDefault("scan-entities", "src/main/java/com/aksi/domain");
    String outputDir = params.getOrDefault("output-dir", "target/generated-sources/domain");
    String generateTypes = params.getOrDefault("generate", "repositories,mappers,services");

    try {
      // Сканування Entity класів
      scanEntities(entitiesPath);

      // Генерація компонентів
      Set<String> typesToGenerate = Set.of(generateTypes.split(","));
      generateComponents(outputDir, typesToGenerate);

      log.info("Генерація завершена успішно!");

    } catch (IOException | RuntimeException e) {
      log.error("Помилка під час генерації: {}", e.getMessage(), e);
      System.exit(1);
    }
  }

  private void scanEntities(String entitiesPath) throws IOException {
    log.info("Сканування Entity класів в: {}", entitiesPath);

    Path startPath = Paths.get(entitiesPath);

    try (Stream<Path> paths = Files.walk(startPath)) {
      paths
          .filter(path -> path.toString().endsWith("Entity.java"))
          .forEach(this::processEntityFile);
    }

    log.info("Знайдено {} Entity класів", entities.size());
  }

  private void processEntityFile(Path entityPath) {
    try {
      String className = getClassNameFromPath(entityPath);
      String packageName = getPackageNameFromPath(entityPath);

      // Аналізуємо Entity клас (спрощена версія)
      EntityInfo entityInfo = new EntityInfo();
      entityInfo.className = className;
      entityInfo.packageName = packageName;
      entityInfo.domainName = className.replace("Entity", "");
      entityInfo.entityFields = extractEntityFields(entityPath);

      entities.put(entityInfo.domainName, entityInfo);

      log.debug("Обробовано Entity: {}", className);

    } catch (IOException | RuntimeException e) {
      log.warn("Не вдалося обробити Entity файл {}: {}", entityPath, e.getMessage());
    }
  }

  private void generateComponents(String outputDir, Set<String> typesToGenerate)
      throws IOException {
    Path outputPath = Paths.get(outputDir);
    Files.createDirectories(outputPath);

    for (EntityInfo entity : entities.values()) {
      if (typesToGenerate.contains("repositories")) {
        generateRepository(entity, outputPath);
      }

      if (typesToGenerate.contains("mappers")) {
        generateMapper(entity, outputPath);
      }

      if (typesToGenerate.contains("services")) {
        generateService(entity, outputPath);
      }
    }
  }

  private void generateRepository(EntityInfo entity, Path outputPath) throws IOException {
    log.info("Генерація Repository для {}", entity.domainName);

    VelocityContext context = createVelocityContext(entity);
    Template template = velocityEngine.getTemplate("templates/repository.vm");

    Path repositoryPath =
        outputPath
            .resolve(entity.packageName.replace(".", "/"))
            .resolve("repository")
            .resolve(entity.domainName + "Repository.java");

    writeTemplate(template, context, repositoryPath);
  }

  private void generateMapper(EntityInfo entity, Path outputPath) throws IOException {
    log.info("Генерація Mapper для {}", entity.domainName);

    VelocityContext context = createVelocityContext(entity);
    Template template = velocityEngine.getTemplate("templates/mapper.vm");

    Path mapperPath =
        outputPath
            .resolve(entity.packageName.replace(".", "/"))
            .resolve("mapper")
            .resolve(entity.domainName + "Mapper.java");

    writeTemplate(template, context, mapperPath);
  }

  private void generateService(EntityInfo entity, Path outputPath) throws IOException {
    log.info("Генерація Service для {}", entity.domainName);

    VelocityContext context = createVelocityContext(entity);
    Template template = velocityEngine.getTemplate("templates/service.vm");

    Path servicePath =
        outputPath
            .resolve(entity.packageName.replace(".", "/"))
            .resolve("service")
            .resolve(entity.domainName + "Service.java");

    writeTemplate(template, context, servicePath);
  }

  private VelocityContext createVelocityContext(EntityInfo entity) {
    VelocityContext context = new VelocityContext();

    context.put("packageName", entity.packageName);
    context.put("domainName", entity.domainName);
    context.put("className", entity.className);
    context.put("domainNameLower", entity.domainName.toLowerCase());
    context.put("domainNameCamel", toCamelCase(entity.domainName));
    context.put("entityFields", entity.entityFields);
    context.put("searchableFields", getSearchableFields(entity.entityFields));

    return context;
  }

  private void writeTemplate(Template template, VelocityContext context, Path outputPath)
      throws IOException {
    Files.createDirectories(outputPath.getParent());

    try (FileWriter writer = new FileWriter(outputPath.toFile())) {
      template.merge(context, writer);
    }

    log.debug("Згенеровано файл: {}", outputPath);
  }

  private VelocityEngine initVelocityEngine() {
    VelocityEngine engine = new VelocityEngine();
    engine.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath");
    engine.setProperty("classpath.resource.loader.class", ClasspathResourceLoader.class.getName());
    engine.init();
    return engine;
  }

  private Map<String, String> parseArguments(String[] args) {
    Map<String, String> params = new HashMap<>();

    for (int i = 0; i < args.length - 1; i += 2) {
      if (args[i].startsWith("--")) {
        params.put(args[i].substring(2), args[i + 1]);
      }
    }

    return params;
  }

  private String getClassNameFromPath(Path path) {
    String fileName = path.getFileName().toString();
    return fileName.substring(0, fileName.lastIndexOf('.'));
  }

  private String getPackageNameFromPath(Path path) {
    // Спрощена версія - витягуємо package з шляху файлу
    String pathStr = path.toString();
    String srcPrefix = "src/main/java/";

    if (pathStr.contains(srcPrefix)) {
      int startIndex = pathStr.indexOf(srcPrefix) + srcPrefix.length();
      String packagePath = pathStr.substring(startIndex, pathStr.lastIndexOf('/'));
      return packagePath.replace('/', '.');
    }

    return "com.aksi.domain";
  }

  private List<FieldInfo> extractEntityFields(Path entityPath) throws IOException {
    // Спрощена версія - парсимо файл текстуально
    List<FieldInfo> fields = new ArrayList<>();
    List<String> lines = Files.readAllLines(entityPath);

    for (String line : lines) {
      line = line.trim();
      if (line.startsWith("private ") && !line.contains("static") && !line.contains("final")) {
        FieldInfo fieldInfo = parseFieldDeclaration(line);
        if (fieldInfo != null) {
          fields.add(fieldInfo);
        }
      }
    }

    return fields;
  }

  private FieldInfo parseFieldDeclaration(String line) {
    // Парсинг: private String name;
    String[] parts = line.split("\\s+");
    if (parts.length >= 3) {
      FieldInfo field = new FieldInfo();
      field.type = parts[1];
      field.name = parts[2].replace(";", "");
      field.searchable = isSearchableType(field.type);
      return field;
    }
    return null;
  }

  private boolean isSearchableType(String type) {
    return type.equals("String") || type.equals("UUID");
  }

  private List<FieldInfo> getSearchableFields(List<FieldInfo> fields) {
    return fields.stream().filter(field -> field.searchable).toList();
  }

  private String toCamelCase(String input) {
    return Character.toLowerCase(input.charAt(0)) + input.substring(1);
  }

  // Внутрішні класи для представлення інформації про Entity
  private static class EntityInfo {
    String className;
    String packageName;
    String domainName;
    List<FieldInfo> entityFields = new ArrayList<>();
  }

  private static class FieldInfo {
    public String name;
    public String type;
    public boolean searchable;
  }
}
