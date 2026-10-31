import { describe, expect, it } from 'vitest';
import {
  formatNumericInput,
  isCurrencyField,
  withNumericSuffix,
} from './numberFormat';

const amountField = {
  key: 'amount',
  label: 'Giá trị hợp đồng',
  type: 'currency',
  required: true,
  suffix: 'VNĐ',
};

describe('numberFormat', () => {
  it('removes non-digits and groups thousands', () => {
    expect(formatNumericInput('180000000 VND')).toBe('180.000.000');
    expect(formatNumericInput('')).toBe('');
  });

  it('detects currency fields by type or key', () => {
    expect(isCurrencyField(amountField)).toBe(true);
    expect(
      isCurrencyField({
        key: 'contract_value',
        label: 'Giá trị',
        type: 'text',
      }),
    ).toBe(true);
    expect(
      isCurrencyField({
        key: 'full_name',
        label: 'Họ tên',
        type: 'text',
      }),
    ).toBe(false);
  });

  it('adds the configured suffix when saving', () => {
    expect(withNumericSuffix('250000000', amountField)).toBe('250.000.000 VNĐ');
    expect(withNumericSuffix('', amountField)).toBe('');
  });
});
