import {
    Box,
    Button,
    Card,
    Container,
    Typography,
    useTheme
} from '@mui/material';
import Breadcrumbs from '../common/Breadcrumbs';
import {Link as RouterLink} from 'react-router-dom';
import paths from '../../routes/paths';
import Iconify from '../common/Iconify';
import {useState} from 'react';
import Chart from '../common/chart';
import GaugeCard from '../common/GaugeCard';

interface CounterCard {
    label: string;
    total: number;
    icon: string;
}

interface CreateButton {
    label: string;
    path: string;
    icon: string;
}

const createItems: CreateButton[] = [
    {
        label: 'Create Tenant',
        path: 'paths.createTenant',
        icon: 'clarity:users-line'
    },
    {
        label: 'Create Site',
        path: paths.dashboardV1,
        icon: 'tdesign:building'
    },
    {
        label: 'Create Blueprint',
        path: paths.dashboardV1,
        icon: 'lets-icons:map-light'
    },
    {
        label: 'Create Device',
        path: paths.dashboardV1,
        icon: 'game-icons:movement-sensor'
    },
    {
        label: 'Create User',
        path: paths.dashboardV1,
        icon: 'lucide:user-round'
    },
];

function DashboardV1() {
    const theme = useTheme();

    const [ramValue, setRamValue] = useState(58);
    const [cpuValue, setCpuValue] = useState(85);
    const [diskValue, setDiskValue] = useState(35);
    const [serverStatus, setServerStatus] = useState('online');
    const [counterCards, setCounterCards] = useState<CounterCard[]>([
        {
            label: 'users',
            total: 5,
            icon: 'lucide:user-round',
        },
        {
            label: 'sites',
            total: 5,
            icon: 'tdesign:building',
        },
        {
            label: 'devices',
            total: 18,
            icon: 'game-icons:movement-sensor',
        },
        {
            label: 'alerts',
            total: 45,
            icon: 'line-md:alert',
        },
    ]);

    const deviceStatusChartOptions = {
        labels: ['Online', 'Offline'],
        colors: [theme.palette.primary.main, 'gray'],
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            color: theme.palette.text.primary,
                        },
                        value: {
                            show: true,
                        },
                    }
                }
            }
        },
        legend: {
            show: false,
        }
    };

    return (
        <Container
            sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
            }}
        >
            <Breadcrumbs
                sx={{mb: 2}}
                heading="Dashboard v1"
                links={[{label: 'Dashboard v1', href: '/dashboard-v1'}]}
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxSizing: 'border-box',
                    gap: '16px',
                    minHeight: 0,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: '16px',
                        flex: 0.1,
                        width: '100%'
                    }}
                >
                    {counterCards.map((item) => (
                        <Card
                            key={item.label}
                            sx={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: theme.palette.primary.lighter,
                                gap: 5,
                                boxShadow: 3,
                            }}
                        >
                            <Typography
                                sx={{
                                    color: theme.palette.primary.main,
                                    fontWeight: 'bold',
                                    fontSize: 'large'
                                }}
                            >
                                {item.total}
                            </Typography>
                            <Iconify
                                width={30}
                                icon={item.icon}
                                sx={{
                                    color: theme.palette.primary.main,
                                    animation: 'bounce 2s',
                                    '@keyframes bounce': {
                                        '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                                        '40%': { transform: 'translateY(-10px)' },
                                        '60%': { transform: 'translateY(-5px)' },
                                    },
                                }}
                            />
                        </Card>
                    ))}
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        gap: '16px',
                        flex: '1',
                        width: '100%',
                        minHeight: 0,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            flex: 1,
                            minHeight: 0,
                            boxSizing: 'border-box'
                        }}
                    >
                        <Card
                            sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                minHeight: 0,
                                boxShadow: 3,
                                backgroundColor: theme.palette.background.paper
                            }}
                        >
                            <Typography
                                variant="h6"
                                align="center"
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontWeight: 'bold',
                                }}
                            >
                                Server Status
                            </Typography>
                            <Box
                                sx={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    minHeight: 0,
                                    overflow: 'hidden',
                                }}
                            >
                                {/*<TrafficLight light={'green'} />*/}

                                <Iconify
                                    icon={serverStatus === 'online' ? 'fontisto:like' : serverStatus === 'offline' ? 'fontisto:dislike' : 'lets-icons:question'}
                                    sx={{
                                        color: serverStatus === 'online' ? theme.palette.primary.main : serverStatus === 'offline' ? theme.palette.error.main : theme.palette.warning.main,
                                        height: '60%',
                                        width: '60%'
                                    }}
                                />
                            </Box>
                            <Typography
                                variant="body1"
                                align="center"
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontWeight: 'bold'
                                }}
                            >
                                Uptime:
                            </Typography>
                            <Typography
                                variant="body1"
                                align="center"
                                sx={{
                                    color: theme.palette.text.primary,
                                }}
                            >
                                45 days, 12hours, 30minutes
                            </Typography>
                        </Card>
                        <GaugeCard
                            cardTitle="RAM Usage"
                            value={ramValue}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            flex: '1',
                        }}
                    >
                        <GaugeCard
                            cardTitle="CPU Usage"
                            value={cpuValue}
                        />
                        <GaugeCard
                            cardTitle="Disk Usage"
                            value={diskValue}
                        />
                    </Box>

                    <Card
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            flex: '1.5',
                            width: '100%',
                            height: '100%',
                            boxShadow: 3,
                            backgroundColor: theme.palette.background.paper
                        }}
                    >
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 'bold',
                            }}
                        >
                            Devices Status
                        </Typography>
                        <Box
                            sx={{
                                flex: 1,
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <Chart
                                type="donut"
                                series={[10, 5]}
                                width="100%"
                                height="100%"
                                options={deviceStatusChartOptions}
                            />
                        </Box>
                    </Card>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        gap: '16px',
                        flex: 0.1,
                        width: '100%',
                    }}
                >
                    {createItems.map((item) => (
                        <Card
                            key={item.label}
                            sx={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                fullWidth={true}
                                sx={{height: '100%'}}
                                component={RouterLink}
                                variant="contained"
                                to={item.path}
                                startIcon={<Iconify icon={item.icon} />}
                            >
                                {item.label}
                            </Button>
                        </Card>
                    ))}
                </Box>
            </Box>
        </Container>
    );
}

export default DashboardV1;
