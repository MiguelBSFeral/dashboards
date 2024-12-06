import {
    Box,
    IconButton,
    IconButtonProps,
    Stack,
    useTheme,
} from '@mui/material';
import {Fragment} from 'react';
import {bgBlur} from '../../utils/css';
import Iconify from '../common/Iconify';
import {navbarConstants} from '../layouts/constants';
import NavList from './CollapsedNavList';
import navConfig from './config';

function ExpandButton(props: IconButtonProps) {
    const {sx, onClick, ...rest} = props;
    const theme = useTheme();
    return (
        <IconButton
            size="small"
            onClick={onClick}
            sx={{
                position: 'fixed',
                top: 32,
                left: navbarConstants.collapsedDashboardWidth - 12,
                padding: 0.5,
                zIndex: theme.zIndex.appBar + 1,
                border: `dashed 1px ${theme.palette.divider}`,
                ...bgBlur({opacity: 0.48, color: theme.palette.background.default}),
                '&:hover': {
                    bgcolor: 'background.default',
                },
                ...sx,
            }}
            {...rest}>
            <Iconify icon="eva:arrow-ios-forward-fill" width={16} />
        </IconButton>
    );
}

type CollapsedSidebarProps = {
    onExpand: () => void;
};

function CollapsedSidebar(props: CollapsedSidebarProps) {
    const {onExpand} = props;

    return (
        <Box
            component="nav"
            sx={{
                flexShrink: {lg: 0},
                width: {lg: navbarConstants.collapsedDashboardWidth},
            }}>
            <ExpandButton onClick={onExpand} />
            <Stack
                sx={{
                    position: 'fixed',
                    width: navbarConstants.collapsedDashboardWidth,
                    height: 1,
                    paddingBottom: 2,
                    borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    overflowX: 'scroll',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}>
                <Stack
                    spacing={0.5}
                    alignItems="center"
                    sx={{
                        paddingInline: 0.75,
                    }}>
                    {navConfig.map((navSection, index) => (
                        <Fragment key={index}>
                            {navSection.items.map((item, index) => (
                                <NavList key={index} item={{...item, depth: 1}} depth={1} />
                            ))}
                            {index === navSection.items.length - 1 && (
                                <Box
                                    sx={{
                                        width: 24,
                                        height: '1px',
                                        backgroundColor: 'divider',
                                        marginBlock: '8px !important',
                                    }}
                                />
                            )}
                        </Fragment>
                    ))}
                </Stack>
            </Stack>
        </Box>
    );
}

export default CollapsedSidebar;
