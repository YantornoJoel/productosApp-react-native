import React from 'react'
import { Dimensions, Image, View } from 'react-native';

const { height } = Dimensions.get('window')

export const WhiteLogo = () => {
    return (
        <View style={{ alignItems: 'center' }}>
            <Image
                source={require('../assets/react-logo-white.png')}
                style={{
                    width: height < 770 ? 80 : 110,
                    height:  height < 770 ? 70 : 100
                }}
            />
        </View>
    )
}
