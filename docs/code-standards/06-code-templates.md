# Шаблони коду

Цей документ містить шаблони коду для стандартних компонентів проекту "Хімчистка AKSI". Використовуйте ці шаблони як основу для створення нових компонентів для забезпечення однорідності кодової бази.

## Призначення шаблонів

Шаблони коду допомагають:
- Підтримувати уніфікований стиль по всьому проекту
- Прискорювати розробку нових компонентів
- Гарантувати дотримання архітектурних принципів
- Уникати поширених помилок

## Як використовувати шаблони

1. **У редакторі IntelliJ IDEA**:
   - Налаштуйте Live Templates (File → Settings → Editor → Live Templates)
   - Додайте шаблони з цього документа
   - Використовуйте скорочення для швидкого вставлення шаблонів

2. **Як довідник**:
   - Зверніться до цього документа при створенні нового компонента
   - Скопіюйте та адаптуйте шаблон відповідно до ваших потреб

## Шаблони для бекенду

### Entity класи

Стандартний шаблон для Entity:

```
@Entity
@Table(name = "${table_name}")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ${Name}Entity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    // Основні поля
    
    // Зв'язки з іншими сутностями
    
    // Допоміжні методи
    
}
```

### Repository інтерфейси

Стандартний шаблон для Repository:

```
public interface ${Name}Repository extends JpaRepository<${Name}Entity, UUID> {
    // Спеціальні методи пошуку
    
    // Кастомні запити
}
```

### DTO класи

#### Шаблон для Request DTO:

```
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ${Name}Request {
    // Поля з валідацією
    
    // Вкладені об'єкти
}
```

#### Шаблон для Response DTO:

```
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ${Name}Response {
    private UUID id;
    
    // Поля відповіді
    
    // Вкладені об'єкти
    
    // Аудит-інформація
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### Mapper інтерфейси

Стандартний шаблон для Mapper:

```
@Mapper(componentModel = "spring", 
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ${Name}Mapper {
    
    ${Name}Response toResponse(${Name}Entity entity);
    
    @Mapping(target = "id", ignore = true)
    ${Name}Entity toEntity(${Name}Request request);
    
    void updateEntity(@MappingTarget ${Name}Entity entity, ${Name}Request request);
}
```

### Service інтерфейси та реалізації

#### Шаблон для Service інтерфейсу:

```
public interface ${Name}Service {
    
    ${Name}Response getById(UUID id);
    
    Page<${Name}Response> getAll(Pageable pageable);
    
    ${Name}Response create(${Name}Request request);
    
    ${Name}Response update(UUID id, ${Name}Request request);
    
    void delete(UUID id);
    
    // Додаткові специфічні методи
}
```

#### Шаблон для Service реалізації:

```
@Service
@RequiredArgsConstructor
@Slf4j
public class ${Name}ServiceImpl implements ${Name}Service {
    
    private final ${Name}Repository ${name}Repository;
    private final ${Name}Mapper ${name}Mapper;
    
    @Override
    public ${Name}Response getById(final UUID id) {
        return ${name}Repository.findById(id)
                .map(${name}Mapper::toResponse)
                .orElseThrow(() -> new ${Name}NotFoundException(id));
    }
    
    @Override
    public Page<${Name}Response> getAll(final Pageable pageable) {
        return ${name}Repository.findAll(pageable)
                .map(${name}Mapper::toResponse);
    }
    
    @Override
    public ${Name}Response create(final ${Name}Request request) {
        ${Name}Entity entity = ${name}Mapper.toEntity(request);
        // Додаткова бізнес-логіка перед збереженням
        
        ${Name}Entity saved = ${name}Repository.save(entity);
        return ${name}Mapper.toResponse(saved);
    }
    
    @Override
    public ${Name}Response update(final UUID id, final ${Name}Request request) {
        ${Name}Entity entity = ${name}Repository.findById(id)
                .orElseThrow(() -> new ${Name}NotFoundException(id));
                
        ${name}Mapper.updateEntity(entity, request);
        // Додаткова бізнес-логіка перед збереженням
        
        ${Name}Entity updated = ${name}Repository.save(entity);
        return ${name}Mapper.toResponse(updated);
    }
    
    @Override
    public void delete(final UUID id) {
        if (!${name}Repository.existsById(id)) {
            throw new ${Name}NotFoundException(id);
        }
        ${name}Repository.deleteById(id);
    }
}
```

### Controller класи

Стандартний шаблон для Controller:

```
@RestController
@RequestMapping("/${url-path}")
@RequiredArgsConstructor
@Tag(name = "${Name}", description = "API для управління ${description}")
public class ${Name}Controller {

    private final ${Name}Service ${name}Service;
    
    @GetMapping("/{id}")
    @Operation(summary = "Отримати ${description} за ID")
    public ResponseEntity<${Name}Response> getById(
            @PathVariable("id") final UUID id) {
        return ResponseEntity.ok(${name}Service.getById(id));
    }
    
    @GetMapping
    @Operation(summary = "Отримати список ${description} з пагінацією")
    public ResponseEntity<Page<${Name}Response>> getAll(
            @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(${name}Service.getAll(pageable));
    }
    
    @PostMapping
    @Operation(summary = "Створити новий ${description}")
    public ResponseEntity<${Name}Response> create(
            @Valid @RequestBody final ${Name}Request request) {
        ${Name}Response created = ${name}Service.create(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Оновити існуючий ${description}")
    public ResponseEntity<${Name}Response> update(
            @PathVariable("id") final UUID id,
            @Valid @RequestBody final ${Name}Request request) {
        return ResponseEntity.ok(${name}Service.update(id, request));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Видалити ${description}")
    public ResponseEntity<Void> delete(
            @PathVariable("id") final UUID id) {
        ${name}Service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Exception класи

Стандартний шаблон для Exception:

```
public class ${Name}NotFoundException extends BaseException {
    
    public ${Name}NotFoundException(UUID id) {
        super(
            String.format("${Description} з ID %s не знайдений", id),
            HttpStatus.NOT_FOUND,
            "${NAME}_NOT_FOUND"
        );
    }
}
```

## Шаблони для фронтенду

### API хуки (React Query + Axios)

```
// features/${feature}/api/use${Name}.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ${Name}Service, ${Name}Response } from '@/lib/api';

export const use${Name} = (id: string) => {
  return useQuery({
    queryKey: ['${name}', id],
    queryFn: () => ${Name}Service.getById(id)
  });
};

export const use${Name}s = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['${name}s', page, size],
    queryFn: () => ${Name}Service.getAll(page, size)
  });
};

export const useCreate${Name} = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ${Name}Service.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${name}s'] });
    }
  });
};

export const useUpdate${Name} = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => ${Name}Service.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${name}', id] });
      queryClient.invalidateQueries({ queryKey: ['${name}s'] });
    }
  });
};

export const useDelete${Name} = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ${Name}Service.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${name}s'] });
    }
  });
};
```

### Form компоненти (React Hook Form + Zod)

```
// features/${feature}/ui/${Name}Form.tsx
'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const ${name}Schema = z.object({
  // Визначення схеми валідації
});

export type ${Name}FormData = z.infer<typeof ${name}Schema>;

export function ${Name}Form({
  initialValues,
  onSubmit,
  isSubmitting
}: {
  initialValues?: Partial<${Name}FormData>;
  onSubmit: (data: ${Name}FormData) => void;
  isSubmitting: boolean;
}) {
  const form = useForm<${Name}FormData>({
    resolver: zodResolver(${name}Schema),
    defaultValues: initialValues || {
      // Значення за замовчуванням
    }
  });
  
  // Логіка форми
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Поля форми */}
    </form>
  );
}
```

## Рекомендації щодо створення нових компонентів

1. **Поетапний процес розробки**:
   - Спочатку створіть Entity і Repository
   - Потім DTO і Mapper
   - Далі Service інтерфейс та реалізацію
   - Останнім кроком Controller

2. **Тестування**:
   - Разом із кожним компонентом створюйте відповідні тести
   - Використовуйте стандартні шаблони тестів

3. **Документація**:
   - Додавайте Javadoc до інтерфейсів та публічних методів
   - Документуйте параметри API через анотації OpenAPI

4. **Узгодження з доменом**:
   - Переконайтеся, що нові компоненти відповідають доменній моделі
   - Дотримуйтеся термінології, встановленої в глосарії проекту
