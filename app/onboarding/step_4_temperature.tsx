import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import commonStyles from './common_styles';
import SleepImage from '../../assets/images/onboarding/step_4_temperature.png';

export default function Step4Tempature() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? Colors.light.background : Colors.dark.background
  const handleContinue = () => {
    router.push('/onboarding/step_4_temperature');
  };

  return (
    <ThemedView style={commonStyles.container}>
      <StatusBar style="auto" />
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={commonStyles.content}>
          <View style={commonStyles.main}>
            <Image source={SleepImage} style={commonStyles.image} resizeMode="cover" />
            <ThemedText style={commonStyles.hookText}>
              FYI. Bedroom temperature matters a lot!
            </ThemedText>
            <ThemedText style={commonStyles.questionText}>
              Do you usually keep your bedroom cool while you sleep?
            </ThemedText>
          </View>

          <View style={commonStyles.buttonContainer}>
            <TouchableOpacity style={[commonStyles.pillButton, {
              backgroundColor: Colors[colorScheme].background,
              borderColor: textColor,
            }]} onPress={handleContinue}>
              <ThemedText style={commonStyles.pillButtonText}>Yes</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[commonStyles.pillButton, {
              backgroundColor: Colors[colorScheme].background,
              borderColor: textColor,
            }]} onPress={handleContinue}>
              <ThemedText style={commonStyles.pillButtonText}>I try to</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[commonStyles.pillButton, {
              backgroundColor: Colors[colorScheme].background,
              borderColor: textColor,
            }]} onPress={handleContinue}>
              <ThemedText style={commonStyles.pillButtonText}>Not really</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}