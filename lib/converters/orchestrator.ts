import { ConversionRequest, ConversionResult } from '../types';
import { DEFAULT_CSV_OPTIONS, DEFAULT_JSON_OPTIONS, DEFAULT_XML_OPTIONS } from '../constants';
import { parseCSV, serializeCSV } from './csv';
import { parseJSON, serializeJSON, isValidJSONArray } from './json';
import { parseXML, serializeXML } from './xml';

// CSV → JSON
function csvToJson(input: string, request: ConversionRequest): ConversionResult<string> {
  const csvResult = parseCSV(input, request.csvOptions);

  if (!csvResult.success || !csvResult.content) {
    return {
      success: false,
      error: csvResult.error,
    };
  }

  const jsonResult = serializeJSON(csvResult.content, request.jsonOptions);

  return {
    success: jsonResult.success,
    content: jsonResult.content,
    error: jsonResult.error,
    metadata: jsonResult.metadata,
  };
}

// JSON → CSV
function jsonToCsv(input: string, request: ConversionRequest): ConversionResult<string> {
  const jsonResult = parseJSON(input);

  if (!jsonResult.success || !jsonResult.content) {
    return {
      success: false,
      error: jsonResult.error,
    };
  }

  let dataToConvert = jsonResult.content;

  // If it's an object with a single array property, use that array
  if (!isValidJSONArray(jsonResult.content) && typeof jsonResult.content === 'object' && jsonResult.content !== null) {
    const keys = Object.keys(jsonResult.content as Record<string, any>);
    if (keys.length === 1 && isValidJSONArray((jsonResult.content as Record<string, any>)[keys[0]])) {
      dataToConvert = (jsonResult.content as Record<string, any>)[keys[0]];
    } else {
      return {
        success: false,
        error: {
          message: 'JSON must be an array of objects to convert to CSV',
          context: typeof jsonResult.content === 'object' ? JSON.stringify(jsonResult.content) : '',
        },
      };
    }
  }

  // JSON must be array of objects for CSV conversion
  if (!isValidJSONArray(dataToConvert)) {
    return {
      success: false,
      error: {
        message: 'JSON must be an array of objects to convert to CSV',
      },
    };
  }

  const csvResult = serializeCSV(dataToConvert, request.csvOptions);

  return {
    success: csvResult.success,
    content: csvResult.content,
    error: csvResult.error,
    metadata: csvResult.metadata,
  };
}

// JSON → XML
function jsonToXml(input: string, request: ConversionRequest): ConversionResult<string> {
  const jsonResult = parseJSON(input);

  if (!jsonResult.success || !jsonResult.content) {
    return {
      success: false,
      error: jsonResult.error,
    };
  }

  const xmlResult = serializeXML(jsonResult.content as Record<string, any>, request.xmlOptions);

  return {
    success: xmlResult.success,
    content: xmlResult.content,
    error: xmlResult.error,
    metadata: xmlResult.metadata,
  };
}

// XML → JSON
function xmlToJson(input: string, request: ConversionRequest): ConversionResult<string> {
  const xmlResult = parseXML(input);

  if (!xmlResult.success || !xmlResult.content) {
    return {
      success: false,
      error: xmlResult.error,
    };
  }

  const jsonResult = serializeJSON(xmlResult.content, request.jsonOptions);

  return {
    success: jsonResult.success,
    content: jsonResult.content,
    error: jsonResult.error,
    metadata: jsonResult.metadata,
  };
}

// CSV → XML (via JSON)
function csvToXml(input: string, request: ConversionRequest): ConversionResult<string> {
  // First convert CSV → JSON
  const csvToJsonResult = csvToJson(input, request);

  if (!csvToJsonResult.success || !csvToJsonResult.content) {
    return {
      success: false,
      error: csvToJsonResult.error,
    };
  }

  // Then convert JSON → XML
  const jsonToXmlResult = jsonToXml(csvToJsonResult.content, request);

  return {
    success: jsonToXmlResult.success,
    content: jsonToXmlResult.content,
    error: jsonToXmlResult.error,
    metadata: jsonToXmlResult.metadata,
  };
}

// XML → CSV (via JSON)
function xmlToCsv(input: string, request: ConversionRequest): ConversionResult<string> {
  // First convert XML → JSON
  const xmlToJsonResult = xmlToJson(input, request);

  if (!xmlToJsonResult.success || !xmlToJsonResult.content) {
    return {
      success: false,
      error: xmlToJsonResult.error,
    };
  }

  // Then convert JSON → CSV
  const jsonToCsvResult = jsonToCsv(xmlToJsonResult.content, request);

  return {
    success: jsonToCsvResult.success,
    content: jsonToCsvResult.content,
    error: jsonToCsvResult.error,
    metadata: jsonToCsvResult.metadata,
  };
}

export function convert(request: ConversionRequest): ConversionResult<string> {
  const startTime = performance.now();

  // Set default options
  const fullRequest: ConversionRequest = {
    ...request,
    csvOptions: { ...DEFAULT_CSV_OPTIONS, ...request.csvOptions },
    jsonOptions: { ...DEFAULT_JSON_OPTIONS, ...request.jsonOptions },
    xmlOptions: { ...DEFAULT_XML_OPTIONS, ...request.xmlOptions },
  };

  let result: ConversionResult<string>;

  if (fullRequest.fromFormat === 'csv' && fullRequest.toFormat === 'json') {
    result = csvToJson(fullRequest.input, fullRequest);
  } else if (fullRequest.fromFormat === 'json' && fullRequest.toFormat === 'csv') {
    result = jsonToCsv(fullRequest.input, fullRequest);
  } else if (fullRequest.fromFormat === 'json' && fullRequest.toFormat === 'xml') {
    result = jsonToXml(fullRequest.input, fullRequest);
  } else if (fullRequest.fromFormat === 'xml' && fullRequest.toFormat === 'json') {
    result = xmlToJson(fullRequest.input, fullRequest);
  } else if (fullRequest.fromFormat === 'csv' && fullRequest.toFormat === 'xml') {
    result = csvToXml(fullRequest.input, fullRequest);
  } else if (fullRequest.fromFormat === 'xml' && fullRequest.toFormat === 'csv') {
    result = xmlToCsv(fullRequest.input, fullRequest);
  } else if (fullRequest.fromFormat === fullRequest.toFormat) {
    // Same format, just return the input
    result = {
      success: true,
      content: fullRequest.input,
    };
  } else {
    result = {
      success: false,
      error: {
        message: `Conversion from ${fullRequest.fromFormat} to ${fullRequest.toFormat} is not supported`,
      },
    };
  }

  const duration = performance.now() - startTime;

  if (result.metadata) {
    result.metadata.duration = Math.round(duration);
  } else {
    result.metadata = { duration: Math.round(duration) };
  }

  return result;
}
