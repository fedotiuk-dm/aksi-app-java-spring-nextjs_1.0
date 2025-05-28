/**
 * @fileoverview Legal Aspects Slice Store - Zustand store для юридичних аспектів замовлення
 * @module domain/wizard/store/stage-4
 * @author AKSI Team
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Типи документів для ознайомлення
 */
export enum LegalDocumentType {
  TERMS_OF_SERVICE = 'TERMS_OF_SERVICE',
  LIABILITY_WAIVER = 'LIABILITY_WAIVER',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  QUALITY_GUARANTEE = 'QUALITY_GUARANTEE',
  DAMAGE_POLICY = 'DAMAGE_POLICY',
}

/**
 * Інтерфейс юридичного документа
 */
interface LegalDocument {
  type: LegalDocumentType;
  title: string;
  content: string;
  version: string;
  lastUpdated: Date;
  isRequired: boolean;
  url?: string;
}

/**
 * Інтерфейс цифрового підпису
 */
interface DigitalSignature {
  signatureData: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  isValid: boolean;
}

/**
 * Інтерфейс підтвердження ризиків
 */
interface RiskAcknowledgment {
  riskType: string;
  description: string;
  isAcknowledged: boolean;
  clientConfirmation: string;
  timestamp: Date;
}

/**
 * Стан юридичних аспектів (Stage 4.2)
 */
interface LegalAspectsState {
  // Legal documents
  availableDocuments: LegalDocument[];
  viewedDocuments: LegalDocumentType[];
  acknowledgedDocuments: LegalDocumentType[];

  // Terms acceptance
  hasAcceptedTerms: boolean;
  termsAcceptanceTimestamp: Date | null;
  requiresTermsAcceptance: boolean;

  // Digital signature
  clientSignature: DigitalSignature | null;
  isSignaturePadActive: boolean;
  signatureImageData: string | null;
  signatureValidationError: string | null;

  // Risk acknowledgments
  identifiedRisks: RiskAcknowledgment[];
  customRisks: string[];
  riskAcknowledgmentText: string;

  // Liability waivers
  liabilityWaivers: string[];
  waiverConfirmations: Record<string, boolean>;
  customWaiverText: string;

  // Quality disclaimers
  qualityDisclaimers: string[];
  hasNoGuaranteeItems: boolean;
  noGuaranteeReasons: string[];

  // GDPR and privacy
  hasConsentedToDataProcessing: boolean;
  dataProcessingPurpose: string[];
  marketingConsent: boolean;

  // Validation
  legalValidationErrors: string[];
  isLegallyValid: boolean;
  allRequiredDocumentsViewed: boolean;
}

/**
 * Дії для юридичних аспектів
 */
interface LegalAspectsActions {
  // Legal documents actions
  setAvailableDocuments: (documents: LegalDocument[]) => void;
  markDocumentAsViewed: (documentType: LegalDocumentType) => void;
  acknowledgeDocument: (documentType: LegalDocumentType) => void;
  openDocument: (documentType: LegalDocumentType) => void;

  // Terms acceptance actions
  setAcceptedTerms: (accepted: boolean) => void;
  setRequiresTermsAcceptance: (required: boolean) => void;
  recordTermsAcceptance: () => void;

  // Digital signature actions
  setSignaturePadActive: (active: boolean) => void;
  saveSignature: (signatureData: string) => void;
  setSignatureImageData: (imageData: string | null) => void;
  validateSignature: () => void;
  clearSignature: () => void;
  setSignatureValidationError: (error: string | null) => void;

  // Risk acknowledgments actions
  addIdentifiedRisk: (risk: RiskAcknowledgment) => void;
  removeIdentifiedRisk: (riskType: string) => void;
  acknowledgeRisk: (riskType: string, confirmation: string) => void;
  addCustomRisk: (risk: string) => void;
  removeCustomRisk: (risk: string) => void;
  setRiskAcknowledgmentText: (text: string) => void;

  // Liability waivers actions
  setLiabilityWaivers: (waivers: string[]) => void;
  confirmWaiver: (waiver: string, confirmed: boolean) => void;
  setCustomWaiverText: (text: string) => void;

  // Quality disclaimers actions
  setQualityDisclaimers: (disclaimers: string[]) => void;
  setHasNoGuaranteeItems: (hasItems: boolean) => void;
  addNoGuaranteeReason: (reason: string) => void;
  removeNoGuaranteeReason: (reason: string) => void;

  // GDPR and privacy actions
  setConsentedToDataProcessing: (consented: boolean) => void;
  setDataProcessingPurpose: (purposes: string[]) => void;
  setMarketingConsent: (consent: boolean) => void;

  // Validation actions
  setLegalValidationErrors: (errors: string[]) => void;
  clearLegalValidationErrors: () => void;
  validateLegalCompliance: () => void;
  setLegallyValid: (valid: boolean) => void;
  checkAllRequiredDocumentsViewed: () => void;

  // Utility actions
  generateLegalSummary: () => string;
  exportLegalData: () => object;

  // Reset actions
  resetLegalAspects: () => void;
}

/**
 * Початковий стан юридичних аспектів
 */
const initialLegalAspectsState: LegalAspectsState = {
  availableDocuments: [],
  viewedDocuments: [],
  acknowledgedDocuments: [],
  hasAcceptedTerms: false,
  termsAcceptanceTimestamp: null,
  requiresTermsAcceptance: true,
  clientSignature: null,
  isSignaturePadActive: false,
  signatureImageData: null,
  signatureValidationError: null,
  identifiedRisks: [],
  customRisks: [],
  riskAcknowledgmentText: '',
  liabilityWaivers: [],
  waiverConfirmations: {},
  customWaiverText: '',
  qualityDisclaimers: [],
  hasNoGuaranteeItems: false,
  noGuaranteeReasons: [],
  hasConsentedToDataProcessing: false,
  dataProcessingPurpose: [],
  marketingConsent: false,
  legalValidationErrors: [],
  isLegallyValid: false,
  allRequiredDocumentsViewed: false,
};

/**
 * Legal Aspects Slice Store
 *
 * Відповідальність:
 * - Управління юридичними документами та угодами
 * - Обробка цифрових підписів клієнтів
 * - Підтвердження ризиків та відмов від гарантій
 * - GDPR та конфіденційність даних
 * - Валідація юридичної відповідності
 * - Генерація юридичного резюме
 *
 * Інтеграція:
 * - API для отримання юридичних документів
 * - Цифровий підпис (canvas, електронний підпис)
 * - GDPR сервіси для обробки згоди
 * - Логування юридичних дій
 */
export const useLegalAspectsStore = create<LegalAspectsState & LegalAspectsActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialLegalAspectsState,

      // Legal documents actions
      setAvailableDocuments: (documents) => {
        set({ availableDocuments: documents }, false, 'legalAspects/setAvailableDocuments');
        get().checkAllRequiredDocumentsViewed();
      },

      markDocumentAsViewed: (documentType) => {
        set(
          (state) => ({
            viewedDocuments: state.viewedDocuments.includes(documentType)
              ? state.viewedDocuments
              : [...state.viewedDocuments, documentType],
          }),
          false,
          'legalAspects/markDocumentAsViewed'
        );
        get().checkAllRequiredDocumentsViewed();
        get().validateLegalCompliance();
      },

      acknowledgeDocument: (documentType) => {
        set(
          (state) => ({
            acknowledgedDocuments: state.acknowledgedDocuments.includes(documentType)
              ? state.acknowledgedDocuments
              : [...state.acknowledgedDocuments, documentType],
          }),
          false,
          'legalAspects/acknowledgeDocument'
        );
        get().validateLegalCompliance();
      },

      openDocument: (documentType) => {
        // Відкриваємо документ для перегляду
        get().markDocumentAsViewed(documentType);

        // Тут може бути логіка відкриття документа в модальному вікні або новій вкладці
        const document = get().availableDocuments.find((doc) => doc.type === documentType);
        if (document?.url) {
          window.open(document.url, '_blank');
        }
      },

      // Terms acceptance actions
      setAcceptedTerms: (accepted) => {
        set({ hasAcceptedTerms: accepted }, false, 'legalAspects/setAcceptedTerms');

        if (accepted) {
          get().recordTermsAcceptance();
        } else {
          set(
            { termsAcceptanceTimestamp: null },
            false,
            'legalAspects/setAcceptedTerms/clearTimestamp'
          );
        }

        get().validateLegalCompliance();
      },

      setRequiresTermsAcceptance: (required) => {
        set(
          { requiresTermsAcceptance: required },
          false,
          'legalAspects/setRequiresTermsAcceptance'
        );
      },

      recordTermsAcceptance: () => {
        set({ termsAcceptanceTimestamp: new Date() }, false, 'legalAspects/recordTermsAcceptance');
      },

      // Digital signature actions
      setSignaturePadActive: (active) => {
        set({ isSignaturePadActive: active }, false, 'legalAspects/setSignaturePadActive');
      },

      saveSignature: (signatureData) => {
        const signature: DigitalSignature = {
          signatureData,
          timestamp: new Date(),
          ipAddress: '127.0.0.1', // В реальному застосунку отримується з API
          userAgent: navigator.userAgent,
          isValid: true,
        };

        set(
          {
            clientSignature: signature,
            signatureImageData: signatureData,
            isSignaturePadActive: false,
          },
          false,
          'legalAspects/saveSignature'
        );

        get().validateSignature();
        get().validateLegalCompliance();
      },

      setSignatureImageData: (imageData) => {
        set({ signatureImageData: imageData }, false, 'legalAspects/setSignatureImageData');
      },

      validateSignature: () => {
        const state = get();
        let error = null;

        if (state.clientSignature) {
          // Перевіряємо мінімальну довжину підпису
          if (state.clientSignature.signatureData.length < 100) {
            error = 'Підпис занадто короткий. Будь ласка, підпишіться повніше.';
          }

          // Перевіряємо час підпису (не може бути в майбутньому)
          if (state.clientSignature.timestamp > new Date()) {
            error = 'Неправильна дата підпису';
          }
        }

        get().setSignatureValidationError(error);
      },

      clearSignature: () => {
        set(
          {
            clientSignature: null,
            signatureImageData: null,
            signatureValidationError: null,
          },
          false,
          'legalAspects/clearSignature'
        );
        get().validateLegalCompliance();
      },

      setSignatureValidationError: (error) => {
        set({ signatureValidationError: error }, false, 'legalAspects/setSignatureValidationError');
      },

      // Risk acknowledgments actions
      addIdentifiedRisk: (risk) => {
        set(
          (state) => ({ identifiedRisks: [...state.identifiedRisks, risk] }),
          false,
          'legalAspects/addIdentifiedRisk'
        );
        get().validateLegalCompliance();
      },

      removeIdentifiedRisk: (riskType) => {
        set(
          (state) => ({
            identifiedRisks: state.identifiedRisks.filter((risk) => risk.riskType !== riskType),
          }),
          false,
          'legalAspects/removeIdentifiedRisk'
        );
        get().validateLegalCompliance();
      },

      acknowledgeRisk: (riskType, confirmation) => {
        set(
          (state) => ({
            identifiedRisks: state.identifiedRisks.map((risk) =>
              risk.riskType === riskType
                ? {
                    ...risk,
                    isAcknowledged: true,
                    clientConfirmation: confirmation,
                    timestamp: new Date(),
                  }
                : risk
            ),
          }),
          false,
          'legalAspects/acknowledgeRisk'
        );
        get().validateLegalCompliance();
      },

      addCustomRisk: (risk) => {
        set(
          (state) => ({
            customRisks: state.customRisks.includes(risk)
              ? state.customRisks
              : [...state.customRisks, risk],
          }),
          false,
          'legalAspects/addCustomRisk'
        );
      },

      removeCustomRisk: (risk) => {
        set(
          (state) => ({ customRisks: state.customRisks.filter((r) => r !== risk) }),
          false,
          'legalAspects/removeCustomRisk'
        );
      },

      setRiskAcknowledgmentText: (text) => {
        set({ riskAcknowledgmentText: text }, false, 'legalAspects/setRiskAcknowledgmentText');
      },

      // Liability waivers actions
      setLiabilityWaivers: (waivers) => {
        set({ liabilityWaivers: waivers }, false, 'legalAspects/setLiabilityWaivers');
      },

      confirmWaiver: (waiver, confirmed) => {
        set(
          (state) => ({
            waiverConfirmations: { ...state.waiverConfirmations, [waiver]: confirmed },
          }),
          false,
          'legalAspects/confirmWaiver'
        );
        get().validateLegalCompliance();
      },

      setCustomWaiverText: (text) => {
        set({ customWaiverText: text }, false, 'legalAspects/setCustomWaiverText');
      },

      // Quality disclaimers actions
      setQualityDisclaimers: (disclaimers) => {
        set({ qualityDisclaimers: disclaimers }, false, 'legalAspects/setQualityDisclaimers');
      },

      setHasNoGuaranteeItems: (hasItems) => {
        set({ hasNoGuaranteeItems: hasItems }, false, 'legalAspects/setHasNoGuaranteeItems');

        // Очищуємо причини якщо немає предметів без гарантії
        if (!hasItems) {
          set(
            { noGuaranteeReasons: [] },
            false,
            'legalAspects/setHasNoGuaranteeItems/clearReasons'
          );
        }

        get().validateLegalCompliance();
      },

      addNoGuaranteeReason: (reason) => {
        set(
          (state) => ({
            noGuaranteeReasons: state.noGuaranteeReasons.includes(reason)
              ? state.noGuaranteeReasons
              : [...state.noGuaranteeReasons, reason],
          }),
          false,
          'legalAspects/addNoGuaranteeReason'
        );
      },

      removeNoGuaranteeReason: (reason) => {
        set(
          (state) => ({
            noGuaranteeReasons: state.noGuaranteeReasons.filter((r) => r !== reason),
          }),
          false,
          'legalAspects/removeNoGuaranteeReason'
        );
      },

      // GDPR and privacy actions
      setConsentedToDataProcessing: (consented) => {
        set(
          { hasConsentedToDataProcessing: consented },
          false,
          'legalAspects/setConsentedToDataProcessing'
        );
        get().validateLegalCompliance();
      },

      setDataProcessingPurpose: (purposes) => {
        set({ dataProcessingPurpose: purposes }, false, 'legalAspects/setDataProcessingPurpose');
      },

      setMarketingConsent: (consent) => {
        set({ marketingConsent: consent }, false, 'legalAspects/setMarketingConsent');
      },

      // Validation actions
      setLegalValidationErrors: (errors) => {
        set(
          {
            legalValidationErrors: errors,
            isLegallyValid: errors.length === 0,
          },
          false,
          'legalAspects/setLegalValidationErrors'
        );
      },

      clearLegalValidationErrors: () => {
        set(
          { legalValidationErrors: [], isLegallyValid: true },
          false,
          'legalAspects/clearLegalValidationErrors'
        );
      },

      validateLegalCompliance: () => {
        const state = get();
        const errors: string[] = [];

        // Валідація прийняття умов
        if (state.requiresTermsAcceptance && !state.hasAcceptedTerms) {
          errors.push('Необхідно прийняти умови надання послуг');
        }

        // Валідація цифрового підпису
        if (!state.clientSignature) {
          errors.push('Необхідний цифровий підпис клієнта');
        } else if (state.signatureValidationError) {
          errors.push(state.signatureValidationError);
        }

        // Валідація ризиків
        const unacknowledgedRisks = state.identifiedRisks.filter((risk) => !risk.isAcknowledged);
        if (unacknowledgedRisks.length > 0) {
          errors.push(`Не підтверджено ${unacknowledgedRisks.length} ризик(ів)`);
        }

        // Валідація відмов від гарантій
        if (state.hasNoGuaranteeItems && state.noGuaranteeReasons.length === 0) {
          errors.push('Вкажіть причини відсутності гарантій');
        }

        // Валідація GDPR
        if (!state.hasConsentedToDataProcessing) {
          errors.push('Необхідна згода на обробку персональних даних');
        }

        // Валідація обов'язкових документів
        if (!state.allRequiredDocumentsViewed) {
          errors.push("Не переглянуто всі обов'язкові документи");
        }

        get().setLegalValidationErrors(errors);
      },

      setLegallyValid: (valid) => {
        set({ isLegallyValid: valid }, false, 'legalAspects/setLegallyValid');
      },

      checkAllRequiredDocumentsViewed: () => {
        const state = get();
        const requiredDocuments = state.availableDocuments.filter((doc) => doc.isRequired);
        const requiredDocumentTypes = requiredDocuments.map((doc) => doc.type);

        const allViewed = requiredDocumentTypes.every((type) =>
          state.viewedDocuments.includes(type)
        );

        set(
          { allRequiredDocumentsViewed: allViewed },
          false,
          'legalAspects/checkAllRequiredDocumentsViewed'
        );
      },

      // Utility actions
      generateLegalSummary: () => {
        const state = get();
        const summary = {
          termsAccepted: state.hasAcceptedTerms,
          termsAcceptanceTime: state.termsAcceptanceTimestamp?.toISOString(),
          signatureProvided: !!state.clientSignature,
          signatureTime: state.clientSignature?.timestamp.toISOString(),
          risksCount: state.identifiedRisks.length,
          acknowledgedRisks: state.identifiedRisks.filter((r) => r.isAcknowledged).length,
          dataProcessingConsent: state.hasConsentedToDataProcessing,
          marketingConsent: state.marketingConsent,
          documentsSigned: state.acknowledgedDocuments.length,
        };

        return JSON.stringify(summary, null, 2);
      },

      exportLegalData: () => {
        const state = get();
        return {
          termsAcceptance: {
            accepted: state.hasAcceptedTerms,
            timestamp: state.termsAcceptanceTimestamp,
          },
          signature: state.clientSignature,
          risks: state.identifiedRisks,
          waivers: state.waiverConfirmations,
          gdprConsent: {
            dataProcessing: state.hasConsentedToDataProcessing,
            purposes: state.dataProcessingPurpose,
            marketing: state.marketingConsent,
          },
          documents: {
            viewed: state.viewedDocuments,
            acknowledged: state.acknowledgedDocuments,
          },
        };
      },

      // Reset actions
      resetLegalAspects: () => {
        set(initialLegalAspectsState, false, 'legalAspects/resetLegalAspects');
      },
    }),
    {
      name: 'legal-aspects-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

export type LegalAspectsStore = ReturnType<typeof useLegalAspectsStore>;
