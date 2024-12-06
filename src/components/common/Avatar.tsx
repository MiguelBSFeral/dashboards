import {
    Avatar as MuiAvatar,
    AvatarProps as MuiAvatarProps,
    Badge,
    BadgeProps,
    useTheme,
} from '@mui/material';
import {forwardRef} from 'react';

const getFirstChar = (name: string) => name && name.charAt(0).toUpperCase();

type AvatarProps = MuiAvatarProps & {
    name?: string;
    size?: 'tiny' | 'small' | 'medium' | 'large';
    color?:
        | 'default'
        | 'primary'
        | 'secondary'
        | 'info'
        | 'success'
        | 'warning'
        | 'error';
    compact?: boolean;
    BadgeProps?: BadgeProps;
};

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
    ({name = '', sx, color = 'primary', children, BadgeProps, ...rest}, ref) => {
        const theme = useTheme();
        const firstChar = getFirstChar(name);

        const content =
            color === 'default' ? (
                <MuiAvatar ref={ref} sx={sx} {...rest}>
                    {firstChar}
                    {children}
                </MuiAvatar>
            ) : (
                <MuiAvatar
                    ref={ref}
                    sx={{
                        color: theme.palette[color]?.contrastText,
                        backgroundColor: theme.palette[color]?.main,
                        fontWeight: theme.typography.fontWeightMedium,
                        ...sx,
                    }}
                    {...rest}>
                    {firstChar}
                    {children}
                </MuiAvatar>
            );

        return BadgeProps ? (
            <Badge
                overlap="circular"
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                {...BadgeProps}>
                {content}
            </Badge>
        ) : (
            content
        );
    },
);

export default Avatar;
