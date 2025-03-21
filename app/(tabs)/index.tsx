import { StyleSheet, View, Image, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [habits, setHabits] = useState({
    goToBed: false,
    avoidBlueLight: false,
    roomTemp: false,
  });

  const [streak, setStreak] = useState<boolean[]>([false, false, false, false, false, false, false]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedHabits = await AsyncStorage.getItem('habits');
        const savedStreak = await AsyncStorage.getItem('streak');
        if (savedHabits) {
          setHabits(JSON.parse(savedHabits));
        }
        if (savedStreak) {
          setStreak(JSON.parse(savedStreak));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('habits', JSON.stringify(habits));
        await AsyncStorage.setItem('streak', JSON.stringify(streak));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    saveData();
  }, [habits, streak]);

  const toggleHabit = (habitKey: keyof typeof habits) => {
    setHabits((prev) => ({
      ...prev,
      [habitKey]: !prev[habitKey],
    }));
  };

  const handleCompleteDay = () => {
    const allHabitsCompleted = Object.values(habits).every((habit) => habit);
    if (allHabitsCompleted) {
      const today = new Date().getDay();
      const adjustedDay = today === 0 ? 6 : today - 1;
      setStreak((prev) => {
        const newStreak = [...prev];
        newStreak[adjustedDay] = true;
        return newStreak;
      });
      setHabits({
        goToBed: false,
        avoidBlueLight: false,
        roomTemp: false,
      });
    }
  };

  const handleResetStreak = async () => {
    Alert.alert(
      'Reset Streak',
      'Are you sure you want to reset your streak? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              setHabits({
                goToBed: false,
                avoidBlueLight: false,
                roomTemp: false,
              });
              setStreak([false, false, false, false, false, false, false]);
              await AsyncStorage.setItem('habits', JSON.stringify({
                goToBed: false,
                avoidBlueLight: false,
                roomTemp: false,
              }));
              await AsyncStorage.setItem('streak', JSON.stringify([false, false, false, false, false, false, false]));
            } catch (error) {
              console.error('Error resetting streak:', error);
            }
          },
        },
      ]
    );
  };

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    >
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="title">Sleep Streak</ThemedText>
        <View style={styles.streakContainer}>
          {daysOfWeek.map((day, index) => (
            <View key={index} style={styles.streakDay}>
              <ThemedText style={styles.dayText}>{day}</ThemedText>
              {streak[index] ? (
                <Image
                  source={require('@/assets/images/owl-icon.png')}
                  style={styles.owlIcon}
                />
              ) : (
                <View style={styles.emptyCircle} />
              )}
            </View>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="title">Tasks for Today</ThemedText>
        <View style={styles.checklist}>
          <TouchableOpacity
            style={styles.checklistItem}
            onPress={() => toggleHabit('goToBed')}
          >
            <View style={[styles.checkbox, habits.goToBed && styles.checkboxChecked]}>
              {habits.goToBed && <View style={styles.checkboxFill} />}
            </View>
            <ThemedText>Go to bed at 10pm</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checklistItem}
            onPress={() => toggleHabit('avoidBlueLight')}
          >
            <View style={[styles.checkbox, habits.avoidBlueLight && styles.checkboxChecked]}>
              {habits.avoidBlueLight && <View style={styles.checkboxFill} />}
            </View>
            <ThemedText>Avoided bluelight (no phones, tablets, bright lights 1 hour before bed)</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checklistItem}
            onPress={() => toggleHabit('roomTemp')}
          >
            <View style={[styles.checkbox, habits.roomTemp && styles.checkboxChecked]}>
              {habits.roomTemp && <View style={styles.checkboxFill} />}
            </View>
            <ThemedText>Set room temperature to 60-67°F / 15-19°C</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.completeButton,
              !Object.values(habits).every((habit) => habit) && styles.completeButtonDisabled,
            ]}
            onPress={handleCompleteDay}
            disabled={!Object.values(habits).every((habit) => habit)}
          >
            <ThemedText
              style={[
                styles.completeButtonText,
                !Object.values(habits).every((habit) => habit) && styles.completeButtonTextDisabled,
              ]}
            >
              Complete Day
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetStreak}
          >
            <ThemedText style={styles.resetButtonText}>
              Reset Streak
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 8,
    marginBottom: 16,
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  streakDay: {
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    marginBottom: 4,
  },
  owlIcon: {
    width: 24,
    height: 24,
  },
  emptyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  checklist: {
    marginTop: 8,
    gap: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: '#0A7EA4',
  },
  checkboxFill: {
    width: 16, // Smaller than the checkbox to create padding
    height: 16, // Smaller than the checkbox to create padding
    borderRadius: 2, // Slightly rounded corners for the fill
    backgroundColor: '#0A7EA4', // Same blue as the border
  },
  buttonContainer: {
    marginTop: 16,
    gap: 12,
  },
  completeButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#0A7EA4',
  },
  completeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  completeButtonTextDisabled: {
    color: '#666',
  },
  resetButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FF4D4D',
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});