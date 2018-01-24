const initialState = { counter: 0 };

/**
 * Action
 */
const INCREMENT = 'INCREMENT';

/**
 * Action creator
 */
export function increment() {
    return {
        type: INCREMENT
    };
}
/**
 * Reducer
 */

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case INCREMENT:
            return { counter: state.counter + 1 };
        default:
            return state;
    }
}
