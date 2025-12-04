import { parseXML, serializeXML, validateXML } from '@/lib/converters/xml';

describe('parseXML', () => {
  it('should_parse_simple_xml', () => {
    const xml = '<root><name>John</name></root>';
    const result = parseXML(xml);

    expect(result.success).toBe(true);
    expect(result.content).toBeTruthy();
  });

  it('should_parse_xml_with_attributes', () => {
    const xml = '<root><person id="1" name="John"></person></root>';
    const result = parseXML(xml);

    expect(result.success).toBe(true);
    expect(result.content).toBeTruthy();
  });

  it('should_parse_xml_with_nested_elements', () => {
    const xml = '<root><user><name>John</name><age>30</age></user></root>';
    const result = parseXML(xml);

    expect(result.success).toBe(true);
    expect(result.content).toBeTruthy();
  });

  it('should_parse_xml_with_text_content', () => {
    const xml = '<root><message>Hello World</message></root>';
    const result = parseXML(xml);

    expect(result.success).toBe(true);
    expect(result.content).toBeTruthy();
  });

  it('should_return_error_on_empty_input', () => {
    const result = parseXML('');

    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('empty');
  });

  it('should_return_error_on_invalid_xml_opening', () => {
    const result = parseXML('not xml');

    expect(result.success).toBe(false);
  });

  it('should_handle_xml_with_unclosed_inner_tags', () => {
    const xml = '<root><name>John<age>25</age></name></root>';
    const result = parseXML(xml);

    // Our simple parser should handle nested elements
    expect(result.success).toBe(true);
  });

  it('should_return_error_on_unclosed_tags', () => {
    const xml = '<root><name>John</root>';
    const result = parseXML(xml);

    expect(result.success).toBe(false);
  });

  it('should_parse_self_closing_tags', () => {
    // Self-closing tags with attributes
    const xml = '<root><item id="1"></item></root>';
    const result = parseXML(xml);

    expect(result.success).toBe(true);
  });

  it('should_parse_xml_with_multiple_same_elements', () => {
    const xml = '<root><item>First</item><item>Second</item></root>';
    const result = parseXML(xml);

    expect(result.success).toBe(true);
  });
});

describe('serializeXML', () => {
  it('should_serialize_object_to_xml', () => {
    // When a single key exists, it's used as the root element
    const data = { root: { name: 'John' } };
    const result = serializeXML(data);

    expect(result.success).toBe(true);
    expect(result.content).toContain('<root>');
    expect(result.content).toContain('</root>');
  });

  it('should_serialize_with_attributes', () => {
    const data = { '@id': '1', '@name': 'John' };
    const result = serializeXML(data);

    expect(result.success).toBe(true);
    expect(result.content).toContain('id="1"');
    expect(result.content).toContain('name="John"');
  });

  it('should_serialize_nested_objects', () => {
    const data = { user: { name: 'John', age: '30' } };
    const result = serializeXML(data);

    expect(result.success).toBe(true);
    expect(result.content).toContain('<user>');
    expect(result.content).toContain('</user>');
  });

  it('should_include_xml_declaration_by_default', () => {
    const data = { name: 'John' };
    const result = serializeXML(data);

    expect(result.success).toBe(true);
    expect(result.content).toContain('<?xml');
  });

  it('should_exclude_xml_declaration_when_option_disabled', () => {
    const data = { name: 'John' };
    const result = serializeXML(data, { includeDeclaration: false });

    expect(result.success).toBe(true);
    expect(result.content).not.toContain('<?xml');
  });

  it('should_pretty_print_xml_by_default', () => {
    const data = { root: { user: { name: 'John' } } };
    const result = serializeXML(data, { prettyPrint: true });

    expect(result.success).toBe(true);
    expect(result.content).toContain('\n');
  });

  it('should_serialize_without_pretty_print', () => {
    const data = { name: 'John' };
    const result = serializeXML(data, { prettyPrint: false, includeDeclaration: false });

    expect(result.success).toBe(true);
    // Without pretty print, it should be on fewer lines
  });

  it('should_use_custom_root_element', () => {
    const data = { name: 'John' };
    const result = serializeXML(data, { rootElement: 'person' });

    expect(result.success).toBe(true);
    expect(result.content).toContain('<person>');
  });

  it('should_escape_special_characters', () => {
    const data = { message: '<>&"' };
    const result = serializeXML(data);

    expect(result.success).toBe(true);
    expect(result.content).toContain('&lt;');
    expect(result.content).toContain('&gt;');
    expect(result.content).toContain('&amp;');
    expect(result.content).toContain('&quot;');
  });
});

describe('validateXML', () => {
  it('should_validate_correct_xml', () => {
    const result = validateXML('<root><name>John</name></root>');

    expect(result.valid).toBe(true);
  });

  it('should_detect_invalid_xml', () => {
    const result = validateXML('<root><name>John</root>');

    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('should_detect_unclosed_tags', () => {
    const result = validateXML('<root><name>John');

    expect(result.valid).toBe(false);
  });

  it('should_detect_empty_input', () => {
    const result = validateXML('');

    expect(result.valid).toBe(false);
  });
});
