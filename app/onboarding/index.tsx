import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import Logo from '../../assets/images/Sleepr-transparent.png';
import { Colors } from '@/constants/Colors';

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleNext = () => {
    router.push('/onboarding/step_1_hook');
  };

  const textColor = colorScheme === 'dark' ? Colors.light.background : Colors.dark.background
  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.main}>
            <Image source={Logo} style={styles.logo} resizeMode="contain" />
            <ThemedText style={[styles.welcomeText, { color: Colors[colorScheme].text }]}>
              Welcome!
            </ThemedText>
            <ThemedText style={[styles.mainText, { color: textColor }]}>
              Let's start by checking out your current sleep habits
            </ThemedText>
          </View>

          <TouchableOpacity
            style={[styles.pillButton, {
              backgroundColor: Colors[colorScheme].background,
              borderColor: textColor,
            }]}
            onPress={handleNext}
          >
            <ThemedText style={[styles.pillButtonText, { color: textColor }]}>
              Start Quiz
            </ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 48,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 300,
    height: 100,
  },
  welcomeText: {
    fontSize: 36,
    textAlign: 'center',
    paddingTop: 30,
    marginBottom: 8,
  },
  mainText: {
    fontSize: 18,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 0,
  },
  pillButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  pillButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});