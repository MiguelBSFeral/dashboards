import {alpha, Box, styled, SxProps} from '@mui/material';
import {ReactNode} from 'react';
import SimpleBar, {Props as SimpleBarProps} from 'simplebar-react';

type ScrollBarProps = SimpleBarProps & {
    sx?: SxProps;
    children?: ReactNode;
};

const StyledSimpleBar = styled(SimpleBar)(({theme}) => ({
    maxHeight: '100%',
    '& .simplebar-scrollbar': {
        '&:before': {
            backgroundColor: alpha(theme.palette.grey[600], 0.48),
        },
        '&.simplebar-visible:before': {
            opacity: 1,
        },
    },
    '& .simplebar-mask': {
        zIndex: 'inherit',
    },
}));

function ScrollBar(props: ScrollBarProps) {
    const {sx, children, ...rest} = props;

    const userAgent =
        typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

    const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            userAgent,
        );

    if (isMobile) {
        return (
            <Box sx={{overflowX: 'auto', ...sx}} {...rest}>
                {children}
            </Box>
        );
    }

    return (
        <Box
            sx={{
                flexGrow: 1,
                height: '100%',
                overflow: 'hidden',
            }}>
            <StyledSimpleBar clickOnTrack={false} sx={sx} {...rest}>
                {children}
            </StyledSimpleBar>
        </Box>
    );
}

export default ScrollBar;
