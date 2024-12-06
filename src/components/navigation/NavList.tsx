import {
    alpha,
    Box,
    Collapse,
    Link,
    ListItemButton,
    ListItemButtonProps,
    ListItemIcon,
    ListItemText,
    Tooltip,
    useTheme,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, matchPath } from 'react-router-dom';
import Iconify from '../common/Iconify';
import { navbarConstants } from '../layouts/constants';

type NavItemProps = ListItemButtonProps & {
    title: string;
    path: string;
    icon?: JSX.Element;
    info?: JSX.Element;
    caption?: string;
    depth: number;
    active?: boolean;
    open?: boolean;
    disabled?: boolean;
    isExternalLink?: boolean;
    children?: NavItemProps[];
};

function NavItem(props: NavItemProps) {
    const {
        title,
        path,
        icon,
        info,
        caption,
        depth,
        active,
        open,
        disabled,
        isExternalLink,
        children,
        ...rest
    } = props;
    const theme = useTheme();
    const isLight = theme.palette.mode === 'light';
    const subItem = depth !== 1;
    const activeStyle = {
        color: theme.palette.primary.main,
        backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
        ),
        ...(!isLight && {
            color: theme.palette.primary.light,
        }),
    };
    const activeSubStyle = {
        color: theme.palette.text.primary,
        backgroundColor: 'transparent',
    };

    const content = (
        <ListItemButton
            sx={{
                position: 'relative',
                height: navbarConstants.dashboardItemHeight,
                paddingLeft: theme.spacing(2),
                paddingRight: theme.spacing(1.5),
                textTransform: 'capitalize',
                color: theme.palette.text.secondary,
                borderRadius: '8px',
                // Sub item
                ...(subItem && {
                    height: navbarConstants.dashboardSubItemHeight,
                    ...(depth > 2 && {
                        paddingLeft: theme.spacing(depth),
                    }),
                    ...(caption && {
                        height: navbarConstants.dashboardItemHeight,
                    }),
                }),
                ...(active && {
                    ...activeStyle,
                    '&:hover': {
                        ...activeStyle,
                    },
                }),
                ...(subItem &&
                    active && {
                        ...activeSubStyle,
                        '&:hover': {
                            ...activeSubStyle,
                        },
                    }),
                ...(disabled && {
                    '&.Mui-disabled': {
                        opacity: 0.64,
                    },
                }),
            }}
            disabled={disabled}
            {...rest}>
            {icon && (
                <ListItemIcon
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 24,
                        height: 24,
                    }}>
                    {icon}
                </ListItemIcon>
            )}
            {subItem && (
                <ListItemIcon>
                    <Box
                        component="span"
                        sx={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.text.disabled,
                            transition: theme.transitions.create('transform', {
                                duration: theme.transitions.duration.shorter,
                            }),
                            ...(active && {
                                transform: 'scale(2)',
                                backgroundColor: theme.palette.primary.main,
                            }),
                        }}
                    />
                </ListItemIcon>
            )}
            <ListItemText
                primary={title}
                secondary={
                    caption && (
                        <Tooltip title={caption} placement="top-start">
                            <span>{caption}</span>
                        </Tooltip>
                    )
                }
                primaryTypographyProps={{
                    component: 'span',
                    variant: active ? 'subtitle2' : 'body2',
                    noWrap: true,
                }}
                secondaryTypographyProps={{
                    variant: 'caption',
                    noWrap: true,
                }}
            />
            {info && (
                <Box component="span" sx={{ lineHeight: 0 }}>
                    {info}
                </Box>
            )}
            {children && (
                <Iconify
                    icon={
                        open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'
                    }
                    sx={{ ml: 1, flexShrink: 0 }}
                    width={16}
                />
            )}
        </ListItemButton>
    );

    if (isExternalLink)
        return (
            <Link href={path} target="_blank" rel="noopener" underline="none">
                {content}
            </Link>
        );

    if (children) {
        return content;
    }

    return (
        <Link component={RouterLink} to={path} underline="none">
            {content}
        </Link>
    );
}

type NavSubListProps = {
    items: NavItemProps[];
    depth: number;
};

function NavSubList(props: NavSubListProps) {
    const { items, depth } = props;
    return (
        <Fragment>
            {items.map((item, index) => (
                <NavList key={index} item={item} depth={depth + 1} />
            ))}
        </Fragment>
    );
}

function isNavItemActive(item: NavItemProps, currentPath: string): boolean {
    const match = matchPath({ path: item.path, end: false }, currentPath) != null;
    if (match) {
        return true;
    }
    if (item.children) {
        return item.children.some(child => isNavItemActive(child, currentPath));
    }
    return false;
}

type NavListProps = {
    item: NavItemProps;
    depth: number;
};

function NavList(props: NavListProps) {
    const { item, depth } = props;
    const { pathname } = useLocation();
    const isExternalLink = item.path.includes('http');
    const active = isNavItemActive(item, pathname);
    const [open, setOpen] = useState(active);

    useEffect(() => {
        if (active) {
            setOpen(true);
        }
    }, [active]);

    return (
        <Fragment>
            <NavItem
                {...item}
                depth={depth}
                active={active}
                open={open}
                isExternalLink={isExternalLink}
                onClick={() => setOpen(!open)}
            />
            {item.children && (
                <Collapse in={open} unmountOnExit>
                    <NavSubList items={item.children} depth={depth} />
                </Collapse>
            )}
        </Fragment>
    );
}

export default NavList;
