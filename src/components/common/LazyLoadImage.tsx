import {Box, BoxProps} from '@mui/material';
import {forwardRef} from 'react';
import {
    LazyLoadImage as RLLICLazyLoadImage,
    LazyLoadImageProps as RLLICLazyLoadImageProps,
} from 'react-lazy-load-image-component';

export type ImageRatio =
    | '4/3'
    | '3/4'
    | '6/4'
    | '4/6'
    | '16/9'
    | '9/16'
    | '21/9'
    | '9/21'
    | '1/1';

type LazyLoadImageProps = BoxProps &
    RLLICLazyLoadImageProps & {
    ratio?: ImageRatio;
    disableEffect?: boolean;
};

function getRatio(ratio: ImageRatio) {
    return {
        '4/3': 'calc(100% / 4 * 3)',
        '3/4': 'calc(100% / 3 * 4)',
        '6/4': 'calc(100% / 6 * 4)',
        '4/6': 'calc(100% / 4 * 6)',
        '16/9': 'calc(100% / 16 * 9)',
        '9/16': 'calc(100% / 9 * 16)',
        '21/9': 'calc(100% / 21 * 9)',
        '9/21': 'calc(100% / 9 * 21)',
        '1/1': '100%',
    }[ratio];
}

const LazyLoadImage = forwardRef<HTMLSpanElement, LazyLoadImageProps>(
    ({ratio, disableEffect = false, effect = 'blur', sx, ...other}, ref) => {
        const content = (
            <Box
                component={RLLICLazyLoadImage}
                wrapperClassName="wrapper"
                effect={disableEffect ? undefined : effect}
                placeholderSrc={
                    disableEffect ? '/assets/transparent.png' : '/assets/placeholder.svg'
                }
                sx={{width: 1, height: 1, objectFit: 'cover'}}
                {...other}
            />
        );

        if (ratio) {
            return (
                <Box
                    ref={ref}
                    component="span"
                    sx={{
                        position: 'relative',
                        display: 'block',
                        width: 1,
                        lineHeight: 1,
                        overflow: 'hidden',
                        paddingTop: getRatio(ratio),
                        '& .wrapper': {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: 1,
                            height: 1,
                            backgroundSize: 'cover !important',
                        },
                        ...sx,
                    }}>
                    {content}
                </Box>
            );
        }

        return (
            <Box
                ref={ref}
                component="span"
                sx={{
                    position: 'relative',
                    display: 'block',
                    overflow: 'hidden',
                    lineHeight: 1,
                    '& .wrapper': {
                        width: 1,
                        height: 1,
                        backgroundSize: 'cover !important',
                    },
                    ...sx,
                }}>
                {content}
            </Box>
        );
    },
);

export default LazyLoadImage;
