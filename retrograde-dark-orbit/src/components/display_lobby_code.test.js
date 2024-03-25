import { render } from '@testing-library/react'
import DisplayLobbyCode from './display_lobby_code';
import { SearchParamsContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime';

test('renders on-screen', () => {
  const params = new URLSearchParams({"code": "CODE"});
  const page = render(
    <SearchParamsContext.Provider value={params}>
      <DisplayLobbyCode/>
    </SearchParamsContext.Provider>
  );
  expect(page).toMatchSnapshot();
});