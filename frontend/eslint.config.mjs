import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import pkg from '@eslint/js';
const { eslint } = pkg;
import nextPlugin from '@next/eslint-plugin-next';
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
    ignores: ignorePatterns,
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
      // Глобальне правило, що забороняє імпорти напряму з директорії generated
      'no-restricted-imports': [
        'error',
        {
          patterns: ['**/lib/api/generated/**'],
        },
      ],
      // Базові правила TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'error',
      // Вимикаємо правила, що потребують type-checking для швидшої роботи
      '@typescript-eslint/no-misused-promises': 'off',

      // Правила для імпортів
      'import/no-unresolved': 'off', // Вимкнено, бо TypeScript перевіряє це
      'import/named': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',

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

      // Правила для FSD структури
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './features/order-wizard/ui/**',
              from: './features/order-wizard/wizard/**',
              message: 'UI компоненти не повинні імпортувати wizard напряму. Використовуйте хуки.',
            },
            {
              target: './features/order-wizard/ui/**',
              from: './features/order-wizard/clients/**',
              message: 'UI компоненти не повинні імпортувати clients напряму. Використовуйте хуки.',
            },
            {
              target: './features/order-wizard/ui/**',
              from: './features/order-wizard/branches/**',
              message:
                'UI компоненти не повинні імпортувати branches напряму. Використовуйте хуки.',
            },
            {
              target: './features/order-wizard/ui/**',
              from: './features/order-wizard/items/**',
              message: 'UI компоненти не повинні імпортувати items напряму. Використовуйте хуки.',
            },
            {
              target: './features/order-wizard/ui/**',
              from: './features/order-wizard/price-calculator/**',
              message:
                'UI компоненти не повинні імпортувати price-calculator напряму. Використовуйте хуки.',
            },
            {
              target: './features/order-wizard/ui/**',
              from: './features/order-wizard/orders/**',
              message: 'UI компоненти не повинні імпортувати orders напряму. Використовуйте хуки.',
            },
          ],
        },
      ],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: '@features/order-wizard/wizard/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@features/order-wizard/clients/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@features/order-wizard/branches/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@features/order-wizard/items/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@features/order-wizard/price-calculator/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@features/order-wizard/orders/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@features/order-wizard/ui/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@features/order-wizard/shared/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },

  // Спеціальні правила для API клієнтів
  {
    files: ['**/*.tsx', '**/*.ts'],
    ignores: ['**/lib/api/generated/**/*.ts'],
    rules: {
      // Заборона прямих імпортів з папки generated
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/lib/api/generated/*/!(index)'],
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
    files: ['**/lib/api/generated/**/*.ts'],
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
