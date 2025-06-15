/**
 * @fileoverview BARREL EXPORT для Orders API
 *
 * 🎯 Єдина точка входу для всіх Orders API експортів:
 * - React Query хуки (useQuery, useMutation)
 * - TypeScript типи та інтерфейси
 * - Zod схеми для валідації
 *
 * 📦 Використання:
 * import { useCreateOrderDraft, OrderDTO, createOrderRequestSchema } from '@/shared/api/generated/orders';
 */

// 🔥 React Query хуки для Orders API
export * from './aksiApi';

// 📝 TypeScript типи та інтерфейси
export * from './aksiApi.schemas';

// 🛡️ Zod схеми для валідації
export * from './schemas.zod';
