import {TOGGLE_LANGUAGE} from './constants'


export function toggleLanguage(data)
{
    return {
        type: TOGGLE_LANGUAGE,
        data: data       
    }
}
