import { Dimensions, StyleSheet } from "react-native";

const { height } = Dimensions.get('window')

export const loginStyles = StyleSheet.create({
    formContainer: {
        flex: 1,
        paddingHorizontal: 50,
        justifyContent: 'center',
        height: 600,
        marginBottom: 75
    },
    formContainerRegister: {
        flex: 1,
        paddingHorizontal: 50,
        justifyContent: 'center',
        height: 600,
        marginBottom: height < 770 ? 0 : 40
    },
    title: {
        color: 'white',
        fontSize: height < 770 ? 25 : 30,
        fontWeight: 'bold',
        marginTop: 20
    },
    label: {
        marginTop: 25,
        color: 'white',
        fontWeight: 'bold'
    },
    inputField: {
        color: 'white',
        fontSize: height < 770 ? 15 : 20
    },
    inputFieldIOS: {
        borderBottomColor: 'white',
        borderBottomWidth: 2,
        paddingBottom: 4
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 50
    },
    button: {
        borderWidth: 2,
        borderColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 100
    },
    buttonText: {
        fontSize: height < 770 ? 14 : 18,
        color: 'white'
    },
    newUserContainer: {
        alignItems: 'flex-end',
        marginTop: 20
    },
    buttonReturn: {
        position: 'absolute',
        top: 20,
        left: 20,
        borderWidth: 1,
        borderColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 100
    }
})