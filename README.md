# Хімчистка AKSI - Система Управління

Монорепозиторій для повного стеку застосунку "Хімчистка AKSI". Система складається з двох основних компонентів:

- **Java/Spring** бекенд
- **Next.js/React** фронтенд

## Технологічний стек

### Бекенд

- **Java**: 21.0.6 LTS
- **Spring Boot**: 3.4.4
- **База даних**: PostgreSQL 17.4
- **Spring Security + JWT**
- **Swagger/OpenAPI**

### Фронтенд

- **Next.js**: 15.3.0 (з App Router)
- **React**: 19.0.0
- **Node.js**: 23.9.0
- **Material UI**: 7.0.x
- **TypeScript**: 5.x

### DevOps

- **Docker**: 28.0.4
- **Docker Compose**: 2.35.0

## Запуск проєкту

Для того, щоб запустити всі сервіси одночасно, використовуйте Docker:

```sh
# З кореневої директорії проєкту
cd docker
./docker-up.sh
```

Після запуску доступні наступні сервіси:

- **Фронтенд**: http://localhost:3000
- **Бекенд API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/swagger-ui/index.html
- **PgAdmin**: http://localhost:5050 (email: admin@aksi.com, пароль: admin)

## Розробка

### Бекенд

Для локальної розробки бекенду:

```sh
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Фронтенд

Для локальної розробки фронтенду:

```sh
cd frontend
npm install
npm run dev
```

## Документація

Детальна документація доступна у директорії `/docs`:

- Структура проєкту: [docs/project_structure.md](docs/project_structure.md)
- Інструкція для розробників: [docs/java_spring_nextjs/Java_Spring_Next_Project_Cursor_Rules.md](docs/java_spring_nextjs/Java_Spring_Next_Project_Cursor_Rules.md)
- Покрокове створення проєкту: [docs/java*spring_nextjs/Покрокове*створення*проекту*Хімчистка.md](docs/java_spring_nextjs/Покрокове_створення_проекту_Хімчистка.md)

## Допомога

При виникненні проблем з розгортанням, звертайтесь до розділу [Troubleshooting](#) або відкрийте issue у репозиторії.
