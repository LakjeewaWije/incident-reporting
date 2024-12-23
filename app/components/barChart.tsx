import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import useItemStore from '../store/useItemStore';
import StoreState from '../store/item.interface';
import { format, parse } from 'date-fns';

interface DataItem {
    label: string;
    value: number;
}

const colorScheme = [
    '#4A90E2', // Light Blue
    '#50E3C2', // Turquoise
    '#B8E986', // Light Green
    '#F8E71C', // Yellow
    '#7B92D7', // Medium Blue
    '#4A8AD8', // Darker Blue
    '#6BD5E1', // Sky Blue
    '#A1DE74', // Lime Green
    '#FFCE4A', // Soft Yellow
    '#7B86D7', // Deep Blue
    '#4A74D8', // Deeper Blue
    '#8FBAFF'  // Light Lavender Blue
];

const BarChartExample: React.FC = () => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const items = useItemStore((state: StoreState) => state.items);

    const [data, setData] = useState<any>([])


    useEffect(() => {

        let monthCounts: any = {
            Jan: 0,
            Feb: 0,
            Mar: 0,
            Apr: 0,
            May: 0,
            Jun: 0,
            Jul: 0,
            Aug: 0,
            Sep: 0,
            Oct: 0,
            Nov: 0,
            Dec: 0,
        };

        items.forEach(item => {

            const parsedDate = parse(item.date, 'yyyy-MM-dd hh:mm a', new Date());

            const monthShort = format(parsedDate, 'MMM');

            monthCounts[monthShort]++;
        });

        const data: DataItem[] = Object.keys(monthCounts).map(month => ({
            label: month,
            value: monthCounts[month],
        }));
        setData(data)
    }, [items]);



    return (
        <View style={styles.container}>
            <BarChart
                data={data.map((item: any, index: any) => ({
                    value: item.value,
                    label: item.label,
                    frontColor: colorScheme[index % colorScheme.length],
                }))}
                barWidth={10} // Adjust the bar width
                barBorderRadius={4}
                width={windowWidth * 0.70} // Adjust the chart width
                height={windowHeight * 0.179} // Adjust the chart height
                yAxisThickness={0}
                xAxisThickness={0}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
});

export default BarChartExample;
