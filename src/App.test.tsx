import React from 'react';
import { render, waitFor } from './test-utils';
import App from './App';

jest.mock('../README.md', () => ({
  text: jest.fn().mockResolvedValue('hello world'),
}));

test('renders home page', async () => {
  const { getByTestId } = render(<App />);
  const MockReactMarkdown = await waitFor(() => getByTestId('MockReactMarkdown'));
  expect(MockReactMarkdown).toBeInTheDocument();
});
