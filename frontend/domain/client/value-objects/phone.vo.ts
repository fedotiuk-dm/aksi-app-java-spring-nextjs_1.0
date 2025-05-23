/**
 * Value Object для телефонного номера
 * Реалізує принцип єдиної відповідальності та інкапсуляції
 */
export class PhoneVO {
  private readonly value: string;

  constructor(phone: string) {
    const cleaned = this.clean(phone);
    this.validate(cleaned);
    this.value = cleaned;
  }

  /**
   * Очищає номер від зайвих символів
   */
  private clean(phone: string): string {
    return phone.replace(/[^\d+]/g, '');
  }

  /**
   * Валідує номер телефону
   */
  private validate(phone: string): void {
    if (!phone) {
      throw new Error('Номер телефону не може бути порожнім');
    }

    // Українські номери: +380XXXXXXXXX або 0XXXXXXXXX
    const ukrainianPattern = /^(\+380|380|0)[0-9]{9}$/;

    if (!ukrainianPattern.test(phone)) {
      throw new Error('Невірний формат українського номера телефону');
    }
  }

  /**
   * Повертає номер у міжнародному форматі
   */
  getInternational(): string {
    if (this.value.startsWith('0')) {
      return '+38' + this.value;
    }
    if (this.value.startsWith('380')) {
      return '+' + this.value;
    }
    return this.value;
  }

  /**
   * Повертає номер у національному форматі
   */
  getNational(): string {
    const international = this.getInternational();
    return international.replace('+380', '0');
  }

  /**
   * Повертає відформатований номер для відображення
   */
  getFormatted(): string {
    const national = this.getNational();
    // Формат: 0XX XXX XX XX
    return national.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  }

  /**
   * Повертає сирий номер
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Порівняння з іншим номером
   */
  equals(other: PhoneVO): boolean {
    return this.getInternational() === other.getInternational();
  }

  toString(): string {
    return this.getFormatted();
  }
}
