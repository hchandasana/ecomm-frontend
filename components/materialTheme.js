import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#135CEF",
        },
        success: {
            main: "#0FC885"
        },
        background: {
            default: "#fff"
        }
    },
    typography: {
        fontFamily: "Roboto",
        h1: {
            fontSize: 24,
            fontWeight: 500,
            lineHeight: 1.5,
        },
        h2: {
            fontSize: 18,
            fontWeight: 500,
            lineHeight: 1.5,
        },
        h3: {
            fontSize: 16,
            fontWeight: 500,
            lineHeight: 1.5,
        },
        subtitle1: {
            lineHeight: 1.5,
            fontSize: 14,
            color: "#747474",
            fontWeight: 400,
        },
        subtitle2: {
            lineHeight: 1.5,
            fontSize: 12,
            color: "#747474",
            fontWeight: 400,
        },
        button: {
            textTransform: "none",
        },
        body1: {
            fontSize: 16,
            lineHeight: 1.5,
        },
        label: {
            fontSize: 16,
            lineHeight: 2.5
        },
        placeholder: {
            color: "#747474"
        },
    },
    overrides: {
        MuiCssBaseline: {
            "@global": {
                "*": {
                    // "scrollbar-width": "",
                },
                "*::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                },
                "*::-webkit-scrollbar-thumb": {
                    backgroundColor: "darkgrey",
                    borderRadius: 6,
                },
            },
        },
        MuiButton: {
            root: {
                textTransform: "none",
                fontSize: 14,
                "&.MuiButton-label": {
                    textTransform: "none",
                },
            },
        },
        MuiListItem: {
            root: {
                height: 54,
                "&$selected": {
                    color: "#135CEF",
                    backgroundColor: "rgba(229, 238, 255, 1)",
                    "&:hover": {
                        backgroundColor: "rgba(229, 238, 255, 1)",
                    },
                },
            },
            button: {
                "&:hover": {
                    color: "#135CEF",
                    backgroundColor: "rgba(229, 238, 255, 1)",
                },
            },
        },
        MuiListItemText: {
            root: {
                fontWeight: 500,
                color: "inherit",
            },
        },
        MuiListItemIcon: {
            root: {
                minWidth: 0,
                color: "inherit",
            },
        },
    },
});

export default theme;
