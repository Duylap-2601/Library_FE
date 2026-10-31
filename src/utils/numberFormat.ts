import type { PlaceholderDef } from '../types/template.types';

const CURRENCY_KEY_PATTERN =
  /(amount|price|cost|budget|salary|fee|total|payment|contract_value|money)/i;

type NumericField = Pick<PlaceholderDef, 'key' | 'label' | 'type' | 'suffix'>;

export function isCurrencyField(field: NumericField): boolean {
  if (field.type === 'currency') return true;
  if (field.type === 'number') return false;
  return CURRENCY_KEY_PATTERN.test(field.key);
}

export function isNumericField(field: NumericField): boolean {
  return field.type === 'number' || isCurrencyField(field);
}

export function formatNumericInput(raw: unknown): string {
  const digits = String(raw ?? '').replace(/\D/g, '');
  if (!digits) return '';
  return new Intl.NumberFormat('vi-VN').format(Number(digits));
}

export function withNumericSuffix(raw: unknown, field: NumericField): string {
  const formatted = formatNumericInput(raw);
  if (!formatted) return '';
  if (!isCurrencyField(field)) return formatted;
  return `${formatted} ${field.suffix || 'VNĐ'}`;
}
