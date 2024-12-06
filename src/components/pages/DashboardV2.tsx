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
import React, {useEffect, useMemo, useRef, useState} from 'react';
import HeatmapChart from '../common/HeatMap';
import FullscreenCard from '../common/FullscreenCard';
import maplibregl from 'maplibre-gl';
import IndoorEqual from 'maplibre-gl-indoorequal';
import 'maplibre-gl/dist/maplibre-gl.css';
import 'maplibre-gl-indoorequal/maplibre-gl-indoorequal.css';
import {Geometry, Point, FeatureCollection, GeoJsonProperties} from 'geojson';
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
import RadarChart from '../common/RadarChart';

interface MetricData {
    id: number;
    label: string;
    db_label: string;
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

function isPointGeometry(geometry: Geometry): geometry is Point {
    return geometry.type === 'Point';
}

function DashboardV2() {
    const theme = useTheme();
    const mapContainerRef = useRef<HTMLDivElement>(null);

    const [heatMapData, setHeatMapData] = useState<
        {timestamp: string; value: number; metric: string}[]
    >([]);
    const [metrics, setMetrics] = useState<MetricData[]>([
        {
            id: 0,
            label: 'Effective Temperature',
            db_label: 'effective_temp',
        },
        {
            id: 1,
            label: 'Discomfort',
            db_label: 'discomfort_index',
        },
        {
            id: 2,
            label: 'Carbon Dioxide',
            db_label: '',
        },
        {
            id: 3,
            label: 'Noise',
            db_label: '',
        },
        {
            id: 4,
            label: 'Light Intensity',
            db_label: '',
        },
    ]);
    const [selectedMetricIndex, setSelectedMetricIndex] = useState(0);
    const [map, setMap] = useState<maplibregl.Map | null>(null);
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
                createdAt: '2024/12/03 10:00:00',
            },
        },
    ]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(
        devices.length > 0 ? devices[0].id : null,
    );
    const [mapCenter, setMapCenter] = useState<maplibregl.LngLatLike>(
        devices[0] ? [devices[0].longitude, devices[0].latitude] : [0, 0],
    );
    const [zoomLevel, setZoomLevel] = useState(18);
    const [isLoading, setIsLoading] = useState(false);

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
    ) => {
        const selectedDevice = devices[index];
        setSelectedDeviceId(selectedDevice.id);
        setSelectedDeviceIndex(index);
        setMapCenter([devices[index].longitude, devices[index].latitude]);
        setZoomLevel(18);
    };

    const geojsonData: FeatureCollection<Point, GeoJsonProperties> = useMemo(() => ({
        type: 'FeatureCollection',
        features: devices.map(marker => ({
            type: 'Feature',
            properties: {
                id: marker.id,
                label: marker.name,
                // installations: marker.installations ? JSON.stringify(marker.installations) : '[]',
            },
            geometry: {
                type: 'Point',
                coordinates: [marker.longitude, marker.latitude],
            },
        })),
    }), [devices]);

    const addClusterLayers = async (mapInstance: maplibregl.Map) => {
        try {
            // Load the image as a Blob
            const response = await fetch('/assets/logo/logo.png');
            if (!response.ok) {
                throw new Error(`Failed to load image: ${response.statusText}`);
            }
            const blob = await response.blob();

            // Create an ImageBitmap from the Blob
            const imageBitmap = await createImageBitmap(blob);

            // Add the image to the map
            if (!mapInstance.hasImage('custom-marker')) {
                mapInstance.addImage('custom-marker', imageBitmap);
            }

            // Now add the cluster layers
            mapInstance.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'markers',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': theme.palette.primary.main,
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        20,
                        100,
                        30,
                        750,
                        40,
                    ],
                    'circle-opacity': 1,
                },
            });

            mapInstance.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'markers',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 12,
                },
                paint: {
                    'text-color': '#FFF',
                    'text-halo-color': '#FFF',
                    'text-halo-width': 0.7,
                },
            });

            mapInstance.addLayer({
                id: 'marker-background',
                type: 'circle',
                source: 'markers',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': '#FFFFFF',
                    'circle-radius': 27,
                },
            });

            mapInstance.addLayer({
                id: 'unclustered-point',
                type: 'symbol',
                source: 'markers',
                filter: ['!', ['has', 'point_count']],
                layout: {
                    'icon-image': 'custom-marker',
                    'icon-size': 0.05,
                    'icon-allow-overlap': true,
                },
            });
        } catch (error) {
            console.error('Error loading marker image:', error);
        }
    };

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const mapInstance = new maplibregl.Map({
            container: mapContainerRef.current,
            style: 'https://api.maptiler.com/maps/streets/style.json?key=T1AXJMGMGUWhEBkHeB3x',
            center: mapCenter,
            zoom: zoomLevel,
            attributionControl: false,
        });

        const indoor = new IndoorEqual(mapInstance, {
            apiKey: 'iek_HI1q6mPKu4HTGa1mcy8V241QGCkP',
        });

        mapInstance.addControl(new maplibregl.NavigationControl(), 'top-right');

        mapInstance.on('load', async () => {
            console.log('Map and IndoorEqual loaded');

            indoor.setLevel('0');

            // Add GeoJSON source with clustering
            mapInstance.addSource('markers', {
                type: 'geojson',
                data: geojsonData,
                cluster: true,
                clusterMaxZoom: 14, // Max zoom to cluster points on
                clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
            });

            // Add layers for clusters and unclustered points
            await addClusterLayers(mapInstance);

            // Handle cluster clicks
            mapInstance.on('click', 'clusters', (e) => {
                const features = mapInstance.queryRenderedFeatures(e.point, {
                    layers: ['clusters'],
                });
                const clusterId = features[0].properties?.cluster_id;
                const source = mapInstance.getSource('markers') as maplibregl.GeoJSONSource;


                source.getClusterExpansionZoom(clusterId).then((zoom) => {
                    mapInstance.easeTo({
                        center: (features[0].geometry as any).coordinates,
                        zoom: zoom,
                    });
                });
            });

            // Handle unclustered point clicks
            mapInstance.on('click', 'unclustered-point', (e) => {
                const features = mapInstance.queryRenderedFeatures(e.point, {
                    layers: ['unclustered-point'],
                });

                if (!features.length) return;
                const feature = features[0];

                // Use the type guard
                if (isPointGeometry(feature.geometry)) {
                    let [lng, lat] = feature.geometry.coordinates;

                    const {label, installations} = feature.properties as any;

                    // Ensure if the map is zoomed out such that multiple copies of the feature are visible, the popup appears over the copy being clicked on
                    while (Math.abs(e.lngLat.lng - lng) > 180) {
                        lng += e.lngLat.lng > lng ? 360 : -360;
                    }

                    // Create HTML content for the popup
                    let popupContent = `<div><h3>${label}</h3>`;
                    if (installations) {
                        const installationsData: InstallationData[] = JSON.parse(installations);
                        installationsData.forEach(installation => {
                            popupContent += `<h4>${installation.label}</h4><ul>`;
                            if (installation.devices) {
                                installation.devices.forEach(device => {
                                    popupContent += `<li>${device.label}</li>`;
                                });
                            }
                            popupContent += `</ul>`;
                        });
                    }
                    popupContent += `</div>`;

                    // Create and set the popup
                    new maplibregl.Popup()
                        .setLngLat([lng, lat])
                        .setHTML(popupContent)
                        .addTo(mapInstance);
                } else {
                    console.warn('Clicked feature is not a Point geometry.');
                }
            });

            // Change the cursor to pointer when hovering over clusters and points
            mapInstance.on('mouseenter', 'clusters', () => {
                mapInstance.getCanvas().style.cursor = 'pointer';
            });
            mapInstance.on('mouseleave', 'clusters', () => {
                mapInstance.getCanvas().style.cursor = '';
            });

            mapInstance.on('mouseenter', 'unclustered-point', () => {
                mapInstance.getCanvas().style.cursor = 'pointer';
            });
            mapInstance.on('mouseleave', 'unclustered-point', () => {
                mapInstance.getCanvas().style.cursor = '';
            });
        });

        setMap(mapInstance);

        return () => {
            mapInstance.remove();
        };
    }, [geojsonData]);

    useEffect(() => {
        const fetchHeatmapData = async () => {
            if (!selectedDeviceId) {
                setHeatMapData([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`/temp/${selectedDeviceId}.json`);
                if (!response.ok) {
                    throw new Error(`Failed to load heatmap data: ${response.statusText}`);
                }
                const jsonData = await response.json();

                const formattedData = jsonData
                    .map((item: {
                        timestamp: string;
                        effective_temp: number;
                        discomfort_index: number;
                        [key: string]: any;
                    }) => ({
                        timestamp: item.timestamp,
                        value: metrics[selectedMetricIndex].db_label
                            ? item[metrics[selectedMetricIndex].db_label]
                            : null,
                        metric: metrics[selectedMetricIndex].db_label,
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

    useEffect(() => {
        if (map) {
            map.easeTo({
                center: mapCenter,
                zoom: zoomLevel,
                duration: 1000, // Optional: duration of the animation in milliseconds
            });
        }
    }, [mapCenter, zoomLevel, map]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedMetricIndex(newValue);
    };

    const filteredDevices = (devices ?? []).filter(
        (device) =>
            stringUtils.insensitiveIncludes(device.name ? device.name : '', searchFilter),
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
                heading='Dashboard v2'
                links={[{label: 'Dashboard v2', href: '/dashboard-v2'}]}
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
                <FullscreenCard sx={{display: 'flex', height: '100%', flexDirection: 'row'}}>
                    <Box
                        sx={{
                            flex: 3,
                            height: '100%',
                            minHeight: 0,
                        }}
                    >
                        <div ref={mapContainerRef} style={{width: '100%', height: '100%'}} />
                    </Box>
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

                <FullscreenCard sx={{height: '100%'}}>
                    <Box
                        sx={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexGrow: 1,
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
                            }}
                        >
                            <Tab
                                label={
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Typography variant='body2'>Effective</Typography>
                                        <Typography variant='body2'>Temperature</Typography>
                                    </Box>
                                }
                                {...a11yProps(0)}
                                sx={{
                                    width: '100%',
                                }}
                            />
                            <Tab
                                label={
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Typography variant='body2'>Discomfort</Typography>
                                    </Box>
                                }
                                {...a11yProps(1)}
                                wrapped
                                sx={{
                                    width: '100%',
                                }}
                            />
                            <Tab
                                label={
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Typography variant='body2'>Carbon</Typography>
                                        <Typography variant='body2'>Dioxide</Typography>
                                    </Box>
                                }
                                {...a11yProps(2)}
                                wrapped
                                sx={{
                                    width: '100%',
                                }}
                            />
                            <Tab
                                label={
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Typography variant='body2'>Noise</Typography>
                                    </Box>
                                }
                                {...a11yProps(3)}
                                wrapped
                                sx={{
                                    width: '100%',
                                }}
                            />
                            <Tab
                                label={
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Typography variant='body2'>Light</Typography>
                                        <Typography variant='body2'>Intensity</Typography>
                                    </Box>
                                }
                                {...a11yProps(4)}
                                sx={{
                                    width: '100%',
                                }}
                            />
                        </Tabs>
                        <Box sx={{flexGrow: 1, height: '100%'}}>
                            {metrics.map((metric, index) => {
                                return (
                                    <TabPanel
                                        value={selectedMetricIndex}
                                        index={index}
                                        key={metric.id}
                                    >
                                        <HeatmapChart data={heatMapData} />
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
                    <RadarChart classificationData={devices[selectedDeviceIndex!].classification} />
                </FullscreenCard>
            </Box>
        </Container>
    );
}

export default DashboardV2;
