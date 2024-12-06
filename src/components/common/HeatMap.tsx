import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import dateUtils from '../../utils/dates';

type HeatMapProps = {
    data: {
        timestamp: string;
        value: number;
        metric: string;
    }[];
};

const HeatMap: React.FC<HeatMapProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>Loading heatmap data...</div>;
    }

    function timeToMinutes(timeStr: string): number {
        const [hourStr, minuteStr] = timeStr.split(':');
        return parseInt(hourStr, 10) * 60 + parseInt(minuteStr, 10);
    }

    const validData = data
        .filter((d) => d.value !== undefined && !isNaN(d.value) && d.timestamp)
        .map((d) => {
            const dateTimeParts = d.timestamp.split(' ');
            const day = dateTimeParts[0];
            const timePart = dateTimeParts[1];
            let time = '';
            if (timePart) {
                const [hour, minute] = timePart.split(':');
                time = `${hour}:${minute}`;
            }
            return { ...d, day, time };
        })
        .filter((d) => d.day && d.time);

    if (validData.length === 0) {
        return <div>No valid data available for the heatmap.</div>;
    }

    const xDataOriginal = Array.from(new Set(validData.map((d) => d.day))).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    const yData = Array.from(new Set(validData.map((d) => d.time))).sort(
        (a, b) => timeToMinutes(a) - timeToMinutes(b)
    );

    function insertBlanksIntoXData(xData: string[]): { newXData: string[]; blankNames: string[] } {
        const newXData: string[] = [];
        const blankNames: string[] = [];
        let blankCounter = 1;
        xData.forEach((day) => {
            const dayOfWeek = dateUtils.getDayOfWeek(day);
            if (dayOfWeek === 6) {
                const blankName = `blank_before_saturday_${blankCounter}`;
                newXData.push(blankName);
                blankNames.push(blankName);
                blankCounter++;
            }
            newXData.push(day);
            if (dayOfWeek === 0) {
                const blankName = `blank_after_sunday_${blankCounter}`;
                newXData.push(blankName);
                blankNames.push(blankName);
                blankCounter++;
            }
        });
        return { newXData, blankNames };
    }

    const { newXData: xData, blankNames } = insertBlanksIntoXData(xDataOriginal);

    const dayToIndexMap: { [key: string]: number } = {};
    xData.forEach((day, index) => {
        if (!blankNames.includes(day)) {
            dayToIndexMap[day] = index;
        }
    });

    const heatmapData = validData.map((d) => {
        const dayIndex = dayToIndexMap[d.day];
        const timeIndex = yData.indexOf(d.time);
        return [dayIndex, timeIndex, d.value];
    });

    const minValue = Math.min(...validData.map((d) => d.value));
    const maxValue = Math.max(...validData.map((d) => d.value));

    if (isNaN(minValue) || isNaN(maxValue)) {
        return <div>Invalid data for visualizing the heatmap.</div>;
    }

    const generateClassification = (metric: string, value: number) => {
        let classification = '';
        let classificationColor = '';
        if (metric === 'effective_temp') {
            if (value < 9) {
                classification = 'Cold';
                classificationColor = '#313695';
            } else if (value < 17) {
                classification = 'Fresh';
                classificationColor = '#abd9e9';
            } else if (value < 21) {
                classification = 'Comfortable';
                classificationColor = '#35d900';
            } else if (value < 23) {
                classification = 'Warm';
                classificationColor = '#f46d43';
            } else {
                classification = 'Hot';
                classificationColor = '#a50026';
            }
        } else if (metric === 'discomfort_index') {
            if (value < 24) {
                classification = 'Comfortable';
                classificationColor = '#35d900';
            } else if (value < 27) {
                classification = 'Moderate';
                classificationColor = '#7ED900';
            } else if (value < 29) {
                classification = 'Uncomfortable';
                classificationColor = '#D9D900';
            } else if (value < 32) {
                classification = 'Very Uncomfortable';
                classificationColor = '#f46d43';
            } else {
                classification = 'Unbearable';
                classificationColor = '#a50026';
            }
        }

        return { classification, classificationColor };
    }

    const option: echarts.EChartsOption = {
        tooltip: {
            position: 'top',
            formatter: (params: any) => {
                const day = xData[params.data[0]];
                const time = yData[params.data[1]];
                const value = params.data[2];
                const {classification, classificationColor} = generateClassification(data[0].metric, value);
                if (blankNames.includes(day)) return ''; // No tooltip for blank entries
                return `${day} ${time}<br/>Classification: <span style="color: ${classificationColor}; font-weight: bold;">${classification}</span>`;
            },
        },
        grid: {
            height: '70%',
            top: '10%',
            bottom: '10%',
            left: '10%',
            right: '10%',
        },
        xAxis: {
            type: 'category',
            data: xData,
            boundaryGap: true,
            splitArea: {
                show: true,
            },
            axisLabel: {
                rotate: 45,
                fontSize: 9,
                formatter: (value: string) => (blankNames.includes(value) ? '' : value), // Hide labels for blank entries
            },
            axisTick: {
                interval: 0
            }
        },
        yAxis: {
            type: 'category',
            data: yData,
            boundaryGap: true,
            splitArea: {
                show: true,
            },
            axisLabel: {
                fontSize: 9,
                interval: 3,
            },
            axisTick: {
                interval: 3
            }
        },
        visualMap: {
            min: minValue,
            max: maxValue,
            calculable: true,
            orient: 'vertical',
            left: 'right',
            bottom: 'center',
            align: 'left',
            inRange: {
                color: [
                    '#313695',
                    '#4575b4',
                    '#74add1',
                    '#abd9e9',
                    '#e0f3f8',
                    '#ffffbf',
                    '#fee090',
                    '#fdae61',
                    '#f46d43',
                    '#d73027',
                    '#a50026',
                ],
            },
        },
        series: [
            {
                name: 'Temperature Heatmap',
                type: 'heatmap',
                data: heatmapData,
                emphasis: {
                    itemStyle: {
                        borderColor: '#333',
                        borderWidth: 1,
                    },
                },
                markLine: {
                    silent: true,
                    symbol: 'none',
                    lineStyle: {
                        type: 'dashed',
                        color: '#000',
                        width: 1,
                    },
                    data: blankNames.map((blankName) => ({
                        xAxis: blankName,
                    })),
                    label: {
                        show: false,
                    }
                },
            },
        ],
    };

    return (
        <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
        />
    );
};

export default HeatMap;
