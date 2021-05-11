import { combineReducers } from 'redux';
import user from './user';
import chatRoom from './chatRoom';


const rootReducer = combineReducers({
    user,
    chatRoom,
});


export default rootReducer;