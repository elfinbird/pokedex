import { tss } from 'src/tss';
import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_POKEMON_DETAILS, Pokemon, PokemonDetail } from 'src/hooks/useGetPokemons';
import { Statistic, Progress, Divider, Skeleton, Image, Result } from 'antd';
import { PokemonType } from './PokemonType';
import { FALLBACK_AVATAR } from './constants';

interface PokemonDetailsResponse {
  pokemon: PokemonDetail[];
}

/**
 * @param pokemon Selected Pokemon from the List Page
 * @returns Component that renders the pokemon details in the pokedex
 */
export const PokemonDetails = ({ pokemon }: { pokemon: Pokemon }) => {
  const { classes } = useStyles();
  const { loading, data, error } = useQuery<PokemonDetailsResponse>(GET_POKEMON_DETAILS, {
    variables: { id: Number(pokemon.id) },
  });

  if (loading) {
    return (
      <div className={classes.skeleton}>
        <Skeleton />
      </div>
    );
  }

  if (error || !data?.pokemon?.[0]) {
    return (
      <Result
        status="error"
        title="Failed to load Pokédex"
        subTitle={
          error?.message ||
          `An error occurred while fetching Pokémon ${pokemon?.name ?? pokemon?.id} from the server.`
        }
      />
    );
  }

  const poke = data.pokemon[0];
  const sprite = poke.pokemonsprites?.[0]?.sprites || '';
  const types: string[] = Array.isArray(poke.pokemontypes)
    ? poke.pokemontypes
        .map((pokemontype) => pokemontype?.type?.typenames?.[0]?.name)
        .filter((n): n is string => Boolean(n))
    : [];
  const stats = poke.pokemonstats;
  const { weight } = poke;
  const { height } = poke;
  const captureRate = poke.pokemonspecy?.capture_rate;

  return (
    <div className={classes.pokedexCard} data-testid="pokemon-details">
      <div className={classes.imageHolder}>
        <Image className={classes.sprite} src={sprite} fallback={FALLBACK_AVATAR} />
      </div>
      <div className={classes.infoGrid}>
        <div>
          <div className={classes.label}>Type</div>{' '}
          {types.map((type: string) => (
            <PokemonType key={type} type={type} />
          ))}
        </div>
        <div>
          <Statistic title="Height" value={height} suffix="dm" />
        </div>
        <div>
          <Statistic title="Weight" value={weight} suffix="hg" />
        </div>
        <div>
          <Statistic title="Capture Rate" value={captureRate} />
        </div>
      </div>
      <Divider>Statistics</Divider>
      <div className={classes.statsSection}>
        {stats.map((s) => (
          <div key={s.stat?.name} className={classes.statRow}>
            <span className={classes.statName}>{s.stat?.name}</span>
            <Progress
              percent={Math.min(s.base_stat / 2, 100)}
              showInfo={false}
              className={classes.statBar}
            />
            <span className={classes.statValue}>{s.base_stat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  skeleton: {
    paddingInlineStart: '1rem',
    textAlign: 'center',
  },
  pokedexCard: {
    padding: '18px 26px 20px 26px',
    color: theme.color.text.primary,
    '& .ant-statistic-title': {
      color: theme.color.text.primary,
    },
    '& .ant-statistic-content': {
      color: theme.color.text.primary,
    },
    '& .ant-divider-inner-text': {
      color: theme.color.text.primary,
    },
  },
  imageHolder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 95,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 8,
  },
  sprite: {
    height: 'auto',
    maxWidth: 200,
    maxHeight: 200,
    background: '#0d2732',
    borderRadius: 18,
    border: `2px solid ${theme.color.border.primary}`,
    margin: 0,
    boxShadow: '0 2px 14px #2A4F61, 0 1px 6px #2A4F61',
  },
  infoGrid: {
    margin: '10px 0 2px 0',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: 12,
  },
  label: {
    color: theme.color.text.primary,
    fontSize: '14px',
    marginBottom: '4px',
  },
  statsSection: {
    marginTop: 7,
  },
  statRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 7,
  },
  statName: {
    width: 74,
    textTransform: 'capitalize',
    fontFamily: 'monospace',
    fontSize: 13,
    color: theme.color.text.primary,
  },
  statBar: {
    flex: 1,
    minWidth: 60,
    '.ant-progress-bg': {
      background: `linear-gradient(90deg, ${theme.color.border.primary} 25%, ${theme.color.border.secondary} 90%)`,
    },
  },
  statValue: {
    width: 22,
    textAlign: 'right',
    color: theme.color.text.primary,
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },
}));
