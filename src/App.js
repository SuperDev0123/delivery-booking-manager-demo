import React from 'react';
import { Provider } from 'react-redux';

import { createAppStore } from './state/stores/AppStore';

import { AppRouter } from './routers/AppRouter';

export const App = () => (
    <Provider store={createAppStore()}>
        <AppRouter />
    </Provider>
);