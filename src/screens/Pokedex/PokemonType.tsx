import React from 'react';
import { tss } from 'src/tss';
import { Tag } from 'antd';

const POKEMON_TYPE_COLORS: { [type: string]: string } = {
  fire: 'volcano',
  water: 'blue',
  grass: 'green',
  electric: 'yellow',
  ice: 'cyan',
  fighting: 'red',
  poison: 'purple',
  ground: 'lime',
  flying: 'geekblue',
  psychic: 'magenta',
  bug: 'orange',
  rock: 'gold',
  ghost: 'purple',
  dragon: 'cyan',
  dark: 'pink',
  steel: 'geekblue',
  fairy: 'pink',
};

/**
 *
 * @param type The type of pokemon
 * @returns Component that renders the Type of Pokemon as a Tag with dedicated colors
 */
export const PokemonType = ({ type }: { type: string }) => {
  const { classes } = useStyles();
  const color = POKEMON_TYPE_COLORS[type?.toLowerCase()] || 'gold';
  return (
    <Tag color={color} className={classes.root}>
      {' '}
      {type}{' '}
    </Tag>
  );
};

const useStyles = tss.create(() => ({
  root: {
    fontWeight: 600,
    marginInlineEnd: '8px',
  },
}));
