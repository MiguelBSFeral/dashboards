import React from 'react';
import ReactECharts, { EChartsOption } from 'echarts-for-react';
import dateUtils from '../../utils/dates';

const toCamelCase = (str: string): string => {
    return str
        .toLowerCase()
        .split(' ')
        .map((word, index) =>
            index === 0
                ? word
                : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join('');
};

const categories: Record<string, string[]> = {
    temperature: ['comfortable', 'cold', 'fresh', 'warm', 'hot'],
    discomfort: ['comfortable', 'moderate', 'uncomfortable', 'veryUncomfortable', 'unbearable'],
    carbonDioxide: ['excellent', 'good', 'fair', 'poor', 'unhealthy'],
    noise: ['quiet', 'normal', 'busy', 'loud', 'noisy'],
    lightIntensity: ['low', 'moderate', 'bright', 'veryBright', 'unbearable'],
};

const categoriesDisplay: Record<string, string[]> = {
    temperature: ['Comfortable', 'Cold', 'Fresh', 'Warm', 'Hot'],
    discomfort: ['Comfortable', 'Moderate', 'Uncomfortable', 'Very Uncomfortable', 'Unbearable'],
    carbonDioxide: ['Excellent', 'Good', 'Fair', 'Poor', 'Unhealthy'],
    noise: ['Quiet', 'Normal', 'Busy', 'Loud', 'Noisy'],
    lightIntensity: ['Low', 'Moderate', 'Bright', 'Very Bright', 'Unbearable'],
};

const categoryToValue: Record<string, Record<string, number>> = Object.fromEntries(
    Object.entries(categories).map(([key, values]) => [
        key,
        Object.fromEntries(values.map((value, index) => [value, index + 1])),
    ])
);

interface Indicator {
    key: string;
    displayName: string;
    max: number;
}

const indicators: Indicator[] = [
    { key: 'temperature', displayName: 'Temperature', max: 5 },
    { key: 'discomfort', displayName: 'Discomfort', max: 5 },
    { key: 'carbonDioxide', displayName: 'Carbon Dioxide', max: 5 },
    { key: 'noise', displayName: 'Noise', max: 5 },
    { key: 'lightIntensity', displayName: 'Light Intensity', max: 5 },
];

type RadarChartProps = {
    classificationData: Record<string, string>;
};

const RadarChart = (props: RadarChartProps) => {
    const {classificationData} = props;

    const numericalData: number[] = indicators.map((indicator) => {
        const rawValue = classificationData[indicator.key];
        const normalizedValue = toCamelCase(rawValue);
        const numericValue = categoryToValue[indicator.key][normalizedValue];

        if (numericValue === undefined) {
            console.warn(
                `No numerical mapping found for ${indicator.displayName}: "${rawValue}" (normalized: "${normalizedValue}")`
            );
            return 0;
        }

        return numericValue;
    });

    const option: EChartsOption = {
        title: {
            text: 'Classifications',
            subtext: 'Based on the latest data',
            top: 10,
            left: 10,
        },
        tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
                const data: number[] = params.data.value;
                let tooltipText = `<strong>${params.seriesName}</strong><br/>`;
                data.forEach((val, idx) => {
                    const indicator = indicators[idx];
                    const categoryDisplay = classificationData[indicator.key] || 'N/A';
                    tooltipText += `${indicator.displayName}: <b>${categoryDisplay}</b><br/>`;
                });
                return tooltipText;
            },
        },
        radar: {
            indicator: indicators.map((indicator) => ({
                name: indicator.displayName,
                max: indicator.max,
            })),
            axisName: {
                show: true,
                textStyle: {
                    color: '#333',
                    fontSize: 12,
                },
            },
            axisLabel: {
                show: false,
            },
            radius: '70%',
            shape: 'circle',
            splitNumber: 5,
            nameGap: 15,
            splitLine: {
                lineStyle: {
                    color: '#ddd',
                },
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['#f9f9f9', '#ffffff'],
                },
            },
            axisLine: {
                lineStyle: {
                    color: '#ddd',
                },
            },
        },
        series: [
            {
                type: 'radar',
                name: `Data from ${dateUtils.formatDate(classificationData.createdAt)}`,
                lineStyle: {
                    width: 2,
                    color: '#5470C6',
                },
                emphasis: {
                    areaStyle: {
                        color: 'rgba(0, 0, 255, 1)'
                    }
                },
                areaStyle: {
                    opacity: 0.1,
                    color: '#5470C6',
                },
                symbol: 'circle',
                symbolSize: 6,
                data: [
                    {
                        value: numericalData,
                        name: 'Latest Data',
                    },
                ],
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: '90%', width: '100%' }} />;
};

export default RadarChart;
