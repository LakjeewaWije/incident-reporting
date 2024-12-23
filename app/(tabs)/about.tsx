import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import NoInternetOverlay from '../components/noInternetOverlay';

const About: React.FC = () => {
    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.name}><Text style={{ color: 'gray' }}>Developed By :</Text>Lakjeewa Ransimal Wijebandara <Text style={{ color: 'gray' }}>/ Student Id :</Text> : 20054325</Text>
                <Text style={styles.title}>About the App</Text>
                <Text style={styles.sectionTitle}>App for News Reporters</Text>
                <Text style={styles.text}>
                    This application is designed specifically for news reporters in certain organizations. It enables reporters to capture incidents by taking pictures and recording locations.
                </Text>
                <Text style={styles.sectionTitle}>Public Safety and Awareness</Text>
                <Text style={styles.text}>
                    The app provides the public with information to help avoid danger zones and promotes personal safety by sharing real-time incident data.
                </Text>
                <Text style={styles.sectionTitle}>Incident Reporting Features</Text>
                <Text style={styles.text}>
                    Reporters can view all reported incidents, see a map with pointers showing where news was recorded, and visualize data with bar charts showing the number of reports per month.
                </Text>
                <Text style={styles.sectionTitle}>Authenticity and Accuracy</Text>
                <Text style={styles.text}>
                    The app ensures the authenticity of reported incidents by requiring reporters to be in the area where the incident occurred. This prevents unauthorized display of others' work.
                </Text>
                <Text style={styles.sectionTitle}>Get Started</Text>
                <Text style={styles.text}>
                    Start by adding a new report to test the functionality of the app.
                </Text>
            </ScrollView>
            {/* <NoInternetOverlay /> */}
        </>

    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2563eb',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
        color: '#db5e30',
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
        color: '#666',
    },
});

export default About;
