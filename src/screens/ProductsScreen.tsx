import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Text, View, StyleSheet, TouchableOpacity, RefreshControl, Button } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { ProductsContext } from '../context/ProductsContext';
import { ProductsStackParams } from '../navigator/ProductsNavigator';
import { AuthContext } from '../context/AuthContext';


interface Props extends StackScreenProps<ProductsStackParams, 'ProductsScreen'> { };

export const ProductsScreen = ({ navigation }: Props) => {

    const { products, loadProducts } = useContext(ProductsContext);
    const { logOut } = useContext(AuthContext);

    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={{ marginRight: 15 }}
                    onPress={() => navigation.navigate('ProductScreen', {})}
                >
                    <Text>Agregar</Text>
                </TouchableOpacity>
            )
        })
    }, [])

    const loadProductsPullRefresh = async () => {
        setIsRefreshing(true);
        await loadProducts()
        setIsRefreshing(false)
    }

    return (
        <View style={{
            flex: 1,
            marginHorizontal: 15,
            marginVertical: 10
        }}>
            <FlatList
                data={products}
                keyExtractor={(producto) => producto._id}

                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={
                            () => navigation.navigate('ProductScreen', {
                                id: item._id,
                                name: item.nombre
                            })
                        }
                    >
                        <Text style={styles.productName}>{item.nombre}</Text>
                    </TouchableOpacity>
                )}

                ItemSeparatorComponent={() => (
                    <View style={styles.itemSeparator} />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={loadProductsPullRefresh}
                    />
                }
            />

            <Button
                title="Cerrar sesión"
                color="#5856D6"
                onPress={logOut}
            />

        </View>
    )
}



const styles = StyleSheet.create({
    productName: {
        fontSize: 20
    },
    itemSeparator: {
        borderBottomWidth: 1.5,
        marginVertical: 7,
        // borderBottomColor: 'rgba(0,0,0,0.2)'
        borderBottomColor: '#5856D6'
    }
})