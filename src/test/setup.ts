import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { afterEach } from 'vitest';
import { flushSync } from 'react-dom';

afterEach(cleanup);

// This React build does not export `act`, while Testing Library expects it.
// A flushSync-based shim is sufficient for these component tests.
const reactWithAct = React as unknown as {
  act?: (callback: () => unknown) => unknown;
};

if (typeof reactWithAct.act !== 'function') {
  reactWithAct.act = (callback: () => unknown) => {
    let result: unknown;
    flushSync(() => {
      result = callback();
    });
    return result;
  };
}
