import { CSVData, CSVOptions, ConversionResult } from '../types';
import { DEFAULT_CSV_OPTIONS, ERROR_MESSAGES, MAX_CSV_ROWS } from '../constants';
import { escapeCSVField, unescapeCSVField, createConversionError } from '../utils';

export function parseCSV(input: string, options: Partial<CSVOptions> = {}): ConversionResult<CSVData> {
  const startTime = performance.now();

  try {
    if (!input || input.trim().length === 0) {
      return {
        success: false,
        error: createConversionError(ERROR_MESSAGES.EMPTY_INPUT),
      };
    }

    const opts: CSVOptions = { ...DEFAULT_CSV_OPTIONS, ...options };
    const lines: string[] = [];
    let currentLine = '';
    let inQuotes = false;

    // Parse CSV respecting quoted fields
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const nextChar = input[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          currentLine += char;
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          currentLine += char;
        }
      } else if (char === '\n' && !inQuotes) {
        // End of line
        lines.push(currentLine);
        currentLine = '';
      } else if (char === '\r') {
        // Handle CRLF
        if (nextChar === '\n') {
          i++; // Skip LF
        }
        if (!inQuotes) {
          lines.push(currentLine);
          currentLine = '';
        } else {
          currentLine += char;
        }
      } else {
        currentLine += char;
      }
    }

    if (inQuotes) {
      return {
        success: false,
        error: createConversionError('Unclosed quote in CSV', undefined, undefined, currentLine),
      };
    }

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    if (lines.length === 0) {
      return {
        success: false,
        error: createConversionError(ERROR_MESSAGES.EMPTY_INPUT),
      };
    }

    if (lines.length > MAX_CSV_ROWS) {
      return {
        success: false,
        error: createConversionError(`CSV exceeds maximum allowed rows (${MAX_CSV_ROWS})`),
      };
    }

    // Parse fields
    const rows: CSVData = [];
    let headers: string[] = [];

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const fields: string[] = [];
      let currentField = '';
      let inQuotes2 = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
          if (inQuotes2 && nextChar === '"') {
            currentField += '"';
            i++;
          } else {
            inQuotes2 = !inQuotes2;
          }
        } else if (char === opts.delimiter && !inQuotes2) {
          fields.push(currentField);
          currentField = '';
        } else {
          currentField += char;
        }
      }

      fields.push(currentField);

      if (opts.trimWhitespace) {
        for (let i = 0; i < fields.length; i++) {
          fields[i] = unescapeCSVField(fields[i].trim());
        }
      } else {
        for (let i = 0; i < fields.length; i++) {
          fields[i] = unescapeCSVField(fields[i]);
        }
      }

      if (lineIndex === 0 && opts.hasHeader) {
        headers = fields;
      } else {
        if (opts.hasHeader && headers.length > 0) {
          const row: Record<string, string> = {};
          for (let i = 0; i < headers.length; i++) {
            row[headers[i]] = fields[i] || '';
          }
          rows.push(row);
        } else if (!opts.hasHeader) {
          const row: Record<string, string> = {};
          for (let i = 0; i < fields.length; i++) {
            row[`column_${i + 1}`] = fields[i];
          }
          rows.push(row);
        }
      }
    }

    const duration = performance.now() - startTime;

    return {
      success: true,
      content: rows,
      metadata: {
        rowCount: rows.length,
        columnCount: headers.length,
        duration: Math.round(duration),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: createConversionError(
        ERROR_MESSAGES.INVALID_CSV,
        undefined,
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      ),
    };
  }
}

export function serializeCSV(data: CSVData, options: Partial<CSVOptions> = {}): ConversionResult<string> {
  const startTime = performance.now();

  try {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        success: false,
        error: createConversionError('Invalid data format for CSV serialization'),
      };
    }

    const opts: CSVOptions = { ...DEFAULT_CSV_OPTIONS, ...options };

    const lines: string[] = [];
    const allKeys = new Set<string>();

    // Collect all unique keys
    data.forEach((row) => {
      Object.keys(row).forEach((key) => {
        allKeys.add(key);
      });
    });

    const headers = Array.from(allKeys);

    // Add header row
    const headerRow = headers.map((header) => escapeCSVField(header, opts.delimiter)).join(opts.delimiter);
    lines.push(headerRow);

    // Add data rows
    data.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header] !== undefined ? String(row[header]) : '';
        return escapeCSVField(value, opts.delimiter);
      });
      lines.push(values.join(opts.delimiter));
    });

    const csv = lines.join('\n');
    const duration = performance.now() - startTime;

    return {
      success: true,
      content: csv,
      metadata: {
        rowCount: data.length + 1, // +1 for header
        columnCount: headers.length,
        duration: Math.round(duration),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: createConversionError(
        'Failed to serialize CSV',
        undefined,
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      ),
    };
  }
}
