import React, {useMemo} from 'react';
import {scaleLinear} from 'd3-scale';
import {line, curveCatmullRomClosed, arc} from 'd3-shape';
import {Box, Tooltip, Typography, useTheme, styled} from '@mui/material';
import {styled as muiStyled} from '@mui/system';
import palette from '../../themes/palette';

interface Indicator {
    key: string;
    displayName: string;
    max: number;
}

const indicators: Indicator[] = [
    {key: 'temperature', displayName: 'Temperature', max: 5},
    {key: 'discomfort', displayName: 'Discomfort', max: 5},
    {key: 'carbonDioxide', displayName: 'Carbon Dioxide', max: 5},
    {key: 'noise', displayName: 'Noise', max: 5},
    {key: 'lightIntensity', displayName: 'Light Intensity', max: 5},
];

const categories: Record<string, string[]> = {
    temperature: ['cold', 'hot', 'fresh', 'warm', 'comfortable'],
    discomfort: ['unbearable', 'veryUncomfortable', 'uncomfortable', 'moderate', 'comfortable'],
    carbonDioxide: ['unhealthy', 'poor', 'fair', 'good', 'excellent'],
    noise: ['noisy', 'loud', 'busy', 'normal', 'quiet'],
    lightIntensity: ['unbearable', 'veryBright', 'bright', 'moderate', 'low'],
};

const toCamelCase = (str: string): string => {
    return str
        .toLowerCase()
        .split(' ')
        .map((word, index) =>
            index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
        )
        .join('');
};

const categoryToValue: Record<string, Record<string, number>> = Object.fromEntries(
    Object.entries(categories).map(([key, values]) => [
        key,
        Object.fromEntries(values.map((value, index) => [value, index + 1])),
    ]),
);

// Color palette
const colorPalette = [
    '#5470C6', // Base blue
    '#91CC75', // Green accent
    '#FAC858', // Yellow accent
    '#EE6666', // Red accent
    '#73C0DE', // Soft blue
];

// Styled SVG Elements
const StyledSVG = muiStyled('svg')(({theme}) => ({
    display: 'block',
}));

const GridCircle = styled('circle')(({theme}) => ({
    fill: 'none',
    stroke: theme.palette.grey[300],
    strokeDasharray: '4,4',
}));

const AxisLine = styled('line')(({theme}) => ({
    stroke: theme.palette.grey[300],
    strokeWidth: 1,
    strokeDasharray: '4,4',
}));

const HoverPath = styled('path')(({theme}) => ({
    fill: 'rgba(84, 112, 198, 0.1)',
    stroke: 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        fill: 'rgba(84, 112, 198, 0.3)',
    },
}));

const generateClassificationColor = (metric: string, classification: string): string => {
    let classificationColor = '';
    if (metric === 'effective_temp' || metric === 'temperature') {
        switch (classification) {
            case 'Cold':
                classificationColor = palette('light').temperatureClassification.cold;
                break;
            case 'Fresh':
                classificationColor = palette('light').temperatureClassification.fresh;
                break;
            case 'Comfortable':
                classificationColor = palette('light').temperatureClassification.comfortable;
                break;
            case 'Warm':
                classificationColor = palette('light').temperatureClassification.warm;
                break;
            case 'Hot':
                classificationColor = palette('light').temperatureClassification.hot;
                break;
            default:
                classificationColor = 'transparent';
                break;
        }
    } else if (metric === 'discomfort') {
        switch (classification) {
            case 'Comfortable':
                classificationColor = palette('light').metricClassification.comfortable;
                break;
            case 'Moderate':
                classificationColor = palette('light').metricClassification.moderate;
                break;
            case 'Uncomfortable':
                classificationColor = palette('light').metricClassification.uncomfortable;
                break;
            case 'Very Uncomfortable':
                classificationColor = palette('light').metricClassification.veryUncomfortable;
                break;
            case 'Unbearable':
                classificationColor = palette('light').metricClassification.unbearable;
                break;
            default:
                classificationColor = 'transparent';
                break;
        }
    } else if (metric === 'carbon_dioxide' || metric === 'carbonDioxide') {
        switch (classification) {
            case 'Excellent':
                classificationColor = palette('light').metricClassification.comfortable;
                break;
            case 'Good':
                classificationColor = palette('light').metricClassification.moderate;
                break;
            case 'Fair':
                classificationColor = palette('light').metricClassification.uncomfortable;
                break;
            case 'Poor':
                classificationColor = palette('light').metricClassification.veryUncomfortable;
                break;
            case 'Unhealthy':
                classificationColor = palette('light').metricClassification.unbearable;
                break;
            default:
                classificationColor = 'transparent';
                break;
        }
    } else if (metric === 'noise') {
        switch (classification) {
            case 'Quiet':
                classificationColor = palette('light').metricClassification.comfortable;
                break;
            case 'Normal':
                classificationColor = palette('light').metricClassification.moderate;
                break;
            case 'Busy':
                classificationColor = palette('light').metricClassification.uncomfortable;
                break;
            case 'Loud':
                classificationColor = palette('light').metricClassification.veryUncomfortable;
                break;
            case 'Noisy':
                classificationColor = palette('light').metricClassification.unbearable;
                break;
            default:
                classificationColor = 'transparent';
                break;
        }
    } else if (metric === 'light_intensity' || metric === 'lightIntensity') {
        switch (classification) {
            case 'Low':
                classificationColor = palette('light').metricClassification.comfortable;
                break;
            case 'Moderate':
                classificationColor = palette('light').metricClassification.moderate;
                break;
            case 'Bright':
                classificationColor = palette('light').metricClassification.uncomfortable;
                break;
            case 'Very Bright':
                classificationColor = palette('light').metricClassification.veryUncomfortable;
                break;
            case 'Unbearable':
                classificationColor = palette('light').metricClassification.unbearable;
                break;
            default:
                classificationColor = 'transparent';
                break;
        }
    }

    return classificationColor;
};

type RadarChartProps = {
    classificationData: Record<string, string>;
    width?: number;
    height?: number;
    margin?: {top: number; right: number; bottom: number; left: number};
    color?: string;
};

const RadarChartV3: React.FC<RadarChartProps> = ({
                                                   classificationData,
                                                   width = 600,
                                                   height = 400,
                                                   margin = {top: 50, right: 50, bottom: 50, left: 50},
                                                   color = colorPalette[1],
                                               }) => {
    const theme = useTheme();

    // Transform data to numeric values
    const numericalData = useMemo(() => {
        return indicators.map((indicator) => {
            const rawValue = classificationData[indicator.key];
            const normalizedValue = toCamelCase(rawValue);
            const numericValue = categoryToValue[indicator.key][normalizedValue] || 0;

            if (numericValue === 0) {
                console.warn(
                    `No numerical mapping found for ${indicator.displayName}: "${rawValue}" (normalized: "${normalizedValue}")`,
                );
            }

            return numericValue;
        });
    }, [classificationData]);

    // Calculate chart dimensions
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;

    // Create scales
    const angleScale = scaleLinear()
        .domain([0, indicators.length])
        .range([0, Math.PI * 2]);

    const radiusScale = scaleLinear()
        .domain([0, 5])
        .range([0, radius]);

    // Generate polygon points
    const points: [number, number][] = indicators.map((indicator, index) => {
        const angle = angleScale(index) - Math.PI / 2; // Rotate to start at top
        const r = radiusScale(numericalData[index]);
        return [Math.cos(angle) * r, Math.sin(angle) * r];
    });

    // Create smooth, closed line generator with Catmull-Rom curve
    const lineGenerator = line<[number, number]>()
        .curve(curveCatmullRomClosed.alpha(0.5)) // Updated curve type
        .x((d) => d[0])
        .y((d) => d[1]);

    // Generate path
    const polygonPath = lineGenerator(points);

    // Hover effect paths (pie slice hover areas)
    const arcGenerator = arc();

    // Compute halfAngle for symmetrical slices
    const halfAngle = (Math.PI * 2) / indicators.length / 2;

    return (
        <Box
            width={'100%'}
            height={'100%'}
            sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        >
            <StyledSVG
                width={'100%'}
                height={'100%'}
                viewBox={`0 0 ${width} ${height}`}
            >
                <g transform={`translate(${width / 2}, ${height / 2})`}>
                    {/* Background grid */}
                    {[1, 2, 3, 4, 5].map((level) => (
                        <GridCircle key={`grid-${level}`} r={radiusScale(level)} />
                    ))}

                    {/* Axis lines */}
                    {indicators.map((indicator, index) => {
                        const angle = angleScale(index) - Math.PI / 2;
                        const x = Math.cos(angle) * radiusScale(5);
                        const y = Math.sin(angle) * radiusScale(5);
                        return (
                            <AxisLine
                                key={`axis-line-${index}`}
                                x1={0}
                                y1={0}
                                x2={x}
                                y2={y}
                            />
                        );
                    })}

                    {/* Axis hover areas (pie slices) with MUI Tooltip */}
                    {indicators.map((indicator, index) => {
                        const vertexAngle = angleScale(index) - Math.PI / 2;
                        const startAngle = vertexAngle - halfAngle + 2.5 * halfAngle;
                        const endAngle = vertexAngle + halfAngle + 2.5 * halfAngle;

                        const slicePath = arcGenerator({
                            innerRadius: 0,
                            outerRadius: radius,
                            startAngle: startAngle,
                            endAngle: endAngle,
                        });

                        return (
                            <Tooltip
                                key={`axis-hover-${index}`}
                                title={
                                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                        <Typography variant='h6'>{indicator.displayName}</Typography>
                                        <Typography
                                            style={{color: generateClassificationColor(indicator.key, classificationData[indicator.key])}}>
                                            {classificationData[indicator.key]}
                                        </Typography>
                                    </Box>
                                }
                                placement='top'
                                arrow
                            >
                                <HoverPath d={slicePath || ''} />
                            </Tooltip>
                        );
                    })}

                    {/* Main data polygon */}
                    <path
                        d={polygonPath || ''}
                        fill={color}
                        fillOpacity={0.5}
                        stroke={color}
                        strokeWidth={2}
                        strokeLinejoin='round'
                        strokeLinecap='round'
                        pointerEvents={'none'}
                    />

                    {/* Axis labels */}
                    {indicators.map((indicator, index) => {
                        const angle = angleScale(index) - Math.PI / 2;
                        const labelRadius = radius + 20;
                        const x = Math.cos(angle) * labelRadius;
                        const y = Math.sin(angle) * labelRadius;

                        return (
                            <foreignObject
                                key={`label-${indicator.key}`}
                                x={x - 50}
                                y={y - 10}
                                width={100}
                                height={20}
                            >
                                <Typography
                                    variant='caption'
                                    align='center'
                                    sx={{
                                        width: '100%',
                                        wordWrap: 'break-word',
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    {indicator.displayName}
                                </Typography>
                            </foreignObject>
                        );
                    })}
                </g>
            </StyledSVG>
        </Box>
    );
};

export default RadarChartV3;
