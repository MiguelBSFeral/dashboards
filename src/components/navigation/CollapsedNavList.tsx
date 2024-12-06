import {
    alpha,
    Link,
    ListItemButton,
    ListItemButtonProps,
    ListItemIcon,
    ListItemText,
    Popover,
    Tooltip,
    useTheme,
} from '@mui/material';
import { forwardRef, Fragment, useEffect, useRef, useState } from 'react';
import { Link as RouterLink, matchPath, useLocation } from 'react-router-dom';
import { bgBlur } from '../../utils/css';
import Iconify from '../common/Iconify';

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
    children?: NavItemProps[]; // Updated type for children
};

const NavItem = forwardRef<HTMLDivElement, NavItemProps>((props, ref) => {
    const {
        title,
        path,
        icon,
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
    const hoverStyle = {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.action.hover,
    };

    const content = (
        <ListItemButton
            ref={ref}
            sx={{
                flexDirection: 'column',
                textTransform: 'capitalize',
                padding: theme.spacing(1, 0, 0.5, 0),
                color: theme.palette.text.secondary,
                borderRadius: '8px',
                '&:hover': hoverStyle,
                ...(subItem && {
                    flexDirection: 'row',
                    padding: theme.spacing(1),
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
                ...(open && !active && hoverStyle),
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
                        width: 22,
                        height: 22,
                        marginRight: 0,
                        marginBottom: '4px',
                    }}>
                    {icon}
                </ListItemIcon>
            )}
            <ListItemText
                primary={title}
                primaryTypographyProps={{
                    noWrap: true,
                    sx: {
                        width: 72,
                        fontSize: 10,
                        lineHeight: '16px',
                        textAlign: 'center',
                        ...(active && {
                            fontWeight: 'fontWeightMedium',
                        }),
                        ...(subItem && {
                            width: 'auto',
                            fontSize: 14,
                            textAlign: 'left',
                        }),
                    },
                }}
            />
            {caption && (
                <Tooltip title={caption} arrow placement="right">
                    <Iconify
                        icon="eva:info-outline"
                        width={16}
                        sx={{
                            position: 'absolute',
                            top: 11,
                            left: 6,
                        }}
                    />
                </Tooltip>
            )}
            {children && (
                <Iconify
                    width={16}
                    icon="eva:chevron-right-fill"
                    sx={{
                        position: 'absolute',
                        top: 11,
                        right: 6,
                    }}
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

    return (
        <Link component={RouterLink} to={path} underline="none">
            {content}
        </Link>
    );
});

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
        return item.children.some((child) => isNavItemActive(child, currentPath));
    }
    return false;
}

type NavListProps = {
    item: NavItemProps;
    depth: number;
};

function NavList(props: NavListProps) {
    const { item, depth } = props;
    const theme = useTheme();
    const { pathname } = useLocation();
    const isExternalLink = item.path.includes('http');
    const active = isNavItemActive(item, pathname);

    const [open, setOpen] = useState(false);

    const navRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const appBarEl = Array.from(
            document.querySelectorAll('.MuiAppBar-root'),
        ) as Array<HTMLElement>;
        document.body.style.overflow = '';
        document.body.style.padding = '';
        appBarEl.forEach((elem: HTMLElement) => {
            elem.style.padding = '';
        });
    }, [open]);

    return (
        <Fragment>
            <NavItem
                {...item}
                ref={navRef}
                depth={depth}
                active={active}
                open={open}
                isExternalLink={isExternalLink}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            />
            {item.children && (
                <Popover
                    sx={{
                        pointerEvents: 'none',
                        '& .MuiPopover-paper': {
                            width: 160,
                            padding: theme.spacing(1),
                            marginTop: theme.spacing(0.5),
                            borderRadius: '12px',
                            boxShadow: theme.customShadows.dropdown,
                            pointerEvents: 'auto',
                            ...bgBlur({ color: theme.palette.background.default }),
                        },
                    }}
                    open={open}
                    anchorEl={navRef.current}
                    anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'center', horizontal: 'left' }}
                    PaperProps={{
                        onMouseEnter: () => setOpen(true),
                        onMouseLeave: () => setOpen(false),
                    }}>
                    <NavSubList items={item.children} depth={depth} />
                </Popover>
            )}
        </Fragment>
    );
}

export default NavList;
