import {forwardRef} from 'react';
import {Box, BoxProps} from '@mui/material';

type SvgIconProps = BoxProps & {
    src: string;
};

const SvgIcon = forwardRef<HTMLSpanElement, SvgIconProps>(
    ({src, sx, ...other}, ref) => (
        <Box
            component="span"
            className="svg-color"
            ref={ref}
            sx={{
                display: 'inline-block',
                width: 24,
                height: 24,
                backgroundColor: 'currentColor',
                mask: `url(${src}) no-repeat center / contain`,
                WebkitMask: `url(${src}) no-repeat center / contain`,
                ...sx,
            }}
            {...other}
        />
    ),
);

export default SvgIcon;
