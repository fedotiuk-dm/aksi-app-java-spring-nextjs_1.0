/**
 * @fileoverview Хук для генерації квитанцій (крок 4.2)
 * @module domain/wizard/hooks/stage-4
 */

import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { useWizardStore } from '../../store';

/**
 * Структура квитанції
 */
interface Receipt {
  // Заголовок
  header: {
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    branchName: string;
    operatorName: string;
  };

  // Інформація про замовлення
  orderInfo: {
    receiptNumber: string;
    uniqueLabel: string;
    creationDate: Date;
    estimatedDate: Date;
  };

  // Клієнт
  clientInfo: {
    fullName: string;
    phone: string;
    email?: string;
    address?: string;
    contactMethods: string[];
  };

  // Предмети
  items: any[];

  // Фінанси
  financial: {
    itemsTotal: number;
    urgencyAmount: number;
    discountAmount: number;
    finalTotal: number;
    paidAmount: number;
    debtAmount: number;
    paymentMethod: string;
  };

  // Юридична інформація
  legal: {
    terms: string[];
    riskWarnings: string[];
    hasClientSignature: boolean;
  };
}

/**
 * Хук для генерації квитанцій
 * 🧾 Композиція: генерація + форматування + друк
 */
export const useReceiptGeneration = () => {
  // 🏪 Zustand - отримуємо всі дані
  const {
    selectedClient,
    selectedBranch,
    orderItems,
    executionParams,
    selectedDiscount,
    addError,
    addWarning,
  } = useWizardStore();

  // 🧾 Генерація структури квитанції
  const generateReceiptData = useCallback((): Receipt | null => {
    if (!selectedClient || !selectedBranch || !orderItems) {
      return null;
    }

    // Розрахунок фінансової частини
    const itemsTotal = orderItems.reduce(
      (sum: number, item: any) => sum + (item.finalPrice || 0),
      0
    );
    const urgencyAmount = executionParams?.urgencyPricing?.additionalCost || 0;
    const discountAmount = selectedDiscount?.amount || 0;
    const finalTotal = itemsTotal + urgencyAmount - discountAmount;

    // Генерація номера квитанції (мок логіка)
    const receiptNumber = `RC-${Date.now().toString().slice(-6)}`;
    const uniqueLabel = `UL-${Date.now().toString().slice(-4)}`;

    return {
      header: {
        companyName: 'Хімчистка АКSI',
        companyAddress: 'м. Київ, вул. Прикладна 1',
        companyPhone: '+380 44 000 00 00',
        branchName: selectedBranch.name || 'Головний офіс',
        operatorName: 'Оператор',
      },

      orderInfo: {
        receiptNumber,
        uniqueLabel,
        creationDate: new Date(),
        estimatedDate: executionParams?.executionDate || new Date(),
      },

      clientInfo: {
        fullName: selectedClient.fullName || '',
        phone: selectedClient.phone || '',
        email: selectedClient.email,
        address: selectedClient.address,
        contactMethods: ['телефон'],
      },

      items: orderItems,

      financial: {
        itemsTotal,
        urgencyAmount,
        discountAmount,
        finalTotal,
        paidAmount: 0, // буде оновлено з payment processing
        debtAmount: finalTotal,
        paymentMethod: 'готівка',
      },

      legal: {
        terms: [
          'Послуги надаються згідно з державними стандартами',
          'Компанія не несе відповідальності за предмети з природними дефектами',
          'Термін зберігання готових виробів - 30 днів',
        ],
        riskWarnings: orderItems
          .filter(
            (item: any) =>
              item.defects?.includes('без_гарантій') || item.risks?.includes('ризики_зміни_кольору')
          )
          .map((item: any) => `Предмет "${item.name}" має підвищені ризики`),
        hasClientSignature: false,
      },
    };
  }, [selectedClient, selectedBranch, orderItems, executionParams, selectedDiscount]);

  // 🧾 Мутація для генерації квитанції
  const generateReceiptMutation = useMutation({
    mutationFn: async (): Promise<Receipt> => {
      const receiptData = generateReceiptData();
      if (!receiptData) {
        throw new Error("Неможливо згенерувати квитанцію - відсутні обов'язкові дані");
      }

      // Мок затримка для імітації генерації
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return receiptData;
    },
    onSuccess: () => {
      addWarning('Квитанція успішно згенерована');
    },
    onError: (error) => {
      addError(`Помилка генерації квитанції: ${error.message}`);
    },
  });

  // 🖨️ Мутація для друку квитанції
  const printReceiptMutation = useMutation({
    mutationFn: async (receipt: Receipt): Promise<void> => {
      // Мок логіка друку
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Тут буде інтеграція з принтером
      console.log('Друк квитанції:', receipt);
    },
    onSuccess: () => {
      addWarning('Квитанція надіслана на друк');
    },
    onError: (error) => {
      addError(`Помилка друку: ${error.message}`);
    },
  });

  // 📧 Мутація для відправки PDF
  const sendPdfMutation = useMutation({
    mutationFn: async ({ receipt, email }: { receipt: Receipt; email: string }): Promise<void> => {
      if (!email) {
        throw new Error('Email не вказано');
      }

      // Мок логіка відправки
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log(`Відправка PDF на ${email}:`, receipt);
    },
    onSuccess: (_, { email }) => {
      addWarning(`PDF відправлено на ${email}`);
    },
    onError: (error) => {
      addError(`Помилка відправки PDF: ${error.message}`);
    },
  });

  // 🔧 Методи роботи з квитанціями
  const generateAndPrint = useCallback(async () => {
    try {
      const receipt = await generateReceiptMutation.mutateAsync();
      await printReceiptMutation.mutateAsync(receipt);
      return receipt;
    } catch (error) {
      addError('Не вдалося згенерувати та надрукувати квитанцію');
      throw error;
    }
  }, [generateReceiptMutation, printReceiptMutation, addError]);

  const generateAndEmail = useCallback(
    async (email: string) => {
      try {
        const receipt = await generateReceiptMutation.mutateAsync();
        await sendPdfMutation.mutateAsync({ receipt, email });
        return receipt;
      } catch (error) {
        addError('Не вдалося згенерувати та відправити квитанцію');
        throw error;
      }
    },
    [generateReceiptMutation, sendPdfMutation, addError]
  );

  // 📊 Інформація про генерацію
  const generationInfo = useMemo(
    () => ({
      canGenerate: !!(selectedClient && selectedBranch && orderItems && orderItems.length > 0),
      isGenerating: generateReceiptMutation.isPending,
      isPrinting: printReceiptMutation.isPending,
      isSending: sendPdfMutation.isPending,
      isAnyOperation:
        generateReceiptMutation.isPending ||
        printReceiptMutation.isPending ||
        sendPdfMutation.isPending,
    }),
    [
      selectedClient,
      selectedBranch,
      orderItems,
      generateReceiptMutation.isPending,
      printReceiptMutation.isPending,
      sendPdfMutation.isPending,
    ]
  );

  // 🔍 Попередній перегляд квитанції
  const getReceiptPreview = useCallback(() => {
    return generateReceiptData();
  }, [generateReceiptData]);

  return {
    // 🧾 Дані квитанції
    getReceiptPreview,
    generationInfo,

    // 🔄 Операції
    generateReceipt: generateReceiptMutation.mutateAsync,
    printReceipt: printReceiptMutation.mutateAsync,
    sendPdfReceipt: sendPdfMutation.mutateAsync,

    // 🔧 Комбіновані методи
    generateAndPrint,
    generateAndEmail,

    // 🔄 Стани
    isGenerating: generateReceiptMutation.isPending,
    isPrinting: printReceiptMutation.isPending,
    isSending: sendPdfMutation.isPending,
  };
};
