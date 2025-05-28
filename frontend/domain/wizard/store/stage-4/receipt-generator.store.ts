/**
 * @fileoverview Receipt Generator Slice Store - Zustand store для генерації PDF квитанцій
 * @module domain/wizard/store/stage-4
 * @author AKSI Team
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Типи макетів квитанцій
 */
export enum ReceiptTemplate {
  STANDARD = 'STANDARD',
  DETAILED = 'DETAILED',
  COMPACT = 'COMPACT',
  THERMAL = 'THERMAL',
}

/**
 * Параметри друку
 */
interface PrintSettings {
  printerName: string;
  paperSize: 'A4' | 'A5' | '80mm' | '58mm';
  copies: number;
  duplex: boolean;
  orientation: 'portrait' | 'landscape';
}

/**
 * Налаштування PDF
 */
interface PDFSettings {
  quality: 'draft' | 'standard' | 'high';
  compression: boolean;
  watermark: boolean;
  password?: string;
}

/**
 * Дані для генерації квитанції
 */
interface ReceiptData {
  receiptNumber: string;
  orderDate: Date;
  completionDate: Date;
  clientInfo: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  branchInfo: {
    name: string;
    address: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    unit: string;
    basePrice: number;
    finalPrice: number;
    modifiers: string[];
  }>;
  totals: {
    subtotal: number;
    discount: number;
    expedite: number;
    total: number;
    paid: number;
    remaining: number;
  };
  terms: string[];
  signatures: {
    client?: string;
    operator: string;
  };
}

/**
 * Стан генератора квитанцій
 */
interface ReceiptGeneratorState {
  // Receipt data
  receiptData: ReceiptData | null;
  isReceiptDataReady: boolean;

  // Template and settings
  selectedTemplate: ReceiptTemplate;
  printSettings: PrintSettings;
  pdfSettings: PDFSettings;

  // Generation process
  isGenerating: boolean;
  generationProgress: number;
  generationError: string | null;

  // Generated files
  generatedPDFUrl: string | null;
  generatedPDFBlob: Blob | null;
  thumbnailUrl: string | null;

  // Print process
  isPrinting: boolean;
  printError: string | null;
  printSuccess: boolean;

  // Email sending
  isSendingEmail: boolean;
  emailSent: boolean;
  emailError: string | null;
  emailRecipients: string[];

  // Preview
  previewData: string | null;
  isPreviewLoading: boolean;
  previewError: string | null;

  // Validation
  receiptValidationErrors: string[];
  isReceiptValid: boolean;
}

/**
 * Дії генератора квитанцій
 */
interface ReceiptGeneratorActions {
  // Receipt data actions
  setReceiptData: (data: ReceiptData) => void;
  updateReceiptData: (updates: Partial<ReceiptData>) => void;
  validateReceiptData: () => void;
  setReceiptDataReady: (ready: boolean) => void;

  // Template and settings actions
  setSelectedTemplate: (template: ReceiptTemplate) => void;
  setPrintSettings: (settings: Partial<PrintSettings>) => void;
  setPDFSettings: (settings: Partial<PDFSettings>) => void;

  // Generation actions
  generatePDF: () => Promise<boolean>;
  setGenerating: (generating: boolean) => void;
  setGenerationProgress: (progress: number) => void;
  setGenerationError: (error: string | null) => void;

  // Generated files actions
  setGeneratedPDF: (url: string | null, blob: Blob | null) => void;
  setThumbnailUrl: (url: string | null) => void;
  downloadPDF: () => void;
  clearGeneratedFiles: () => void;

  // Print actions
  printReceipt: () => Promise<boolean>;
  setPrinting: (printing: boolean) => void;
  setPrintError: (error: string | null) => void;
  setPrintSuccess: (success: boolean) => void;

  // Email actions
  sendReceiptByEmail: (recipients: string[]) => Promise<boolean>;
  setSendingEmail: (sending: boolean) => void;
  setEmailSent: (sent: boolean) => void;
  setEmailError: (error: string | null) => void;
  setEmailRecipients: (recipients: string[]) => void;

  // Preview actions
  generatePreview: () => Promise<void>;
  setPreviewData: (data: string | null) => void;
  setPreviewLoading: (loading: boolean) => void;
  setPreviewError: (error: string | null) => void;

  // Validation actions
  setReceiptValidationErrors: (errors: string[]) => void;
  clearReceiptValidationErrors: () => void;
  setReceiptValid: (valid: boolean) => void;

  // Reset actions
  resetReceiptGenerator: () => void;
}

/**
 * Початковий стан генератора квитанцій
 */
const initialReceiptGeneratorState: ReceiptGeneratorState = {
  receiptData: null,
  isReceiptDataReady: false,
  selectedTemplate: ReceiptTemplate.STANDARD,
  printSettings: {
    printerName: '',
    paperSize: 'A4',
    copies: 2,
    duplex: false,
    orientation: 'portrait',
  },
  pdfSettings: {
    quality: 'standard',
    compression: true,
    watermark: false,
  },
  isGenerating: false,
  generationProgress: 0,
  generationError: null,
  generatedPDFUrl: null,
  generatedPDFBlob: null,
  thumbnailUrl: null,
  isPrinting: false,
  printError: null,
  printSuccess: false,
  isSendingEmail: false,
  emailSent: false,
  emailError: null,
  emailRecipients: [],
  previewData: null,
  isPreviewLoading: false,
  previewError: null,
  receiptValidationErrors: [],
  isReceiptValid: false,
};

/**
 * Receipt Generator Slice Store
 *
 * Відповідальність:
 * - Збір даних для квитанції з інших stores
 * - Генерація PDF квитанцій у різних форматах
 * - Налаштування друку та відправки
 * - Попередній перегляд квитанцій
 * - Відправка квитанцій по email
 * - Збереження та завантаження файлів
 *
 * Інтеграція:
 * - PDF генерація (jsPDF, PDFKit)
 * - Print API для друку
 * - Email API для відправки
 * - File System API для збереження
 */
export const useReceiptGeneratorStore = create<ReceiptGeneratorState & ReceiptGeneratorActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialReceiptGeneratorState,

      // Receipt data actions
      setReceiptData: (data) => {
        set({ receiptData: data }, false, 'receiptGenerator/setReceiptData');
        get().validateReceiptData();
      },

      updateReceiptData: (updates) => {
        set(
          (state) => ({
            receiptData: state.receiptData ? { ...state.receiptData, ...updates } : null,
          }),
          false,
          'receiptGenerator/updateReceiptData'
        );
        get().validateReceiptData();
      },

      validateReceiptData: () => {
        const state = get();
        const errors: string[] = [];

        if (!state.receiptData) {
          errors.push('Дані квитанції не готові');
        } else {
          const { receiptData } = state;

          if (!receiptData.receiptNumber) {
            errors.push("Номер квитанції обов'язковий");
          }

          if (!receiptData.clientInfo.name) {
            errors.push("Ім'я клієнта обов'язкове");
          }

          if (!receiptData.clientInfo.phone) {
            errors.push("Телефон клієнта обов'язковий");
          }

          if (!receiptData.items || receiptData.items.length === 0) {
            errors.push('Додайте хоча б один предмет');
          }

          if (receiptData.totals.total <= 0) {
            errors.push('Сума замовлення повинна бути більше 0');
          }
        }

        get().setReceiptValidationErrors(errors);
      },

      setReceiptDataReady: (ready) => {
        set({ isReceiptDataReady: ready }, false, 'receiptGenerator/setReceiptDataReady');
      },

      // Template and settings actions
      setSelectedTemplate: (template) => {
        set({ selectedTemplate: template }, false, 'receiptGenerator/setSelectedTemplate');
      },

      setPrintSettings: (settings) => {
        set(
          (state) => ({ printSettings: { ...state.printSettings, ...settings } }),
          false,
          'receiptGenerator/setPrintSettings'
        );
      },

      setPDFSettings: (settings) => {
        set(
          (state) => ({ pdfSettings: { ...state.pdfSettings, ...settings } }),
          false,
          'receiptGenerator/setPDFSettings'
        );
      },

      // Generation actions
      generatePDF: async () => {
        const state = get();

        if (!state.isReceiptValid || !state.receiptData) {
          get().setGenerationError('Дані квитанції не готові для генерації');
          return false;
        }

        set(
          { isGenerating: true, generationError: null, generationProgress: 0 },
          false,
          'receiptGenerator/generatePDF/start'
        );

        try {
          // Симуляція процесу генерації PDF
          for (let progress = 0; progress <= 100; progress += 10) {
            get().setGenerationProgress(progress);
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          // Тут буде реальна генерація PDF
          // const pdfBlob = await generateReceiptPDF(state.receiptData, state.selectedTemplate, state.pdfSettings);

          // Мок для демонстрації
          const mockPDFContent = JSON.stringify(state.receiptData, null, 2);
          const mockBlob = new Blob([mockPDFContent], { type: 'application/pdf' });
          const mockUrl = URL.createObjectURL(mockBlob);

          get().setGeneratedPDF(mockUrl, mockBlob);

          // Генеруємо мініатюру
          const thumbnailUrl = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
          get().setThumbnailUrl(thumbnailUrl);

          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Помилка генерації PDF';
          get().setGenerationError(errorMessage);
          return false;
        } finally {
          set({ isGenerating: false }, false, 'receiptGenerator/generatePDF/complete');
        }
      },

      setGenerating: (generating) => {
        set({ isGenerating: generating }, false, 'receiptGenerator/setGenerating');
      },

      setGenerationProgress: (progress) => {
        set({ generationProgress: progress }, false, 'receiptGenerator/setGenerationProgress');
      },

      setGenerationError: (error) => {
        set({ generationError: error }, false, 'receiptGenerator/setGenerationError');
      },

      // Generated files actions
      setGeneratedPDF: (url, blob) => {
        set(
          { generatedPDFUrl: url, generatedPDFBlob: blob },
          false,
          'receiptGenerator/setGeneratedPDF'
        );
      },

      setThumbnailUrl: (url) => {
        set({ thumbnailUrl: url }, false, 'receiptGenerator/setThumbnailUrl');
      },

      downloadPDF: () => {
        const state = get();
        if (state.generatedPDFUrl && state.receiptData) {
          const link = document.createElement('a');
          link.href = state.generatedPDFUrl;
          link.download = `receipt_${state.receiptData.receiptNumber}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      },

      clearGeneratedFiles: () => {
        const state = get();

        // Очищуємо URL об'єкти для звільнення пам'яті
        if (state.generatedPDFUrl) {
          URL.revokeObjectURL(state.generatedPDFUrl);
        }
        if (state.thumbnailUrl && state.thumbnailUrl.startsWith('blob:')) {
          URL.revokeObjectURL(state.thumbnailUrl);
        }

        set(
          {
            generatedPDFUrl: null,
            generatedPDFBlob: null,
            thumbnailUrl: null,
          },
          false,
          'receiptGenerator/clearGeneratedFiles'
        );
      },

      // Print actions
      printReceipt: async () => {
        const state = get();

        if (!state.generatedPDFUrl) {
          get().setPrintError('PDF не згенеровано');
          return false;
        }

        set({ isPrinting: true, printError: null }, false, 'receiptGenerator/printReceipt/start');

        try {
          // Тут буде інтеграція з Print API або принтером
          // await printPDF(state.generatedPDFUrl, state.printSettings);

          // Мок для демонстрації
          await new Promise((resolve) => setTimeout(resolve, 2000));

          get().setPrintSuccess(true);
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Помилка друку';
          get().setPrintError(errorMessage);
          return false;
        } finally {
          set({ isPrinting: false }, false, 'receiptGenerator/printReceipt/complete');
        }
      },

      setPrinting: (printing) => {
        set({ isPrinting: printing }, false, 'receiptGenerator/setPrinting');
      },

      setPrintError: (error) => {
        set({ printError: error, printSuccess: false }, false, 'receiptGenerator/setPrintError');
      },

      setPrintSuccess: (success) => {
        set({ printSuccess: success, printError: null }, false, 'receiptGenerator/setPrintSuccess');
      },

      // Email actions
      sendReceiptByEmail: async (recipients) => {
        const state = get();

        if (!state.generatedPDFBlob) {
          get().setEmailError('PDF не згенеровано');
          return false;
        }

        if (recipients.length === 0) {
          get().setEmailError('Не вказано одержувачів');
          return false;
        }

        set(
          { isSendingEmail: true, emailError: null },
          false,
          'receiptGenerator/sendReceiptByEmail/start'
        );

        try {
          // Тут буде інтеграція з Email API
          // await sendEmailWithAttachment(recipients, state.generatedPDFBlob, state.receiptData);

          // Мок для демонстрації
          await new Promise((resolve) => setTimeout(resolve, 3000));

          get().setEmailRecipients(recipients);
          get().setEmailSent(true);
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Помилка відправки email';
          get().setEmailError(errorMessage);
          return false;
        } finally {
          set({ isSendingEmail: false }, false, 'receiptGenerator/sendReceiptByEmail/complete');
        }
      },

      setSendingEmail: (sending) => {
        set({ isSendingEmail: sending }, false, 'receiptGenerator/setSendingEmail');
      },

      setEmailSent: (sent) => {
        set({ emailSent: sent, emailError: null }, false, 'receiptGenerator/setEmailSent');
      },

      setEmailError: (error) => {
        set({ emailError: error, emailSent: false }, false, 'receiptGenerator/setEmailError');
      },

      setEmailRecipients: (recipients) => {
        set({ emailRecipients: recipients }, false, 'receiptGenerator/setEmailRecipients');
      },

      // Preview actions
      generatePreview: async () => {
        const state = get();

        if (!state.receiptData) {
          get().setPreviewError('Дані квитанції не готові');
          return;
        }

        set(
          { isPreviewLoading: true, previewError: null },
          false,
          'receiptGenerator/generatePreview/start'
        );

        try {
          // Тут буде генерація HTML прев'ю
          // const htmlPreview = await generateReceiptPreview(state.receiptData, state.selectedTemplate);

          // Мок для демонстрації
          await new Promise((resolve) => setTimeout(resolve, 800));
          const mockPreview = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>Квитанція ${state.receiptData.receiptNumber}</h2>
              <p>Клієнт: ${state.receiptData.clientInfo.name}</p>
              <p>Телефон: ${state.receiptData.clientInfo.phone}</p>
              <p>Сума: ${state.receiptData.totals.total} грн</p>
            </div>
          `;

          get().setPreviewData(mockPreview);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Помилка генерації прев'ю";
          get().setPreviewError(errorMessage);
        } finally {
          set({ isPreviewLoading: false }, false, 'receiptGenerator/generatePreview/complete');
        }
      },

      setPreviewData: (data) => {
        set({ previewData: data }, false, 'receiptGenerator/setPreviewData');
      },

      setPreviewLoading: (loading) => {
        set({ isPreviewLoading: loading }, false, 'receiptGenerator/setPreviewLoading');
      },

      setPreviewError: (error) => {
        set({ previewError: error }, false, 'receiptGenerator/setPreviewError');
      },

      // Validation actions
      setReceiptValidationErrors: (errors) => {
        set(
          {
            receiptValidationErrors: errors,
            isReceiptValid: errors.length === 0,
          },
          false,
          'receiptGenerator/setReceiptValidationErrors'
        );
      },

      clearReceiptValidationErrors: () => {
        set(
          { receiptValidationErrors: [], isReceiptValid: true },
          false,
          'receiptGenerator/clearReceiptValidationErrors'
        );
      },

      setReceiptValid: (valid) => {
        set({ isReceiptValid: valid }, false, 'receiptGenerator/setReceiptValid');
      },

      // Reset actions
      resetReceiptGenerator: () => {
        const state = get();

        // Очищуємо URL об'єкти перед reset
        if (state.generatedPDFUrl) {
          URL.revokeObjectURL(state.generatedPDFUrl);
        }
        if (state.thumbnailUrl && state.thumbnailUrl.startsWith('blob:')) {
          URL.revokeObjectURL(state.thumbnailUrl);
        }

        set(initialReceiptGeneratorState, false, 'receiptGenerator/resetReceiptGenerator');
      },
    }),
    {
      name: 'receipt-generator-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

export type ReceiptGeneratorStore = ReturnType<typeof useReceiptGeneratorStore>;
