import {Box} from '@mui/material';
import {m} from 'framer-motion';
import {ReactNode} from 'react';

type AnimatedWrapperProps = {
    size: 'small' | 'medium' | 'large';
    children: ReactNode;
};

const smallVariant = {
    hover: {scale: 1.1},
    tap: {scale: 0.95},
};

const mediumVariant = {
    hover: {scale: 1.09},
    tap: {scale: 0.97},
};

const largeVariant = {
    hover: {scale: 1.08},
    tap: {scale: 0.99},
};

function AnimatedWrapper(props: AnimatedWrapperProps) {
    const {size, children} = props;
    const isSmall = size === 'small';
    const isLarge = size === 'large';

    return (
        <Box
            component={m.div}
            whileTap="tap"
            whileHover="hover"
            variants={
                (isSmall && smallVariant) || (isLarge && largeVariant) || mediumVariant
            }
            sx={{display: 'inline-flex'}}>
            {children}
        </Box>
    );
}

export default AnimatedWrapper;
