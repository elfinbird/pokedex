import { createTss } from 'tss-react';

function useContext() {
  const theme = {
    color: {
      surface: '#10222c',
      lightSurface: '1A3644',
      text: {
        primary: '#D1D5DB',
        secondary: '#C0C7CE',
      },
      border: {
        primary: '#C0C0C0',
        secondary: '#24425c',
      },
    },
  };

  return { theme };
}

export const { tss } = createTss({ useContext });

export const useStyles = tss.create({});
