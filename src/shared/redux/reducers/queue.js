import i from 'icepick';

export default (state = {}, action) => {
    switch (action.type) {

        case ('QUEUE/CLEAR'): {
            const queue = [...state.queue];
            queue.splice(state.queueCursor + 1, state.queue.length - state.queueCursor);
            return {
                ...state,
                queue
            };
        }

        case ('QUEUE/REMOVE'): {
            const queue = [...state.queue];
            queue.splice(state.queueCursor + action.payload.index + 1, 1);
            return {
                ...state,
                queue
            };
        }

        case ('QUEUE/ADD_FULFILLED'): {
            const queue = [...state.queue, ...action.payload];
            return {
                ...state,
                queue
            };
        }

        case ('QUEUE/ADD_NEXT_FULFILLED'): {

            const queue = [...state.queue];
            queue.splice(state.queueCursor + 1, 0, ...action.payload);
            return {
                ...state,
                queue
            };
        }

        case ('QUEUE/SET_QUEUE'): {
            return i.chain(state)
                .assoc('queue', action.payload.queue)
                .assoc('queueCursor', null)
                .assocIn(['player', 'history'], [])
                .assocIn(['player', 'historyCursor'], null)
                .value();
        }

        default: {
            return state;
        }
    }
};
