export * from './item-manager';
export * from './substep1';
export * from './substep2';
export * from './substep3';
export * from './substep4';
export * from './substep5';
export * from './workflow';

// Workflow з підетапів (експорт під унікальними іменами)
export * as Substep1Workflow from './substep1/workflow';
export * as Substep2Workflow from './substep2/workflow';
export * as Substep3Workflow from './substep3/workflow';
export * as Substep4Workflow from './substep4/workflow';
export * as Substep5Workflow from './substep5/workflow';
