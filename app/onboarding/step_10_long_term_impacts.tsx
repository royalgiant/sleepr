import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import commonStyles from './common_styles';
import SleepImage from '../../assets/images/onboarding/step_10_long_term_impacts.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

const checklistItems = [
  "Increased risk of heart disease & high blood pressure",
  "Weakened immune system",
  "Increased likelihood of type 2 diabetes",
  "Alzheimer's and Dementia",
  "Car accidents due to fatigue",
  "I find myself less empathetic or understanding",
  "Mental health issues like depression",
];

export default function step10LongTermImpacts() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? Colors.light.background : Colors.dark.background;
  const [selectedItems, setSelectedItems] = useState([]);
  const isContinueEnabled = selectedItems.length > 0;

  const handleCheckboxToggle = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleContinue = async () => {
    if (isContinueEnabled) {
      try {
        await AsyncStorage.setItem('step10LongTermImpacts', JSON.stringify(selectedItems));
        console.log('Saved to AsyncStorage: step10LongTermImpacts - ', selectedItems);
        router.push('/onboarding/step_11_solution');
      } catch (error) {
        console.error('Error saving to AsyncStorage:', error);
      }
    }
  };

  return (
    <ThemedView style={commonStyles.container}>
      <StatusBar style="auto" />
      <SafeAreaView style={commonStyles.safeArea}>
        <ScrollView contentContainerStyle={commonStyles.scrollViewContent}>
          <View style={commonStyles.content}>
            <View style={commonStyles.main}>
              <Image source={SleepImage} style={commonStyles.image} resizeMode="cover" />
              <ThemedText style={commonStyles.hookText}>
                Long-term health risks caused by poor sleep
              </ThemedText>
              <ThemedText style={commonStyles.questionText}>
                Which Ones Would You REALLY Want to Avoid?
              </ThemedText>

              <View style={commonStyles.checklistContainer}>
                {checklistItems.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      commonStyles.listItem,
                      selectedItems.includes(item) && commonStyles.selectedListItem,
                      { backgroundColor: Colors[colorScheme].background, borderColor: textColor },
                    ]}
                    onPress={() => handleCheckboxToggle(item)}
                  >
                    <View style={commonStyles.checkbox}>
                      {selectedItems.includes(item) && (
                        <View style={[commonStyles.checkboxInner, { backgroundColor: textColor }]} />
                      )}
                    </View>
                    <ThemedText style={[commonStyles.listItemText, { color: textColor }]}>{item}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={commonStyles.buttonContainer}>
              <TouchableOpacity
                style={[
                  commonStyles.pillButton,
                  {
                    backgroundColor: isContinueEnabled ? Colors[colorScheme].primary : Colors[colorScheme].border,
                    borderColor: textColor,
                  },
                ]}
                onPress={handleContinue}
                disabled={!isContinueEnabled}
              >
                <ThemedText
                  style={[
                    commonStyles.pillButtonText,
                    { color: textColor },
                  ]}
                >
                  Continue
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}