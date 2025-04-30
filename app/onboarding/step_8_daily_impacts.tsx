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
import SleepImage from '../../assets/images/onboarding/step_8_daily_impacts.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

const checklistItems = [
  "It's hard to concentrate and make decisions",
  "I often feel more forgetful",
  "I'm less patient and more irritable",
  "I often feel a lack of energy to do anything",
  "I crave junk food & I'm always gaining weight",
  "I don't feel motivated for work or my goals",
];

export default function Step8DailyImpacts() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? Colors.light.background : Colors.dark.background;
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxToggle = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleContinue = async () => {
    try {
      await AsyncStorage.setItem('step8DailyImpacts', JSON.stringify(selectedItems));
      console.log('Saved to AsyncStorage: step8DailyImpacts - ', selectedItems);
      router.push('/onboarding/step_9_emotional_impacts');
    } catch (error) {
      console.error('Error saving to AsyncStorage:', error);
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
                The daily cost of poor sleep
              </ThemedText>
              <ThemedText style={commonStyles.questionText}>
                What do you find relatable throughout your day?
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
                    backgroundColor: Colors[colorScheme].primary,
                    borderColor: textColor,
                  },
                ]}
                onPress={handleContinue}
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