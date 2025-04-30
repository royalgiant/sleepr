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
import SleepImage from '../../assets/images/onboarding/step_9_emotional_impacts.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

const checklistItems = [
  "I feel more anxious or worried than usual",
  "My mood swings and I'm emotionally unstable",
  "I don't want to connect with friends and family",
  "Stress feels too hard to handle",
  "I just want to cry",
  "I find myself less empathetic or understanding",
  "I often feel low and unhappy",
];

export default function step9EmotionalImpacts() {
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
      await AsyncStorage.setItem('step9EmotionalImpacts', JSON.stringify(selectedItems));
      console.log('Saved to AsyncStorage: step9EmotionalImpacts - ', selectedItems);
      router.push('/onboarding/step_10_long_term_impacts');
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
                Beyond Tired: Your Emotions & Connections
              </ThemedText>
              <ThemedText style={commonStyles.questionText}>
                Sleep Deprived? How Do You Feel?
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