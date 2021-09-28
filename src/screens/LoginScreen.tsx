import React, { useContext, useEffect } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';

import { Background } from '../components/Background'
import { WhiteLogo } from '../components/WhiteLogo'
import { loginStyles } from '../theme/loginTheme';
import { useForm } from '../hooks/useForm';
import { AuthContext } from '../context/AuthContext';


interface Props extends StackScreenProps<any, any> { }

export const LoginScreen = ({ navigation }: Props) => {

    const { signIn, errorMessage, removeError } = useContext(AuthContext);

    const { email, password, onChange } = useForm({
        email: '',
        password: ''
    });

    useEffect(() => {
        if (errorMessage.length === 0) return

        Alert.alert('Inicio de sesión incorrecto', errorMessage, [{
            text: 'Ok',
            onPress: removeError
        }]);
    }, [errorMessage])

    const onLogin = () => {
        Keyboard.dismiss();

        signIn({ correo: email, password })
    }

    return (
        <>
            {/* Background */}
            <Background />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={(Platform.OS === 'ios') ? 'padding' : 'height'}
            >
                <View style={loginStyles.formContainer}>

                    <WhiteLogo />

                    <Text style={loginStyles.title}>Iniciar sesión</Text>

                    <Text style={loginStyles.label}>Email</Text>
                    <TextInput
                        placeholder="Ingrese su email"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        keyboardType="email-address"
                        underlineColorAndroid='white'
                        style={[
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                        ]}
                        selectionColor='black'
                        onChangeText={(value) => onChange(value, 'email')}
                        value={email}
                        onSubmitEditing={onLogin}
                        autoCapitalize='none'
                        autoCorrect={false}
                    />

                    <Text style={loginStyles.label}>Contraseña</Text>
                    <TextInput
                        placeholder="*********"
                        secureTextEntry
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        underlineColorAndroid='white'
                        style={[
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                        ]}
                        selectionColor='black'
                        onChangeText={(value) => onChange(value, 'password')}
                        value={password}
                        onSubmitEditing={onLogin}
                        autoCapitalize='none'
                        autoCorrect={false}
                    />

                    <View style={loginStyles.buttonContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={loginStyles.button}
                            onPress={onLogin}
                        >
                            <Text style={loginStyles.buttonText}>Iniciar sesión</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={loginStyles.newUserContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.replace('RegisterScreen')}
                        >
                            <Text style={loginStyles.buttonText}>Crear cuenta</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </>
    )
}
