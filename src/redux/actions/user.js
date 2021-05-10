import {
    SET_USER,
} from '../constants/user';

export const setUser = user => ({
    type: SET_USER,
    payload: user,
})