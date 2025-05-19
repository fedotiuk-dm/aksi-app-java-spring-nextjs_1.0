/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderDetailedSummaryResponse = {
    description: `Детальний підсумок замовлення для етапу перегляду та підтвердження`,
    properties: {
        id: {
            type: 'string',
            description: `ID замовлення`,
            format: 'uuid',
        },
        receiptNumber: {
            type: 'string',
            description: `Номер квитанції замовлення`,
        },
        tagNumber: {
            type: 'string',
            description: `Номер мітки замовлення`,
        },
        client: {
            type: 'ClientResponse',
            description: `Детальна інформація про клієнта`,
        },
        branchLocation: {
            type: 'BranchLocationDTO',
            description: `Філія, в якій оформлено замовлення`,
        },
        items: {
            type: 'array',
            contains: {
                type: 'OrderItemDetailedDTO',
            },
        },
        totalAmount: {
            type: 'number',
            description: `Загальна вартість замовлення до знижок`,
        },
        discountAmount: {
            type: 'number',
            description: `Сума знижки`,
        },
        expediteSurchargeAmount: {
            type: 'number',
            description: `Сума надбавки за терміновість`,
        },
        finalAmount: {
            type: 'number',
            description: `Фінальна вартість замовлення з урахуванням знижок та надбавок`,
        },
        prepaymentAmount: {
            type: 'number',
            description: `Сума передоплати`,
        },
        balanceAmount: {
            type: 'number',
            description: `Сума до сплати при отриманні`,
        },
        expediteType: {
            type: 'Enum',
        },
        expectedCompletionDate: {
            type: 'string',
            description: `Очікувана дата виконання замовлення`,
            format: 'date-time',
        },
        createdDate: {
            type: 'string',
            description: `Дата створення замовлення`,
            format: 'date-time',
        },
        customerNotes: {
            type: 'string',
            description: `Примітки клієнта`,
        },
        discountType: {
            type: 'string',
            description: `Тип знижки`,
        },
        discountPercentage: {
            type: 'number',
            description: `Відсоток знижки`,
            format: 'int32',
        },
    },
} as const;
