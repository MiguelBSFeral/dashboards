import {Box, useMediaQuery, useTheme} from '@mui/material';
import {useEffect, useState} from 'react';
import {Outlet, useLocation} from 'react-router-dom';
import CollapsedSidebar from '../navigation/CollapsedSidebar';
import Sidebar from '../navigation/Sidebar';

function DashboardLayout() {
    const {pathname} = useLocation();
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        setIsDrawerOpen(false);
    }, [pathname]);

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Box display="flex" flex="1" overflow="hidden">
                {isSidebarCollapsed && isLargeScreen ? (
                    <CollapsedSidebar onExpand={() => setIsSidebarCollapsed(false)} />
                ) : (
                    <Sidebar
                        onCollapse={() => setIsSidebarCollapsed(true)}
                        isDrawerOpen={isDrawerOpen}
                        onCloseDrawer={() => setIsDrawerOpen(false)}
                    />
                )}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        padding: '5px + 10px',
                    }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}

export default DashboardLayout;
