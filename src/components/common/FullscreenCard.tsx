import React, {useRef, useState} from 'react';
import {Card, IconButton, SxProps} from '@mui/material';
import Iconify from './Iconify';

type FullscreenCardProps = {
    children: React.ReactNode;
    sx?: SxProps;
}

function FullscreenCard(props: FullscreenCardProps) {
    const {children, sx} = props;
    const [isFullscreen, setIsFullscreen] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const toggleFullscreen = () => {
        if (!isFullscreen && cardRef.current) {
            cardRef.current.requestFullscreen();
        } else if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
    };

    return (
        <Card ref={cardRef} sx={{position: 'relative', ...sx}}>
            <IconButton
                onClick={toggleFullscreen}
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 1000,
                    borderRadius: 10,
                    borderStyle: 'solid',
                    borderWidth: 2,
                }}
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
                <Iconify icon={isFullscreen ? 'mingcute:fullscreen-exit-2-fill' : 'mingcute:fullscreen-2-fill'} />
            </IconButton>
            {children}
        </Card>
    );
}

export default FullscreenCard;
