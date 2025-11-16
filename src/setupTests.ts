import '@testing-library/jest-dom';

global.fetch = (args: any) =>
  Promise.resolve({
    ok: true,
    json: () => {},
    text: () => {},
    ...args,
  }) as Promise<Response>;

// --- Global setup for matchMedia (needed for antd) --- ideally can be part of global-test-setup file
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(), // deprecated but some libs still call it
      removeListener: jest.fn(), // deprecated
      dispatchEvent: jest.fn(),
    }),
  });
}
