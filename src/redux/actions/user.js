import {
    SET_USER,
    CLEAR_USER,
    SET_PHOTO_URL,
} from '../constants/user';

export const setUser = user => ({
    type: SET_USER,
    payload: user,
})

export const clearUser = () => ({
    type: CLEAR_USER,
})

export const setPhotoURL = url => ({
    type: SET_PHOTO_URL,
    payload: url,
})