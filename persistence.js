const sessionWindowIdKey = "window-colour-picker-id"

// Get window's ID from session->window storage or generate a new one if none exists.
// This ID can be used to lookup a window even over a close/restore cycle,
// cf. https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/sessions/getWindowValue
async function getLocalStorageId(windowId) {
    let sessionWindowId = await browser.sessions.getWindowValue(windowId, sessionWindowIdKey);
    if (!sessionWindowId) {
        sessionWindowId = crypto.randomUUID();
        await browser.sessions.setWindowValue(windowId, sessionWindowIdKey, sessionWindowId);
    }
    return "window_" + sessionWindowId + "_colour";
}

// Get window colour from local storage
export async function getWindowColour(windowId) {
    const localStorageId = await getLocalStorageId(windowId);
    const storageData = await browser.storage.local.get(localStorageId);
    return storageData[localStorageId];
}

// Set window colour in local storage
export async function setWindowColour(windowId, colour) {
    const localStorageId = await getLocalStorageId(windowId);
    browser.storage.local.set({[localStorageId]: colour});
}

// Remove window colour from local storage and ID from session->window storage
export async function removeWindowColour(windowId) {
    const localStorageId = await getLocalStorageId(windowId);
    await browser.storage.local.remove(localStorageId);
    await browser.sessions.removeWindowValue(windowId, sessionWindowIdKey);
}
