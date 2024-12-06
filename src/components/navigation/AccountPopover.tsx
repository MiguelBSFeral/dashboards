import {alpha, Box, Divider, MenuItem, Stack, Typography} from '@mui/material';
import {Fragment, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import AnimatedIconButton from '../common/animated/IconButton';
import Avatar from '../common/Avatar';
import MenuPopover from '../common/MenuPopover';

const links = [
    {label: 'Home', to: '/dashboard-v1'},
    {label: 'Profile', to: '/users/profile'},
];

function AccountPopover() {
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const username = 'Feralbyte';
    const email = 'feralbyte@feralbyte.com';

    return (
        <Fragment>
            <AnimatedIconButton
                sx={{
                    padding: 0,
                    ...(anchorEl && {
                        '&:before': {
                            position: 'absolute',
                            zIndex: 1,
                            content: "''",
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.5),
                        },
                    }),
                }}
                onClick={(event) => setAnchorEl(event.currentTarget)}>
                <Avatar name={username} />
            </AnimatedIconButton>
            <MenuPopover
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                sx={{width: 200, padding: 0}}>
                <Box sx={{marginBlock: 1.5, paddingInline: 2.5}}>
                    <Typography variant="subtitle2" noWrap>
                        {username}
                    </Typography>
                    <Typography variant="body2" sx={{color: 'text.secondary'}} noWrap>
                        {email}
                    </Typography>
                </Box>
                <Divider sx={{borderStyle: 'dashed'}} />
                <Stack sx={{padding: 1}}>
                    {links.map((link) => (
                        <MenuItem key={link.label} onClick={() => navigate(link.to)}>
                            {link.label}
                        </MenuItem>
                    ))}
                </Stack>
                <Divider sx={{borderStyle: 'dashed'}} />
                <MenuItem sx={{margin: 1}}>
                    Logout
                </MenuItem>
            </MenuPopover>
        </Fragment>
    );
}

export default AccountPopover;
