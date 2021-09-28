import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const baseUrlLocal = 'http://192.168.0.58:2021/api';
const baseUrlProd = 'https://mern-react-native-be.herokuapp.com/api';


const productosApi = axios.create({ baseURL: baseUrlProd });


// Middleware que verificar si hay token o no (para que cuando se recargue la pantalla se mantenga con el inicio de sesión)
productosApi.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers['x-token'] = token;
        }

        return config;
    }
);




export default productosApi;