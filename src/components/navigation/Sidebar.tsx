import {
    alpha,
    Box,
    Drawer,
    IconButton,
    IconButtonProps,
    Link,
    List,
    ListSubheader,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {Fragment} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {bgBlur} from '../../utils/css';
import Avatar from '../common/Avatar';
import Iconify from '../common/Iconify';
import ScrollBar from '../common/ScrollBar';
import navConfig from './config';
import NavList from './NavList';

function CollapseButton(props: IconButtonProps) {
    const {sx, onClick, ...rest} = props;
    const theme = useTheme();
    return (
        <IconButton
            size="small"
            onClick={onClick}
            sx={{
                p: 0.5,
                top: 32,
                position: 'fixed',
                left: 280 - 12,
                zIndex: theme.zIndex.appBar + 1,
                border: `dashed 1px ${theme.palette.divider}`,
                ...bgBlur({opacity: 0.48, color: theme.palette.background.default}),
                '&:hover': {
                    bgcolor: 'background.default',
                },
                ...sx,
            }}
            {...rest}>
            <Iconify width={16} icon="eva:arrow-ios-back-fill" />
        </IconButton>
    );
}

function Account() {
    let role = 'Admin';
    let username = 'Feralbyte';

    return (
        <Link component={RouterLink} to="/users/profile" underline="none" color="inherit">
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: (theme) => theme.spacing(2, 2.5),
                    borderRadius: '16px',
                    backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.12),
                }}>
                <Avatar name={'Feralbyte'} />
                <Box sx={{ml: 2, minWidth: 0}}>
                    <Typography variant="subtitle2" noWrap>
                        {username}
                    </Typography>
                    <Typography variant="body2" noWrap sx={{color: 'text.secondary'}}>
                        {role}
                    </Typography>
                </Box>
            </Box>
        </Link>
    );
}

type SidebarProps = {
    isDrawerOpen: boolean;
    onCloseDrawer: () => void;
    onCollapse: () => void;
};

function Sidebar(props: SidebarProps) {
    const {isDrawerOpen, onCloseDrawer, onCollapse} = props;
    const theme = useTheme();

    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

    const content = (
        <ScrollBar
            sx={{
                height: 1,
                '& .simplebar-content': {
                    height: 1,
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}>
            <Stack
                spacing={3}
                sx={{
                    paddingTop: 3,
                    paddingBottom: 2,
                    paddingInline: 2.5,
                    flexShrink: 0,
                }}>
                <Account />
            </Stack>
            <Stack>
                {navConfig.map((section, index) => (
                    <List key={index} disablePadding sx={{paddingInline: 2}}>
                        {section.subheader && (
                            <ListSubheader
                                sx={{
                                    ...theme.typography.overline,
                                    fontSize: 11,
                                    paddingTop: theme.spacing(3),
                                    paddingBottom: theme.spacing(1),
                                    color: theme.palette.text.secondary,
                                }}
                                disableSticky>
                                {section.subheader}
                            </ListSubheader>
                        )}
                        {section.items.map((item, index) => (
                            <NavList key={index} item={{...item, depth: 1}} depth={1} />
                        ))}
                    </List>
                ))}
            </Stack>
        </ScrollBar>
    );

    return (
        <Box sx={{flexShrink: {lg: 0}, width: {lg: 280}}} component="nav">
            {isLargeScreen ? (
                <Fragment>
                    <CollapseButton onClick={onCollapse} />
                    <Drawer
                        open
                        variant="permanent"
                        PaperProps={{
                            sx: {
                                zIndex: 0,
                                width: 280,
                                bgcolor: 'transparent',
                                borderRightStyle: 'dashed',
                            },
                        }}>
                        {content}
                    </Drawer>
                </Fragment>
            ) : (
                <Drawer
                    open={isDrawerOpen}
                    onClose={onCloseDrawer}
                    ModalProps={{keepMounted: true}}
                    PaperProps={{sx: {width: 280}}}>
                    {content}
                </Drawer>
            )}
        </Box>
    );
}

export default Sidebar;
