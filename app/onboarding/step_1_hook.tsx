import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import commonStyles from './common_styles';
import SleepImage from '../../assets/images/onboarding/step_1_hook.png';

export default function Step1HookScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? Colors.light.background : Colors.dark.background
  const handleContinue = () => {
    router.push('/onboarding/step2_consistency');
  };

  return (
    <ThemedView style={commonStyles.container}>
      <StatusBar style="auto" />
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={commonStyles.content}>
          <View style={commonStyles.main}>
            <Image source={SleepImage} style={commonStyles.image} resizeMode="cover" />
            <ThemedText style={commonStyles.hookText}>
              Unlock the power of consistent habits for truly restful nights and brighter days.
            </ThemedText>
            <ThemedText style={commonStyles.questionText}>
              Do you believe consistent habits are key to a good night's sleep?
            </ThemedText>
          </View>

          <View style={commonStyles.buttonContainer}>
            <TouchableOpacity style={[commonStyles.pillButton, {
              backgroundColor: Colors[colorScheme].background,
              borderColor: textColor,
            }]} onPress={handleContinue}>
              <ThemedText style={commonStyles.pillButtonText}>Yes!</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[commonStyles.pillButton, {
              backgroundColor: Colors[colorScheme].background,
              borderColor: textColor,
            }]} onPress={handleContinue}>
              <ThemedText style={commonStyles.pillButtonText}>Maybe...</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}