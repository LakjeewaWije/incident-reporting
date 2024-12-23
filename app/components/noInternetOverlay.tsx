import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Dimensions } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const NoInternetOverlay: React.FC = () => {
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state: any) => {
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <Modal
            visible={!isConnected}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.overlay}>
                <Text style={styles.text}>No Internet Connection</Text>
            </View>
        </Modal>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    text: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default NoInternetOverlay;
