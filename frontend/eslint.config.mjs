import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import pkg from '@eslint/js';
import sonarjsPlugin from 'eslint-plugin-sonarjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Список файлів та папок для ігнорування
const ignorePatterns = [
  // Автогенеровані файли
  '**/lib/api/generated/**/*',
  '**/shared/api/generated/**/*',
  '**/.next/**/*',
  '**/node_modules/**/*',
  '**/build/**/*',
  '**/dist/**/*',

  // Кеш та тимчасові файли
  '**/*.log',
  '**/.DS_Store',
  '**/coverage/**/*',
  '**/.vercel/**/*',

  // Конфігураційні файли
  'next.config.ts',
  'jest.config.ts',
  '.eslintrc.js',
  '.prettierrc',
  '.eslintignore',
  '.prettierignore',

  // Client Selection модуль
  '**/features/order-wizard/client-selection/utils/validation-utils.ts',

  // Папка API
  '**/lib/api/**',
  '**/shared/api/generated/**',
];

// Базові налаштування Next.js
const eslintConfig = [
  // Завантажуємо налаштування Next.js
  ...compat.config({
    extends: ['next/core-web-vitals'],
    rules: {
      // Відключаємо попередження про невикористані eslint-disable директиви
      'eslint-comments/no-unused-disable': 'off',
    },
    ignorePatterns,
  }),

  // Налаштування для всіх файлів
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    ignores: [
      ...ignorePatterns,
      '**/features/order-wizard/client-selection/utils/validation-utils.ts',
      '**/lib/api/**',
      '**/shared/api/generated/**',
    ],
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      sonarjs: sonarjsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // 🚀 Автоматичне виправлення API імпортів - використовуйте короткі alias
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/shared/api/generated/*'],
              message:
                'Використовуйте короткі alias: @api/stage1, @api/substep1, @api/main тощо замість @/shared/api/generated/*',
            },
            {
              group: ['**/lib/api/generated/**/*', '**/shared/api/generated/**/!(index)*'],
              message:
                'Не імпортуйте напряму з папки generated. Використовуйте індексні файли або короткі alias.',
            },
          ],
        },
      ],
      // Базові правила TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'error',
      // Вимикаємо правила, що потребують type-checking для швидшої роботи
      '@typescript-eslint/no-misused-promises': 'off',

      // 📦 Правила для імпортів з автоматичним сортуванням
      'import/no-unresolved': 'off', // Вимкнено, бо TypeScript перевіряє це
      'import/named': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',
      'import/no-duplicates': 'error',
      'import/order': 'off', // Тимчасово відключено для зручності розробки

      // SonarJS rules
      'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-identical-expressions': 'error',
      'sonarjs/no-redundant-boolean': 'error',
      'sonarjs/no-small-switch': 'error',
      'sonarjs/no-unused-collection': 'error',
      'sonarjs/no-use-of-empty-return-value': 'error',
      'sonarjs/no-useless-catch': 'error',
      'sonarjs/prefer-immediate-return': 'error',
      'sonarjs/prefer-object-literal': 'error',
      'sonarjs/prefer-single-boolean-return': 'error',
      'sonarjs/prefer-while': 'error',
    },
  },

  // Спеціальні правила для API клієнтів
  {
    files: ['**/*.tsx', '**/*.ts'],
    ignores: ['**/lib/api/generated/**/*.ts', '**/shared/api/generated/**/*.ts'],
    rules: {
      // Заборона прямих імпортів з папки generated
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/lib/api/generated/**/!(index)*', '**/shared/api/generated/**/!(index)*'],
              message: 'Не імпортуйте напряму з папки generated. Використовуйте індексні файли.',
            },
          ],
        },
      ],

      // Базові перевірки використання API
      // Вимикаємо правила, що потребують type-checking для швидшої роботи
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },

  // Вимкнення перевірок для автогенерованого коду
  {
    files: ['**/lib/api/generated/**/*.ts', '**/shared/api/generated/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      // Відключаємо попередження про невикористані eslint-disable директиви
      'eslint-comments/no-unused-disable': 'off',
      // Додаємо правило, яке відключає всі попередження для автогенерованого коду
      'eslint-comments/disable-enable-pair': 'off',
    },
  },
];

export default eslintConfig;
