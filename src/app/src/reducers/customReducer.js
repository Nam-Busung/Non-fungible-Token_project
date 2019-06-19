const initialState = {emoji:{f: null, e:null, m:null}}

function customReducer (state = initialState, action) {
    switch (action.type) {

        case 'SAY_HELLO' :
            return {
                ...state,
                sayHello: "Hello, " + action.payload
            };

        case 'EMOJI_CHANGED' :
            return {
                ...state,
                emoji: action.payload
            };

        default : return state
    }

}

export default customReducer;
