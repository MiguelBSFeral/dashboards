import React, {useEffect, useMemo, useRef, useState} from 'react';
import maplibregl from 'maplibre-gl';
import {FeatureCollection, GeoJsonProperties, Geometry, Point} from 'geojson';
import Company from '../../../models/entities/company';
import Alert from '../../../models/entities/alert';
import IndoorEqual from 'maplibre-gl-indoorequal';
import {useTheme} from '@mui/material';

const MAPTILER_API_KEY = 'T1AXJMGMGUWhEBkHeB3x';
const MAP_STYLE = `https://api.maptiler.com/maps/bright-v2/style.json?key=${MAPTILER_API_KEY}`;

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

interface MetricData {
    id: number;
    label: string;
    db_label: string;
    classification: string;
}

interface InstallationData {
    id: string;
    label: string;
    devices?: DeviceData[];
}

function isPointGeometry(geometry: Geometry): geometry is Point {
    return geometry.type === 'Point';
}

type IndoorEqualMapProps = {
    devices: DeviceData[];
    selectedDeviceIndex: number | null;
};

function IndoorEqualMap(props: IndoorEqualMapProps) {
    const {devices, selectedDeviceIndex } = props;

    const theme = useTheme();
    const mapContainerRef = useRef<HTMLDivElement>(null);

    const [map, setMap] = useState<maplibregl.Map | null>(null);
    const [mapCenter, setMapCenter] = useState<maplibregl.LngLatLike>(
        devices[0] ? [devices[0].longitude, devices[0].latitude] : [0, 0],
    );
    const [zoomLevel, setZoomLevel] = useState(18);

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
            style: MAP_STYLE,
            center: mapCenter,
            zoom: zoomLevel,
            attributionControl: false,
        });

        const indoor = new IndoorEqual(mapInstance, {
            apiKey: 'iek_HI1q6mPKu4HTGa1mcy8V241QGCkP',
        });

        mapInstance.addControl(new maplibregl.NavigationControl(), 'top-right');

        mapInstance.addControl(indoor);

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
        if (map) {
            map.easeTo({
                center: mapCenter,
                zoom: zoomLevel,
                duration: 2000,
            });
        }
    }, [mapCenter, zoomLevel, map]);

    useEffect(() => {
        const index = selectedDeviceIndex ?? 0
        setMapCenter([devices[index].longitude, devices[index].latitude]);
        setZoomLevel(18);
    }, [selectedDeviceIndex]);

    return (
        <div ref={mapContainerRef} style={{width: '100%', height: '100%'}} />
    );
}

export default IndoorEqualMap;
