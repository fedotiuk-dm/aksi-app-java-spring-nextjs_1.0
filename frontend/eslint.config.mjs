import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Базові налаштування Next.js
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Налаштування для всіх файлів
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      "import": importPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Базові правила TypeScript
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-non-null-assertion": "error",
      // Вимикаємо правила, що потребують type-checking для швидшої роботи
      "@typescript-eslint/no-misused-promises": "off",
      
      // Правила для імпортів
      "import/no-unresolved": "off", // Вимкнено, бо TypeScript перевіряє це
      "import/named": "error",
      "import/namespace": "error",
      "import/default": "error",
      "import/export": "error",
    },
  },
  
  // Спеціальні правила для API клієнтів
  {
    files: ["**/*.tsx", "**/*.ts"],
    ignores: ["**/lib/api/generated/**/*.ts"],
    rules: {
      // Заборона прямих імпортів з папки generated
      "no-restricted-imports": [
        "error",
        {
          "patterns": [
            {
              "group": ["@/lib/api/generated/*/!(index)"],
              "message": "Не імпортуйте напряму з папки generated. Використовуйте індексні файли."
            }
          ]
        }
      ],
      
      // Базові перевірки використання API
      // Вимикаємо правила, що потребують type-checking для швидшої роботи
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
    },
  },
  
  // Вимкнення перевірок для автогенерованого коду
  {
    files: ["**/lib/api/generated/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];

export default eslintConfig;
