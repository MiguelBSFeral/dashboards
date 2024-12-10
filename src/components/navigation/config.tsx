import paths from '../../routes/paths';
import SvgIcon from '../common/SvgIcon';

export type NavItem = {
    title: string;
    path: string;
    icon?: JSX.Element;
    children?: any;
};

export type NavSection = {
    subheader: string;
    items: NavItem[];
};

function icon(name: string) {
    return (
        <SvgIcon
            src={`/assets/icons/navbar/${name}.svg`}
            sx={{width: 1, height: 1}}
        />
    );
}

const icons = {
    dashboard: icon('ic_dashboard'),
};

const navConfig: NavSection[] = [
    {
        subheader: '',
        items: [
            {
                title: 'v1 @ 2024-11-15',
                path: paths.dashboardV1,
                icon: icons.dashboard,
            },
            {
                title: 'v2 @ 2024-12-03',
                path: paths.dashboardV2,
                icon: icons.dashboard,
            },
            {
                title: 'v3 @ 2024-12-10',
                path: paths.dashboardV3,
                icon: icons.dashboard,
            },
        ],
    },
];

export default navConfig;
