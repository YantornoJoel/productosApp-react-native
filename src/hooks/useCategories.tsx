import { useEffect, useState } from "react"
import productosApi from "../api/productosApi"
import { Categoria, CategoriesResponse } from '../interfaces/appInterfaces';


export const useCategories = () => {

    const [categories, setCategories] = useState<Categoria[]>([])
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async () => {
        const resp = await productosApi.get<CategoriesResponse>('/categorias')
        setCategories(resp.data.categorias);
        setIsLoading(false)
    }

    return {
        categories,
        isLoading
    }
}
