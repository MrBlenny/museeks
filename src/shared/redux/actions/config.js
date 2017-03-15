const aliasEmit = require('../../modules/alias/aliasEmit');

const getAll = () => (dispatch) =>  {
    return {
        type : 'APP_CONFIG_GET_ALL',
        payload : aliasEmit(dispatch, 'config.getAll', '', 'mainRenderer')
    }

const set = (key, value) => (dispatch) => {
    return {
        type : 'APP_CONFIG_SET',
        payload : aliasEmit(dispatch, 'app.library.config.set', [key, value]),
        meta: { key, value }
    }
};

const save = () => (dispatch) => {
    return {
        type : 'APP_CONFIG_SAVE',
        payload: aliasEmit(dispatch, 'app.library.config.saveSync', '')
    }
};

module.exports = {
    getAll,
    set,
    save
};