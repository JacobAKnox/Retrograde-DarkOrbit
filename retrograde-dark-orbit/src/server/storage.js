// uses session storage which is not presevreed across tabs, but is across refresh
// switch to localstorage at some point
export function getItem(itemId) {
    if (typeof window !== 'undefined') {
        return sessionStorage.getItem(itemId);
    }
    return undefined;
}

export function storeItem(itemId, item) {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem(itemId, item);
    }
}