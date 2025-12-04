import { XMLOptions, ConversionResult, XMLNode } from '../types';
import { DEFAULT_XML_OPTIONS, ERROR_MESSAGES } from '../constants';
import { createConversionError, sanitizeXMLString } from '../utils';

// Simple XML parser that doesn't require external libraries for basic use
function simpleParseXML(xmlString: string): XMLNode {
  const stack: XMLNode[] = [{}];
  const root: XMLNode = {};
  let current = root;

  // Regex to match XML tags and content
  const tagRegex = /<([^/?!][^\s>]*)((?:\s+[^\s=]+="[^"]*")*)\s*\/?>/g;
  const closeTagRegex = /<\/([^>]+)>/g;
  const attribRegex = /\s+([^\s=]+)="([^"]*)"/g;

  let lastIndex = 0;
  let match;

  while ((match = tagRegex.exec(xmlString)) !== null) {
    const tagName = match[1];
    const attributes = match[2];
    const fullMatch = match[0];
    const startIndex = match.index;

    // Check if this is a self-closing tag
    const isSelfClosing = fullMatch.endsWith('/>');

    if (startIndex > lastIndex) {
      const text = xmlString.substring(lastIndex, startIndex).trim();
      if (text && current) {
        current['#text'] = text;
      }
    }

    // Parse attributes
    const attrs: Record<string, string> = {};
    let attrMatch;
    while ((attrMatch = attribRegex.exec(attributes)) !== null) {
      attrs['@' + attrMatch[1]] = attrMatch[2];
    }

    // Create element
    const element: XMLNode = { ...attrs };

    if (current && typeof current === 'object') {
      if (tagName in current) {
        // Handle multiple elements with same name
        if (!Array.isArray(current[tagName])) {
          current[tagName] = [current[tagName]];
        }
        (current[tagName] as XMLNode[]).push(element);
      } else {
        current[tagName] = element;
      }
    }

    if (!isSelfClosing) {
      stack.push(element);
      current = element;
    }

    lastIndex = match.index + fullMatch.length;
  }

  // Handle closing tags
  while (closeTagRegex.exec(xmlString) !== null) {
    stack.pop();
    current = stack[stack.length - 1] || root;
  }

  // Get remaining text
  if (lastIndex < xmlString.length) {
    const text = xmlString.substring(lastIndex).trim();
    if (text && current && Object.keys(current).length === 0) {
      current['#text'] = text;
    }
  }

  return Object.keys(root).length > 0 ? root : { root: {} };
}

export function parseXML(input: string): ConversionResult<XMLNode> {
  const startTime = performance.now();

  try {
    if (!input || input.trim().length === 0) {
      return {
        success: false,
        error: createConversionError(ERROR_MESSAGES.EMPTY_INPUT),
      };
    }

    // Basic validation
    const trimmed = input.trim();
    if (!trimmed.startsWith('<')) {
      return {
        success: false,
        error: createConversionError('XML must start with <'),
      };
    }

    // Check for unclosed tags
    const openMatches = trimmed.match(/<([^/?!][^\s/>]*)/g) || [];
    const closeMatches = trimmed.match(/<\/([^>]+)>/g) || [];
    const selfClosingMatches = trimmed.match(/<[^/?!][^>]*\/>/g) || [];

    const openCount = openMatches.length;
    const closeCount = closeMatches.length;
    const selfClosingCount = selfClosingMatches.length;

    if (openCount !== closeCount + selfClosingCount) {
      return {
        success: false,
        error: createConversionError('Mismatched XML tags (unclosed elements)'),
      };
    }

    const parsed = simpleParseXML(trimmed);
    const duration = performance.now() - startTime;

    return {
      success: true,
      content: parsed,
      metadata: {
        duration: Math.round(duration),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: createConversionError(
        ERROR_MESSAGES.INVALID_XML,
        undefined,
        undefined,
        error instanceof Error ? error.message : ''
      ),
    };
  }
}

function buildXMLElement(tagName: string, content: any, indent: string = '', currentIndent: string = ''): string {
  let xml = `${currentIndent}<${tagName}`;

  if (typeof content === 'string') {
    xml += `>${sanitizeXMLString(content)}</${tagName}>`;
    return xml;
  }

  if (typeof content === 'number' || typeof content === 'boolean') {
    xml += `>${String(content)}</${tagName}>`;
    return xml;
  }

  if (content === null) {
    xml += '/>';
    return xml;
  }

  if (Array.isArray(content)) {
    return content.map((item) => buildXMLElement(tagName, item, indent, currentIndent)).join('\n');
  }

  if (typeof content === 'object') {
    const attrs: string[] = [];
    const children: { key: string; value: any }[] = [];

    Object.entries(content).forEach(([key, value]) => {
      if (key.startsWith('@')) {
        attrs.push(` ${key.substring(1)}="${sanitizeXMLString(String(value))}"`);
      } else if (key !== '#text') {
        children.push({ key, value });
      }
    });

    xml += attrs.join('');

    if (children.length === 0 && !content['#text']) {
      xml += '/>';
      return xml;
    }

    xml += '>';

    if (children.length > 0) {
      xml += '\n';
      children.forEach(({ key, value }) => {
        xml += buildXMLElement(key, value, indent, currentIndent + indent) + '\n';
      });
      xml += currentIndent;
    } else if (content['#text']) {
      xml += sanitizeXMLString(content['#text']);
    }

    xml += `</${tagName}>`;
    return xml;
  }

  xml += '/>';
  return xml;
}

export function serializeXML(data: XMLNode, options: Partial<XMLOptions> = {}): ConversionResult<string> {
  const startTime = performance.now();

  try {
    const opts: XMLOptions = { ...DEFAULT_XML_OPTIONS, ...options };

    // Check if data has a single root element key
    const keys = Object.keys(data);
    const hasRootKey = keys.length === 1 && !keys[0].startsWith('@') && !keys[0].startsWith('#');

    const rootElement = opts.rootElement || (hasRootKey ? keys[0] : 'root');
    const contentToSerialize = hasRootKey && !opts.rootElement ? data[keys[0]] : data;
    const indent = opts.prettyPrint ? '  ' : '';

    let xml = '';

    if (opts.includeDeclaration) {
      xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
    }

    xml += buildXMLElement(rootElement, contentToSerialize, indent, '');

    const duration = performance.now() - startTime;

    return {
      success: true,
      content: xml,
      metadata: {
        duration: Math.round(duration),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: createConversionError(
        'Failed to serialize to XML',
        undefined,
        undefined,
        error instanceof Error ? error.message : ''
      ),
    };
  }
}

export function validateXML(input: string): { valid: boolean; error?: string } {
  try {
    if (!input || input.trim().length === 0) {
      return { valid: false, error: 'XML is empty' };
    }

    const trimmed = input.trim();
    if (!trimmed.startsWith('<')) {
      return { valid: false, error: 'XML must start with <' };
    }

    const openTags = (trimmed.match(/<([^/?!][^\s>]*)/g) || []).length;
    const closeTags = (trimmed.match(/<\/([^>]+)>/g) || []).length;

    if (openTags !== closeTags) {
      return { valid: false, error: 'Mismatched XML tags' };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : 'Invalid XML' };
  }
}
