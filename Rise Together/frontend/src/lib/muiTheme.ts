import { grey } from '@mui/material/colors';
import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#9c27b0',
        },
        text: {
            primary: '#000000',
            secondary: 'rgba(0, 0, 0, 0.6)',
            disabled: 'rgba(0, 0, 0, 0.4)',
        },
        background: {
            default: '#ffffff', // White background
            paper: '#ffffff', // White background
        },
        error: {
            main: '#f44336',
        },
        warning: {
            main: '#ff9800',
        },
        info: {
            main: '#2196f3',
        },
        success: {
            main: '#4caf50',
        },
        divider: 'rgba(0, 0, 0, 0.12)',
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    border: 'none', // Remove default border
                },
            },
        },
    },
};

const muiTheme = createTheme(themeOptions);

export default muiTheme;
