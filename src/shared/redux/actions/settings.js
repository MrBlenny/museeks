const AppConstants = require('../constants/AppConstants');
const actions      = require('./index');
const semver       = require('semver');
const ipcRenderer  = electron.ipcRenderer;
//import app          from '../lib/app';

const check = () => {
    checkTheme();
    checkDevMode();
    checkSleepBlocker();
    if(app.config.get('autoUpdateChecker')) checkForUpdate({ silentFail: true });
};

const checkTheme = () => {
    const themeName = app.config.get('theme');
    document.querySelector('body').classList.add(`theme-${themeName}`);
};

const toggleDarkTheme = (value) => {
    const oldTheme = value ? 'light' : 'dark';
    const newTheme = value ? 'dark' : 'light';

    document.querySelector('body').classList.remove(`theme-${oldTheme}`);
    document.querySelector('body').classList.add(`theme-${newTheme}`);

    app.config.set('theme', newTheme);
    app.config.saveSync();

    return {
        type : 'APP_REFRESH_CONFIG'
    };
};

const toggleSleepBlocker = (value) => (dispatch) => {
    app.config.set('sleepBlocker', value);
    app.config.saveSync();

    ipcRenderer.send('toggleSleepBlocker', value, 'prevent-app-suspension');

    dispatch({
        type : 'APP_REFRESH_CONFIG'
    });
};

const checkSleepBlocker = () => {
    if(app.config.get('sleepBlocker')) {
        ipcRenderer.send('toggleSleepBlocker', true, 'prevent-app-suspension');
    }
};

const toggleDevMode = (value) => (dispatch) => {
    app.config.set('devMode', value);

    // Open dev tools if needed
    if(value) app.browserWindows.main.webContents.openDevTools();
    else app.browserWindows.main.webContents.closeDevTools();

    app.config.saveSync();

    dispatch({
        type : 'APP_REFRESH_CONFIG'
    });
};

const checkDevMode = () => {
    if(app.config.get('devMode')) app.browserWindows.main.webContents.openDevTools();
};

const toggleAutoUpdateChecker = (value) => (dispatch) => {
    app.config.set('autoUpdateChecker', value);
    app.config.saveSync();

    dispatch({
        type : 'APP_REFRESH_CONFIG'
    });
};

const checkForUpdate = async (options = {}) => {
    const currentVersion = app.version;

    try {
        const response = await fetch('https://api.github.com/repos/KeitIG/museeks/releases');
        const releases = await response.json();

        const newRelease = releases.find((release) => {
            return semver.valid(release.tag_name) !== null && semver.gt(release.tag_name, currentVersion);
        });

        let message;
        if (newRelease) {
            message = `Museeks ${newRelease.tag_name} is available, check http://museeks.io !`;
        } else if(!options.silentFail) {
            message = `Museeks ${currentVersion} is the latest version available.`;
        }

        if (message) {
            dispatch(actions.toasts.add('success', message));
        }
    } catch (e) {
        if(!options.silentFail) dispatch(actions.toasts.add('danger', 'An error occurred while checking updates.'));
    }
};

const toggleNativeFrame = (value) => {
    app.config.set('useNativeFrame', value);
    app.config.saveSync();
    dispatch(actions.app.restart());
};

const toggleMinimizeToTray = (value) => (dispatch) => {
    app.config.set('minimizeToTray', value);
    app.config.saveSync();

    dispatch({
        type : 'APP_REFRESH_CONFIG'
    });
};

const refreshProgress = (percentage) => (dispatch) => {
    dispatch({
        type : 'APP_LIBRARY_REFRESH_PROGRESS',
        percentage
    });
};

const toggleDisplayNotifications = (value) => (dispatch) => {
    app.config.set('displayNotifications', value);
    app.config.saveSync();

    dispatch({
        type : 'APP_REFRESH_CONFIG'
    });
};

module.exports = {
    check,
    checkDevMode,
    checkForUpdate,
    checkSleepBlocker,
    checkTheme,
    refreshProgress,
    toggleAutoUpdateChecker,
    toggleDarkTheme,
    toggleDevMode,
    toggleDisplayNotifications,
    toggleMinimizeToTray,
    toggleNativeFrame,
    toggleSleepBlocker
};
