//import app      from '../lib/app';
const Promise  = require('bluebird');
const actions  = require( './index.js';
const api      = require('../../api');
const fs       = require('fs');
const globby   = require('globby');
const path     = require('path');
const utils    = require('../../utils/utils');

const supportedExtensions = require('../../utils/supportedExtensions');

const dialog = electron.remote.dialog;
const realpathAsync = Promise.promisify(fs.realpath);

const load = async (a) => {
    const querySort = {
        'loweredMetas.artist': 1,
        'year': 1,
        'loweredMetas.album': 1,
        'disk.no': 1,
        'track.no': 1
    };

    try {
        const tracks = await app.models.Track.find().sort(querySort).execAsync();
        store.dispatch({
            type : 'APP_REFRESH_LIBRARY',
            tracks
        });
    } catch (err) {
        console.warn(err);
    }
};

const load2 = async (data) => {
    const querySort = data.sort || {
        'loweredMetas.artist': 1,
        'year': 1,
        'loweredMetas.album': 1,
        'disk.no': 1,
        'track.no': 1
    };

    try {
        const tracks = await api.library.list(data);
        return tracks;
    } catch (err) {
        console.warn(err);
    }
};

const list = async (data) => {
    const querySort = data.sort || {
        'loweredMetas.artist': 1,
        'year': 1,
        'loweredMetas.album': 1,
        'disk.no': 1,
        'track.no': 1
    };

    try {
        const tracks = app.models.Track.find().sort(querySort).execAsync();

        return tracks;
    } catch (err) {
        console.warn(err);
    }
};

const setTracksCursor = (cursor) => {
    store.dispatch({
        type : 'APP_LIBRARY_SET_TRACKSCURSOR',
        cursor
    });
};

const resetTracks = () => {
    store.dispatch({
        type : 'APP_REFRESH_LIBRARY',
        tracks : null
    });
};

const filterSearch = (search) => {
    store.dispatch({
        type : 'APP_FILTER_SEARCH',
        search
    });
};

const addFolders = () => {
    dialog.showOpenDialog({
        properties: ['openDirectory', 'multiSelections']
    }, (folders) => {
        if(folders !== undefined) {
            Promise.map(folders, (folder) => {
                return realpathAsync(folder);
            }).then((resolvedFolders) => {
                store.dispatch({
                    type : 'APP_LIBRARY_ADD_FOLDERS',
                    folders: resolvedFolders
                });
            });
        }
    });
};

const removeFolder = (index) => {
    store.dispatch({
        type : 'APP_LIBRARY_REMOVE_FOLDER',
        index
    });
};

const reset = async () => {
    store.dispatch({
        type : 'APP_LIBRARY_REFRESH_START',
    });

    try {
        await app.models.Track.removeAsync({}, { multi: true });
    } catch (err) {
        console.error(err);
    }

    try {
        await app.models.Playlist.removeAsync({}, { multi: true });
    } catch (err) {
        console.error(err);
    }

    actions.library.load();
    store.dispatch({
        type : 'APP_LIBRARY_REFRESH_END',
    });
};

const refresh = () => {
    store.dispatch({
        type : 'APP_LIBRARY_REFRESH_START'
    });

    const dispatchEnd = function() {
        store.dispatch({
            type : 'APP_LIBRARY_REFRESH_END'
        });
    };
    const folders = app.config.get('musicFolders');
    const fsConcurrency = 32;

    // Start the big thing
    app.models.Track.removeAsync({}, { multi: true }).then(() => {
        return Promise.map(folders, (folder) => {
            const pattern = path.join(folder, '**/*.*');
            return globby(pattern, { nodir: true, follow: true });
        });
    }).then((filesArrays) => {
        return filesArrays.reduce((acc, array) => {
            return acc.concat(array);
        }, []).filter((filePath) => {
            const extension = path.extname(filePath).toLowerCase();
            return supportedExtensions.includes(extension);
        });
    }).then((supportedFiles) => {
        if (supportedFiles.length === 0) {
            dispatchEnd();
            return;
        }

        let addedFiles = 0;
        const totalFiles = supportedFiles.length;
        return Promise.map(supportedFiles, (filePath) => {
            return app.models.Track.findAsync({ path: filePath }).then((docs) => {
                if (docs.length === 0) {
                    return utils.getMetadata(filePath);
                }
                return docs[0];
            }).then((track) => {
                return app.models.Track.insertAsync(track);
            }).then(() => {
                const percent = parseInt(addedFiles * 100 / totalFiles);
                actions.settings.refreshProgress(percent);
                addedFiles++;
            });
        }, { concurrency: fsConcurrency });
    }).then(() => {
        actions.library.load();
        dispatchEnd();
    }).catch((err) => {
        console.warn(err);
    });
};

const fetchCover = async (path) => {
    const cover = await utils.fetchCover(path);
    store.dispatch({
        type : 'APP_LIBRARY_FETCHED_COVER',
        cover
    });
};

/**
 * Update the play count attribute.
 *
 * @param source
 */
const incrementPlayCount = async (source) => {
    const query = { src: source };
    const update = { $inc: { playcount : 1 } };
    try {
        await app.models.Track.updateAsync(query, update);
    } catch (err) {
        console.warn(err);
    }
};


module.exports = {
    load,
    load2,
    list,
    setTracksCursor,
    resetTracks,
    filterSearch,
    addFolders,
    removeFolder,
    reset,
    refresh,
    fetchCover,
    incrementPlayCount
};
