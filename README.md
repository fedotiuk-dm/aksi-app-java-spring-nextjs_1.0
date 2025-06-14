# 🧼 Хімчистка AKSI - Order Wizard System

Сучасна система управління замовленнями для хімчистки з архітектурою "DDD inside, FSD outside". Повнофункціональний Order Wizard для покрокового оформлення замовлень з інтегрованою системою розрахунку цін, управлінням клієнтами та автоматичним формуванням документації.

## 🏗️ Архітектура проекту

### Монорепозиторій структура

```
├── backend/           # Java/Spring Boot API
├── frontend/          # Next.js/React UI
├── docker/           # Docker конфігурації
├── docs-helpers/     # Документація та інструкції
└── scripts/          # Утиліти та автоматизація
```

### Архітектурні принципи

- **"DDD inside, FSD outside"** - доменна логіка в `domains/`, UI компоненти в `features/`
- **API First** - автогенерація клієнтів через Orval з OpenAPI
- **Type Safety** - повна типізація з TypeScript + Zod схемами
- **Модульність** - кожен домен має власні хуки, стори, схеми

## 🚀 Технологічний стек

### Backend (Java/Spring)

- **Java**: 21 LTS
- **Spring Boot**: 3.4.4
- **База даних**: PostgreSQL 17
- **ORM**: Hibernate/Spring Data JPA
- **API**: REST (Spring Web)
- **Документація**: Swagger/OpenAPI 3
- **Автентифікація**: Spring Security + JWT
- **Валідація**: Jakarta Validation (Hibernate Validator)
- **Маппінг**: MapStruct 1.6.3, Lombok 1.18.38
- **Логування**: SLF4J + Logback
- **Тестування**: JUnit 5.12.1, Mockito
- **Міграції БД**: Liquibase 4.31.1
- **PDF Генерація**: iTextPDF 5.5.13.4
- **QR Code**: ZXing 3.5.3
- **Email**: Spring Mail
- **State Machine**: Spring State Machine 4.0.0

### Frontend (Next.js/React)

- **Фреймворк**: Next.js 15.3.0 (App Router)
- **Мова**: TypeScript 5
- **React**: 19.0.0
- **UI**: Material UI 7.1.1
- **Керування станом**: Zustand 5.0.3
- **API/Бекенд взаємодія**: React Query 5.80.6 + Axios 1.9.0
- **API Генерація**: Orval 7.9.0 (OpenAPI → TypeScript + Zod)
- **Форми**: React Hook Form 7.57.0
- **Валідація**: Zod 3.25.56
- **Дати**: Day.js 1.11.13
- **Тестування**: Vitest 3.2.3 + React Testing Library 16.3.0
- **Локалізація**: next-intl 4.1.0
- **Лінтинг**: ESLint 9 + SonarJS + TypeScript ESLint

### DevOps

- **Контейнеризація**: Docker + Docker Compose
- **Node.js**: 22.14.0-alpine3.20
- **Автоматизація**: Bash скрипти, npm scripts
- **Git Hooks**: Husky + lint-staged

## 🎯 Основні функції Order Wizard

### Етап 1: Клієнт та базова інформація

- Пошук існуючих клієнтів (ім'я, телефон, email, адреса)
- Створення нових клієнтів з повною інформацією
- Вибір філії та автогенерація номера квитанції
- Введення унікальної мітки замовлення

### Етап 2: Менеджер предметів (циклічний)

- **Підетап 2.1**: Основна інформація (категорія, найменування, кількість)
- **Підетап 2.2**: Характеристики (матеріал, колір, наповнювач, знос)
- **Підетап 2.3**: Забруднення та дефекти (плями, ризики, примітки)
- **Підетап 2.4**: Калькулятор ціни (модифікатори, знижки, надбавки)
- **Підетап 2.5**: Фотодокументація (до 5 фото на предмет)

### Етап 3: Загальні параметри замовлення

- Параметри виконання (дата, терміновість)
- Глобальні знижки (Еверкард, соцмережі, ЗСУ)
- Спосіб оплати (термінал, готівка, на рахунок)

### Етап 4: Підтвердження та документація

- Детальний перегляд замовлення з розрахунками
- Цифровий підпис клієнта
- Автоматичне формування та друк квитанції
- PDF генерація з QR-кодом для відстеження

## 🛠️ Швидкий старт

### Повний запуск через Docker

```bash
# З кореневої директорії проекту
cd docker
./docker-up.sh
```

### Доступні сервіси після запуску

- **🎨 Фронтенд**: http://localhost:3000
- **🔧 Backend API**: http://localhost:8080/api
- **📚 Swagger UI**: http://localhost:8080/swagger-ui/index.html
- **🗄️ PgAdmin**: http://localhost:5050 (admin@aksi.com / admin)

## 💻 Локальна розробка

### Backend розробка

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend розробка

```bash
cd frontend
npm install
npm run dev
```

### API генерація (Orval)

```bash
cd frontend
# Генерація всіх API клієнтів та Zod схем
npm run orval:wizard-all

# Автоматична генерація при змінах
npm run orval:watch

# Повна перегенерація
npm run api:rebuild
```

### Лінтинг та форматування

```bash
cd frontend
# Автоматичне виправлення
npm run lint:fix

# Виправлення API імпортів
./scripts/fix-api-imports.sh

# Перевірка типів
npm run type-check
```

## 📁 Структура фронтенду

### Доменна архітектура (DDD inside)

```
domains/wizard/
├── stage1/                    # Клієнт та базова інформація
│   ├── client-search/         # Пошук клієнтів
│   ├── client-creation/       # Створення клієнтів
│   └── basic-order-info/      # Базова інформація замовлення
├── stage2/                    # Менеджер предметів
│   ├── item-manager/          # Головний менеджер
│   ├── substep1/             # Основна інформація
│   ├── substep2/             # Характеристики
│   ├── substep3/             # Забруднення та дефекти
│   ├── substep4/             # Калькулятор ціни
│   └── substep5/             # Фотодокументація
└── main/                      # Головний workflow візарда
```

### Структура домену

```
domain/
├── constants/                 # Константи та енуми
├── schemas/                   # Orval схеми + UI форми (Zod)
├── store/                     # Zustand UI стан
├── hooks/                     # Композиційні хуки
│   ├── use-{feature}.hook.ts  # Спеціалізовані хуки
│   └── use-{domain}.hook.ts   # Головний композиційний хук
└── index.ts                   # Публічне API домену
```

### UI компоненти (FSD outside)

```
features/order-wizard/
├── ui/                        # "Тонкі" UI компоненти
│   ├── stage1/               # Компоненти етапу 1
│   ├── stage2/               # Компоненти етапу 2
│   └── shared/               # Спільні компоненти
└── index.ts                   # Публічне API фічі
```

## 🔧 Налаштування розробки

### VS Code налаштування

Автоматично створюються в `.vscode/settings.json`:

- Автоматичне виправлення ESLint при збереженні
- Сортування імпортів
- Виключення згенерованих файлів з пошуку

### ESLint правила

- Заборона прямих імпортів з `@/shared/api/generated/*`
- Автоматичне сортування імпортів (тимчасово відключено)
- SonarJS правила для якості коду
- TypeScript строга типізація

## 📚 Документація

### Основна документація

- **Архітектурні принципи**: `docs-helpers/java_spring_nextjs/Java_Spring_Next_Project_Cursor_Rules.md`
- **Order Wizard логіка**: `docs-helpers/java_spring_nextjs/OrderWizard instruction_structure logic.md`
- **Покрокове створення**: `docs-helpers/java_spring_nextjs/Покрокове_створення_проекту_Хімчистка.md`

### API документація

- **Swagger UI**: http://localhost:8080/swagger-ui/index.html
- **OpenAPI JSON**: http://localhost:8080/api/v3/api-docs
- **Згенеровані типи**: `frontend/shared/api/generated/`

## 🚨 Troubleshooting

### Проблеми з Docker

```bash
# Очистка Docker
./clean-docker.sh

# Перезапуск сервісів
cd docker && docker-compose down && docker-compose up -d
```

### Проблеми з API генерацією

```bash
cd frontend
# Очистка та повна регенерація
npm run api:clean
npm run orval:wizard-all
```

### Проблеми з імпортами

```bash
cd frontend
# Автоматичне виправлення API імпортів
./scripts/fix-api-imports.sh

# Виправлення ESLint помилок
npm run lint:fix
```



## 📄 Ліцензія

Приватний проект для хімчистки AKSI.

---

**Розроблено з ❤️ використовуючи сучасні технології та найкращі практики розробки**
