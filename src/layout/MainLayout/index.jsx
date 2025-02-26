import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Toolbar, useMediaQuery } from '@mui/material';

// project import
import Drawer from './Drawer';
import Header from './Header';
import navigation from '@menuItems';
import Breadcrumbs from '@components/@extended/Breadcrumbs';

// types
import { openDrawer } from '@store/reducers/menu';
import { isTauri } from '@utils/Tauri';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    const theme = useTheme();
    const matchDownLG = useMediaQuery(theme.breakpoints.down('xl'));
    const dispatch = useDispatch();

    const { drawerOpen } = useSelector((state) => state.menu);

    // drawer toggler
    const [open, setOpen] = useState(drawerOpen);
    const handleDrawerToggle = () => {
        setOpen(!open);
        dispatch(openDrawer({ drawerOpen: !open }));
    };

    // set media wise responsive drawer
    useEffect(() => {
        setOpen(!matchDownLG);
        dispatch(openDrawer({ drawerOpen: !matchDownLG }));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchDownLG]);

    useEffect(() => {
        if (matchDownLG) {
            setOpen(false);
            dispatch(openDrawer({ drawerOpen: false }));
        }
    }, [window.location.href]);

    useEffect(() => {
        if (open !== drawerOpen) {
            setOpen(drawerOpen);
            dispatch(openDrawer({ drawerOpen: drawerOpen }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drawerOpen, window.location.href]);

    return (
        <>
            <Box sx={{ display: 'flex', maxWidth: '100wh', maxHeight: isTauri ? 'calc(100vh - 44px)!important' : 'calc(100vh)!important', overflow: 'hidden'}}>
                <Header open={open} handleDrawerToggle={handleDrawerToggle} />
                <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
                <Box
                    component="main"
                    sx={{
                        width: '100wh',
                        flexGrow: 1,
                        p: { xs: 2, sm: 3 },
                        mt: isTauri ? 6 : 2,
                        overflow: "hidden",
                        overflowY: "scroll",
                        height: isTauri ? 'calc(100vh - 94px)!important' : 'calc(100vh - 61px)!important' // You can adjust the max height as needed
                    }}
                >
                    <Toolbar />
                    <Breadcrumbs navigation={navigation} title titleBottom card={false} divider={false} />
                    <Outlet />
                </Box>
            </Box>
        </>
    );
};

export default MainLayout;
