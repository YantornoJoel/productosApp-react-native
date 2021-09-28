import React, { createContext, useEffect, useReducer } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import productosApi from '../api/productosApi';
import { Usuario, LoginResponse, LoginData, RegisterData } from '../interfaces/appInterfaces';
import { AuthReducer, AuthState } from './authReducer';


type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signUp: (registerData: RegisterData) => void;
    signIn: (loginData: LoginData) => void;
    logOut: () => void;
    removeError: () => void;
}


const authInitialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: ''
}

export const AuthContext = createContext({} as AuthContextProps);


export const AuthProvider = ({ children }: any) => {

    const [state, dispatch] = useReducer(AuthReducer, authInitialState)

    useEffect(() => {
        validaToken();
    }, [])

    const validaToken = async () => {
        const token = await AsyncStorage.getItem('token')

        // No hay token, no esta autorizado
        if (!token) return dispatch({ type: 'notAuthenticated' });

        // Si hay token
        const resp = await productosApi.get('/auth');
        if (resp.status !== 200) {
            return dispatch({ type: 'notAuthenticated' });
        };

        await AsyncStorage.setItem('token', resp.data.token);
        dispatch({
            type: 'signUp',
            payload: {
                token: resp.data.token,
                user: resp.data.usuario
            }
        })

    }


    const signUp = async ({ nombre, correo, password, rol = "ADMIN_ROLE" }: RegisterData) => {
        try {
            const { data } = await productosApi.post<LoginResponse>('/usuarios', { nombre, correo, password, rol })
            dispatch({
                type: 'signUp',
                payload: {
                    user: data.usuario,
                    token: data.token
                }
            })

            await AsyncStorage.setItem('token', data.token)

        } catch (error: any) {
            dispatch({
                type: 'addError',
                payload: error.response.data.errors[0].msg || 'Revise la información'
            })
        }
    };


    const signIn = async ({ correo, password }: LoginData) => {
        try {
            const { data } = await productosApi.post<LoginResponse>('/auth/login', { correo, password })
            dispatch({
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            })

            await AsyncStorage.setItem('token', data.token)

        } catch (error: any) {
            dispatch({
                type: 'addError',
                payload: error.response.data.msg || 'Información incorrecta'
            })
        }
    };


    const logOut = async () => {
        await AsyncStorage.removeItem('token');
        dispatch({ type: 'logout' });
    };


    const removeError = () => {
        dispatch({
            type: 'removeError'
        })
    };


    return (
        <AuthContext.Provider value={{
            ...state,
            signUp,
            signIn,
            logOut,
            removeError
        }}>
            {children}
        </AuthContext.Provider>
    )
}
