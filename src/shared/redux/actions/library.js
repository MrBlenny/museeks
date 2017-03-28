import Promise from 'bluebird';
import actions from './index.js';
import fs from 'fs';
import globby from 'globby';
import utils from '../../utils/utils';
import electron from 'electron';
import { join, extname } from 'path';
const realpath = Promise.promisify(fs.realpath);

const library = (lib) => {

    const add = (pathsToScan) => (dispatch, getState) => {
        dispatch({
            type : 'LIBRARY/REFRESH_PENDING'
        });

        let rootFiles; // HACK Kind of hack, looking for a better solution

        // Scan folders and add files to library
        new Promise((resolve) => {
            const paths = Promise.map(pathsToScan, (path) => {
                return statAsync(path).then((stat) => {
                    return {
                        path,
                        stat
                    };
                });
            });

            resolve(paths);
        }).then((paths) => {
            const files = [];
            const folders = [];

            paths.forEach((elem) => {
                if(elem.stat.isFile()) files.push(elem.path);
                if(elem.stat.isDirectory() || elem.stat.isSymbolicLink()) folders.push(elem.path);
            });

            rootFiles = files;

            return Promise.map(folders, (folder) => {
                const pattern = path.join(folder, '**/*.*');
                return globby(pattern, { nodir: true, follow: true });
            });
        }).then((files) => {
            // Merge all path arrays together and filter them with the extensions we support
            const flatFiles = files.reduce((acc, array) => acc.concat(array), [])
                .concat(rootFiles)
                .filter((filePath) => {
                    const extension = path.extname(filePath).toLowerCase();
                    return app.supportedExtensions.includes(extension);
                }
            );

            return flatFiles;
        }).then((supportedFiles) => {
            if (supportedFiles.length === 0) {
                return;
            }

            // Add files to be processed to the scan object
            scan.total += supportedFiles.length;

            supportedFiles.forEach((filePath) => {
                scanQueue.push((callback) => {
                    return app.models.Track.findAsync({ path: filePath }).then((docs) => {
                        if (docs.length === 0) {
                            return utils.getMetadata(filePath);
                        }
                        return null;
                    }).then((track) => {
                        // If null, that means a track with the same absolute path already exists in the database
                        if(track === null) return;
                        // else, insert the new document in the database
                        return app.models.Track.insertAsync(track);
                    }).then(() => {
                        scan.processed++;
                        callback();
                    });
                });
            });
        }).catch((err) => {
            console.warn(err);
        });

        // TODO progressive loading in the store, don't freeze the app, able to add files/folders when scanning
    };


    return {
        add,
        removeFolder,
        rescan
    };
};

export default library;
