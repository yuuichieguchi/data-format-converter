import { ConversionError } from './types';

export function escapeCSVField(field: string, delimiter: string): string {
  const needsQuotes = field.includes(delimiter) || field.includes('"') || field.includes('\n') || field.includes('\r');

  if (!needsQuotes) {
    return field;
  }

  // Escape quotes by doubling them
  const escaped = field.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function unescapeCSVField(field: string): string {
  // Remove surrounding quotes if present
  if (field.startsWith('"') && field.endsWith('"')) {
    field = field.slice(1, -1);
  }
  // Unescape doubled quotes
  return field.replace(/""/g, '"');
}

export function createConversionError(message: string, line?: number, column?: number, context?: string): ConversionError {
  return {
    message,
    line,
    column,
    context,
  };
}

export function findJsonErrorPosition(jsonString: string): { line: number; column: number; context: string } {
  const lines = jsonString.split('\n');

  try {
    JSON.parse(jsonString);
  } catch (e) {
    if (e instanceof SyntaxError) {
      const match = e.message.match(/position (\d+)/);
      if (match) {
        const position = parseInt(match[1], 10);
        let currentPos = 0;

        for (let i = 0; i < lines.length; i++) {
          const lineLength = lines[i].length + 1; // +1 for newline
          if (currentPos + lineLength > position) {
            const column = position - currentPos;
            const context = lines[i];
            return { line: i + 1, column, context };
          }
          currentPos += lineLength;
        }
      }
    }
  }

  return { line: 1, column: 0, context: '' };
}

export function sanitizeXMLString(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function unescapeXMLString(str: string): string {
  return str
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');
}

export function detectRootElement(data: any): string {
  if (Array.isArray(data)) {
    return 'root';
  }

  if (typeof data === 'object' && data !== null) {
    const keys = Object.keys(data);
    if (keys.length === 1) {
      return keys[0];
    }
    return 'root';
  }

  return 'root';
}

export function formatXML(xml: string, indent: string = '  '): string {
  let formatted = '';
  let indentLevel = 0;
  let inTag = false;

  for (let i = 0; i < xml.length; i++) {
    const char = xml[i];

    if (char === '<') {
      inTag = true;
      if (formatted.length > 0 && formatted[formatted.length - 1] !== '\n') {
        formatted += '\n';
      }
      formatted += indent.repeat(indentLevel);

      if (xml.substring(i, i + 2) === '</') {
        indentLevel = Math.max(0, indentLevel - 1);
      }
    }

    formatted += char;

    if (char === '>' && inTag) {
      inTag = false;

      if (xml.substring(i - 1, i + 1) === '/>') {
        // Self-closing tag
      } else if (xml.substring(i - 1, i + 1) !== '?>' && xml.substring(i, i + 2) !== '</') {
        // Opening tag (not self-closing and not closing tag)
        const isOpeningTag = !xml.substring(i - 1, i + 1).includes('/');
        if (isOpeningTag) {
          indentLevel++;
        }
      }
    }
  }

  return formatted.trim();
}
