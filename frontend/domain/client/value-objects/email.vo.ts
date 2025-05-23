/**
 * Value Object для email адреси
 * Реалізує принцип єдиної відповідальності та інкапсуляції
 */
export class EmailVO {
  private readonly value: string;

  constructor(email: string) {
    const cleaned = this.clean(email);
    this.validate(cleaned);
    this.value = cleaned;
  }

  /**
   * Очищає email від зайвих пробілів
   */
  private clean(email: string): string {
    return email.trim().toLowerCase();
  }

  /**
   * Валідує email адресу
   */
  private validate(email: string): void {
    if (!email) {
      throw new Error('Email адреса не може бути порожньою');
    }

    // Регулярний вираз для валідації email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      throw new Error('Невірний формат email адреси');
    }

    if (email.length > 254) {
      throw new Error('Email адреса занадто довга');
    }
  }

  /**
   * Повертає домен email адреси
   */
  getDomain(): string {
    return this.value.split('@')[1];
  }

  /**
   * Повертає локальну частину email адреси
   */
  getLocalPart(): string {
    return this.value.split('@')[0];
  }

  /**
   * Перевіряє, чи є це корпоративна email адреса
   */
  isCorporate(): boolean {
    const personalDomains = [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'ukr.net',
      'i.ua',
    ];
    return !personalDomains.includes(this.getDomain());
  }

  /**
   * Повертає замасковану email адресу для відображення
   */
  getMasked(): string {
    const [local, domain] = this.value.split('@');
    if (local.length <= 2) {
      return `${local}***@${domain}`;
    }
    return `${local.substring(0, 2)}***@${domain}`;
  }

  /**
   * Повертає сиру email адресу
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Порівняння з іншою email адресою
   */
  equals(other: EmailVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
