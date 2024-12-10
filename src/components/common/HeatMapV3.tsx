// import React from 'react';
// import ReactECharts from 'echarts-for-react';
// import * as echarts from 'echarts';
// import dateUtils from '../../utils/dates';
// import {
//   EChartsOption,
//   CustomSeriesOption,
//   CustomSeriesRenderItemParams,
//   CustomSeriesRenderItemAPI,
//   CustomSeriesRenderItemReturn,
// } from 'echarts';
//
// type HeatMapProps = {
//   data: {
//     timestamp: string;
//     value: number;
//     metric: string;
//     classification: string;
//   }[];
// };
//
// type WeekdayName =
//   | 'monday'
//   | 'tuesday'
//   | 'wednesday'
//   | 'thursday'
//   | 'friday'
//   | 'saturday'
//   | 'sunday';
//
// const HeatMap: React.FC<HeatMapProps> = ({ data }) => {
//
//   console.log("----------------------------")
//   console.log("----------------------------")
//   console.log("JSON.stringify(data) -> ", JSON.stringify(data))
//   console.log("----------------------------")
//   console.log("----------------------------")
//
//   if (!data || data.length === 0) {
//     return <div>Loading heatmap data...</div>;
//   }
//
//   function timeToMinutes(timeStr: string): number {
//     const [hourStr, minuteStr] = timeStr.split(':');
//     return parseInt(hourStr, 10) * 60 + parseInt(minuteStr, 10);
//   }
//
//   const validData = data
//     .filter((d) => d.value !== undefined && !isNaN(d.value) && d.timestamp)
//     .map((d) => {
//       const dateTimeParts = d.timestamp.split(' ');
//       const day = dateTimeParts[0];
//       const timePart = dateTimeParts[1];
//       let time = '';
//       if (timePart) {
//         const [hour, minute] = timePart.split(':');
//         time = `${hour}:${minute}`;
//       }
//       return { ...d, day, time };
//     })
//     .filter((d) => d.day && d.time);
//
//   if (validData.length === 0) {
//     return <div>No valid data available for the heatmap.</div>;
//   }
//
//   const xData = Array.from(new Set(validData.map((d) => d.day))).sort(
//     (a, b) => new Date(a).getTime() - new Date(b).getTime()
//   );
//   const yData = Array.from(new Set(validData.map((d) => d.time))).sort(
//     (a, b) => timeToMinutes(a) - timeToMinutes(b)
//   );
//
//   // Map days to indices
//   const dayToIndexMap: { [key: string]: number } = {};
//   xData.forEach((day, index) => {
//     dayToIndexMap[day] = index;
//   });
//
//   const heatmapData = validData.map((d) => {
//     const dayIndex = dayToIndexMap[d.day];
//     const timeIndex = yData.indexOf(d.time);
//     return [dayIndex, timeIndex, d.value];
//   });
//
//   const minValue = Math.min(...validData.map((d) => d.value));
//   const maxValue = Math.max(...validData.map((d) => d.value));
//
//   if (isNaN(minValue) || isNaN(maxValue)) {
//     return <div>Invalid data for visualizing the heatmap.</div>;
//   }
//
//   const timeRanges: Record<WeekdayName, { start: string; end: string }[]> = {
//     monday: [
//       { start: '08:00', end: '12:00' },
//       { start: '14:00', end: '18:00' },
//     ],
//     tuesday: [{ start: '09:00', end: '17:00' }],
//     wednesday: [],
//     thursday: [{ start: '10:00', end: '16:00' }],
//     friday: [{ start: '08:30', end: '15:30' }],
//     saturday: [],
//     sunday: [],
//   };
//
//   // Identify ranges of consecutive days to highlight
//   const highlightedRanges: {startIndex: number, endIndex: number}[] = [];
//   let isHighlighting = false;
//   let startIndex = 0;
//
//   xData.forEach((day, index) => {
//     const dayOfWeek = dateUtils.getDayOfWeek(day); // 0 (Sunday) to 6 (Saturday)
//     const isHolidayOrWeekend =
//       dayOfWeek === 6 || dayOfWeek === 0 || dateUtils.isHoliday(new Date(day));
//
//     if (isHolidayOrWeekend) {
//       if (!isHighlighting) {
//         // Start of a new range
//         isHighlighting = true;
//         startIndex = index;
//       }
//       // Continue highlighting
//     } else {
//       if (isHighlighting) {
//         // End of the current range
//         isHighlighting = false;
//         highlightedRanges.push({
//           startIndex,
//           endIndex: index - 1,
//         });
//       }
//     }
//   });
//
//   // Handle the case where the last days are highlighted
//   if (isHighlighting) {
//     highlightedRanges.push({
//       startIndex,
//       endIndex: xData.length - 1,
//     });
//   }
//
//   const customSeries: CustomSeriesOption = {
//     type: 'custom',
//     renderItem: (
//       params: CustomSeriesRenderItemParams,
//       api: CustomSeriesRenderItemAPI
//     ): CustomSeriesRenderItemReturn => {
//       const yAxisMin = api.coord([0, 0])[1];
//       const yAxisMax = api.coord([0, yData.length - 1])[1];
//       const categoryWidth = (api.size!([1, 0]) as number[])[0]; // Width of one category on x-axis
//
//       const coordSys = params.coordSys as unknown as {
//         x: number;
//         y: number;
//         width: number;
//         height: number;
//       };
//
//       const group: any = {
//         type: 'group',
//         children: [],
//       };
//       highlightedRanges.forEach((range) => {
//         let xStart;
//         if (range.startIndex > 0) {
//           const xCenterStart = api.coord([range.startIndex, 0])[0];
//           const xCenterPrev = api.coord([range.startIndex - 1, 0])[0];
//           xStart = (xCenterPrev + xCenterStart) / 2;
//         } else {
//           const xCenterStart = api.coord([range.startIndex, 0])[0];
//           xStart = xCenterStart - categoryWidth / 2;
//         }
//
//         let xEnd;
//         if (range.endIndex < xData.length - 1) {
//           const xCenterEnd = api.coord([range.endIndex, 0])[0];
//           const xCenterNext = api.coord([range.endIndex + 1, 0])[0];
//           xEnd = (xCenterEnd + xCenterNext) / 2;
//         } else {
//           const xCenterEnd = api.coord([range.endIndex, 0])[0];
//           xEnd = xCenterEnd + categoryWidth / 2;
//         }
//
//         const rectShape = echarts.graphic.clipRectByRect(
//           {
//             x: xStart,
//             y: yAxisMin,
//             width: xEnd - xStart,
//             height: yAxisMax - yAxisMin,
//           },
//           {
//             x: coordSys.x,
//             y: coordSys.y,
//             width: coordSys.width,
//             height: coordSys.height,
//           }
//         );
//         if (rectShape) {
//           const rect: any = {
//             type: 'rect',
//             shape: rectShape,
//             style: api.style({
//               fill: 'transparent',
//               stroke: 'red', // Set your desired border color
//               lineWidth: 2,  // Set your desired border width
//             }),
//             silent: true,
//           };
//           group.children.push(rect);
//         }
//       });
//
//       return group as CustomSeriesRenderItemReturn;
//     },
//     data: [0], // Dummy data
//     z: 3, // Render above the heatmap
//   };
//
//   const weekdayNames: WeekdayName[] = [
//     'sunday',
//     'monday',
//     'tuesday',
//     'wednesday',
//     'thursday',
//     'friday',
//     'saturday',
//   ];
//
//   const dayToWeekdayMap: Record<string, WeekdayName> = {};
//   xData.forEach((dateStr) => {
//     const date = new Date(dateStr);
//     const dayOfWeek = date.getDay();
//     dayToWeekdayMap[dateStr] = weekdayNames[dayOfWeek];
//   });
//
//   function findClosestIndexInYData(timeStr: string): number {
//     const targetMinutes = timeToMinutes(timeStr);
//     let closestIndex = -1;
//     let minDiff = Infinity;
//     yData.forEach((yTime, index) => {
//       const yMinutes = timeToMinutes(yTime);
//       const diff = Math.abs(yMinutes - targetMinutes);
//       if (diff < minDiff) {
//         minDiff = diff;
//         closestIndex = index;
//       }
//     });
//     return closestIndex;
//   }
//
//   const timeRangeRects: { xIndex: number; yStartIndex: number; yEndIndex: number }[] = [];
//
//   xData.forEach((dateStr, xIndex) => {
//     const weekdayName = dayToWeekdayMap[dateStr];
//     const ranges = timeRanges[weekdayName];
//     if (ranges && ranges.length > 0) {
//       ranges.forEach((range: { start: string; end: string }) => {
//         const yStartIndex = findClosestIndexInYData(range.start);
//         const yEndIndex = findClosestIndexInYData(range.end);
//         if (yStartIndex !== -1 && yEndIndex !== -1) {
//           const yStart = Math.min(yStartIndex, yEndIndex);
//           const yEnd = Math.max(yStartIndex, yEndIndex);
//           timeRangeRects.push({
//             xIndex,
//             yStartIndex: yStart,
//             yEndIndex: yEnd,
//           });
//         }
//       });
//     }
//   });
//
//   const customTimeSeries: CustomSeriesOption = {
//     type: 'custom',
//     renderItem: (
//       params: CustomSeriesRenderItemParams,
//       api: CustomSeriesRenderItemAPI
//     ): CustomSeriesRenderItemReturn => {
//       const coordSys = params.coordSys as unknown as {
//         x: number;
//         y: number;
//         width: number;
//         height: number;
//       };
//
//       const group: any = {
//         type: 'group',
//         children: [],
//       };
//
//       timeRangeRects.forEach((rectInfo) => {
//         const xIndex = rectInfo.xIndex;
//         const yStartIndex = rectInfo.yStartIndex;
//         const yEndIndex = rectInfo.yEndIndex;
//
//         // Calculate x coordinates
//         const xStartCoord = api.coord([xIndex, 0])[0] - (api.size!([1, 0]) as number[])[0] / 2;
//         const xEndCoord = api.coord([xIndex, 0])[0] + (api.size!([1, 0]) as number[])[0] / 2;
//
//         const x = xStartCoord;
//         const width = xEndCoord - xStartCoord;
//
//         // Calculate y coordinates considering inverse y-axis
//         const yStartCoord = api.coord([0, yStartIndex])[1] + (api.size!([0, 1]) as number[])[1] / 2;
//         const yEndCoord = api.coord([0, yEndIndex])[1] - (api.size!([0, 1]) as number[])[1] / 2;
//
//         const y = Math.min(yStartCoord, yEndCoord);
//         const height = Math.abs(yEndCoord - yStartCoord);
//
//         const rectShape = echarts.graphic.clipRectByRect(
//           {
//             x,
//             y,
//             width,
//             height,
//           },
//           {
//             x: coordSys.x,
//             y: coordSys.y,
//             width: coordSys.width,
//             height: coordSys.height,
//           }
//         );
//
//         if (rectShape) {
//           const rect: any = {
//             type: 'rect',
//             shape: rectShape,
//             style: api.style({
//               fill: 'transparent',
//               stroke: 'green',
//               lineWidth: 2,
//             }),
//             silent: true,
//           };
//           group.children.push(rect);
//         }
//       });
//
//       return group as CustomSeriesRenderItemReturn;
//     },
//     data: [0], // Dummy data
//     z: 4, // Render above other series
//   };
//
//   const generateClassificationColor = (metric: string, classification: string): string => {
//     let classificationColor = '';
//     if (metric === 'effective_temp') {
//       switch (classification) {
//         case 'Cold':
//           classificationColor = '#313695';
//           break;
//         case 'Fresh':
//           classificationColor = '#abd9e9';
//           break;
//         case 'Comfortable':
//           classificationColor = '#35d900';
//           break;
//         case 'Warm':
//           classificationColor = '#f46d43';
//           break;
//         case 'Hot':
//           classificationColor = '#a50026';
//           break;
//         default:
//           classificationColor = 'transparent';
//           break;
//       }
//     } else if (metric === 'discomfort_index') {
//       switch (classification) {
//         case 'Comfortable':
//           classificationColor = '#35d900';
//           break;
//         case 'Moderate':
//           classificationColor = '#7ED900';
//           break;
//         case 'Uncomfortable':
//           classificationColor = '#D9D900';
//           break;
//         case 'Very Uncomfortable':
//           classificationColor = '#f46d43';
//           break;
//         case 'Unbearable':
//           classificationColor = '#a50026';
//           break;
//         default:
//           classificationColor = 'transparent';
//           break;
//       }
//     }
//
//     return classificationColor;
//   };
//
//   const option: EChartsOption = {
//     tooltip: {
//       position: 'top',
//       formatter: (params: any) => {
//         if (params.seriesType === 'bar') {
//           return ''; // Hide tooltip for the bar series
//         }
//         const day = xData[params.data[0]];
//         const time = yData[params.data[1]];
//         const value = params.data[2];
//         const classification = params.data[3];
//         console.log("--------------------------")
//         console.log("params.data -> ", params.data)
//         console.log("--------------------------")
//         const classificationColor = generateClassificationColor(
//           data[0].metric,
//           classification
//         );
//         return `${day} ${time}<br/>Classification: <span style="color: ${classificationColor}; font-weight: bold;">${classification}</span>`;
//       },
//     },
//     grid: {
//       height: '70%',
//       top: '10%',
//       bottom: '10%',
//       left: '10%',
//       right: '10%',
//     },
//     xAxis: {
//       type: 'category',
//       data: xData,
//       boundaryGap: true,
//       splitArea: {
//         show: false,
//       },
//       axisLabel: {
//         rotate: 45,
//         fontSize: 9,
//       },
//       axisTick: {
//         interval: 0,
//       },
//     },
//     yAxis: [
//       {
//         type: 'category',
//         data: yData,
//         inverse: true,
//         boundaryGap: true,
//         splitArea: {
//           show: true,
//         },
//         axisLabel: {
//           fontSize: 9,
//           interval: 3,
//         },
//         axisTick: {
//           interval: 3,
//         },
//       },
//       {
//         type: 'value',
//         show: false,
//         min: 0,
//         max: yData.length - 1,
//       },
//     ],
//     visualMap: {
//       min: minValue,
//       max: maxValue,
//       calculable: true,
//       orient: 'vertical',
//       left: 'right',
//       bottom: 'center',
//       align: 'left',
//       inRange: {
//         color: [
//           '#313695',
//           '#4575b4',
//           '#74add1',
//           '#abd9e9',
//           '#e0f3f8',
//           '#ffffbf',
//           '#fee090',
//           '#fdae61',
//           '#f46d43',
//           '#d73027',
//           '#a50026',
//         ],
//       },
//     },
//     series: [
//       {
//         name: 'Temperature Heatmap',
//         type: 'heatmap',
//         data: heatmapData,
//         yAxisIndex: 0,
//         emphasis: {
//           itemStyle: {
//             borderColor: '#333',
//             borderWidth: 1,
//           },
//         },
//         z: 2,
//       },
//       customSeries,
//       customTimeSeries,
//     ],
//   };
//
//   return (
//     <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
//   );
// };
//
// export default HeatMap;

















import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import dateUtils from '../../utils/dates';
import {
    EChartsOption,
    CustomSeriesOption,
    CustomSeriesRenderItemParams,
    CustomSeriesRenderItemAPI,
    CustomSeriesRenderItemReturn,
} from 'echarts';
import {useTheme} from '@mui/material';
import palette from '../../themes/palette';

type HeatMapV3Props = {
    data: {
        timestamp: string;
        value: number;
        metric: string;
        classification: string;
    }[];
};

type WeekdayName =
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';

type HeatmapDataPoint = {
    value: [number, number, number];
    classification: string;
};

const HeatMapV3: React.FC<HeatMapV3Props> = ({ data }) => {
    const theme = useTheme();

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

    const xData = Array.from(new Set(validData.map((d) => d.day))).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    const yData = Array.from(new Set(validData.map((d) => d.time))).sort(
        (a, b) => timeToMinutes(a) - timeToMinutes(b)
    );

    // Map days to indices
    const dayToIndexMap: { [key: string]: number } = {};
    xData.forEach((day, index) => {
        dayToIndexMap[day] = index;
    });

    const heatmapData: HeatmapDataPoint[] = validData.map((d) => ({
        value: [dayToIndexMap[d.day], yData.indexOf(d.time), d.value],
        classification: d.classification,
    }));

    const minValue = Math.min(...validData.map((d) => d.value));
    const maxValue = Math.max(...validData.map((d) => d.value));

    if (isNaN(minValue) || isNaN(maxValue)) {
        return <div>Invalid data for visualizing the heatmap.</div>;
    }

    const timeRanges: Record<WeekdayName, { start: string; end: string }[]> = {
        monday: [
            { start: '08:00', end: '12:00' },
            { start: '14:00', end: '18:00' },
        ],
        tuesday: [{ start: '09:00', end: '17:00' }],
        wednesday: [],
        thursday: [{ start: '10:00', end: '16:00' }],
        friday: [{ start: '08:30', end: '15:30' }],
        saturday: [],
        sunday: [],
    };

    // Identify ranges of consecutive days to highlight
    const highlightedRanges: {startIndex: number, endIndex: number}[] = [];
    let isHighlighting = false;
    let startIndex = 0;

    xData.forEach((day, index) => {
        const dayOfWeek = dateUtils.getDayOfWeek(day); // 0 (Sunday) to 6 (Saturday)
        const isHolidayOrWeekend =
            dayOfWeek === 6 || dayOfWeek === 0 || dateUtils.isHoliday(new Date(day));

        if (isHolidayOrWeekend) {
            if (!isHighlighting) {
                // Start of a new range
                isHighlighting = true;
                startIndex = index;
            }
            // Continue highlighting
        } else {
            if (isHighlighting) {
                // End of the current range
                isHighlighting = false;
                highlightedRanges.push({
                    startIndex,
                    endIndex: index - 1,
                });
            }
        }
    });

    // Handle the case where the last days are highlighted
    if (isHighlighting) {
        highlightedRanges.push({
            startIndex,
            endIndex: xData.length - 1,
        });
    }

    const customSeries: CustomSeriesOption = {
        type: 'custom',
        renderItem: (
            params: CustomSeriesRenderItemParams,
            api: CustomSeriesRenderItemAPI
        ): CustomSeriesRenderItemReturn => {
            const yAxisMin = api.coord([0, 0])[1];
            const yAxisMax = api.coord([0, yData.length - 1])[1];
            const categoryWidth = (api.size!([1, 0]) as number[])[0]; // Width of one category on x-axis

            const coordSys = params.coordSys as unknown as {
                x: number;
                y: number;
                width: number;
                height: number;
            };

            const group: any = {
                type: 'group',
                children: [],
            };
            highlightedRanges.forEach((range) => {
                let xStart;
                if (range.startIndex > 0) {
                    const xCenterStart = api.coord([range.startIndex, 0])[0];
                    const xCenterPrev = api.coord([range.startIndex - 1, 0])[0];
                    xStart = (xCenterPrev + xCenterStart) / 2;
                } else {
                    const xCenterStart = api.coord([range.startIndex, 0])[0];
                    xStart = xCenterStart - categoryWidth / 2;
                }

                let xEnd;
                if (range.endIndex < xData.length - 1) {
                    const xCenterEnd = api.coord([range.endIndex, 0])[0];
                    const xCenterNext = api.coord([range.endIndex + 1, 0])[0];
                    xEnd = (xCenterEnd + xCenterNext) / 2;
                } else {
                    const xCenterEnd = api.coord([range.endIndex, 0])[0];
                    xEnd = xCenterEnd + categoryWidth / 2;
                }

                const rectShape = echarts.graphic.clipRectByRect(
                    {
                        x: xStart,
                        y: yAxisMin,
                        width: xEnd - xStart,
                        height: yAxisMax - yAxisMin,
                    },
                    {
                        x: coordSys.x,
                        y: coordSys.y,
                        width: coordSys.width,
                        height: coordSys.height,
                    }
                );
                if (rectShape) {
                    const rect: any = {
                        type: 'rect',
                        shape: rectShape,
                        style: api.style({
                            fill: 'transparent',
                            stroke: 'red', // Set your desired border color
                            lineWidth: 2,  // Set your desired border width
                        }),
                        silent: true,
                    };
                    group.children.push(rect);
                }
            });

            return group as CustomSeriesRenderItemReturn;
        },
        data: [0], // Dummy data
        z: 3, // Render above the heatmap
    };

    const weekdayNames: WeekdayName[] = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ];

    const dayToWeekdayMap: Record<string, WeekdayName> = {};
    xData.forEach((dateStr) => {
        const date = new Date(dateStr);
        const dayOfWeek = date.getDay();
        dayToWeekdayMap[dateStr] = weekdayNames[dayOfWeek];
    });

    function findClosestIndexInYData(timeStr: string): number {
        const targetMinutes = timeToMinutes(timeStr);
        let closestIndex = -1;
        let minDiff = Infinity;
        yData.forEach((yTime, index) => {
            const yMinutes = timeToMinutes(yTime);
            const diff = Math.abs(yMinutes - targetMinutes);
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = index;
            }
        });
        return closestIndex;
    }

    const timeRangeRects: { xIndex: number; yStartIndex: number; yEndIndex: number }[] = [];

    xData.forEach((dateStr, xIndex) => {
        const weekdayName = dayToWeekdayMap[dateStr];
        const ranges = timeRanges[weekdayName];
        if (ranges && ranges.length > 0) {
            ranges.forEach((range: { start: string; end: string }) => {
                const yStartIndex = findClosestIndexInYData(range.start);
                const yEndIndex = findClosestIndexInYData(range.end);
                if (yStartIndex !== -1 && yEndIndex !== -1) {
                    const yStart = Math.min(yStartIndex, yEndIndex);
                    const yEnd = Math.max(yStartIndex, yEndIndex);
                    timeRangeRects.push({
                        xIndex,
                        yStartIndex: yStart,
                        yEndIndex: yEnd,
                    });
                }
            });
        }
    });

    const customTimeSeries: CustomSeriesOption = {
        type: 'custom',
        renderItem: (
            params: CustomSeriesRenderItemParams,
            api: CustomSeriesRenderItemAPI
        ): CustomSeriesRenderItemReturn => {
            const coordSys = params.coordSys as unknown as {
                x: number;
                y: number;
                width: number;
                height: number;
            };

            const group: any = {
                type: 'group',
                children: [],
            };

            timeRangeRects.forEach((rectInfo) => {
                const xIndex = rectInfo.xIndex;
                const yStartIndex = rectInfo.yStartIndex;
                const yEndIndex = rectInfo.yEndIndex;

                // Calculate x coordinates
                const xStartCoord = api.coord([xIndex, 0])[0] - (api.size!([1, 0]) as number[])[0] / 2;
                const xEndCoord = api.coord([xIndex, 0])[0] + (api.size!([1, 0]) as number[])[0] / 2;

                const x = xStartCoord;
                const width = xEndCoord - xStartCoord;

                // Calculate y coordinates considering inverse y-axis
                const yStartCoord = api.coord([0, yStartIndex])[1] + (api.size!([0, 1]) as number[])[1] / 2;
                const yEndCoord = api.coord([0, yEndIndex])[1] - (api.size!([0, 1]) as number[])[1] / 2;

                const y = Math.min(yStartCoord, yEndCoord);
                const height = Math.abs(yEndCoord - yStartCoord);

                const rectShape = echarts.graphic.clipRectByRect(
                    {
                        x,
                        y,
                        width,
                        height,
                    },
                    {
                        x: coordSys.x,
                        y: coordSys.y,
                        width: coordSys.width,
                        height: coordSys.height,
                    }
                );

                if (rectShape) {
                    const rect: any = {
                        type: 'rect',
                        shape: rectShape,
                        style: api.style({
                            fill: 'transparent',
                            stroke: 'green',
                            lineWidth: 2,
                        }),
                        silent: true,
                    };
                    group.children.push(rect);
                }
            });

            return group as CustomSeriesRenderItemReturn;
        },
        data: [0], // Dummy data
        z: 4, // Render above other series
    };

    const generateClassificationColor = (metric: string, classification: string): string => {
        let classificationColor = '';
        if (metric === 'effective_temp') {
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
        } else if (metric === 'carbon_dioxide') {
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
        } else if (metric === 'light_intensity') {
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

    const option: EChartsOption = {
        tooltip: {
            position: 'top',
            formatter: (params: any) => {
                if (params.seriesType === 'bar') {
                    return ''; // Hide tooltip for the bar series
                }
                const day = xData[params.data.value[0]];
                const time = yData[params.data.value[1]];
                const classification = params.data.classification;
                const classificationColor = generateClassificationColor(
                    data[0].metric,
                    classification
                );
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
                show: false,
            },
            axisLabel: {
                rotate: 45,
                fontSize: 9,
            },
            axisTick: {
                interval: 0,
            },
        },
        yAxis: [
            {
                type: 'category',
                data: yData,
                inverse: true,
                boundaryGap: true,
                splitArea: {
                    show: true,
                },
                axisLabel: {
                    fontSize: 9,
                    interval: 3,
                },
                axisTick: {
                    interval: 3,
                },
            },
            {
                type: 'value',
                show: false,
                min: 0,
                max: yData.length - 1,
            },
        ],
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
                yAxisIndex: 0,
                emphasis: {
                    itemStyle: {
                        borderColor: '#333',
                        borderWidth: 1,
                    },
                },
                z: 2,
            },
            customSeries,
            customTimeSeries,
        ],
    };

    return (
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    );
};

export default HeatMapV3;
