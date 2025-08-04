// Airtable Types
export interface AirtableAttachment {
  id: string;
  url: string;
  filename?: string;
  name?: string;
  width?: number;
  height?: number;
  size?: number;
  type?: string;
}

export interface AirtableRecord {
  id: string;
  getCellValue: (field: AirtableField) => any;
  getCellValueAsString: (field: AirtableField) => string;
}

export interface AirtableField {
  id: string;
  name: string;
  type: string;
}

export interface AirtableTable {
  id: string;
  name: string;
  primaryField: AirtableField;
  getFieldByIdIfExists: (fieldId: string | null) => AirtableField | null;
  updateRecordAsync: (recordId: string, fields: Record<string, any>) => Promise<void>;
}

export interface AirtableBase {
  id: string;
  name: string;
  getTableByIdIfExists: (tableId: string | null) => AirtableTable | null;
}

export interface AirtableGlobalConfig {
  get: (key: string) => any;
  setAsync: (key: string, value: any) => Promise<void>;
}

// Processing Action Types
export type ProcessingAction = 'remove_bg' | 'upscale' | 'process_both';

export interface ProcessingActionOption {
  value: ProcessingAction;
  label: string;
}

// Application State Types
export interface AppState {
  selectedTableId: string | null;
  selectedImageFieldId: string | null;
  selectedOutputFieldId: string | null;
  selectedAction: ProcessingAction | null;
  selectedUpscaleFactors: Record<string, number>;
  selectedImages: Record<string, number[]>;
  processingRecordId: string | null;
  processingStatus: string;
  appendMode: boolean;
}

// Context Types
export interface AppContextType extends AppState {
  // Setters
  setSelectedTableId: (id: string | null) => void;
  setSelectedImageFieldId: (id: string | null) => void;
  setSelectedOutputFieldId: (id: string | null) => void;
  setSelectedAction: (action: ProcessingAction | null) => void;
  setSelectedUpscaleFactors: (factors: Record<string, number>) => void;
  setSelectedImages: (images: Record<string, number[]>) => void;
  setProcessingRecordId: (id: string | null) => void;
  setProcessingStatus: (status: string) => void;
  setAppendMode: (mode: boolean) => void;
  
  // Helper functions
  getUpscaleFactorForRecord: (recordId: string, availableFactors: number[]) => number | null;
  setUpscaleFactorForRecord: (recordId: string, factor: number) => void;
  getSelectedImagesForRecord: (recordId: string) => number[];
  selectImageForRecord: (recordId: string, imageIndex: number) => void;
  getSelectedImageIndexForRecord: (recordId: string) => number | null;
}

// Image Processing Types
export interface UpscaleFactorLimit {
  factor: number;
  maxWidth: number;
  maxHeight: number;
}

export interface ApiConfig {
  MAX_RETRIES: number;
  BASE_TIMEOUT: number;
  PROGRESSIVE_TIMEOUT_INCREMENT: number;
  MAX_TIMEOUT: number;
  RATE_LIMIT_WAIT: {
    INITIAL: number;
    MAX: number;
  };
  ENDPOINTS: {
    REMOVE_BG: string;
    UPSCALE: string;
  };
}

export interface MaxOutputDimensions {
  WIDTH: number;
  HEIGHT: number;
}

// API Response Types
export interface PicsartAPIResponse {
  status: string;
  data?: {
    url: string;
  };
  error?: string;
  message?: string;
}

import React from 'react';

// Component Props Types
export interface LoadingSpinnerProps {
    style?: React.CSSProperties;
}

export interface ActionSelectorProps {
  value: ProcessingAction | null;
  onChange: (action: ProcessingAction | null) => void;
}

export interface CurrentSelectionProps {
  selectedAction: ProcessingAction | null;
}

export interface OutputModeSelectorProps {
  appendMode: boolean;
  onChange: (mode: boolean) => void;
}

export interface ImageFieldPickerProps {
  table: AirtableTable;
  field: AirtableField | null;
  onChange: (field: AirtableField | null) => void;
}

export interface OutputFieldPickerProps {
  table: AirtableTable;
  field: AirtableField | null;
  onChange: (field: AirtableField | null) => void;
}

export interface ImageGridProps {
  recordId: string;
  images: AirtableAttachment[];
  selectedImages: number[];
  onSelectImage: (recordId: string, imageIndex: number) => void;
  processingRecordId: string | null;
}

export interface UpscaleFactorSelectorProps {
  selectedAction: ProcessingAction | null;
  uiFactors: number[];
  currentFactor: number | null;
  onFactorChange: (recordId: string, factor: number) => void;
  recordId: string;
  width: number;
  height: number;
  processingRecordId: string | null;
}

export interface ProcessButtonProps {
  selectedAction: ProcessingAction | null;
  uiFactors: number[];
  selectedImageIndex: number | null;
  processingRecordId: string | null;
  recordId: string;
  onProcess: (record: AirtableRecord) => void;
  record: AirtableRecord;
}

export interface RecordItemProps {
  record: AirtableRecord;
  table: AirtableTable;
  imageField: AirtableField;
  outputField: AirtableField;
  onProcess: (record: AirtableRecord) => void;
}

export interface RecordListProps {
  table: AirtableTable;
  imageField: AirtableField;
  outputField: AirtableField;
  records: AirtableRecord[];
  onProcess: (record: AirtableRecord) => void;
  base: AirtableBase;
  globalConfig: AirtableGlobalConfig;
}

export interface ConfigurationContainerProps {
  globalConfig: AirtableGlobalConfig;
  table: AirtableTable | null;
  imageField: AirtableField | null;
  outputField: AirtableField | null;
}

export interface ProcessingContainerProps {
  base: AirtableBase;
  globalConfig: AirtableGlobalConfig;
  table: AirtableTable | null;
  imageField: AirtableField | null;
  outputField: AirtableField | null;
  records: AirtableRecord[];
  picsartApiKey: string;
}

// Hook Return Types
export interface UseConfigurationReturn {
  picsartApiKey: string;
}

export interface UseImageProcessingReturn {
  processImage: (record: AirtableRecord, picsartApiKey: string) => Promise<void>;
}

export interface UseAirtableDataReturn {
  // This hook doesn't return anything specific, all state is managed through context
}

// Service Types
export interface PicsartAPIServiceInterface {
  callPicsartAPI: (
    imageBlob: Blob,
    action: ProcessingAction,
    upscaleFactor: number,
    setProcessingStatus: (status: string) => void
  ) => Promise<string>;
  downloadProcessedImage: (
    imageUrl: string,
    setProcessingStatus: (status: string) => void
  ) => Promise<string>;
}

export interface AirtableServiceInterface {
  updateRecord: (
    table: AirtableTable,
    recordId: string,
    fields: Record<string, any>
  ) => Promise<void>;
  getRecordsWithImages: (
    records: AirtableRecord[],
    imageField: AirtableField
  ) => AirtableRecord[];
  getRecordsWithoutImages: (
    records: AirtableRecord[],
    imageField: AirtableField
  ) => AirtableRecord[];
}

// Utility Function Types
export type CalculateSafeUpscaleFactors = (width: number, height: number) => number[];
export type GetUIUpscaleFactors = (safeFactors: number[]) => number[];
export type GetRecordDisplayName = (
  record: AirtableRecord,
  inputImages: AirtableAttachment[],
  selectedImageIndex: number | null,
  table: AirtableTable
) => string;
export type UrlToBlob = (
  imageUrl: string,
  setProcessingStatus: (status: string) => void
) => Promise<Blob>;
export type GetProgressiveTimeout = (attempt: number) => number;
export type GetRateLimitWaitTime = (attempt: number) => number;
export type FetchWithTimeout = (
    url: string,
    options: globalThis.RequestInit,
    timeoutMs: number
) => Promise<Response>; 