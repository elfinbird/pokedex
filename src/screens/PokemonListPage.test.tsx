import React from 'react';
import { act, renderWithMemoryRouter, waitFor } from 'src/test-utils';
import { PokemonListPage } from './PokemonListPage';
import { useNavigate } from 'react-router-dom';

const MOCK_POKEMON_DATA = [
  { id: 1, name: 'Bulbasaur' },
  { id: 2, name: 'Pikachu' },
];
jest.useFakeTimers();
jest.mock('src/hooks/useGetPokemons', () => ({
  useGetPokemons: jest.fn((search) => ({
    data: !search
      ? MOCK_POKEMON_DATA
      : MOCK_POKEMON_DATA.filter((poke) =>
          poke.name.toLowerCase().includes(String(search).toLowerCase()),
        ),
  })),
}));

jest.mock('src/screens/Pokedex/PokemonDetails', () => ({
  PokemonDetails: jest.fn().mockReturnValue(null),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('PokemonListPage', () => {
  test('it renders', () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    const { getByText } = renderWithMemoryRouter(<PokemonListPage />);
    getByText('Bulbasaur');
  });
  test('clicking on a pokemon calls navigate', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    const { getByText, user } = renderWithMemoryRouter(<PokemonListPage />);

    await act(async () => {
      await user.click(getByText('Bulbasaur'));
    });

    expect(mockNavigate).toHaveBeenCalledWith({ search: 'pokemon=1' }, { replace: false });
  });

  test('typing in the search bar filters the results', async () => {
    const { getByTestId, user } = renderWithMemoryRouter(<PokemonListPage />);
    const userWithNoDelay = user.setup({ delay: null });
    const input = await waitFor(() => getByTestId('pokemon-search'));
    expect(input).toBeDefined();
    await act(async () => {
      await userWithNoDelay.click(input);
      await userWithNoDelay.type(input, 'bulb');
    });
    await waitFor(() => {
      expect(input).toHaveValue('bulb');
    });
    await act(() => {
      jest.advanceTimersByTime(500);
    });
    const bulbasaur = await waitFor(() => getByTestId('pokemon-list-item-1'));
    expect(bulbasaur).toBeDefined();
    await act(async () => {
      await userWithNoDelay.clear(input);
      await userWithNoDelay.type(input, 'pika');
      await userWithNoDelay.type(input, '{enter}');
    });
    await waitFor(() => {
      expect(input).toHaveValue('pika');
    });
    await act(() => {
      jest.advanceTimersByTime(500);
    });
    const pikachu = await waitFor(() => getByTestId('pokemon-list-item-2'));
    expect(pikachu).toBeDefined();
  });

  test('typing in the search bar filters the results (negative scenario)', async () => {
    const { getByTestId, user, container } = renderWithMemoryRouter(<PokemonListPage />);
    const userWithNoDelay = user.setup({ delay: null });
    const input = await waitFor(() => getByTestId('pokemon-search'));
    expect(input).toBeDefined();
    await act(async () => {
      await userWithNoDelay.click(input);
      await userWithNoDelay.type(input, 'charizard'); // not part of the mocked response
    });
    await waitFor(() => {
      expect(input).toHaveValue('charizard');
    });
    await act(() => {
      jest.advanceTimersByTime(500);
    });
    const emptyText = container.querySelector('.ant-list-empty-text'); // no matches found
    expect(emptyText).toBeDefined();
  });
});
