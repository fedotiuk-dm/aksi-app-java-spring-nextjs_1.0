/**
 * @fileoverview Індексний файл для UI компонентів Stage1
 *
 * Експортує всі компоненти першого етапу Order Wizard
 * Архітектура: "DDD inside, FSD outside" - тонкі UI компоненти
 */

// 🎯 Головний контейнер Stage1
export { Stage1ClientSelection } from './Stage1ClientSelection';

// 🔍 Панелі для вибору та пошуку клієнтів
export { ClientSelectionPanel } from './ClientSelectionPanel';
export { ClientSearchSection } from './ClientSearchSection';

// 👤 Компоненти для створення клієнтів
export { NewClientForm } from './NewClientForm';
export { CreateClientModal } from './CreateClientModal';

// 🏢 Компоненти для вибору філії та базової інформації
export { BranchSelectionPanel } from './BranchSelectionPanel';
export { BranchSelectionSection } from './BranchSelectionSection';
export { BasicOrderInfoForm } from './BasicOrderInfoForm';

// 📝 Типи для експорту будуть додані пізніше при необхідності
