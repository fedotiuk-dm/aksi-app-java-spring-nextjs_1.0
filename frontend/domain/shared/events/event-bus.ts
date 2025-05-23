/**
 * Базовий інтерфейс події
 */
interface DomainEvent {
  readonly eventType: string;
  readonly aggregateId: string;
  readonly timestamp: Date;
  readonly version: number;
}

/**
 * Тип обробника події
 */
type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => void | Promise<void>;

/**
 * Централізований Event Bus для комунікації між доменами
 * Реалізує Observer Pattern та забезпечує loose coupling
 */
class EventBus {
  private handlers = new Map<string, Set<EventHandler>>();

  /**
   * Підписка на подію
   */
  subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    const handlersSet = this.handlers.get(eventType);
    if (!handlersSet) return () => {};

    handlersSet.add(handler as EventHandler);

    // Повертаємо функцію для відписки
    return () => {
      handlersSet.delete(handler as EventHandler);
      if (handlersSet.size === 0) {
        this.handlers.delete(eventType);
      }
    };
  }

  /**
   * Публікація події
   */
  async publish<T extends DomainEvent>(event: T): Promise<void> {
    const handlers = this.handlers.get(event.eventType);

    if (!handlers || handlers.size === 0) {
      return;
    }

    // Виконуємо всі обробники паралельно
    const promises = Array.from(handlers).map(async (handler) => {
      try {
        await handler(event);
      } catch (error) {
        console.error(`Error handling event ${event.eventType}:`, error);
      }
    });

    await Promise.all(promises);
  }

  /**
   * Очищення всіх обробників
   */
  clear(): void {
    this.handlers.clear();
  }

  /**
   * Отримання кількості обробників для події
   */
  getHandlerCount(eventType: string): number {
    return this.handlers.get(eventType)?.size || 0;
  }

  /**
   * Перевірка, чи є обробники для події
   */
  hasHandlers(eventType: string): boolean {
    return this.getHandlerCount(eventType) > 0;
  }
}

/**
 * Глобальний інстанс Event Bus
 * Реалізує Singleton Pattern
 */
export const eventBus = new EventBus();

/**
 * Експортуємо типи для використання в інших доменах
 */
export type { DomainEvent, EventHandler };
