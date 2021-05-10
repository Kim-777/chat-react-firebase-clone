import {
    SET_USER,
} from '../constants/user';


// initialstate 
const initialState = {
    currentUser: null,
    isLoading: true,
}

function user (state = initialState, action ) {
    switch(action.type) {
        case SET_USER :
            return {
                ...state,
                currentUser: action.payload,
                isLoading: false,
            }
        default:
            return state;
    }
}


export default user;