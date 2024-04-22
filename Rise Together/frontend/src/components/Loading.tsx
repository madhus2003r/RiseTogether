import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

const FullScreenLoading = () => {
    return (
        <Backdrop open={true}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default FullScreenLoading;
