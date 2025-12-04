import { parseJSON, serializeJSON, validateJSON } from '@/lib/converters/json';

describe('parseJSON', () => {
  it('should_parse_valid_json_object', () => {
    const json = '{"name": "John", "age": 30}';
    const result = parseJSON(json);

    expect(result.success).toBe(true);
    expect(result.content).toEqual({ name: 'John', age: 30 });
  });

  it('should_parse_valid_json_array', () => {
    const json = '[{"name": "John"}, {"name": "Jane"}]';
    const result = parseJSON(json);

    expect(result.success).toBe(true);
    expect(Array.isArray(result.content)).toBe(true);
  });

  it('should_parse_nested_json', () => {
    const json = '{"user": {"name": "John", "address": {"city": "NYC"}}}';
    const result = parseJSON(json);

    expect(result.success).toBe(true);
    expect((result.content as any).user.address.city).toBe('NYC');
  });

  it('should_handle_json_with_null_values', () => {
    const json = '{"name": "John", "age": null}';
    const result = parseJSON(json);

    expect(result.success).toBe(true);
    expect((result.content as any).age).toBeNull();
  });

  it('should_return_error_on_empty_input', () => {
    const result = parseJSON('');

    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('empty');
  });

  it('should_return_error_on_invalid_json', () => {
    const json = '{"name": "John"';
    const result = parseJSON(json);

    expect(result.success).toBe(false);
    expect(result.error?.message).toBeTruthy();
  });

  it('should_handle_json_with_trailing_comma_error', () => {
    const json = '{"name": "John",}';
    const result = parseJSON(json);

    expect(result.success).toBe(false);
  });

  it('should_parse_json_with_escaped_characters', () => {
    const json = '{"text": "Line1\\nLine2\\tTab"}';
    const result = parseJSON(json);

    expect(result.success).toBe(true);
    expect((result.content as any).text).toContain('\n');
  });
});

describe('serializeJSON', () => {
  it('should_serialize_object_to_json', () => {
    const data = { name: 'John', age: 30 };
    const result = serializeJSON(data);

    expect(result.success).toBe(true);
    expect(result.content).toContain('name');
    expect(result.content).toContain('John');
  });

  it('should_serialize_array_to_json', () => {
    const data = [{ name: 'John' }, { name: 'Jane' }];
    const result = serializeJSON(data);

    expect(result.success).toBe(true);
    expect(result.content).toContain('[');
    expect(result.content).toContain(']');
  });

  it('should_pretty_print_json_with_2_spaces', () => {
    const data = { name: 'John', age: 30 };
    const result = serializeJSON(data, { indent: 2, prettyPrint: true });

    expect(result.success).toBe(true);
    expect(result.content).toContain('\n');
    // Check for 2-space indentation
    const lines = result.content!.split('\n');
    expect(lines.some((line) => line.startsWith('  '))).toBe(true);
  });

  it('should_pretty_print_json_with_4_spaces', () => {
    const data = { name: 'John', age: 30 };
    const result = serializeJSON(data, { indent: 4, prettyPrint: true });

    expect(result.success).toBe(true);
    const lines = result.content!.split('\n');
    expect(lines.some((line) => line.startsWith('    '))).toBe(true);
  });

  it('should_serialize_without_pretty_print', () => {
    const data = { name: 'John', age: 30 };
    const result = serializeJSON(data, { prettyPrint: false });

    expect(result.success).toBe(true);
    expect(result.content).not.toContain('\n');
  });

  it('should_roundtrip_json_to_json', () => {
    const originalJson = { name: 'John', age: 30, hobbies: ['reading', 'coding'] };
    const parseResult = parseJSON(JSON.stringify(originalJson));
    const serializeResult = serializeJSON(parseResult.content, { indent: 2 });

    expect(parseResult.success).toBe(true);
    expect(serializeResult.success).toBe(true);

    const reparsed = JSON.parse(serializeResult.content!);
    expect(reparsed).toEqual(originalJson);
  });
});

describe('validateJSON', () => {
  it('should_validate_correct_json', () => {
    const result = validateJSON('{"name": "John"}');

    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should_detect_invalid_json', () => {
    const result = validateJSON('{"name": "John"');

    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('should_provide_error_details_for_invalid_json', () => {
    const result = validateJSON('{invalid}');

    expect(result.valid).toBe(false);
    expect(result.error?.message).toBeTruthy();
  });
});
