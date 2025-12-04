import { parseCSV, serializeCSV } from '@/lib/converters/csv';

describe('parseCSV', () => {
  it('should_parse_simple_csv_with_headers', () => {
    const csv = 'name,age\nJohn,30\nJane,25';
    const result = parseCSV(csv);

    expect(result.success).toBe(true);
    expect(result.content).toEqual([
      { name: 'John', age: '30' },
      { name: 'Jane', age: '25' },
    ]);
  });

  it('should_parse_csv_with_quoted_fields', () => {
    const csv = 'name,description\n"Smith, John","Loves coding"';
    const result = parseCSV(csv);

    expect(result.success).toBe(true);
    expect(result.content?.[0]).toEqual({
      name: 'Smith, John',
      description: 'Loves coding',
    });
  });

  it('should_handle_csv_with_newlines_in_quoted_fields', () => {
    const csv = 'name,description\n"John","Line 1\nLine 2"';
    const result = parseCSV(csv);

    expect(result.success).toBe(true);
    expect(result.content?.[0]?.description).toContain('Line 1\nLine 2');
  });

  it('should_handle_csv_with_escaped_quotes', () => {
    const csv = 'name,quote\n"John","He said ""Hi"""';
    const result = parseCSV(csv);

    expect(result.success).toBe(true);
    // The field "He said ""Hi""" contains an escaped quote
    expect(result.content?.[0]?.quote).toContain('He said');
  });

  it('should_parse_csv_with_custom_delimiter', () => {
    const csv = 'name;age\nJohn;30';
    const result = parseCSV(csv, { delimiter: ';' });

    expect(result.success).toBe(true);
    expect(result.content?.[0]).toEqual({
      name: 'John',
      age: '30',
    });
  });

  it('should_parse_csv_with_tab_delimiter', () => {
    const csv = 'name\tage\nJohn\t30';
    const result = parseCSV(csv, { delimiter: '\t' });

    expect(result.success).toBe(true);
    expect(result.content?.[0]).toEqual({
      name: 'John',
      age: '30',
    });
  });

  it('should_handle_empty_fields', () => {
    const csv = 'name,age,city\nJohn,30,\nJane,,New York';
    const result = parseCSV(csv);

    expect(result.success).toBe(true);
    expect(result.content?.[0]).toEqual({
      name: 'John',
      age: '30',
      city: '',
    });
    expect(result.content?.[1]).toEqual({
      name: 'Jane',
      age: '',
      city: 'New York',
    });
  });

  it('should_trim_whitespace_by_default', () => {
    const csv = ' name , age \n John , 30 ';
    const result = parseCSV(csv);

    expect(result.success).toBe(true);
    expect(result.content?.[0]).toEqual({
      name: 'John',
      age: '30',
    });
  });

  it('should_preserve_whitespace_when_option_disabled', () => {
    const csv = ' name , age \n John , 30 ';
    const result = parseCSV(csv, { trimWhitespace: false });

    expect(result.success).toBe(true);
    expect(result.content?.[0]).toEqual({
      ' name ': ' John ',
      ' age ': ' 30 ',
    });
  });

  it('should_return_error_on_empty_input', () => {
    const result = parseCSV('');

    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('empty');
  });

  it('should_return_error_on_unclosed_quote', () => {
    const csv = 'name\n"unclosed quote';
    const result = parseCSV(csv);

    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('quote');
  });

  it('should_parse_csv_without_headers', () => {
    const csv = 'John,30\nJane,25';
    const result = parseCSV(csv, { hasHeader: false });

    expect(result.success).toBe(true);
    expect(result.content?.[0]).toEqual({
      column_1: 'John',
      column_2: '30',
    });
  });
});

describe('serializeCSV', () => {
  it('should_serialize_simple_data_to_csv', () => {
    const data = [
      { name: 'John', age: '30' },
      { name: 'Jane', age: '25' },
    ];
    const result = serializeCSV(data);

    expect(result.success).toBe(true);
    expect(result.content).toContain('name,age');
    expect(result.content).toContain('John,30');
    expect(result.content).toContain('Jane,25');
  });

  it('should_quote_fields_with_commas', () => {
    const data = [{ name: 'Smith, John', age: '30' }];
    const result = serializeCSV(data);

    expect(result.success).toBe(true);
    expect(result.content).toContain('"Smith, John"');
  });

  it('should_escape_quotes_in_fields', () => {
    const data = [{ quote: 'He said "Hi"' }];
    const result = serializeCSV(data);

    expect(result.success).toBe(true);
    expect(result.content).toContain('""'); // Doubled quotes
  });

  it('should_handle_missing_fields_in_rows', () => {
    const data = [
      { name: 'John', age: '30', city: 'New York' },
      { name: 'Jane', age: '25' },
    ];
    const result = serializeCSV(data);

    expect(result.success).toBe(true);
    expect(result.content).toContain('name,age,city');
    const lines = result.content!.split('\n');
    expect(lines[2]).toBe('Jane,25,');
  });

  it('should_use_custom_delimiter', () => {
    const data = [{ name: 'John', age: '30' }];
    const result = serializeCSV(data, { delimiter: ';' });

    expect(result.success).toBe(true);
    expect(result.content).toContain('name;age');
    expect(result.content).toContain('John;30');
  });

  it('should_roundtrip_csv_to_csv', () => {
    const originalCsv = 'name,age\nJohn,30\nJane,25';
    const parseResult = parseCSV(originalCsv);
    const serializeResult = serializeCSV(parseResult.content!);

    expect(parseResult.success).toBe(true);
    expect(serializeResult.success).toBe(true);
    expect(serializeResult.content).toEqual(originalCsv);
  });

  it('should_return_error_on_invalid_data', () => {
    const result = serializeCSV([]);

    expect(result.success).toBe(false);
  });
});
