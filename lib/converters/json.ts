import { JSONOptions, ConversionResult, ConversionError } from '../types';
import { DEFAULT_JSON_OPTIONS, ERROR_MESSAGES } from '../constants';
import { createConversionError, findJsonErrorPosition } from '../utils';

export function parseJSON(input: string): ConversionResult<unknown> {
  const startTime = performance.now();

  try {
    if (!input || input.trim().length === 0) {
      return {
        success: false,
        error: createConversionError(ERROR_MESSAGES.EMPTY_INPUT),
      };
    }

    const parsed = JSON.parse(input);
    const duration = performance.now() - startTime;

    return {
      success: true,
      content: parsed,
      metadata: {
        duration: Math.round(duration),
      },
    };
  } catch (error) {
    let message = ERROR_MESSAGES.INVALID_JSON;
    let context = '';

    if (error instanceof SyntaxError) {
      message = error.message;
      const position = findJsonErrorPosition(input);
      context = position.context;

      return {
        success: false,
        error: createConversionError(message, position.line, position.column, context),
      };
    }

    return {
      success: false,
      error: createConversionError(message, undefined, undefined, error instanceof Error ? error.message : ''),
    };
  }
}

export function serializeJSON(data: unknown, options: Partial<JSONOptions> = {}): ConversionResult<string> {
  const startTime = performance.now();

  try {
    const opts: JSONOptions = { ...DEFAULT_JSON_OPTIONS, ...options };

    if (!opts.prettyPrint) {
      const json = JSON.stringify(data);
      const duration = performance.now() - startTime;

      return {
        success: true,
        content: json,
        metadata: {
          duration: Math.round(duration),
        },
      };
    }

    const json = JSON.stringify(data, null, opts.indent);
    const duration = performance.now() - startTime;

    return {
      success: true,
      content: json,
      metadata: {
        duration: Math.round(duration),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: createConversionError(
        'Failed to serialize to JSON',
        undefined,
        undefined,
        error instanceof Error ? error.message : ''
      ),
    };
  }
}

export function validateJSON(input: string): { valid: boolean; error?: ConversionError } {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (error) {
    if (error instanceof SyntaxError) {
      const position = findJsonErrorPosition(input);
      return {
        valid: false,
        error: createConversionError(error.message, position.line, position.column, position.context),
      };
    }

    return {
      valid: false,
      error: createConversionError(
        ERROR_MESSAGES.INVALID_JSON,
        undefined,
        undefined,
        error instanceof Error ? error.message : ''
      ),
    };
  }
}

export function isValidJSONArray(data: unknown): data is any[] {
  return Array.isArray(data);
}

export function isValidJSONObject(data: unknown): data is Record<string, any> {
  return typeof data === 'object' && data !== null && !Array.isArray(data);
}
