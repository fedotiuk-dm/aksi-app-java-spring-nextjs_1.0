/**
 * @fileoverview Order Wizard Domain - бізнес-логіка оформлення замовлень хімчистки
 * @module domain/wizard
 * @author AKSI Team
 * @since 1.0.0
 *
 * @description
 * Доменний модуль Order Wizard реалізує всю бізнес-логіку оформлення замовлень у хімчистці
 * за принципом "DDD inside". Включає управління станом wizard, валідацію кроків,
 * координацію між різними етапами процесу та інтеграцію з іншими доменами.
 *
 * Структура модуля:
 * - shared/ - спільні компоненти (типи, константи, утиліти)
 * - flow/ - управління переходами між кроками (XState)
 * - steps/ - модулі окремих кроків (Zustand + хуки)
 *
 * @example
 * // Основне використання wizard
 * import { useWizard } from '@/domain/wizard';
 *
 * function OrderWizardPage() {
 *   const { currentStep, goNext, goPrev, canProceed } = useWizard();
 *
 *   return (
 *     <WizardContainer>
 *       <StepComponent step={currentStep} />
 *       <WizardNavigation
 *         onNext={goNext}
 *         onPrev={goPrev}
 *         canProceed={canProceed}
 *       />
 *     </WizardContainer>
 *   );
 * }
 *
 * @example
 * // Інтеграція з існуючими доменами
 * import { useWizard } from '@/domain/wizard';
 * import { useClient } from '@/domain/client';
 * import { useOrder } from '@/domain/order';
 *
 * function WizardWithDomainIntegration() {
 *   const wizard = useWizard();
 *   const client = useClient();
 *   const order = useOrder();
 *
 *   // Всі домени працюють разом через композицію
 *   return <ComplexOrderInterface />;
 * }
 *
 * @see {@link flow} - Flow управління переходами між кроками
 * @see {@link shared} - Спільні компоненти та утиліти
 */

// Flow management (XState)
export * from './flow';

// Main wizard hook (буде створений пізніше)
// export { useWizard } from './hooks/use-wizard.hook';
