import { z } from 'zod';
import { ItemCharacteristicsFillerCondition, ItemCharacteristicsWearLevel } from '@/shared/api/generated/cart';

export const itemFormSchema = z.object({
  priceListItemId: z.string().min(1, 'Оберіть послугу'),
  quantity: z.number().min(1, 'Кількість повинна бути більше 0'),
  characteristics: z.object({
    material: z.string().optional(),
    color: z.string().optional(),
    filler: z.string().optional(),
    fillerCondition: z.nativeEnum(ItemCharacteristicsFillerCondition).optional(),
    wearLevel: z.nativeEnum(ItemCharacteristicsWearLevel).optional(),
  }).optional(),
  modifierCodes: z.array(z.string()).optional(),
});

export type ItemFormData = z.infer<typeof itemFormSchema>;