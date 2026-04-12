import * as persistence from "./persistence.js";

// Simple theme class
class BasicColourTheme {
    constructor(frame, tab_background_text = '#111') {
        this.frame = frame;
        this.tab_background_text = tab_background_text;
    }

    get browserThemeObject() {
        return {
            colors: {
                frame: this.frame,
                tab_background_text: this.tab_background_text,
            }
        };
    }
}

// Track custom window colours
let customWindowColours = new Map();

// Apply saved colours when windows are created
async function applyColourToWindow(window) {
    // Check if window has a custom colour preference
    const customColour = await persistence.getWindowColour(window.id);

    if (customColour) {
        // Apply custom colour
        const customTheme = new BasicColourTheme(customColour);
        browser.theme.update(window.id, customTheme.browserThemeObject);
        customWindowColours.set(window.id, customTheme);
    }
    // If no custom colour, window remains with default theme
}

<<<<<<< Updated upstream
// Clean up when window is closed
async function cleanupWindow(windowId) {
    if (customWindowColours.has(windowId)) {
        customWindowColours.delete(windowId);
        await persistence.removeWindowColour(windowId)
=======
function applyTheme(windowId, theme) {
    browser.theme.update(windowId, theme.browserThemeObject);
    themeOfWindowID.set(windowId, theme);
    theme.usage += 1;
    theme.lastUsed = Date.now();
}

async function onStartup(details) {
    console.log("onStartup " + JSON.stringify(details));
    applyThemesToAllWindows();
}

async function onInstalled(details) {
    console.log("onInstalled " + JSON.stringify(details));
    let currentTheme = await browser.theme.getCurrent();
    console.log("theme " + JSON.stringify(currentTheme));
    applyThemesToAllWindows();
}

async function applyThemesToAllWindows() {
    for (const window of await browser.windows.getAll()) {
        applyTheme(window.id, getNextTheme());
>>>>>>> Stashed changes
    }
}

// Apply saved colours to all existing windows on startup
async function applySavedColours() {
    const windows = await browser.windows.getAll();
    for (const window of windows) {
        await applyColourToWindow(window);
    }
}

<<<<<<< Updated upstream
// Event listeners
browser.windows.onCreated.addListener(applyColourToWindow);
browser.windows.onRemoved.addListener(cleanupWindow);
browser.runtime.onStartup.addListener(applySavedColours);
browser.runtime.onInstalled.addListener(applySavedColours);
=======
browser.windows.onCreated.addListener(window => applyTheme(window.id, getNextTheme()));
browser.windows.onRemoved.addListener(freeTheme);
browser.runtime.onStartup.addListener(onStartup);
browser.runtime.onInstalled.addListener(onInstalled);
>>>>>>> Stashed changes

// Handle messages from popup
browser.runtime.onMessage.addListener(async (message) => {
<<<<<<< Updated upstream
    if (message.action === 'setWindowColour') {
        const { windowId, colour } = message;
        
        // Apply custom colour
        const customTheme = new BasicColourTheme(colour);
        browser.theme.update(windowId, customTheme.browserThemeObject);
        customWindowColours.set(windowId, customTheme);
        await persistence.setWindowColour(windowId, colour);
    } else if (message.action === 'removeWindowColour') {
        const { windowId } = message;
        
        // Reset to default theme
        browser.theme.reset(windowId);
        customWindowColours.delete(windowId);
        await persistence.removeWindowColour(windowId);
    } else if (message.action === 'resetAllColours') {
        // Clear all custom colours
        customWindowColours.clear();
        await browser.storage.local.clear();
        const windows = await browser.windows.getAll();
        for (const window of windows) {
            browser.theme.reset(window.id);
            await persistence.removeWindowColour(window.id);
=======
    if (message.action === 'setWindowColor') {
        const { color } = message;
        const window = await browser.windows.getCurrent()
        if ( color === 'reset' ) {
            browser.theme.reset(window.id);
        } else {
            freeTheme(window.id);
            let theme = ALL_THEMES.find(theme => theme.frame === color)
            applyTheme(window.id, theme)
>>>>>>> Stashed changes
        }
    }
});