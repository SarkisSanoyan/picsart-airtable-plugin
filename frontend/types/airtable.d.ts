// Airtable UI Component Type Compatibility
declare module '@airtable/blocks/ui' {
  import React from 'react';
  
  // Override the problematic ForwardRefExoticComponent types
  export const Box: React.ComponentType<any>;
  export const TablePicker: React.ComponentType<any>;
  export const FieldPicker: React.ComponentType<any>;
  export const SelectButtons: React.ComponentType<any>;
  export const Select: React.ComponentType<any>;
  export const Switch: React.ComponentType<any>;
  
  // Add missing exports
  export const useBase: () => any;
  export const useRecords: (table: any) => any[];
  export const useGlobalConfig: () => any;
  export const initializeBlock: (component: () => React.ReactElement) => void;
  
  // Keep other exports as they are
  export * from '@airtable/blocks/ui';
} 