import React, { createContext, useState, useEffect } from "react";
import { ImagePickerResponse } from "react-native-image-picker";
import productosApi from "../api/productosApi";
import { Producto, ProductsResponse } from '../interfaces/appInterfaces';


type ProductsContextProps = {
    products: Producto[];
    loadProducts: () => Promise<void>;
    addProduct: (categoryId: string, productName: string, productPrice: string) => Promise<Producto>;
    updateProduct: (categoryId: string, productName: string, productPrice: string, productId: string) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    loadProductById: (id: string) => Promise<Producto>;
    uploadImage: (data: any, id: string) => Promise<void>;
}


export const ProductsContext = createContext({} as ProductsContextProps)


export const ProductsProvider = ({ children }: any) => {

    const [products, setProducts] = useState<Producto[]>([])

    useEffect(() => {
        loadProducts();
    }, [])

    const loadProducts = async () => {

        const resp = await productosApi.get<ProductsResponse>('/productos?limite=50');
        // setProducts([...products, ...resp.data.productos]);
        setProducts([...resp.data.productos]);

    };

    const addProduct = async (categoryId: string, productName: string, productPrice: string): Promise<Producto> => {

        const resp = await productosApi.post<Producto>('/productos', {
            nombre: productName,
            categoria: categoryId,
            precio: productPrice
        })
        setProducts([...products, resp.data])

        return resp.data
    };

    const updateProduct = async (categoryId: string, productName: string, productPrice: string, productId: string) => {

        const resp = await productosApi.put<Producto>(`/productos/${productId}`, {
            nombre: productName,
            categoria: categoryId,
            precio: productPrice
        })
        setProducts(products.map(prod => {
            return (prod._id === productId)
                ? resp.data
                : prod
        }))

    };

    const deleteProduct = async (productId: string) => {

        const resp = await productosApi.delete<Producto>(`/productos/${productId}`)
        // console.log("RESP: ", resp)
        // setProducts(products.map(prod => {
        //     return (prod._id === productId)
        //         ? resp.data
        //         : prod
        // }))

    };

    const loadProductById = async (id: string): Promise<Producto> => {
        const resp = await productosApi.get<Producto>(`/productos/${id}`);
        return resp.data;
    };

    const uploadImage = async (data: ImagePickerResponse, id: string) => {

        const fileToUpload = {
            uri: data.assets?.[0].uri,
            type: data.assets?.[0].type,
            name: data.assets?.[0].fileName
        }

        const formData = new FormData();
        formData.append('archivo', fileToUpload);

        try {

            const resp = await productosApi.put(`/uploads/productos/${id}`, formData)
            // console.log(resp)

        } catch (error) {
            console.log(error)
        }

    };


    return (
        <ProductsContext.Provider value={{
            products,
            loadProducts,
            addProduct,
            updateProduct,
            deleteProduct,
            loadProductById,
            uploadImage
        }}>
            {children}
        </ProductsContext.Provider>
    )
}
