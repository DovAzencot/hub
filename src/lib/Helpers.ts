import {
    MOBILE_MAX_WIDTH,
} from './Constants';

export function setHistoryStorage(key: string, data: any) {
    // Note that data can be anything that can be structurally cloned:
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
    history.replaceState({
        ...history.state,
        [key]: data,
    }, '');
}

export function getHistoryStorage(key: string): any | undefined {
    return history.state ? history.state[key] : undefined;
}

export function includesOrigin(list: string[], origin: string) {
    return list.includes(origin) || list.includes('*');
}

export function isDesktop() {
    return (window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth) > MOBILE_MAX_WIDTH;
}

export function isMilliseconds(time: number) {
    /*
     * 1568577148 = timestamp at time of writing
     * 100000000000 ~ 11/16/5138
     */
    return time > 100000000000;
}
