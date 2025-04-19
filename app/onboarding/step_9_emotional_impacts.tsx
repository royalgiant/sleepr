import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView } from 'react-native'; // Import ScrollView
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import commonStyles from './common_styles';
import SleepImage from '../../assets/images/onboarding/step_9_emotional_impacts.png';

const checklistItems = [
  "It's hard to concentrate and make decisions",
  "I often feel more forgetful",
  "I'm less patient and more irritable",
  "I often feel a lack of energy to do anything",
  "I crave junk food & I'm always gaining weight",
  "I don't feel motivated for work or my goals",
  // ... potentially more items
];

export default function Step8DailyImpacts() {
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

  const handleContinue = () => {
    if (isContinueEnabled) {
      router.push('/onboarding/step_9_emotional_impacts');
      console.log('Selected Items:', selectedItems);
    }
  };

  return (
    <ThemedView style={commonStyles.container}>
      <StatusBar style="auto" />
      <SafeAreaView style={commonStyles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}> {/* Use contentContainerStyle */}
          <View style={commonStyles.content}>
            <View style={commonStyles.main}>
              <Image source={SleepImage} style={commonStyles.image} resizeMode="cover" />
              <ThemedText style={commonStyles.hookText}>
                The Daily Cost of Poor Sleep
              </ThemedText>
              <ThemedText style={commonStyles.questionText}>
                What do you find relatable throughout your day?
              </ThemedText>

              <View style={styles.checklistContainer}>
                {checklistItems.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.listItem,
                      selectedItems.includes(item) && styles.selectedListItem,
                      { backgroundColor: Colors[colorScheme].background, borderColor: textColor },
                    ]}
                    onPress={() => handleCheckboxToggle(item)}
                  >
                    <View style={styles.checkbox}>
                      {selectedItems.includes(item) && (
                        <View style={[styles.checkboxInner, { backgroundColor: textColor }]} />
                      )}
                    </View>
                    <ThemedText style={[styles.listItemText, { color: textColor }]}>{item}</ThemedText>
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

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between', 
  },
  checklistContainer: {
    paddingVertical: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  selectedListItem: {},
  listItemText: {
    marginLeft: 12,
    fontSize: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 2,
  },
});