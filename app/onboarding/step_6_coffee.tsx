import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import commonStyles from './common_styles';
import SleepGif from '../../assets/images/onboarding/step_6_coffee.gif';

export default function Step6Coffee() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? Colors.light.background : Colors.dark.background
  const handleContinue = () => {
    router.push('/onboarding/step_7_food');
  };

  return (
    <ThemedView style={commonStyles.container}>
      <StatusBar style="auto" />
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={commonStyles.content}>
          <View style={commonStyles.main}>
            <Image source={SleepGif} style={commonStyles.image} resizeMode="cover" />
            <ThemedText style={commonStyles.hookText}>
              On average, it takes 5 hours for half of the caffeine to leave our bodies!
            </ThemedText>
            <ThemedText style={commonStyles.questionText}>
              Do you often drink coffee or alcohol leading up to bedtime?
            </ThemedText>
          </View>

          <View style={commonStyles.buttonContainer}>
            <TouchableOpacity style={[commonStyles.pillButton, {
              backgroundColor: Colors[colorScheme].background,
              borderColor: textColor,
            }]} onPress={handleContinue}>
              <ThemedText style={commonStyles.pillButtonText}>Often</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[commonStyles.pillButton, {
              backgroundColor: Colors[colorScheme].background,
              borderColor: textColor,
            }]} onPress={handleContinue}>
              <ThemedText style={commonStyles.pillButtonText}>Sometimes</ThemedText>
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