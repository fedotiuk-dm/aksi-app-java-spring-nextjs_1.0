import { PrismaClient, Role } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Визначимо типи для JSON даних (для кращої типізації)
type PriceListJsonItem = {
  id: string;
  name: string;
  unit: string;
  basePrice: number;
  detailsPrice?: number;
  colorVariants?: {
    black?: number;
    other?: number;
  };
};

type PriceListJsonCategory = {
  categoryId: string;
  categoryName: string;
  items: PriceListJsonItem[];
};

type PriceListJsonData = {
  services: PriceListJsonCategory[];
};

async function main() {
  console.log('Start seeding ...');

  // --- Створення Адміністратора ---
  const adminUsername = 'admin';
  const adminEmail = `${adminUsername}@example.com`; // Визначаємо email для перевірки
  const adminPassword = 'password123';
  const saltRounds = 10;

  // Перевіряємо, чи існує вже адмін за EMAIL (для уникнення помилки findUnique)
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: adminEmail, // Повертаємо пошук за email
    },
  });

  if (!existingAdmin) {
    console.log(
      `Admin user (${adminUsername} / ${adminEmail}) not found, creating...`
    );
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // Створюємо з name та email
    await prisma.user.create({
      data: {
        name: adminUsername, // Залишаємо ім'я користувача
        email: adminEmail, // Використовуємо визначений email
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });
    console.log(
      `Admin user (${adminUsername} / ${adminEmail}) created successfully.`
    );
  } else {
    console.log(`Admin user with email ${adminEmail} already exists.`);
  }
  // --- Кінець Створення Адміністратора ---

  // 1. Читання JSON файлу
  const filePath = path.join(
    process.cwd(),
    'scripts',
    'V2price',
    'price_list.json'
  );
  let priceData: PriceListJsonData;
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    priceData = JSON.parse(jsonData);
  } catch (error) {
    console.error('Error reading or parsing price_list.json:', error);
    return; // Зупиняємо скрипт, якщо файл не знайдено або пошкоджено
  }

  // 2. Наповнення бази даних
  for (const category of priceData.services) {
    console.log(
      `Processing category: ${category.categoryName} (${category.categoryId})`
    );

    // Створюємо або оновлюємо категорію
    // Використовуємо `code` (з categoryId JSON) як унікальний ідентифікатор для upsert
    const createdCategory = await prisma.serviceCategory.upsert({
      where: { code: category.categoryId },
      update: {
        name: category.categoryName,
        // Можна додати оновлення description, sortOrder, якщо потрібно
      },
      create: {
        code: category.categoryId,
        name: category.categoryName,
        // Можна додати description, sortOrder
      },
    });

    console.log(
      `  Category ${createdCategory.name} processed (ID: ${createdCategory.id})`
    );

    // Обробляємо елементи (послуги) всередині категорії
    for (let i = 0; i < category.items.length; i++) {
      const item = category.items[i];
      const catalogNumber = i + 1; // Використовуємо індекс + 1 як номер в каталозі

      // Дані для створення/оновлення PriceListItem
      const priceListItemData = {
        jsonId: item.id,
        name: item.name,
        catalogNumber: catalogNumber,
        unitOfMeasure: item.unit,
        // Prisma автоматично конвертує number в Decimal
        basePrice: item.basePrice,
        priceBlack: item.colorVariants?.black,
        priceColor: item.colorVariants?.other,
        active: true, // За замовчуванням активно
        categoryId: createdCategory.id, // Використовуємо UUID створеної/знайденої категорії
      };

      try {
        // Створюємо або оновлюємо послугу
        // Використовуємо комбінацію categoryId, jsonId як унікальний ключ для upsert
        await prisma.priceListItem.upsert({
          where: {
            categoryId_jsonId: {
              categoryId: createdCategory.id,
              jsonId: item.id,
            },
          },
          update: priceListItemData, // Оновлюємо всі поля
          create: priceListItemData, // Створюємо з усіма полями
        });
        console.log(
          `    Item ${item.name} (Catalog #${catalogNumber}) processed.`
        );
      } catch (error) {
        // Обробка можливих помилок (наприклад, якщо унікальний ключ змінився, а upsert не спрацював)
        console.error(
          `    Error processing item ${item.name} (ID: ${item.id}):`,
          error
        );
      }
    }
  }

  // --- Створення Тестових Клієнтів ---
  console.log('Seeding test clients...');
  const testClients = [
    {
      fullName: 'Тест Клієнт Один',
      phone: '+380501112233',
      email: 'test1@example.com',
      address: 'вул. Тестова, 1',
    },
    {
      fullName: 'Тест Клієнт Два',
      phone: '+380502223344',
      email: 'test2@example.com',
    },
    {
      fullName: 'Тест Клієнт Три',
      phone: '+380503334455',
      // email: null, // Можна без email
      address: 'вул. Тестова, 3',
    },
    {
      fullName: 'Іван Франко',
      phone: '+380504445566',
      email: 'franko@example.com',
    },
    {
      fullName: 'Леся Українка',
      phone: '+380505556677',
      email: 'lesya@example.com',
      address: 'м. Київ',
    },
  ];

  for (const clientData of testClients) {
    try {
      await prisma.client.upsert({
        where: { phone: clientData.phone }, // Унікальне поле для перевірки
        update: clientData, // Якщо знайдено, оновлюємо дані (можна залишити порожнім, якщо не потрібно оновлювати)
        create: clientData, // Якщо не знайдено, створюємо
      });
      console.log(`  Client ${clientData.fullName} seeded successfully.`);
    } catch (error) {
      // Обробка можливих помилок (наприклад, якщо телефон не унікальний з якоїсь причини)
      console.error(
        `  Error seeding client ${clientData.fullName} (Phone: ${clientData.phone}):`,
        error
      );
    }
  }
  // --- Кінець Створення Тестових Клієнтів ---

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
