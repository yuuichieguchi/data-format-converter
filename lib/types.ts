export type ConversionFormat = 'csv' | 'json' | 'xml';

export interface ConversionError {
  message: string;
  line?: number;
  column?: number;
  context?: string;
  code?: string;
}

export interface ConversionResult<T = string> {
  success: boolean;
  content?: T;
  error?: ConversionError;
  metadata?: {
    rowCount?: number;
    columnCount?: number;
    duration?: number;
  };
}

export interface CSVOptions {
  delimiter: ',' | ';' | '\t';
  hasHeader: boolean;
  trimWhitespace: boolean;
}

export interface JSONOptions {
  indent: 2 | 4;
  prettyPrint: boolean;
}

export interface XMLOptions {
  prettyPrint: boolean;
  rootElement?: string;
  includeDeclaration: boolean;
}

export interface ConversionRequest {
  input: string;
  fromFormat: ConversionFormat;
  toFormat: ConversionFormat;
  csvOptions?: Partial<CSVOptions>;
  jsonOptions?: Partial<JSONOptions>;
  xmlOptions?: Partial<XMLOptions>;
}

export type CSVData = Record<string, string>[];

export type XMLNodeValue = string | number | boolean | null | XMLNode | XMLNode[];

export interface XMLNode {
  [key: string]: XMLNodeValue;
}
