import {
    SET_USER,
    CLEAR_USER,
    SET_PHOTO_URL,
} from '../constants/user';


// initialstate 
const initialState = {
    currentUser: null,
    isLoading: false,
}

function user (state = initialState, action ) {
    switch(action.type) {
        case SET_USER :
            return {
                ...state,
                currentUser: action.payload,
                isLoading: false,
            }
        case CLEAR_USER:
            return {
                ...state,
                currentUser: null,
            }
        case SET_PHOTO_URL:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    photoURL : action.payload
                }
            }
        default:
            return state;
    }
}


export default user;