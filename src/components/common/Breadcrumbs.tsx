import {
    Box,
    Breadcrumbs as MuiBreadcrumbs,
    BreadcrumbsProps as MuiBreadcrumbsProps,
    Link as MuiLink,
    Stack,
    Typography,
} from '@mui/material';
import {ReactNode} from 'react';
import {Link as RouterLink} from 'react-router-dom';

type LinkProps = {
    label: string;
    href: string;
    icon?: ReactNode;
    active?: boolean;
    disabled?: boolean;
};

function Link(props: LinkProps) {
    const {label, href, icon, active, disabled} = props;

    const styles = {
        display: 'inline-flex',
        alignItems: 'center',
        typography: 'body2',
        color: 'text.primary',
        ...(disabled &&
            !active && {
                color: 'text.disabled',
                cursor: 'default',
                pointerEvents: 'none',
            }),
    };

    return (
        <MuiLink component={RouterLink} to={href} sx={styles}>
            {icon && (
                <Box
                    component="span"
                    sx={{
                        display: 'inherit',
                        marginRight: 1,
                        '& svg': {width: 20, height: 20},
                    }}>
                    {icon}
                </Box>
            )}
            {label}
        </MuiLink>
    );
}

function Separator() {
    return (
        <Box
            component="span"
            sx={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: 'text.disabled',
            }}
        />
    );
}

type BreadcrumbsProps = MuiBreadcrumbsProps & {
    heading?: string;
    moreLink?: string[];
    activeLast?: boolean;
    action?: React.ReactNode;
    links: LinkProps[];
};

function Breadcrumbs({links, action, heading, sx, ...rest}: BreadcrumbsProps) {
    return (
        <Box sx={{mb: 1, ...sx}}>
            <Stack direction="row" alignItems="center">
                <Box sx={{flexGrow: 1}}>
                    {heading && (
                        <Typography variant="h4" gutterBottom>
                            {heading}
                        </Typography>
                    )}
                    {!!links.length && (
                        <MuiBreadcrumbs separator={<Separator />} {...rest}>
                            {links.map((link, index) => (
                                <Link
                                    key={link.label || ''}
                                    disabled={index === links.length - 1}
                                    {...link}
                                />
                            ))}
                        </MuiBreadcrumbs>
                    )}
                </Box>
                {action && <Box sx={{flexShrink: 0}}>{action}</Box>}
            </Stack>
        </Box>
    );
}

export default Breadcrumbs;
