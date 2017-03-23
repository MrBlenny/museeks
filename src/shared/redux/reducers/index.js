import { combineReducers } from 'redux';

import app from './app';
import config from './config';
import library from './library';
import network from './network';
import player from './player';
import playlists from './playlists';
import queue from './queue';
import toasts from './toasts';
import tracks from './tracks';

const isolatedReducers = combineReducers({
    app,
    config,
    library,
    network,
    playlists,
    toasts,
    tracks
});

const topLevelReducers = [{
    isolatedReducers,
    player,
    queue
}];


export default (state, action) => {
    return reducers.reduce((currentState, reducer) => {
        return reducer(currentState, action);
    }, state);
}
