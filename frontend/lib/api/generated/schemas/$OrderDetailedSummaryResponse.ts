/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderDetailedSummaryResponse = {
    description: `Детальний підсумок замовлення для етапу перегляду та підтвердження`,
    properties: {
        balanceAmount: {
            type: 'number',
            description: `Сума до сплати при отриманні`,
        },
        branchLocation: {
            type: 'BranchLocationDTO',
            description: `Філія, в якій оформлено замовлення`,
        },
        client: {
            type: 'ClientResponse',
            description: `Детальна інформація про клієнта`,
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
        discountAmount: {
            type: 'number',
            description: `Сума знижки`,
        },
        discountPercentage: {
            type: 'number',
            description: `Відсоток знижки`,
            format: 'int32',
        },
        discountType: {
            type: 'string',
            description: `Тип знижки`,
        },
        expectedCompletionDate: {
            type: 'string',
            description: `Очікувана дата виконання замовлення`,
            format: 'date-time',
        },
        expediteSurchargeAmount: {
            type: 'number',
            description: `Сума надбавки за терміновість`,
        },
        expediteType: {
            type: 'Enum',
        },
        finalAmount: {
            type: 'number',
            description: `Фінальна вартість замовлення з урахуванням знижок та надбавок`,
        },
        id: {
            type: 'string',
            description: `ID замовлення`,
            format: 'uuid',
        },
        items: {
            type: 'array',
            contains: {
                type: 'OrderItemDetailedDTO',
            },
        },
        prepaymentAmount: {
            type: 'number',
            description: `Сума передоплати`,
        },
        receiptNumber: {
            type: 'string',
            description: `Номер квитанції замовлення`,
        },
        tagNumber: {
            type: 'string',
            description: `Номер мітки замовлення`,
        },
        totalAmount: {
            type: 'number',
            description: `Загальна вартість замовлення до знижок`,
        },
    },
} as const;
