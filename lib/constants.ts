import { CSVOptions, JSONOptions, XMLOptions } from './types';

export const DEFAULT_CSV_OPTIONS: CSVOptions = {
  delimiter: ',',
  hasHeader: true,
  trimWhitespace: true,
};

export const DEFAULT_JSON_OPTIONS: JSONOptions = {
  indent: 2,
  prettyPrint: true,
};

export const DEFAULT_XML_OPTIONS: XMLOptions = {
  prettyPrint: true,
  includeDeclaration: true,
};

export const ERROR_MESSAGES = {
  INVALID_JSON: 'Invalid JSON syntax',
  INVALID_CSV: 'Invalid CSV format',
  INVALID_XML: 'Invalid XML format',
  EMPTY_INPUT: 'Input cannot be empty',
  UNSUPPORTED_CONVERSION: 'This conversion is not supported',
  FILE_TOO_LARGE: 'File is too large (max 10MB)',
  INVALID_FILE_TYPE: 'Invalid file type',
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_CSV_ROWS = 100000;
export const MAX_XML_DEPTH = 100;
export const MAX_PROCESSING_TIME = 5000; // 5 seconds

export const SUPPORTED_FORMATS = ['csv', 'json', 'xml'] as const;

export const SUPPORTED_CONVERSIONS: Record<string, string[]> = {
  csv: ['json', 'xml'],
  json: ['csv', 'xml'],
  xml: ['csv', 'json'],
};
