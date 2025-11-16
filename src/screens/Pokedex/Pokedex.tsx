import React from 'react';
import { Modal, Skeleton, Result } from 'antd';
import { Pokemon } from 'src/hooks/useGetPokemons';
import { PokemonDetails } from './PokemonDetails';
import { tss } from 'src/tss';
import { POKEMON_QUERY_PARAM } from './constants';
import { useNavigate, useSearchParams } from 'react-router-dom';

type PokedexProps = {
  selectedPokemon: Pokemon | undefined | null;
  loading: boolean;
};

/**
 * @param selectedPokemon Selected Pokemon from the list page
 * @param loading boolean identifier to display loaders when API is in progress
 * @returns Component that renders the pokedex
 */
export const Pokedex = ({ selectedPokemon, loading }: PokedexProps) => {
  const { classes } = useStyles();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const showModal: boolean = params.get(POKEMON_QUERY_PARAM) !== null;
  if (!showModal) return null;

  let children;

  if (loading) {
    children = <Skeleton />;
  } else if (!selectedPokemon) {
    children = (
      <Result
        className={classes.label}
        status="error"
        title="Failed to load Pokédex"
        subTitle={`An error occurred while fetching Pokémon ${params.get(POKEMON_QUERY_PARAM)} from the server.`}
      />
    );
  } else {
    children = <PokemonDetails pokemon={selectedPokemon} />;
  }

  const handlePokedexClose = () => {
    const newParams = new URLSearchParams(params);
    newParams.delete(POKEMON_QUERY_PARAM);
    navigate({ search: newParams.toString() }, { replace: true });
  };
  let title;
  if (selectedPokemon) {
    title = (
      <div className={classes.header}>
        <span className={classes.pokedexAccent} />
        <span className={classes.pokedexTitle}>
          {' '}
          {selectedPokemon.name} - {selectedPokemon.id}
        </span>
      </div>
    );
  } else {
    title = <span className={classes.label}>Pokédex</span>;
  }
  return (
    <Modal
      className={classes.root}
      title={title}
      open={showModal}
      footer={null}
      centered
      onCancel={handlePokedexClose}
      destroyOnClose
    >
      {children}
    </Modal>
  );
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    background: 'linear-gradient(135deg, #152d3d 70%, #10222c 100%)',
    borderRadius: 24,
    border: `3px solid ${theme.color.border.primary}`,
    boxShadow: '0 2px 24px 0 #010b175d',
    padding: '18px 26px 20px 26px',
    minWidth: 280,
    minHeight: 500,
    margin: '0 auto',
    color: theme.color.text.primary,
    '& .ant-modal-content': {
      background: 'linear-gradient(135deg, #152d3d 70%, #10222c 100%)',
      boxShadow: 'none',
      padding: 0,
    },
    '& .ant-modal-header': {
      background: '#152d3d',
    },
    '& .ant-modal-close': {
      top: 0,
      insetInlineEnd: 0,
    },
    '& .ant-modal-close-x': {
      color: theme.color.border.primary,
    },
    '& .ant-result > *': {
      color: theme.color.text.primary,
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
  },
  pokedexAccent: {
    display: 'inline-block',
    marginRight: 10,
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: 'radial-gradient(ellipse at 45% 40%, #B7DAFF 65%, #F5F7FA 100%)',
    boxShadow: '0 0 5px #B7DAFF',
    border: '2px solid #183c54',
  },
  pokedexTitle: {
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: '0.6px',
    color: '#e1f7fc',
  },
  label: {
    color: theme.color.text.primary,
  },
}));
