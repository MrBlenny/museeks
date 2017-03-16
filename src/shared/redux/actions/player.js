const utils = require('../../utils/utils');

const library = (lib) => {

    const audioErrors = {
        aborted: 'The video playback was aborted.',
        corrupt: 'The audio playback was aborted due to a corruption problem.',
        notFound: 'The track file could not be found. It may be due to a file move or an unmounted partition.',
        unknown: 'An unknown error occurred.'
    };

    const playToggle = () => (dispatch, getState) => {
        const { paused } = Player.getAudio();
        // TODO (y.solovyov | KeitIG): calling getState is a hack.
        const { queue } = getState();
        if (paused && queue.length > 0) {
            dispatch(play());
        } else {
            dispatch(pause());
        }
    };

    const play = () => (dispatch, getState) => {
        // TODO (y.solovyov | KeitIG): calling getState is a hack.
        const { queue } = getState();
        if (queue !== null) {
            Player.play();
            dispatch({
                type : 'APP_PLAYER_PLAY'
            });
        }
    };

    const pause = () => (dispatch, getState) => {
        // TODO (y.solovyov | KeitIG): calling getState is a hack.
        const { queue } = getState();
        if (queue !== null) {
            Player.pause();
            dispatch({
                type : 'APP_PLAYER_PAUSE'
            });
        }
    };

    const start = (_id) => (dispatch, getState) => {
        // TODO (y.solovyov | KeitIG): calling getState is a hack.
        const { tracks, tracksCursor } = getState();
        const queue = [...tracks[tracksCursor].sub];
        const queuePosition = queue.findIndex((track) => {
            return track._id === _id;
        });

        if (queuePosition > -1) {
            const uri = utils.parseUri(queue[queuePosition].path);

            Player.setAudioSrc(uri);
            Player.play();

            dispatch({
                type : 'APP_PLAYER_START',
                queuePosition,
                _id
            });
        }
    };

    const stop = () => {
        Player.stop();
        return {
            type : 'APP_PLAYER_STOP'
        };
        // DR: We can Remove?
        // ipcRenderer.send('playerAction', 'stop');
    };

    const next = () => (dispatch, getState) => {
        // TODO (y.solovyov | KeitIG): calling getState is a hack.
        const { queue, queueCursor, repeat } = getState();
        let newQueueCursor;

        if (repeat === 'one') {
            newQueueCursor = queueCursor;
        } else if (repeat === 'all' && queueCursor === queue.length - 1) { // is last track
            newQueueCursor = 0; // start with new track
        } else {
            newQueueCursor = queueCursor + 1;
        }

        const track = queue[newQueueCursor];

        if (track !== undefined) {
            const uri = utils.parseUri(track.path);

            Player.setAudioSrc(uri);
            Player.play();
            dispatch({
                type : 'APP_PLAYER_NEXT',
                newQueueCursor
            });
        } else {
            dispatch(stop());
        }
    };

    const previous = () => (dispatch, getState) => {
        const currentTime = Player.getCurrentTime();

        // TODO (y.solovyov | KeitIG): calling getState is a hack.
        const { queue, queueCursor } = getState();
        let newQueueCursor = queueCursor;

        // If track started less than 5 seconds ago, play th previous track,
        // otherwise replay the current one
        if (currentTime < 5) {
            newQueueCursor = queueCursor - 1;
        }

        const newTrack = queue[newQueueCursor];

        if (newTrack !== undefined) {
            const uri = utils.parseUri(newTrack.path);

            Player.setAudioSrc(uri);
            Player.play();

            dispatch({
                type : 'APP_PLAYER_PREVIOUS',
                currentTime,
                newQueueCursor,
            });
        } else {
            dispatch(stop());
        }
    };

    const shuffle = (shuffle) => {
        lib.config.set('audioShuffle', shuffle);
        lib.config.saveSync();

        const currentSrc = Player.getSrc();
        return {
            type : 'APP_PLAYER_SHUFFLE',
            shuffle,
            currentSrc
        };
    };

    const repeat = (repeat) => {
        lib.config.set('audioRepeat', repeat);
        lib.config.saveSync();

        return {
            type : 'APP_PLAYER_REPEAT',
            repeat
        };
    };

    const setVolume = (volume) => {
        if (!isNaN(parseFloat(volume)) && isFinite(volume)) {
            Player.setAudioVolume(volume);

            lib.config.set('audioVolume', volume);
            lib.config.saveSync();
            return {
                type : 'APP_REFRESH_CONFIG'
            };
        }
    };

    const setMuted = (muted = false) => {
        if (muted) Player.mute();
        else Player.unmute();

        lib.config.set('audioMuted', muted);
        lib.config.saveSync();
        return {
            type : 'APP_REFRESH_CONFIG'
        };
    };

    const setPlaybackRate = (value) => {
        if (!isNaN(parseFloat(value)) && isFinite(value)) { // if is numeric
            if (value >= 0.5 && value <= 5) { // if in allowed range
                Player.setAudioPlaybackRate(value);

                lib.config.set('audioPlaybackRate', parseFloat(value));
                lib.config.saveSync();
                return {
                    type : 'APP_REFRESH_CONFIG'
                };
            }
        }
    };

    const jumpTo = (to) => {
        // TODO (y.solovyov) do we want to set some explicit state?
        // if yes, what should it be? if not, do we need this actions at all?
        Player.setAudioCurrentTime(to);
        return {
            type : 'APP_PLAYER_JUMP_TO'
        };
    };

    const audioError = (e) => {
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

    return {
        audioError,
        jumpTo,
        next,
        pause,
        play,
        playToggle,
        previous,
        repeat,
        setMuted,
        setPlaybackRate,
        setVolume,
        shuffle,
        start,
        stop,
        audioErrors
    };
}

module.exports = library;
