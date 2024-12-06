import {Box, Card, Typography, useTheme} from '@mui/material';
import Chart from './chart';

type GaugeCardProps = {
    cardTitle: string;
    value: number;
};

const GaugeCard = (props: GaugeCardProps) => {
    const {cardTitle, value} = props;
    const theme = useTheme();

    const percentageToHexColor = (percentage: number) => {
        const clampedPercentage = Math.max(0, Math.min(100, percentage)) / 100; // Normalize to 0-1

        // RGB components of the start color (#84A9FF) light
        const startRed = 132;
        const startGreen = 169;
        const startBlue = 255;

        // RGB components of the end color (#091A7A)
        const endRed = 9;
        const endGreen = 26;
        const endBlue = 122;

        // Interpolate between the start and end RGB values
        const red = Math.round(startRed + (endRed - startRed) * clampedPercentage);
        const green = Math.round(startGreen + (endGreen - startGreen) * clampedPercentage);
        const blue = Math.round(startBlue + (endBlue - startBlue) * clampedPercentage);

        // Convert RGB values to hexadecimal
        const redHex = red.toString(16).padStart(2, '0').toUpperCase();
        const greenHex = green.toString(16).padStart(2, '0').toUpperCase();
        const blueHex = blue.toString(16).padStart(2, '0').toUpperCase();

        return `#${redHex}${greenHex}${blueHex}`;
    }

    const chartOptions = {
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                hollow: {
                    background: 'transparent',
                },
                track: {
                    background: theme.palette.grey['700'],
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        fontSize: "30px",
                        show: true
                    }
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'horizontal',
                shadeIntensity: 0.5,
                gradientToColors: [theme.palette.primary.darker],
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100],
                colorStops: [
                    {
                        offset: 0,
                        color: theme.palette.primary.lighter,
                        opacity: 1,
                    },
                    {
                        offset: value,
                        color: percentageToHexColor(value),
                        opacity: 1,
                    },
                ],
            }
        },
        labels: ["Progress"],
    };

    return (
        <Card
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
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
                    color: useTheme().palette.text.primary,
                    fontWeight: 'bold',
                }}
            >
                {cardTitle}
            </Typography>
            <Box
                sx={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                }}
            >
                <Chart
                    type="radialBar"
                    series={[value]}
                    width="100%"
                    height="150%"
                    options={chartOptions}
                />
            </Box>
        </Card>
    );
};

export default GaugeCard;
