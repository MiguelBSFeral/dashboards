import {MenuItem, Stack} from '@mui/material';
import {enUS, Localization} from '@mui/material/locale';
import {Fragment, useState} from 'react';
import AnimatedIconButton from '../common/animated/IconButton';
import LazyLoadImage from '../common/LazyLoadImage';
import MenuPopover from '../common/MenuPopover';

type Language = {
    label: string;
    value: string;
    systemValue: Localization;
    icon: string;
};

const languages: Language[] = [
    {
        label: 'English',
        value: 'en',
        systemValue: enUS,
        icon: '/assets/icons/flags/ic_flag_en.svg',
    },
];

const currentLanguage: Language = languages[0];

function LanguagePopover() {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    function handleOpen(event: React.MouseEvent<HTMLElement>) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function handleChangeLanguage(language: Language) {}

    return (
        <Fragment>
            <AnimatedIconButton
                sx={{
                    width: 40,
                    height: 40,
                    ...(anchorEl && {
                        backgroundColor: 'action.selected',
                    }),
                }}
                onClick={handleOpen}>
                <LazyLoadImage
                    src={currentLanguage.icon}
                    alt={currentLanguage.label}
                    disableEffect
                />
            </AnimatedIconButton>
            <MenuPopover anchorEl={anchorEl} onClose={handleClose} sx={{width: 180}}>
                <Stack spacing={0.75}>
                    {languages.map((language) => (
                        <MenuItem
                            key={language.value}
                            selected={language.value === currentLanguage.value}
                            onClick={() => handleChangeLanguage(language)}>
                            <LazyLoadImage
                                alt={language.label}
                                src={language.icon}
                                sx={{width: 28, marginRight: 2}}
                                disableEffect
                            />
                            {language.label}
                        </MenuItem>
                    ))}
                </Stack>
            </MenuPopover>
        </Fragment>
    );
}

export default LanguagePopover;
