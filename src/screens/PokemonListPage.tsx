import React, { useState, useMemo, useEffect } from 'react';
import { Pokemon, useGetPokemons } from 'src/hooks/useGetPokemons';
import { tss } from 'src/tss';
import { PokemonListPageHeader } from './PokemonListPageHeader';
import { Input, Image, Layout, List, Result, Button } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PokemonType } from './Pokedex/PokemonType';
import { Pokedex } from './Pokedex/Pokedex';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  FALLBACK_AVATAR,
  POKEMON_QUERY_PARAM,
} from './Pokedex/constants';

export const PokemonListPage = () => {
  const { classes } = useStyles();
  const [params] = useSearchParams();
  const initialSearch = params.get('search') || '';
  const [searchBarText, setSearchBarText] = useState<string>(initialSearch);
  const [search, setSearch] = useState<string>(initialSearch);
  const debouncedSetSearch = useMemo(() => debounce(setSearch), []);
  const prevSearchRef = React.useRef<string>(initialSearch);
  const navigate = useNavigate();
  const page = parseInt(params.get('page') || DEFAULT_PAGE, 10);
  const pageSize = parseInt(params.get('pageSize') || DEFAULT_PAGE_SIZE, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  useEffect(() => {
    const urlSearch = params.get('search') || '';
    setSearch(urlSearch);
    setSearchBarText(urlSearch);
  }, [params]);

  useEffect(() => {
    // Only reset to page=1 if search value itself changes (not on paging/navigation)
    if (search !== prevSearchRef.current) {
      const newParams = new URLSearchParams(params);
      newParams.set('search', search);
      newParams.set('page', '1');
      navigate({ search: newParams.toString() }, { replace: false });
      prevSearchRef.current = search;
    }
  }, [search, params, navigate]);

  const { data, total, loading, error } = useGetPokemons(search, limit, offset);
  const selectedPokemonId: string | null = params.get(POKEMON_QUERY_PARAM);
  const selectedPokemon: Pokemon | null | undefined = selectedPokemonId
    ? data.find((p: Pokemon) => selectedPokemonId === String(p.id))
    : null;

  const onSearchInputChange = (value: string) => {
    debouncedSetSearch(value);
    setSearchBarText(value);
  };

  const onPokemonSelect = (id: string) => {
    const newParams = new URLSearchParams(params);
    newParams.set(POKEMON_QUERY_PARAM, id);
    navigate({ search: newParams.toString() }, { replace: false });
  };

  if (error) {
    return (
      <Result
        status="error"
        title="Failed to load Pokémon list"
        subTitle={error.message || 'An error occurred while fetching data from the server.'}
      />
    );
  }

  return (
    <div className={classes.root}>
      <Layout className={classes.layout}>
        <PokemonListPageHeader />
        <Layout.Content className={classes.content}>
          <Input.Search
            className={classes.darkSearch}
            value={searchBarText}
            loading={loading}
            placeholder="Type to search Pokémon…"
            allowClear
            onChange={(e) => onSearchInputChange(e.target.value)}
            disabled={!!error}
            data-testid="pokemon-search"
          />
          <List
            itemLayout="horizontal"
            locale={{
              emptyText: 'No Pokémon found in our records.',
            }}
            dataSource={data}
            pagination={{
              current: page,
              pageSize,
              total,
              position: 'bottom',
              align: 'center',
              onChange: (newPage, newPageSize) => {
                const newParams = new URLSearchParams(params);
                newParams.set('page', String(newPage));
                newParams.set('pageSize', String(newPageSize));
                navigate({ search: newParams.toString() }, { replace: false });
              },
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50'],
            }}
            loading={loading}
            renderItem={(item) => (
              <List.Item
                className={classes.listItem}
                data-testid={`pokemon-list-item-${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onPokemonSelect(String(item.id));
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Image
                      className={classes.pokemonAvatar}
                      src={item.sprite}
                      fallback={FALLBACK_AVATAR}
                      preview={false}
                    />
                  }
                  title={
                    <Button href="#" type="link" className={classes.pokemonLink}>
                      {item.name}
                    </Button>
                  }
                  description={
                    <div>
                      <span className={classes.secondaryTextContainer}>
                        <strong>ID: </strong>&nbsp;
                      </span>
                      <span className={classes.secondaryTextContainer}>{item.id}</span>
                      <div>
                        <span className={classes.secondaryTextContainer}>
                          <strong>Type: </strong>&nbsp;
                        </span>
                        <span>
                          {item?.types?.map((type: string) => (
                            <PokemonType key={type} type={type} />
                          ))}
                        </span>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />

          <Pokedex selectedPokemon={selectedPokemon} loading={loading} />
        </Layout.Content>
      </Layout>
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    color: theme.color.text.primary,
    background: theme.color.surface,
    minHeight: '100vh',
    '& .ant-list-pagination': {
      background: '#F5F7FA',
    },
    '& .ant-list-empty-text': {
      color: theme.color.text.primary,
    },
    '& .ant-list-loading': {
      background: theme.color.surface,
    },
  },
  listItem: {
    position: 'relative',
    transition: 'background 0.15s, box-shadow 0.15s, transform 0.15s, border 0.2s',
    borderRadius: '10px',
    border: `1.8px solid ${theme.color.border.secondary}`,
    background: '#162c39',
    boxShadow: `0 4px 16px 0 ${theme.color.surface}`,
    padding: '12px !important',
    marginBottom: 16,
    overflow: 'hidden',
    '&:hover': {
      background: theme.color.lightSurface,
      boxShadow: `0px 2px 14px 2px ${theme.color.surface} 0 6px 18px 0 ${theme.color.surface}`,
      cursor: 'pointer',
      transform: 'translateY(-2px) scale(1.015)',
    },
    '& .ant-btn-link': {
      padding: 0,
    },
  },
  layout: {
    background: theme.color.surface,
    color: theme.color.text.primary,
  },
  content: {
    background: theme.color.surface,
    color: theme.color.text.primary,
  },
  darkSearch: {
    border: `1.5px solid ${theme.color.border.secondary}`,
    marginBottom: '12px',
    '& .ant-input-wrapper > *': {
      background: '#F5F7FA',
    },
  },
  pokemonAvatar: {
    border: `3px solid ${theme.color.border.primary}`,
    background: theme.color.surface,
    transition: 'transform 0.18s cubic-bezier(0.33,1,0.68,1.01), box-shadow 0.18s',
    zIndex: 2,
    width: '100px !important',
    height: '100px !important',
  },
  pokemonLink: {
    color: `${theme.color.text.primary} !important`,
    fontWeight: 700,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  secondaryTextContainer: {
    color: theme.color.text.secondary,
  },
}));

function debounce<T extends (...args: any[]) => void>(callback: T, delay = 500) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
