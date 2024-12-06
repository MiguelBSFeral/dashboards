import {Icon, IconifyIcon} from '@iconify/react';
import {Box, BoxProps} from '@mui/material';
import {forwardRef} from 'react';

type IconifyProps = BoxProps & {
    icon: IconifyIcon | string;
};

const Iconify = forwardRef<SVGElement, IconifyProps>(
    ({icon, width = 20, sx, ...rest}, ref) => (
        <Box
            ref={ref}
            component={Icon}
            icon={icon}
            sx={{width, height: width, ...sx}}
            {...rest}
        />
    ),
);

export default Iconify;
