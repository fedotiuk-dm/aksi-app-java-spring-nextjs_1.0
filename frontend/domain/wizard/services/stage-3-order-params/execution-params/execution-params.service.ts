import {
  calculateCompletionDate,
  type WizardCompletionDateCalculationData,
  type WizardCompletionDateCalculationResult,
  WizardExpediteType,
} from '@/domain/wizard/adapters/order';
import {
  executionParamsSchema,
  type UrgentExecution,
} from '@/domain/wizard/schemas/wizard-stage-3.schemas';

// Імпорти адаптерів з wizard domain

import { BaseWizardService } from '../../base.service';

/**
 * ✅ МІНІМАЛІСТСЬКИЙ СЕРВІС ДЛЯ 3.1: ПАРАМЕТРИ ВИКОНАННЯ
 * ✅ На основі: OrderWizard instruction_structure logic.md
 * Розмір: ~70 рядків (дотримання ліміту)
 *
 * Відповідальність (ТІЛЬКИ):
 * - Композиція order адаптерів для розрахунку дат
 * - Валідація параметрів виконання через централізовані Zod схеми
 * - Мінімальні трансформації для UI відповідно до документу
 *
 * НЕ дублює:
 * - Розрахунок дат (роль order адаптерів)
 * - Календарну логіку (роль адаптерів)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 */

export class ExecutionParamsService extends BaseWizardService {
  protected readonly serviceName = 'ExecutionParamsService';

  /**
   * Валідація параметрів виконання (через централізовані схеми)
   */
  validateExecutionParams(data: unknown) {
    return executionParamsSchema.safeParse(data);
  }

  /**
   * Композиція: розрахунок дати завершення через адаптер
   * Автоматичний розрахунок на основі категорій доданих предметів (з документу)
   */
  async calculateCompletionDate(
    serviceCategoryIds: string[],
    urgentExecution: UrgentExecution = 'звичайне'
  ): Promise<WizardCompletionDateCalculationResult | null> {
    const data: WizardCompletionDateCalculationData = {
      serviceCategoryIds,
      expediteType: this.mapUrgentExecutionToExpediteType(urgentExecution),
    };

    const result = await calculateCompletionDate(data);
    return result.success ? result.data || null : null;
  }

  /**
   * Отримання опцій терміновості відповідно до документу
   * Термінове виконання (мультивибір):
   * - Звичайне (без націнки)
   * - +50% за 48 год
   * - +100% за 24 год
   */
  getUrgentExecutionOptions(): Array<{ value: UrgentExecution; label: string; percent: number }> {
    return [
      { value: 'звичайне', label: 'Звичайне (без націнки)', percent: 0 },
      { value: 'термінове_50_за_48год', label: '+50% за 48 год', percent: 50 },
      { value: 'термінове_100_за_24год', label: '+100% за 24 год', percent: 100 },
    ];
  }

  /**
   * Інформація про стандартні терміни (з документу)
   * 48 годин для звичайних/14 днів для шкіри
   */
  getStandardDeadlineInfo(hasSkinItems: boolean = false): string {
    return hasSkinItems ? '14 днів для шкіряних виробів' : '48 годин для звичайних виробів';
  }

  /**
   * Приватний метод: маппінг urgentExecution -> WizardExpediteType для адаптера
   */
  private mapUrgentExecutionToExpediteType(urgentExecution: UrgentExecution): WizardExpediteType {
    const mapping: Record<UrgentExecution, WizardExpediteType> = {
      звичайне: WizardExpediteType.STANDARD,
      термінове_50_за_48год: WizardExpediteType.EXPRESS_48H,
      термінове_100_за_24год: WizardExpediteType.EXPRESS_24H,
    };
    return mapping[urgentExecution] || WizardExpediteType.STANDARD;
  }
}
