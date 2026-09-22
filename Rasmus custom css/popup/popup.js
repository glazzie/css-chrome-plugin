const siteInput = document.getElementById("rasmus-site");
const cssInput = document.getElementById("rasmus-css");
const enabledInput = document.getElementById("rasmus-enabled");
const saveButton = document.getElementById("rasmus-save");
const status = document.getElementById("rasmus-status");


async function getCurrentSite() {
    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    if (!tabs.length || !tabs[0].url) {
        return null;
    }

    try {
        const url = new URL(tabs[0].url);

        return url.hostname;
    } catch {
        return null;
    }
}


async function getStyles() {
    const { styles = {} } =
        await chrome.storage.local.get("styles");

    return styles;
}


async function loadSite(site) {
    if (!site) {
        cssInput.value = "";
        enabledInput.checked = true;

        return;
    }

    const styles = await getStyles();
    const settings = styles[site];

    if (!settings) {
        cssInput.value = "";
        enabledInput.checked = true;

        return;
    }

    cssInput.value = settings.css || "";
    enabledInput.checked = settings.enabled ?? true;
}


async function saveSite() {
    const site = siteInput.value.trim().toLowerCase();

    if (!site) {
        showStatus("No website selected.");
        return;
    }

    const styles = await getStyles();

    styles[site] = {
        css: cssInput.value,
        enabled: enabledInput.checked
    };

    await chrome.storage.local.set({
        styles
    });

    showStatus("Saved.");
}


function showStatus(message) {
    status.textContent = message;

    setTimeout(() => {
        status.textContent = "";
    }, 2000);
}


siteInput.addEventListener("change", async () => {
    const site = siteInput.value.trim().toLowerCase();

    await loadSite(site);
});


saveButton.addEventListener("click", saveSite);


async function init() {
    const site = await getCurrentSite();

    if (!site) {
        siteInput.value = "";
        siteInput.placeholder = "Unable to detect website";

        return;
    }

    siteInput.value = site;

    await loadSite(site);
}


init();