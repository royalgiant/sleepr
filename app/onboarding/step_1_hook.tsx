import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
// Assuming you have an image related to restful sleep in your assets
import SleepImage from '../../assets/images/onboarding/step_1_hook.png';

export default function Step1HookScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? Colors.light.background : Colors.dark.background
  const handleContinue = () => {
    router.push('/onboarding/step2_consistency');
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.main}>
            <Image source={SleepImage} style={styles.image} resizeMode="cover" />
            <ThemedText style={styles.hookText}>
              Unlock the power of consistent habits for truly restful nights and brighter days.
            </ThemedText>
            <ThemedText style={styles.questionText}>
              Do you believe consistent habits are key to a good night's sleep?
            </ThemedText>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.pillButton, {
              backgroundColor: Colors[colorScheme].background,
              borderColor: textColor,
            }]} onPress={handleContinue}>
              <ThemedText style={styles.pillButtonText}>Yes!</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.pillButton, {
              backgroundColor: Colors[colorScheme].background,
              borderColor: textColor,
            }]} onPress={handleContinue}>
              <ThemedText style={styles.pillButtonText}>Maybe...</ThemedText>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'space-around',
    paddingVertical: 48,
  },
  main: {
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 150,
  },
  hookText: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 24,
    lineHeight: 28,
  },
  questionText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 32,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 12, // Adjust the gap as needed for spacing between buttons
  },
  pillButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});