import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export interface Pokemon {
  id: string | number;
  name?: string;
  types?: string[];
  sprite?: string;
}

export interface PokemonType {
  type: string;
}

interface PokemonSpeciesName {
  name: string;
}
interface PokemonSpecy {
  pokemonspeciesnames: PokemonSpeciesName[];
  capture_rate: number;
}
interface TypeName {
  name: string;
}
interface TypeObj {
  typenames: TypeName[];
}
interface TypeEntry {
  type: TypeObj;
}
interface SpriteObj {
  sprites: string;
}
interface StatObj {
  base_stat: number;
  stat: { name: string };
}
export interface PokemonDetail extends Pokemon {
  id: number;
  pokemonspecy: PokemonSpecy;
  pokemonsprites: SpriteObj[];
  pokemontypes: TypeEntry[];
  pokemonstats: StatObj[];
  weight: number;
  height: number;
}

export const GET_POKEMONS = gql`
  query GetPokemons($search: String, $limit: Int, $offset: Int) {
    pokemon(
      order_by: { id: asc }
      where: {
        pokemonspecy: {
          pokemonspeciesnames: { language: { name: { _eq: "en" } }, name: { _regex: $search } }
        }
      }
      limit: $limit
      offset: $offset
    ) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
      }
      pokemonsprites {
        sprites(path: "other.official-artwork.front_default")
      }
      pokemontypes {
        type {
          typenames(where: { language: { name: { _eq: "en" } } }) {
            name
          }
        }
      }
    }
    pokemon_aggregate(
      where: {
        pokemonspecy: {
          pokemonspeciesnames: { language: { name: { _eq: "en" } }, name: { _regex: $search } }
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_POKEMON_DETAILS = gql`
  query GetPokemonDetails($id: Int!) {
    pokemon(where: { id: { _eq: $id } }) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
        capture_rate
      }
      pokemonsprites {
        sprites(path: "other.official-artwork.front_default")
      }
      pokemontypes {
        type {
          typenames(where: { language: { name: { _eq: "en" } } }) {
            name
          }
        }
      }
      weight
      height
      pokemonstats {
        base_stat
        stat {
          name
        }
      }
    }
  }
`;

// Search should be done client-side for the mid-level assessment. Uncomment for the senior assessment.
/**
 * Interface matching the shape returned by GET_POKEMONS for pokemon.
 */
interface PokemonQueryResult {
  id: string | number;
  pokemonspecy?: {
    pokemonspeciesnames?: { name: string }[];
  };
  pokemonsprites?: { sprites: string }[];
  pokemontypes?: { type: { typenames?: { name: string }[] } }[];
}

export const useGetPokemons = (
  search?: string,
  limit?: number,
  offset?: number,
): {
  data: Pokemon[];
  total: number;
  loading: boolean;
  error: ReturnType<typeof useQuery>['error'];
} => {
  const { data, loading, error } = useQuery<{
    pokemon: PokemonQueryResult[];
    pokemon_aggregate: { aggregate: { count: number } };
  }>(GET_POKEMONS, {
    variables: {
      search: search ? `(?i).*${search}.*` : '',
      limit,
      offset,
    },
  });

  return {
    data:
      data?.pokemon?.map(
        (p): Pokemon => ({
          id: p.id,
          name: p?.pokemonspecy?.pokemonspeciesnames?.[0]?.name,
          sprite: p?.pokemonsprites?.[0]?.sprites,
          types: Array.isArray(p?.pokemontypes)
            ? p.pokemontypes
                .map((type) => type?.type?.typenames?.[0]?.name ?? '')
                .filter((type: string) => type !== '')
            : [],
        }),
      ) ?? [],
    total: data?.pokemon_aggregate?.aggregate?.count ?? 0,
    loading,
    error,
  };
};
