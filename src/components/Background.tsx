import React from 'react'
import { Dimensions, View } from 'react-native';

const { height } = Dimensions.get('window')

export const Background = () => {
    return (
        <View
            style={{
                position: 'absolute',
                backgroundColor: '#5856D6',
                top: height < 770 ? -500 : -350,
                width: 1000,
                height: height < 770 ? 1250 : 1200,
                transform: [
                    { rotate: '-70deg' }
                ]
            }}
        />
    )
}
