import { PERMISSIONS_ADDED, TOGGLE_LANGUAGE } from './constants'


export function toggleLanguage(data) {
    return {
        type: TOGGLE_LANGUAGE,
        data: data
    }
}

export function addPermissions(data) {
    return {
        type: PERMISSIONS_ADDED,
        payload: data
    }
}
