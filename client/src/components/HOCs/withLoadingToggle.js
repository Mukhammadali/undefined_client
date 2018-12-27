import { withState } from 'recompose';

export const withLoadingToggle = withState('loading', 'toggleLoading', false);
