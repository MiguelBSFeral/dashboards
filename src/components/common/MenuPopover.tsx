import {
    alpha,
    Box,
    BoxProps,
    Popover,
    PopoverOrigin,
    PopoverProps,
    useTheme,
} from '@mui/material';

function getPosition(arrow: string) {
    let props;
    switch (arrow) {
        case 'top-left':
            props = {
                style: {marginLeft: -0.75},
                anchorOrigin: {vertical: 'bottom', horizontal: 'left'},
                transformOrigin: {vertical: 'top', horizontal: 'left'},
            };
            break;
        case 'top-center':
            props = {
                style: {},
                anchorOrigin: {vertical: 'bottom', horizontal: 'center'},
                transformOrigin: {vertical: 'top', horizontal: 'center'},
            };
            break;
        case 'top-right':
            props = {
                style: {marginLeft: 0.75},
                anchorOrigin: {vertical: 'bottom', horizontal: 'right'},
                transformOrigin: {vertical: 'top', horizontal: 'right'},
            };
            break;
        case 'bottom-left':
            props = {
                style: {marginLeft: -0.75},
                anchorOrigin: {vertical: 'top', horizontal: 'left'},
                transformOrigin: {vertical: 'bottom', horizontal: 'left'},
            };
            break;
        case 'bottom-center':
            props = {
                style: {},
                anchorOrigin: {vertical: 'top', horizontal: 'center'},
                transformOrigin: {vertical: 'bottom', horizontal: 'center'},
            };
            break;
        case 'bottom-right':
            props = {
                style: {marginLeft: 0.75},
                anchorOrigin: {vertical: 'top', horizontal: 'right'},
                transformOrigin: {vertical: 'bottom', horizontal: 'right'},
            };
            break;
        case 'left-top':
            props = {
                style: {mt: -0.75},
                anchorOrigin: {vertical: 'top', horizontal: 'right'},
                transformOrigin: {vertical: 'top', horizontal: 'left'},
            };
            break;
        case 'left-center':
            props = {
                anchorOrigin: {vertical: 'center', horizontal: 'right'},
                transformOrigin: {vertical: 'center', horizontal: 'left'},
            };
            break;
        case 'left-bottom':
            props = {
                style: {mt: 0.75},
                anchorOrigin: {vertical: 'bottom', horizontal: 'right'},
                transformOrigin: {vertical: 'bottom', horizontal: 'left'},
            };
            break;
        case 'right-top':
            props = {
                style: {mt: -0.75},
                anchorOrigin: {vertical: 'top', horizontal: 'left'},
                transformOrigin: {vertical: 'top', horizontal: 'right'},
            };
            break;
        case 'right-center':
            props = {
                anchorOrigin: {vertical: 'center', horizontal: 'left'},
                transformOrigin: {vertical: 'center', horizontal: 'right'},
            };
            break;
        case 'right-bottom':
            props = {
                style: {mt: 0.75},
                anchorOrigin: {vertical: 'bottom', horizontal: 'left'},
                transformOrigin: {vertical: 'bottom', horizontal: 'right'},
            };
            break;
        // top-right
        default:
            props = {
                style: {marginLeft: 0.75},
                anchorOrigin: {vertical: 'bottom', horizontal: 'right'},
                transformOrigin: {vertical: 'top', horizontal: 'right'},
            };
    }
    return props;
}

type StyledArrowProps = BoxProps & {
    arrowPosition: MenuPopoverArrowPosition;
};

function StyledArrow(props: StyledArrowProps) {
    const {arrowPosition, sx, children, ...rest} = props;
    const theme = useTheme();
    const size = 12;
    const position = -(size / 2);
    const borderStyle = `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`;
    const topStyle = {
        top: position,
        borderBottom: borderStyle,
        borderRight: borderStyle,
        borderRadius: '0 0 3px 0',
    };
    const bottomStyle = {
        bottom: position,
        borderTop: borderStyle,
        borderLeft: borderStyle,
        borderRadius: '3px 0 0 0',
    };
    const leftStyle = {
        left: position,
        borderTop: borderStyle,
        borderRight: borderStyle,
        borderRadius: '0 3px 0 0',
    };
    const rightStyle = {
        right: position,
        borderBottom: borderStyle,
        borderLeft: borderStyle,
        borderRadius: '0 0 0 3px',
    };

    return (
        <Box
            sx={{
                display: 'none',
                [theme.breakpoints.up('sm')]: {
                    position: 'absolute',
                    zIndex: 1,
                    display: 'block',
                    width: size,
                    height: size,
                    content: "''",
                    transform: 'rotate(-135deg)',
                    background: theme.palette.background.paper,
                },
                // Top
                ...(arrowPosition === 'top-left' && {...topStyle, left: 20}),
                ...(arrowPosition === 'top-center' && {
                    ...topStyle,
                    left: 0,
                    right: 0,
                    margin: 'auto',
                }),
                ...(arrowPosition === 'top-right' && {...topStyle, right: 20}),
                // Bottom
                ...(arrowPosition === 'bottom-left' && {...bottomStyle, left: 20}),
                ...(arrowPosition === 'bottom-center' && {
                    ...bottomStyle,
                    left: 0,
                    right: 0,
                    margin: 'auto',
                }),
                ...(arrowPosition === 'bottom-right' && {...bottomStyle, right: 20}),
                // Left
                ...(arrowPosition === 'left-top' && {...leftStyle, top: 20}),
                ...(arrowPosition === 'left-center' && {
                    ...leftStyle,
                    top: 0,
                    bottom: 0,
                    margin: 'auto',
                }),
                ...(arrowPosition === 'left-bottom' && {...leftStyle, bottom: 20}),
                // Right
                ...(arrowPosition === 'right-top' && {...rightStyle, top: 20}),
                ...(arrowPosition === 'right-center' && {
                    ...rightStyle,
                    top: 0,
                    bottom: 0,
                    margin: 'auto',
                }),
                ...(arrowPosition === 'right-bottom' && {...rightStyle, bottom: 20}),
            }}
            component="span"
            {...rest}>
            {children}
        </Box>
    );
}

type MenuPopoverArrowPosition =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
    | 'left-top'
    | 'left-center'
    | 'left-bottom'
    | 'right-top'
    | 'right-center'
    | 'right-bottom';

type MenuPopoverProps = Omit<PopoverProps, 'open'> & {
    anchorEl: HTMLElement | null;
    arrowPosition?: MenuPopoverArrowPosition;
    disabledArrow?: boolean;
};

function MenuPopover({
                         anchorEl,
                         children,
                         arrowPosition = 'top-right',
                         disabledArrow,
                         sx,
                         ...rest
                     }: MenuPopoverProps) {
    const {style, anchorOrigin, transformOrigin} = getPosition(arrowPosition);

    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            anchorOrigin={anchorOrigin as PopoverOrigin}
            transformOrigin={transformOrigin as PopoverOrigin}
            PaperProps={{
                sx: {
                    padding: 1,
                    width: 'auto',
                    overflow: 'inherit',
                    ...style,
                    '& .MuiMenuItem-root': {
                        paddingInline: 1,
                        typography: 'body2',
                        borderRadius: 0.75,
                        '& svg': {marginRight: 2, width: 20, height: 20, flexShrink: 0},
                    },
                    ...sx,
                },
            }}
            {...rest}>
            {!disabledArrow && <StyledArrow arrowPosition={arrowPosition} />}
            {children}
        </Popover>
    );
}

export default MenuPopover;
