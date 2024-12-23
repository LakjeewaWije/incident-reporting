import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#2563eb' }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="report"
                options={{
                    title: 'Report',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="camera-retro" color={color} />,
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    title: 'Map',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="map" color={color} />,
                }}
            />
            <Tabs.Screen
                name="about"
                options={{
                    title: 'About',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="exclamation-circle" color={color} />,
                }}
            />
        </Tabs>
    );
}
