import React, { useContext, useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Text, View, StyleSheet, ScrollView, TextInput, Button, ActivityIndicator, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { ProductsStackParams } from '../navigator/ProductsNavigator';
import { useCategories } from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';
import { ProductsContext } from '../context/ProductsContext';



interface Props extends StackScreenProps<ProductsStackParams, 'ProductScreen'> { };

export const ProductScreen = ({ route, navigation }: Props) => {

    const { id = '', name = '' } = route.params

    const [tempUri, setTempUri] = useState<string>()

    const { categories, isLoading } = useCategories()

    const { loadProductById, addProduct, updateProduct, uploadImage, deleteProduct } = useContext(ProductsContext);

    const { _id, categoriaId, nombre, img, precio, form, onChange, setFormValue } = useForm({
        _id: id,
        categoriaId: '',
        nombre: name,
        img: '',
        precio: ''
    });


    useEffect(() => {
        navigation.setOptions({
            title: (nombre || 'Sin nombre')
        })
    }, [nombre])

    useEffect(() => {
        loadProduct()
    }, [])

    const loadProduct = async () => {
        if (id.length === 0) return;
        const product = await loadProductById(id)
        setFormValue({
            _id: id,
            categoriaId: product.categoria._id,
            img: product.img || '',
            nombre,
            precio: product.precio.toString()
        })
    }

    const saveOrUpdate = async () => {
        if (id.length > 0) {
            updateProduct(categoriaId, nombre, precio, id)
        } else {
            const tempCategoriaId = categoriaId || categories[0]._id;
            const newProduct = await addProduct(tempCategoriaId, nombre, precio)
            onChange(newProduct._id, '_id')
        }
    }

    const deleteProductById = () => {
        deleteProduct(id)
        navigation.replace('ProductsScreen')
    }

    if (isLoading) return <ActivityIndicator size={150} color="green" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />

    const takePhoto = () => {
        launchCamera({
            mediaType: 'photo',
            quality: 0.7
        }, (resp) => {
            if (resp.didCancel) return;
            if (!resp.assets?.[0].uri) return;
            setTempUri(resp.assets?.[0].uri)
            uploadImage(resp, _id)
        });
    }

    const takePhotoFromGallery = () => {
        launchImageLibrary({
            mediaType: 'photo',
            quality: 0.7
        }, (resp) => {
            if (resp.didCancel) return;
            if (!resp.assets?.[0].uri) return;
            setTempUri(resp.assets?.[0].uri)
            uploadImage(resp, _id)
        });
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.label}>Nombre del producto:</Text>

                <TextInput
                    placeholder="Producto"
                    style={styles.textInput}
                    value={nombre}
                    onChangeText={(value) => onChange(value, 'nombre')}
                />

                <Text style={styles.label}>Precio:</Text>

                <TextInput
                    placeholder={precio || 'Precio'}
                    style={styles.textInput}
                    value={precio}
                    onChangeText={(value) => onChange(value, 'precio')}
                />

                <Text style={styles.label}>Categoría:</Text>
                <Picker
                    selectedValue={categoriaId}
                    onValueChange={(value) => onChange(value, 'categoriaId')}
                >
                    {
                        categories.map(category => (
                            <Picker.Item
                                label={category.nombre}
                                value={category._id}
                                key={category._id}
                            />
                        ))
                    }

                </Picker>

                <Button
                    title="Guardar"
                    color="#5856D6"
                    onPress={saveOrUpdate}
                />

                {
                    (_id.length > 0) && (
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                            <Button
                                title="Cámara"
                                color="#5856D6"
                                onPress={takePhoto}
                            />

                            <View style={{ width: 15 }} />

                            <Button
                                title="Galería"
                                color="#5856D6"
                                onPress={takePhotoFromGallery}
                            />

                            <View style={{ width: 15 }} />

                            <Button
                                title="Eliminar"
                                color="red"
                                onPress={deleteProductById}
                            />

                        </View>
                    )
                }

                {
                    (img.length > 0 && !tempUri) && (
                        <Image
                            source={{ uri: img }}
                            style={{
                                marginTop: 30,
                                width: '100%',
                                height: 300
                            }}
                        />
                    )
                }


                {
                    (tempUri) && (
                        <Image
                            source={{ uri: tempUri }}
                            style={{
                                marginTop: 30,
                                width: '100%',
                                height: 300
                            }}
                        />
                    )
                }

            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 20
    },
    label: {
        fontSize: 18
    },
    textInput: {
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        height: 45,
        borderRadius: 20,
        borderColor: 'rgba(0,0,0,0.2)'
    }
})