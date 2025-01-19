export enum ETheme {
    LIGHT = "light",
    DARK = "dark"
}

export const LOCALSTORAGE_THEME_KEY = "poltiracker_theme";

export function getTheme() {
    const theme = localStorage.getItem(LOCALSTORAGE_THEME_KEY);
    if (theme) {
        switch (theme) {
            case "light":
                return ETheme.LIGHT;

            case "dark":
                return ETheme.DARK;
        }
    }

    return ETheme.LIGHT;
}