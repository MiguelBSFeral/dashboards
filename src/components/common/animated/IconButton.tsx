import {IconButton, IconButtonProps} from '@mui/material';
import {forwardRef} from 'react';
import AnimatedWrapper from './Wrapper';

const AnimatedIconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({children, size = 'medium', ...rest}, ref) => (
        <AnimatedWrapper size={size}>
            <IconButton ref={ref} size={size} {...rest}>
                {children}
            </IconButton>
        </AnimatedWrapper>
    ),
);

export default AnimatedIconButton;
