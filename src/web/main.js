
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import PlayerControls from './components/PlayerControls';

/*
|--------------------------------------------------------------------------
| React and Router
|--------------------------------------------------------------------------
*/

require('bootstrap-css-only/css/bootstrap.min.css');
require('font-awesome/css/font-awesome.css');
require('./styles/main.scss');

/*
|--------------------------------------------------------------------------
| Render the app
|--------------------------------------------------------------------------
*/

ReactDOM.render(
    <Provider store={ store }>
        <div>
            <PlayerControls />
        </div>
    </Provider>,
    document.getElementById('wrap')
);
