/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $WorkflowMap = {
    properties: {
        description: {
            type: 'string',
        },
        steps: {
            type: 'array',
            contains: {
                type: 'WorkflowStep',
            },
        },
        note: {
            type: 'string',
        },
    },
} as const;
