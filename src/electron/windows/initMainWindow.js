import { BrowserWindow, screen } from 'electron';
import extend from 'xtend';
import os from 'os';
import { throttle } from 'lodash';

const checkBounds = (desiredBounds) => {

    // capture the bounds of the user's screen
    const { width, height } = screen.getPrimaryDisplay().workArea;
    const screenBounds = {
        x: parseInt(width / 2),
        y: parseInt(height / 2)
    };
    const bounds = extend(screenBounds, desiredBounds);

    // check if the browser window is offscreen
    const display = screen.getDisplayNearestPoint(bounds).workArea;

    const onScreen = bounds.x >= display.x &&
        bounds.x + bounds.width <= display.x + display.width &&
        bounds.y >= display.y &&
        bounds.y + bounds.height <= display.y + display.height;

    if (!onScreen) {
        delete bounds.x;
        delete bounds.y;
        bounds.width = 900;
        bounds.height = 550;
    }

    return bounds;
};

const library = (lib, icons, srcPath) => {

    const { store } = lib;

    const bounds = checkBounds(store.getState().config.bounds);

    const mainWindowOption = {
        title: 'Museeks',
        icon: os.platform() === 'win32' ? icons['ico'] : icons['256'],
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        minWidth: 900,
        minHeight: 550,
        frame: store.getState().config.useNativeFrame,
        show: false
    };

    // Create the browser window
    let mainWindow = new BrowserWindow(mainWindowOption);

    // ... and load our html page
    mainWindow.loadURL(`file://${srcPath}/renderer/index.html#/library`);

    // Dereference the window object
    mainWindow.on('closed', () => mainWindow = null);
    mainWindow.on('ready-to-show', mainWindow.show);
    mainWindow.on('close', (e) => {
        e.preventDefault();
        mainWindow.webContents.send('close');
    });

    // Save the bounds on resize
    const saveBounds = () => store.dispatch(lib.actions.config.set('bounds', mainWindow.getBounds()));
    const saveBoundsThrottled = throttle(saveBounds, 3000);
    mainWindow.on('resize', saveBoundsThrottled);
    mainWindow.on('move', saveBoundsThrottled);

    return mainWindow;
};

export default library;
