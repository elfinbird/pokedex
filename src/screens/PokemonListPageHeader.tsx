import { tss } from 'src/tss';
import React from 'react';

/**
 *
 * @returns Component that renders the header section of the Pokemon List Page
 */
export const PokemonListPageHeader = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.root}>
      <span className={classes.header}> Pokémon</span>
      <span className={classes.subHeader}> Gotta catch &#39;em all ! </span>
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    paddingInlineStart: '1rem',
  },
  header: {
    fontSize: '2rem',
    color: theme.color.text.primary,
  },

  subHeader: {
    color: theme.color.text.secondary,
    paddingInlineStart: '0.5rem',
  },
}));
