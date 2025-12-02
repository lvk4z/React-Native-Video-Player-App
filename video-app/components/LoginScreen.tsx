import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import LogoSvg from '@/assets/logo.svg';
import AppIcon from '@/assets/app-icon.svg';
import { PText } from '@/components/StyledText'


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
                <PText style={styles.subtitle}>Welcome to the best YouTube-based learning application.</PText>

                <Pressable
                    onPress={handleLogin}
                    style={styles.loginButton}
                >
                    <PText style={styles.loginButtonLabel}>Log in as a Guest</PText>
                </Pressable>

                <View>
                    <PText style={styles.links}>By continuing you agree with <PText style={styles.boldLinks}>Terms and Conditions</PText> and <PText style={styles.boldLinks}>Privacy Policy</PText></PText>
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
        fontSize: 22,
        color: '#FFFFFF',
        lineHeight: 24,
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
    links: {
        color: '#FFFFFF',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 16,
    },
    boldLinks: {
        color: '#2B2D42',
        textDecorationColor: '#2B2D42'
    }

})

export default LoginScreen;