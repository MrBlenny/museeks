import utils from '../../utils/utils';

const library = (lib) => {

    const setState = (state) => (dispatch, getState) => {
        dispatch({
            type: 'PLAYER/SET_STATE',
            payload: {
                state
            }
        });

        // Set audio element play state: can be play/pause/stop
        dispatch(lib.actions.player[state.playStatus]());

        // Set audio element repeat
        dispatch(lib.actions.player.repeat(state.repeat));

        // Set audio element suffle
        dispatch(lib.actions.player.shuffle(state.shuffle));

        // Set audio element elapsed time
        dispatch(lib.actions.player.jumpTo(state.elapsed));

        dispatch(lib.actions.player.load());
    }

    const load = (_id) => (dispatch, getState) => {
        const {
            queue,
            queueCursor,
            tracks: { library : { data: tracks }},
            player: { currentTrack: oldCurrentTrack, history, historyCursor },
            network: { output }
        } = getState();

        const getTrack = (_id) => {
            // load a specific track if supplied
            if (_id) {
                return tracks[_id];
            } else {
                const inHistory = historyCursor !== -1;

                return inHistory
                    ? history[historyCursor]
                    : queue[queueCursor];
            }
        }

        const track = getTrack();

        if (track) {
            const outputIsLocal = () => lib.player.setMetadata(track);
            const outputIsRemote = () => lib.api.actions.player.load(output, _id);

            return dispatch({
                type: 'PLAYER/LOAD',
                payload: output.isLocal
                    ? outputIsLocal()
                    : outputIsRemote(),
                meta: {
                    track,
                    oldCurrentTrack
                }
            });
        } else {
            return dispatch(lib.actions.player.stop());
        }
    };

    const loadAndPlay = (_id) => (dispatch, getState) => {
        dispatch(lib.actions.player.load(_id));
        dispatch(lib.actions.player.play());
    };

    const newQueueLoadAndPlay = (_id) => (dispatch, getState) => {
        console.log('starting newQueueLoadAndPlay')
        const { tracks, tracks: { tracksCursor } } = getState();

        const subList = tracks[tracksCursor].sub;

        return dispatch(lib.actions.player.createNewQueue(subList)).then(() => {
            console.log('new queue should be above here ^^^')
            console.log('createNewQueue promise completed', getState().queue)
            return dispatch(lib.actions.player.loadAndPlay(_id));
        });
    };


    const play = () => (dispatch, getState) => {
        const { queue , network: { output } } = getState();

        // lib.store.dispatch(lib.actions.player.nowPlaying(track));
        //
        // if (!this.lib.app.browserWindows.main.isFocused()) {
        //     return lib.actions.network.fetchCover(track.path).then((cover) => {
        //         return NotificationActions.add({
        //             title: track.title,
        //             body: `${track.artist}\n${track.album}`,
        //             icon: cover
        //         });
        //     });
        // }

        if (queue === null) return;

        const outputIsLocal = () => Promise.resolve(lib.player.play());
        const outputIsRemote = () => lib.api.actions.player.play(output);

        return dispatch({
            type: 'PLAYER/PLAY',
            payload: output.isLocal
                ? outputIsLocal()
                : outputIsRemote()
        });
    };

    const pause = () => (dispatch, getState) => {
        const { player: { playStatus }, network: { output } } = getState();

        const outputIsLocal = () => Promise.resolve(lib.player.pause());
        const outputIsRemote = () => lib.api.actions.player.pause(output);

        return dispatch({
            type: 'PLAYER/PAUSE',
            payload: output.isLocal
                ? outputIsLocal()
                : outputIsRemote()
        });
    };

    const playToggle = () => (dispatch, getState) => {
        lib.player.getAudio().then((audio) => {
            if (audio.paused && getState().queue.length > 0) {
                dispatch(lib.actions.player.play());
            } else {
                dispatch(lib.actions.player.pause());
            }
        });
    };

    const stop = () => (dispatch, getState) => {
        const { network: { output } } = getState();

        const outputIsLocal = () => Promise.resolve(lib.player.stop());
        const outputIsRemote = () => lib.api.actions.player.stop(output);

        return dispatch({
            type: 'PLAYER/STOP',
            payload: output.isLocal
                ? outputIsLocal()
                : outputIsRemote()
        });
    };

    const next = (data = {}) => (dispatch, getState) => {
        const {
            queue,
            queueCursor: oldQueueCursor,
            player: { history, historyCursor: oldHistoryCursor },
        } = getState();

        let queueCursor = oldQueueCursor;
        let historyCursor = oldHistoryCursor;

        const inHistory = historyCursor !== -1;

        // if we're currently playing a track from our history
        if (inHistory) {
            // move one step forward in the history
            historyCursor = historyCursor + 1;

            // if we moved past the tail of the history queue
            if (historyCursor === history.length) {
                // disable the history cursor
                historyCursor = -1;
                // set the queue cursor to the next track
                queueCursor = utils.getNextQueueCursor({ queue, queueCursor, repeat, shuffle });
            }
        } else {
            // set the queue cursor to the next track
            queueCursor = utils.getNextQueueCursor({ queue, queueCursor, repeat, shuffle });
        }

        dispatch({
            type: 'PLAYER/NEXT',
            payload: {
                queueCursor,
                historyCursor
            }
        });

        dispatch(lib.actions.player.load());
    };

    const previous = (data = {}) => (dispatch, getState) => {
        const {
            queue,
            queueCursor: oldQueueCursor,
            player: { history, historyCursor: oldHistoryCursor },
        } = getState();

        lib.player.getAudio().then((audio) => {

            let queueCursor = oldQueueCursor;
            let historyCursor = oldHistoryCursor;

            const inHistory = historyCursor !== -1;

            // if track started less than 5 seconds ago, play the previous track, otherwise replay the current track
            if (audio.currentTime < 5) {
                // if we're currently playing a track from our history
                if (inHistory) {
                    // move one step back in the history
                    historyCursor = historyCursor - 1;

                    if (historyCursor === -1) {
                        // we tried to move past the head of the history queue, stay at the top
                        historyCursor = 0;
                    }
                } else {
                    // set the history cursor to the end of the history queue
                    historyCursor = history.length - 1;
                }
            }

            dispatch({
                type: 'PLAYER/PREVIOUS',
                payload: moveCursorPrevious,
                meta: {
                    queueCursor,
                    historyCursor
                }
            });

            dispatch(lib.actions.player.load());
        });
    };

    const shuffle = (shuffle) => (dispatch, getState) => {
        const { player: { shuffle: prevShuffle }, network: { output } } = getState();

        const outputIsLocal = () => Promise.resolve(lib.actions.config.set('shuffle', shuffle));
        const outputIsRemote = () => lib.api.actions.player.shuffle(output, shuffle);

        return dispatch({
            type: 'PLAYER/SHUFFLE',
            payload: output.isLocal
                ? outputIsLocal()
                : outputIsRemote(),
            meta: {
                prevShuffle,
                shuffle
            }
        });
    };

    const repeat = (repeat) => (dispatch, getState) => {
        const { player: { repeat: prevRepeat }, network: { output } } = getState();

        const outputIsLocal = () => Promise.resolve(lib.actions.config.set('repeat', repeat));
        const outputIsRemote = () => lib.api.actions.player.repeat(output, repeat);

        return {
            type: 'PLAYER/REPEAT',
            payload: output.isLocal
                ? outputIsLocal()
                : outputIsRemote(),
            meta: {
                prevRepeat,
                repeat
            }
        };
    };

    const setVolume = (volume) => (dispatch) => {
        if (!isNaN(parseFloat(volume)) && isFinite(volume)) {
            lib.player.setVolume(volume);

            dispatch(lib.actions.config.set('volume', volume));
        }
    };

    const setMuted = (muted = false) => (dispatch) => {
        if (muted) lib.player.mute();
        else lib.player.unmute();

        dispatch(lib.actions.config.set('muted', muted));
    };

    const setPlaybackRate = (value) => (dispatch) => {
        if (!isNaN(parseFloat(value)) && isFinite(value)) { // if is numeric
            if (value >= 0.5 && value <= 5) { // if in allowed range
                lib.player.setPlaybackRate(value);

                dispatch(lib.actions.config.set('playbackRate', parseFloat(value)));
            }
        }
    };

    const jumpTo = (to) => (dispatch, getState) => {
        const { network: { output } } = getState();

        const outputIsLocal = () => Promise.resolve(lib.player.setCurrentTime(to));
        const outputIsRemote = () => {
            return lib.player.getAudio().then((audio) => {
                lib.api.actions.player.jumpTo(output, to);
            });
        }

        dispatch({
            type: 'PLAYER/JUMP_TO',
            payload: output.isLocal
                ? outputIsLocal()
                : outputIsRemote()
            // meta: { prevTime, time }
        });
    };

    const fetchCover = (metadata) => ({
        type: 'PLAYER/SET_COVER',
        payload: {
            cover: utils.coverEndpoint({
                _id: metadata._id,
                peer: metadata.owner
            })
        }
    });

    const audioError = (e) => (dispatch) => {
        const audioErrors = {
            aborted: 'The video playback was aborted.',
            corrupt: 'The audio playback was aborted due to a corruption problem.',
            notFound: 'The track file could not be found. It may be due to a file move or an unmounted partition.',
            unknown: 'An unknown error occurred.'
        };

        switch (e.target.error.code) {
            case e.target.error.MEDIA_ERR_ABORTED:
                dispatch(lib.actions.toasts.add('warning', audioErrors.aborted));
                break;
            case e.target.error.MEDIA_ERR_DECODE:
                dispatch(lib.actions.toasts.add('danger', audioErrors.corrupt));
                break;
            case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                dispatch(lib.actions.toasts.add('danger', audioErrors.notFound));
                break;
            default:
                dispatch(lib.actions.toasts.add('danger', audioErrors.unknown));
                break;
        }
    };

    const createNewQueue = (newQueue) => (dispatch, getState) => {
        const {
            queue: oldQueue,
            queueCursor: oldQueueCursor,
            network: { output, me }
        } = getState();

        console.log('createNewQueue output.isLocal', output.isLocal)

        const outputIsLocal = () => new Promise(setTimeout);
        const outputIsRemote = () => {
            const remoteQueue = utils.transformTrackPaths({
                tracks: newQueue,
                peer: output,
                me
            });
            return lib.api.actions.player.createNewQueue(output, remoteQueue);
        }

        return dispatch({
            type: 'PLAYER/CREATE_NEW_QUEUE',
            payload: output.isLocal
                ? outputIsLocal()
                : outputIsRemote(),
            meta: {
                newQueue,
                oldQueue,
                oldQueueCursor
            }
        });
    }

    return {
        load,
        loadAndPlay,
        newQueueLoadAndPlay,
        play,
        pause,
        stop,
        playToggle,
        next,
        previous,
        jumpTo,
        repeat,
        shuffle,
        setMuted,
        setPlaybackRate,
        setVolume,
        fetchCover,
        audioError,
        createNewQueue
    };
}

export default library;
