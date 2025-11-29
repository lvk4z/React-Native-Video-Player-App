import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import LogoSvg from '@/assets/logo.svg';
import AppIcon from '@/assets/app-icon.svg';


function LoginScreen() {
    const router = useRouter();

    const handleLogin = () => {
        router.push("/(tabs)/home");
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleBox}>
                <LogoSvg width={300}/>
            </View>

            <View style={styles.logoBox}>
                <AppIcon width={200}/>
            </View>

            <View style={styles.bottomBox}>
                <Text style={styles.subtitle}>Welcome to the best YouTube-based learning application.</Text>

                <Pressable
                    onPress={handleLogin}
                    style={styles.loginButton}
                >
                    <Text style={styles.loginButtonLabel}>Log in as a Guest</Text>
                </Pressable>

                <View style={styles.linksBox}>
                    <Text style={styles.links}>By continuing you agree with Terms and Conditions and Privacy Policy</Text>
                </View>
            </View>
        </View>
    )


    
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#8D99AE',
        paddingHorizontal: 30,
        display: 'flex',
        height: '100%',
        justifyContent: 'space-around'
    },
    titleBox: {
        marginTop: 60,
        alignItems: 'center',
    },
    logoBox: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomBox: {
        marginBottom: 20,
        alignItems: 'center',
        display: 'flex',
        gap: 20,
    },
    subtitle: {
        fontSize: 26,
        color: '#FFFFFF',
    },
    loginButton: {
        backgroundColor: '#2B2D42',
        padding: 10,
        width: '100%',
        borderRadius: 12,
    },
    loginButtonLabel: {
        color: '#FFFFFF',
        fontSize: 18,
        textAlign: 'center',
    },
    linksBox: {
        alignItems: 'center',
    },
    links: {
        color: '#FFFFFF',
        fontSize: 16,
    },

})

export default LoginScreen;