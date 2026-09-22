const STYLE_ID = "rasmus-custom-css";

async function applyStyles() {
    const { styles = {} } = await chrome.storage.local.get("styles");

    const hostname = window.location.hostname;
    const site = styles[hostname];

    let style = document.getElementById(STYLE_ID);

    if (!site?.enabled || !site.css) {
        style?.remove();
        return;
    }

    if (!style) {
        style = document.createElement("style");
        style.id = STYLE_ID;

        document.documentElement.appendChild(style);
    }

    style.textContent = site.css;
}

applyStyles();

chrome.storage.onChanged.addListener((changes) => {
    if (changes.styles) {
        applyStyles();
    }
});