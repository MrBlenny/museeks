import i from 'icepick';

export default (state = {}, action) => {
    switch (action.type) {
        case('PLAYER/START'): {
            const { queue, queueCursor } = action.payload;
            const track = queue[queueCursor];
            return i.chain(state)
                .assoc('queue', queue)
                .assoc('queueCursor', queueCursor)
                .updateIn(['player', 'history'], (history) => i.push(history, track))
                .assocIn(['player', 'currentTrack'], track)
                .value();
        }

        case('PLAYER/PLAY'): {
            return i.assocIn(state, ['player', 'playStatus'], 'play');
        }

        case('PLAYER/PAUSE'): {
            return i.assocIn(state, ['player', 'playStatus'], 'pause');
        }

        case('PLAYER/STOP'): {
            return i.chain(state)
                .assoc('queue', [])
                .assoc('queueCursor', null)
                .assocIn(['player', 'playStatus'], 'stop')
                .value();
        }

        case('PLAYER/NEXT'): {
            const { newQueueCursor } = action.payload;
            const previousTrack = state.queue[state.queueCursor];
            const currentTrack = state.queue[newQueueCursor];
            return i.chain(state)
                .assoc('queueCursor', newQueueCursor)
                .updateIn(['player', 'history'], (history) => i.push(history, previousTrack))
                .assocIn(['player', 'currentTrack'], currentTrack)
                .value();
        }
        case('PLAYER/PREVIOUS'): {
            const { newQueueCursor } = action.payload;
            const currentTrack = state.queue[newQueueCursor];
            return i.chain(state)
                .assoc('queueCursor', newQueueCursor)
                .assocIn(['player', 'currentTrack'], currentTrack)
                .value();
        }

        case('PLAYER/JUMP_TO'): {
            return state;
        }

        case('PLAYER/SHUFFLE'): {
            return i.assocIn(state, ['player', 'shuffle'], action.payload.shuffle);
        }

        case('PLAYER/REPEAT'): {
            return i.assocIn(state, ['player', 'repeat'], action.payload.repeat);
        }

        case('PLAYER/FETCHED_COVER'): {
            return i.assocIn(state, ['player', 'cover'], action.payload.cover);
        }

        default: {
            return state;
        }
    }
};
