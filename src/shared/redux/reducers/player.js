export default (state = {}, action) => {
    switch (action.type) {
        case('APP_PLAYER_START'): {
            const queue = [...state.tracks[state.tracksCursor].sub];
            const id = action.payload._id;

            let queueCursor = action.payload.queuePosition; // Clean that variable mess later

            // Check if we have to shuffle the queue
            if (state.shuffle) {
                // need to check that later
                const index = queue.findIndex((track) => track._id === id);

                const firstTrack = queue[index];

                queue.splice(id, 1);

                let m = queue.length;
                let t;
                let i;
                while (m) {
                    // Pick a remaining element…
                    i = Math.floor(Math.random() * m--);

                    // And swap it with the current element.
                    t = queue[m];
                    queue[m] = queue[i];
                    queue[i] = t;
                }

                queue.unshift(firstTrack);

                // Let's set the cursor to 0
                queueCursor = 0;
            }

            // Backup that and change the UI
            return {
                ...state,
                queue,
                queueCursor,
                oldQueue: queue,
                oldQueueCursor: queueCursor,
                playerStatus: 'play'
            };
        }

        case('APP_PLAYER_PLAY'): {
            return {
                ...state,
                playerStatus: 'play'
            };
        }

        case('APP_PLAYER_PAUSE'): {
            return {
                ...state,
                playerStatus: 'pause'
            };
        }

        case('APP_PLAYER_STOP'): {
            const newState = {
                ...state,
                queue:  [],
                queueCursor:  null,
                playerStatus: 'stop'
            };

            return newState;
        }

        case('APP_PLAYER_NEXT'): {
            return {
                ...state,
                playerStatus: 'play',
                queueCursor: action.payload.newQueueCursor
            };
        }

        case('APP_PLAYER_PREVIOUS'): {
            return {
                ...state,
                playerStatus: 'play',
                queueCursor: action.payload.newQueueCursor
            };
        }

        case('APP_PLAYER_JUMP_TO'): {
            return state;
        }

        case('APP_PLAYER_SHUFFLE'): {
            if (action.payload.shuffle) {
                // Let's shuffle that
                const queueCursor = state.queueCursor;
                let queue = [...state.queue];

                // Get the current track
                const firstTrack  = queue[queueCursor];

                // now get only what we want
                queue = queue.splice(queueCursor + 1, state.queue.length - (queueCursor + 1));

                let m = queue.length;
                let t;
                let i;
                while (m) {
                    // Pick a remaining element…
                    i = Math.floor(Math.random() * m--);

                    // And swap it with the current element.
                    t = queue[m];
                    queue[m] = queue[i];
                    queue[i] = t;
                }

                queue.unshift(firstTrack); // Add the current track at the first position

                return {
                    ...state,
                    queue,
                    shuffle: true,
                    queueCursor: 0,
                    oldQueue: state.queue,
                };
            }

            const currentTrackIndex = state.oldQueue.findIndex((track) => {
                return action.payload.currentSrc === `file://${encodeURI(track.path)}`;
            });

            // Roll back to the old but update queueCursor
            return {
                ...state,
                queue: [...state.oldQueue],
                queueCursor: currentTrackIndex,
                shuffle: false
            };
        }

        case('APP_PLAYER_REPEAT'): {
            return {
                ...state,
                repeat: action.payload.repeat
            };
        }

        default: {
            return state;
        }
    }
};
