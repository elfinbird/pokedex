# UI Assessment - Pokédex

This is a take-home assessment that will leverage various frontend technologies to evaluate your aptitude. You can complete this at your own pace. Your recruiter will communicate when you should submit this assessment.

---

## Getting Started

### Leveraging Open API GraphQL

In this assessment you will utilize a Pokémon open API (GraphQL). This will demonstrate your knowledge and aptitude with GraphQL, which ReliaQuest heavily leverages.

**Resources:**

- [API Docs](https://pokeapi.co/docs/graphql) (with [interactive playground](https://graphql.pokeapi.co/v1beta2/console))
- [Apollo Docs](https://www.apollographql.com/docs/react/)
- [React Docs](https://reactjs.org/docs/getting-started.html)
- [React Router Docs](https://reactrouter.com/home)

---

## App-Wide Requirements

1. **Must use JSS for all styling** - No CSS files. The `<PokemonListPage />` component (`src/screens/PokemonListPage.tsx`) already demonstrates this pattern using the `tss` function from `src/tss.ts`. All styling contexts are already provided and implemented for you.

2. **Must use TypeScript for all files** - Proper typing throughout with minimal use of `any`.

3. **All components must handle loading, error, and empty states appropriately** - App should not break in unexpected empty or error states.

---

## Core Requirements

### 1 - List Page

Expand the existing list page with the following features. You will need to retrieve data from the `useGetPokemons` hook (`src/hooks/useGetPokemons.ts`) where the GraphQL query is defined.

1. Create list items that display:

   - Pokémon name
   - Pokémon number
   - Pokémon type(s)
   - Pokémon image (available through the API)

2. Each list item should have a hover effect

3. Show a proper loading state while data is being fetched

### 2 - Search Functionality

Implement search functionality so users can quickly find Pokémon.

1. Add a search input box that filters the list of Pokémon

2. Search should be **case insensitive**

3. Only Pokémon matching the search should be displayed

4. Show appropriate messaging when no results are found

5. **For Entry- and Mid-Level Engineers:** Searching will be **client-side only** (filter the results you already have). Please do not implement server-side searching, as you are being evaluated on your ability to manipulate a data set.

6. **For Senior Engineers:** See "Additional Senior Requirements" below - you will implement **server-side search** instead.

### 3 - Dialog for Pokémon Details

When a user clicks on a Pokémon, show a dialog/modal with detailed information.

1. **Route-dependent modal:** The dialog should open based on the route using `react-router` (already set up in the app). For example: `/pokemon/25`. This also means the page should support deep linking--if you copy a link to a details dialog, you should be able to paste that link in the address bar and get to the same details dialog.

2. **Open on top of the list:** The dialog should overlay the list page, whether you clicked a list item or pasted a link to the details page.

3. **Fetch detailed data:** Use GET_POKEMON_DETAILS query to fetch details for a single Pokémon

4. **Handle states:** Properly handle loading and error states for the detail fetch.

5. **Display choice:** What additional details you display and how you lay them out is up to you.

6. **You may use a component library** for the dialog/modal (e.g., [Ant Design Modal](https://ant.design/components/modal)) so you don't have to build one from scratch.

### 4 - Testing Requirements

This assessment includes a testing component using Jest and React Testing Library, found in PokemonListPage.test.tsx. You can run it with `yarn test`

All three tests should pass when submitting.

## Additional Requirements for Senior Engineers

Senior candidates must complete all entry/mid-level requirements AND the following:

### 1. Pagination

Implement pagination for the Pokémon list:

- Add pagination controls (Previous/Next buttons, page numbers, or similar UI)
- Load Pokémon in chunks rather than all 151 at once (e.g., 20 per page)
- The GraphQL API supports pagination with the `first` and `offset` parameters
- Maintain pagination state when navigating to and from the detail modal
- Search functionality should work with pagination

### 2. Server-Side Search

Replace the client-side search with server-side search:

- Update your GraphQL query to perform searching on the backend
- Use the API documentation and interactive playground to test your query
- Implement debouncing for the search input to avoid excessive API calls while typing
- Show a loading indicator while search results are being fetched
- Search should work in conjunction with pagination

———

## Submission

When you're ready to submit:

1. Ensure all tests pass
2. Ensure the app runs without errors
3. Follow the submission instructions provided by your recruiter

Good luck!
