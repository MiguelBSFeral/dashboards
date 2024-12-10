import {
    Box,
    Container,
    InputAdornment,
    List,
    ListItemButton,
    ListItemText,
    Tab,
    Tabs,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import Breadcrumbs from '../common/Breadcrumbs';
import React, {useEffect, useState} from 'react';
import HeatMap from '../common/HeatMapV3';
import FullscreenCard from '../common/FullscreenCardV3';
import 'maplibre-gl/dist/maplibre-gl.css';
import 'maplibre-gl-indoorequal/maplibre-gl-indoorequal.css';
import Iconify from '../common/Iconify';
import stringUtils from '../../utils/strings';
import Company from '../../models/entities/company';
import Alert from '../../models/entities/alert';
import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
} from '@mui/lab';
import RadarChart from '../common/RadarChartV3';
import palette from '../../themes/palette';
import IndoorEqualMap from '../common/map/IndoorEqualMap';
import DashboardV2 from "./DashboardV2";

interface MetricData {
    id: number;
    label: string;
    db_label: string;
    classification: string;
}

interface DeviceData {
    id: string;
    name: string;
    serialNumber: string;
    mac: string;
    latitude: number;
    longitude: number;
    group: Company;
    label?: string;
    metrics?: MetricData[];
    alerts?: Alert[];
    classification: any;
}

interface InstallationData {
    id: string;
    label: string;
    devices?: DeviceData[];
}

interface MarkerData {
    id: string;
    position: [number, number];
    label: string;
    installations?: InstallationData[];
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <Box
            role='tabpanel'
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            sx={{flexGrow: 1, p: 0, height: '100%'}}
            {...other}
        >
            {value === index && (
                <Box sx={{height: '100%', width: '100%'}}>
                    {children}
                </Box>
            )}
        </Box>
    );
}

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

function DashboardV3() {
    const theme = useTheme();

    const [heatMapData, setHeatMapData] = useState<
        {timestamp: string; value: number; metric: string; classification: string}[]
    >([]);
    const [metrics, setMetrics] = useState<MetricData[]>([
        {
            id: 0,
            label: 'Effective Temperature',
            db_label: 'effective_temp',
            classification: 'effective_temp_classification',
        },
        {
            id: 1,
            label: 'Discomfort',
            db_label: 'discomfort',
            classification: 'discomfort_classification',
        },
        {
            id: 2,
            label: 'Carbon Dioxide',
            db_label: 'carbon_dioxide',
            classification: 'carbon_dioxide_classification',
        },
        {
            id: 3,
            label: 'Noise',
            db_label: 'noise',
            classification: 'noise_classification',
        },
        {
            id: 4,
            label: 'Light Intensity',
            db_label: 'light_intensity',
            classification: 'light_intensity_classification',
        },
    ]);
    const [selectedMetricIndex, setSelectedMetricIndex] = useState(0);
    const [searchFilter, setSearchFilter] = useState('');
    const [selectedDeviceIndex, setSelectedDeviceIndex] = useState<number | null>(0);
    const [devices, setDevices] = useState<DeviceData[]>([
        {
            id: 'VCH03',
            name: 'Device 01 - VCH03',
            serialNumber: 'device01serialnumber',
            mac: 'device01mac',
            latitude: 41.2284799495016,
            longitude: -8.57693310989641,
            group: {
                id: 'xpto-companyA',
                name: 'Colégio Novo da Maia',
                packageId: 'xpto-package',
            },
            alerts: [
                {
                    id: 'alert01',
                    number: 1,
                    alertTypeId: 'alertTypeId01',
                    dataId: 1,
                    value: 41,
                    alertType: {
                        id: 'alertTypeId01',
                        name: 'Critical Temperature',
                        description: 'Temperature reached the highest level of alarm',
                        color: '#a50026',
                        criticality: 'CRITICAL WARNING',
                    },
                    alertCondition: {
                        id: 'alertConditionId01',
                        alertTypeId: 'alertTypeId01',
                        operator: '>',
                        value: 35,
                        metric: 'temperature',
                    },
                    createdAt: new Date('2024-10-22 15:29:16.046 +00:00'),
                    modifiedAt: new Date('2024-10-22 15:29:16.046 +00:00'),
                },
                {
                    id: 'alert02',
                    number: 2,
                    alertTypeId: 'alertTypeId02',
                    dataId: 2,
                    value: 85,
                    alertType: {
                        id: 'alertTypeId02',
                        name: 'Critical Humidity',
                        description: 'Humidity reached the highest level of alarm',
                        color: '#a50026',
                        criticality: 'CRITICAL WARNING',
                    },
                    alertCondition: {
                        id: 'alertConditionId02',
                        alertTypeId: 'alertTypeId02',
                        operator: '>',
                        value: 80,
                        metric: 'humidity',
                    },
                    createdAt: new Date('2024-10-22 08:29:16.046 +00:00'),
                    modifiedAt: new Date('2024-10-22 08:29:16.046 +00:00'),
                },
                {
                    id: 'alert041',
                    number: 4,
                    alertTypeId: 'alertTypeId01',
                    dataId: 1,
                    value: 37,
                    alertType: {
                        id: 'alertTypeId01',
                        name: 'Critical Temperature',
                        description: 'Temperature reached the highest level of alarm',
                        color: '#a50026',
                        criticality: 'CRITICAL WARNING',
                    },
                    alertCondition: {
                        id: 'alertConditionId01',
                        alertTypeId: 'alertTypeId01',
                        operator: '>',
                        value: 35,
                        metric: 'temperature',
                    },
                    createdAt: new Date('2024-10-20 13:35:16.046 +00:00'),
                    modifiedAt: new Date('2024-10-20 13:35:16.046 +00:00'),
                },
            ],
            classification: {
                temperature: 'Warm',
                discomfort: 'Uncomfortable',
                carbonDioxide: 'Good',
                noise: 'Loud',
                lightIntensity: 'Very Bright',
                color: palette('light').metricClassification.moderate,
                createdAt: '2024/12/01 10:45:00',
            },
        },
        {
            id: 'BUP05',
            name: 'Device 02 - BUP05',
            serialNumber: 'device02serialnumber',
            mac: 'device02mac',
            latitude: 41.228736,
            longitude: -8.576881,
            group: {
                id: 'xpto-companyA',
                name: 'Colégio Novo da Maia',
                packageId: 'xpto-package',
            },
            alerts: [
                {
                    id: 'alert03',
                    number: 3,
                    alertTypeId: 'alertTypeId01',
                    dataId: 3,
                    value: 38,
                    alertType: {
                        id: 'alertTypeId01',
                        name: 'Critical Temperature',
                        description: 'Temperature reached the highest level of alarm',
                        color: '#a50026',
                        criticality: 'CRITICAL WARNING',
                    },
                    alertCondition: {
                        id: 'alertConditionId01',
                        alertTypeId: 'alertTypeId01',
                        operator: '>',
                        value: 35,
                        metric: 'temperature',
                    },
                    createdAt: new Date('2024-10-23 13:29:16.046 +00:00'),
                    modifiedAt: new Date('2024-10-23 13:29:16.046 +00:00'),
                },
            ],
            classification: {
                temperature: 'Comfortable',
                discomfort: 'Comfortable',
                carbonDioxide: 'Fair',
                noise: 'Normal',
                lightIntensity: 'Moderate',
                color: palette('light').metricClassification.comfortable,
                createdAt: '2024/12/01 14:00:00',
            },
        },
        {
            id: 'DAI01',
            name: 'Device 03 - DAI01',
            serialNumber: 'device03serialnumber',
            mac: 'device03mac',
            latitude: 41.128427,
            longitude: -8.651027,
            group: {
                id: 'xpto-companyB',
                name: 'Colégio Novo de Gaia',
                packageId: 'xpto-package',
            },
            alerts: [],
            classification: {
                temperature: 'Warm',
                discomfort: 'Moderate',
                carbonDioxide: 'Fair',
                noise: 'Busy',
                lightIntensity: 'Bright',
                color: palette('light').metricClassification.moderate,
                createdAt: '2024/12/02 17:00:00',
            },
        },
        {
            id: 'COD0B',
            name: 'Device 04 - COD0B',
            serialNumber: 'device04serialnumber',
            mac: 'device04mac',
            latitude: 41.17828890640605,
            longitude: -8.595448040112927,
            group: {
                id: 'xpto-companyC',
                name: 'FEUP',
                packageId: 'xpto-package',
            },
            alerts: [],
            classification: {
                temperature: 'Fresh',
                discomfort: 'Unbearable',
                carbonDioxide: 'Poor',
                noise: 'Busy',
                lightIntensity: 'Low',
                color: palette('light').metricClassification.uncomfortable,
                createdAt: '2024/11/31 09:00:00',
            },
        },
        {
            id: 'MAC04',
            name: 'Device 05 - MAC04',
            serialNumber: 'device05serialnumber',
            mac: 'device05mac',
            latitude: 41.17815805021574,
            longitude: -8.594472873170375,
            group: {
                id: 'xpto-companyC',
                name: 'FEUP',
                packageId: 'xpto-package',
            },
            alerts: [],
            classification: {
                temperature: 'Warm',
                discomfort: 'Uncomfortable',
                carbonDioxide: 'Good',
                noise: 'Loud',
                lightIntensity: 'Very Bright',
                color: palette('light').metricClassification.veryUncomfortable,
                createdAt: '2024/12/01 18:00:00',
            },
        },
        {
            id: 'COV01',
            name: 'Device 06 - COV01',
            serialNumber: 'device06serialnumber',
            mac: 'device06mac',
            latitude: 41.17819765094947,
            longitude: -8.595759796521811,
            group: {
                id: 'xpto-companyC',
                name: 'FEUP',
                packageId: 'xpto-package',
            },
            alerts: [],
            classification: {
                temperature: 'Cold',
                discomfort: 'Very Uncomfortable',
                carbonDioxide: 'Poor',
                noise: 'Noisy',
                lightIntensity: 'Unbearable',
                color: palette('light').metricClassification.unbearable,
                createdAt: '2024/12/03 10:00:00',
            },
        },
    ]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(
        devices.length > 0 ? devices[0].id : null,
    );
    const [isLoading, setIsLoading] = useState(false);

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
    ) => {
        const selectedDevice = devices[index];
        setSelectedDeviceId(selectedDevice.id);
        setSelectedDeviceIndex(index);
    };

    useEffect(() => {
        const fetchHeatmapData = async () => {
            if (!selectedDeviceId) {
                setHeatMapData([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`/temp/${selectedDeviceId}_v3.json`);
                if (!response.ok) {
                    throw new Error(`Failed to load heatmap data: ${response.statusText}`);
                }
                const jsonData = await response.json();

                const formattedData = jsonData
                    .map((item: {
                        timestamp: string;
                        effective_temp: number;
                        discomfort: number;
                        carbon_dioxide: number;
                        noise: number;
                        light_intensity: number;
                        [key: string]: any;
                    }) => ({
                        timestamp: item.timestamp,
                        value: metrics[selectedMetricIndex].db_label
                            ? item[metrics[selectedMetricIndex].db_label]
                            : null,
                        metric: metrics[selectedMetricIndex].db_label,
                        classification: item[metrics[selectedMetricIndex].classification],
                    }))
                    .filter(
                        (item: {timestamp: string; value: number}) =>
                            item.timestamp &&
                            !isNaN(item.value) &&
                            item.value !== null &&
                            item.value !== undefined,
                    );

                setHeatMapData(formattedData);
            } catch (error) {
                console.error('Error fetching or parsing JSON:', error);
                setHeatMapData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHeatmapData();
    }, [selectedDeviceId, selectedMetricIndex]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedMetricIndex(newValue);
    };

    const filteredDevices = (devices ?? []).filter(
        (device) =>
            stringUtils.insensitiveIncludes(device.name || '', searchFilter) ||
            stringUtils.insensitiveIncludes(device.group?.name || '', searchFilter),
    );

    return (
        <Container
            maxWidth={false}
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
                heading='Dashboard v3'
                links={[{label: 'Dashboard v3', href: '/dashboard-v3'}]}
            />
            <Box
                sx={{
                    display: 'grid',
                    gap: '16px',
                    width: '100%',
                    flex: 1,
                    gridTemplateRows: '1fr 1fr',
                    gridTemplateColumns: '2fr 1fr',
                    minHeight: 0,
                }}
            >
                <FullscreenCard sx={{display: 'flex', height: '100%', flexDirection: 'row'}} isMap={true}>
                    <Box
                        sx={{
                            flex: 1,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            backgroundColor: theme.palette.background.paper,
                            boxSizing: 'border-box',
                            minHeight: 0,
                        }}
                    >
                        <Box
                            sx={{
                                width: '98%',
                                height: '98%',
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: 0,
                            }}
                        >
                            <TextField
                                fullWidth
                                placeholder='search'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Iconify icon='eva:search-fill' sx={{color: 'text.disabled'}} />
                                        </InputAdornment>
                                    ),
                                }}
                                value={searchFilter}
                                onChange={(event) => setSearchFilter(event.target.value)}
                            />
                            <List
                                sx={{
                                    flex: 1,
                                    overflow: 'auto',
                                    minHeight: 0,
                                }}
                            >
                                {filteredDevices.map((device, index) => (
                                    <ListItemButton
                                        key={device.id}
                                        selected={index === selectedDeviceIndex}
                                        onClick={(event) => handleListItemClick(event, index)}
                                    >
                                        <ListItemText
                                            primary={device.name}
                                            secondary={device.group?.name}
                                        />
                                    </ListItemButton>
                                ))}
                                {filteredDevices.length === 0 && (
                                    <ListItemText primary={'No devices found...'} />
                                )}
                            </List>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            flex: 3,
                            height: '100%',
                            minHeight: 0,
                        }}
                    >
                        <IndoorEqualMap devices={devices} selectedDeviceIndex={selectedDeviceIndex} />
                        {/*<IndoorMap />*/}
                    </Box>
                </FullscreenCard>

                <FullscreenCard
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            textAlign: 'center',
                            alignItems: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <Iconify icon='fluent-color:warning-16' width={40} />
                        <Typography variant='h4' sx={{marginX: 2}}>Critical Alerts</Typography>
                        <Iconify icon='fluent-color:warning-16' width={40} />
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 1,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'auto',
                            minHeight: 0,
                        }}
                    >
                        <Timeline sx={{width: '100%'}}>
                            {devices[selectedDeviceIndex ?? 0].alerts?.map((alert) => {
                                let icon = '';
                                switch (alert.alertCondition?.metric) {
                                    case 'temperature':
                                        icon = 'la:temperature-high';
                                        break;
                                    case 'humidity':
                                        icon = 'material-symbols:humidity-percentage';
                                        break;
                                    default:
                                        icon = 'fluent-color:warning-16';
                                        break;
                                }
                                return (
                                    <TimelineItem key={alert.id}>
                                        <TimelineOppositeContent sx={{flex: 0.3}}>
                                            <Typography color='textSecondary'>
                                                {alert.createdAt?.toLocaleString()}
                                            </Typography>
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                            <TimelineDot color='primary'>
                                                <Iconify icon={icon} />
                                            </TimelineDot>
                                            <TimelineConnector />
                                        </TimelineSeparator>
                                        <TimelineContent sx={{flex: 0.7}}>
                                            <Typography variant='h6' component='h1'>
                                                {alert.alertType?.name}
                                            </Typography>
                                            <Typography>{alert.alertType?.description} with {alert.alertCondition?.metric} of {alert.value}</Typography>
                                        </TimelineContent>
                                    </TimelineItem>
                                );
                            })}
                            {devices[selectedDeviceIndex ?? 0].alerts?.length === 0 && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '100%',
                                    }}
                                >
                                    <Typography>No alerts for this device</Typography>
                                </Box>
                            )}
                        </Timeline>
                    </Box>
                </FullscreenCard>

                <FullscreenCard sx={{height: '100%', overflow: 'visible'}}>
                    <Box
                        sx={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Tabs
                            orientation='vertical'
                            variant='scrollable'
                            value={selectedMetricIndex}
                            onChange={handleChange}
                            sx={{
                                borderRight: 1,
                                borderColor: 'divider',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                flex: 1,
                            }}
                        >
                            {[
                                'Effective Temperature',
                                'Discomfort',
                                'Carbon Dioxide',
                                'Noise',
                                'Light Intensity'
                            ].map((label, index) => (
                                <Tab
                                    label={
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                width: '100%',
                                                textAlign: 'left',
                                                paddingLeft: 2,
                                                paddingRight: 2,
                                            }}
                                        >
                                            <Typography>{label}</Typography>
                                        </Box>
                                    }
                                    {...a11yProps(index)}
                                    sx={{
                                        width: '100%',
                                        height: '100%'
                                    }}
                                />
                            ))}
                        </Tabs>
                        <Box sx={{flex: 3, height: '100%'}}>
                            {metrics.map((metric, index) => {
                                return (
                                    <TabPanel
                                        value={selectedMetricIndex}
                                        index={index}
                                        key={metric.id}
                                    >
                                        <HeatMap data={heatMapData} />
                                    </TabPanel>
                                );
                            })}
                        </Box>
                    </Box>
                </FullscreenCard>

                <FullscreenCard
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <RadarChart
                        classificationData={devices[selectedDeviceIndex!].classification}
                        color={devices[selectedDeviceIndex!].classification.color}
                    />
                </FullscreenCard>
            </Box>
        </Container>
    );
}

export default DashboardV3;
