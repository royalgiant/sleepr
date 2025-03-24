import { StyleSheet, View, Image, Alert, Platform, Modal, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/constants/Colors';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [habits, setHabits] = useState({
    goToBed: false,
    avoidBlueLight: false,
    roomTemp: false,
    didWindDown: false,
    avoidCaffeine: false,
    avoidLateEating: false,
  });

  const [streak, setStreak] = useState<{ completedHabits: number }[]>([
    { completedHabits: 0 },
    { completedHabits: 0 },
    { completedHabits: 0 },
    { completedHabits: 0 },
    { completedHabits: 0 },
    { completedHabits: 0 },
    { completedHabits: 0 },
  ]);
  const [lastCompletionDate, setLastCompletionDate] = useState<string | null>(null);
  const [isDayCompleted, setIsDayCompleted] = useState(false);
  const [bedtime, setBedtime] = useState<Date | null>(null);
  const [blueLightMinutes, setBlueLightMinutes] = useState<number>(60);
  const [didWindDownRoutine, setDidWindDownRoutine] = useState<boolean>(false);
  const [avoidCaffeineReminder, setAvoidCaffeineReminder] = useState<boolean>(false);
  const [avoidCaffeineHours, setAvoidCaffeineHours] = useState<number>(6);
  const [avoidLateEatingReminder, setAvoidLateEatingReminder] = useState<boolean>(false);
  const [avoidLateEatingHours, setAvoidLateEatingHours] = useState<number>(3);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const calculateCompletedHabits = () => {
    return Object.values(habits).filter((habit) => habit).length;
  };

  const loadData = async () => {
    try {
      const savedHabits = await AsyncStorage.getItem('habits');
      const savedStreak = await AsyncStorage.getItem('streak');
      const savedCompletionDate = await AsyncStorage.getItem('lastCompletionDate');
      const savedBedtime = await AsyncStorage.getItem('bedtime');
      const savedBlueLightMinutes = await AsyncStorage.getItem('blueLightMinutes');
      const savedDidWindDownRoutine = await AsyncStorage.getItem('didWindDownRoutine');
      const savedAvoidCaffeineReminder = await AsyncStorage.getItem('avoidCaffeineReminder');
      const savedAvoidCaffeineHours = await AsyncStorage.getItem('avoidCaffeineHours');
      const savedAvoidLateEatingReminder = await AsyncStorage.getItem('avoidLateEatingReminder');
      const savedAvoidLateEatingHours = await AsyncStorage.getItem('avoidLateEatingHours');

      if (savedHabits) {
        setHabits(JSON.parse(savedHabits));
      }
      if (savedStreak) {
        setStreak(JSON.parse(savedStreak));
      }
      if (savedCompletionDate) {
        setLastCompletionDate(savedCompletionDate);
        checkIfDayCompleted(savedCompletionDate);
      }
      if (savedBedtime) {
        setBedtime(new Date(savedBedtime));
      } else {
        const defaultBedtime = new Date();
        defaultBedtime.setHours(22, 0, 0, 0);
        setBedtime(defaultBedtime);
      }
      if (savedBlueLightMinutes) {
        setBlueLightMinutes(parseInt(savedBlueLightMinutes));
      }
      if (savedDidWindDownRoutine) {
        setDidWindDownRoutine(JSON.parse(savedDidWindDownRoutine));
      }
      if (savedAvoidCaffeineReminder) {
        setAvoidCaffeineReminder(JSON.parse(savedAvoidCaffeineReminder));
      }
      if (savedAvoidCaffeineHours) {
        setAvoidCaffeineHours(parseInt(savedAvoidCaffeineHours));
      }
      if (savedAvoidLateEatingReminder) {
        setAvoidLateEatingReminder(JSON.parse(savedAvoidLateEatingReminder));
      }
      if (savedAvoidLateEatingHours) {
        setAvoidLateEatingHours(parseInt(savedAvoidLateEatingHours));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadSettings = async () => {
        try {
          const savedBedtime = await AsyncStorage.getItem('bedtime');
          const savedBlueLightMinutes = await AsyncStorage.getItem('blueLightMinutes');
          const savedDidWindDownRoutine = await AsyncStorage.getItem('didWindDownRoutine');
          const savedAvoidCaffeineReminder = await AsyncStorage.getItem('avoidCaffeineReminder');
          const savedAvoidCaffeineHours = await AsyncStorage.getItem('avoidCaffeineHours');
          const savedAvoidLateEatingReminder = await AsyncStorage.getItem('avoidLateEatingReminder');
          const savedAvoidLateEatingHours = await AsyncStorage.getItem('avoidLateEatingHours');

          if (savedBedtime) {
            setBedtime(new Date(savedBedtime));
          }
          if (savedBlueLightMinutes) {
            setBlueLightMinutes(parseInt(savedBlueLightMinutes));
          }
          if (savedDidWindDownRoutine) {
            setDidWindDownRoutine(JSON.parse(savedDidWindDownRoutine));
          }
          if (savedAvoidCaffeineReminder) {
            setAvoidCaffeineReminder(JSON.parse(savedAvoidCaffeineReminder));
          }
          if (savedAvoidCaffeineHours) {
            setAvoidCaffeineHours(parseInt(savedAvoidCaffeineHours));
          }
          if (savedAvoidLateEatingReminder) {
            setAvoidLateEatingReminder(JSON.parse(savedAvoidLateEatingReminder));
          }
          if (savedAvoidLateEatingHours) {
            setAvoidLateEatingHours(parseInt(savedAvoidLateEatingHours));
          }
        } catch (error) {
          console.error('Error loading settings on focus:', error);
        }
      };
      loadSettings();
    }, [])
  );

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('habits', JSON.stringify(habits));
        await AsyncStorage.setItem('streak', JSON.stringify(streak));
        await AsyncStorage.setItem('lastCompletionDate', lastCompletionDate || '');
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    saveData();
  }, [habits, streak, lastCompletionDate]);

  const getLocalDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const checkIfDayCompleted = (completionDate: string) => {
    const today = new Date();
    const todayDateString = getLocalDateString(today);
    console.log('Today (Local):', todayDateString, 'Last Completion Date:', completionDate);

    const isCompleted = completionDate === todayDateString;
    setIsDayCompleted(isCompleted);
    if (!isCompleted) {
      setHabits({
        goToBed: false,
        avoidBlueLight: false,
        roomTemp: false,
        didWindDown: false,
        avoidCaffeine: false,
        avoidLateEating: false,
      });
    } else {
      setHabits({
        goToBed: true,
        avoidBlueLight: true,
        roomTemp: true,
        didWindDown: true,
        avoidCaffeine: true,
        avoidLateEating: true,
      });
    }
  };

  const toggleHabit = (habitKey: keyof typeof habits) => {
    if (isDayCompleted) return;
    setHabits((prev) => ({
      ...prev,
      [habitKey]: !prev[habitKey],
    }));
  };

  const handleCompleteDay = () => {
    const mandatoryHabits = {
      goToBed: habits.goToBed,
      avoidBlueLight: habits.avoidBlueLight,
      roomTemp: habits.roomTemp,
    };
    const allMandatoryHabitsCompleted = Object.values(mandatoryHabits).every((habit) => habit);
    if (allMandatoryHabitsCompleted) {
      const today = new Date().getDay();
      const adjustedDay = today === 0 ? 6 : today - 1;
      const completedHabitsCount = calculateCompletedHabits();
      setStreak((prev) => {
        const newStreak = [...prev];
        newStreak[adjustedDay] = { completedHabits: completedHabitsCount };
        return newStreak;
      });
      const todayDateString = getLocalDateString(new Date());
      setLastCompletionDate(todayDateString);
      setIsDayCompleted(true);
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
                didWindDown: false,
                avoidCaffeine: false,
                avoidLateEating: false,
              });
              setStreak([
                { completedHabits: 0 },
                { completedHabits: 0 },
                { completedHabits: 0 },
                { completedHabits: 0 },
                { completedHabits: 0 },
                { completedHabits: 0 },
                { completedHabits: 0 },
              ]);
              setLastCompletionDate(null);
              setIsDayCompleted(false);
              await AsyncStorage.setItem('habits', JSON.stringify({
                goToBed: false,
                avoidBlueLight: false,
                roomTemp: false,
                didWindDown: false,
                avoidCaffeine: false,
                avoidLateEating: false,
              }));
              await AsyncStorage.setItem('streak', JSON.stringify([
                { completedHabits: 0 },
                { completedHabits: 0 },
                { completedHabits: 0 },
                { completedHabits: 0 },
                { completedHabits: 0 },
                { completedHabits: 0 },
                { completedHabits: 0 },
              ]));
              await AsyncStorage.setItem('lastCompletionDate', '');
            } catch (error) {
              console.error('Error resetting streak:', error);
            }
          },
        },
      ]
    );
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    console.log('Date Picker Changed:', selectedDate, 'Event Type:', event.type);
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const handleDateConfirm = () => {
    const dateString = getLocalDateString(tempDate);
    setLastCompletionDate(dateString);
    checkIfDayCompleted(dateString);

    const selectedDate = new Date(tempDate);
    const dayOfWeek = selectedDate.getDay();
    const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const completedHabitsCount = calculateCompletedHabits();
    setStreak((prev) => {
      const newStreak = [...prev];
      newStreak[adjustedDay] = { completedHabits: completedHabitsCount };
      return newStreak;
    });

    setShowDatePicker(false);
  };

  const formatDate = (date: Date) => {
    return getLocalDateString(date);
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const formatDuration = (value: number, unit: 'hours' | 'minutes') => {
    if (unit === 'hours') {
      return value === 0 ? '0 hrs (off)' : `${value} hr${value !== 1 ? 's' : ''}`;
    } else {
      return `${value} min${value !== 1 ? 's' : ''}`;
    }
  };

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const isDevMode = __DEV__;

  const getOwlIcon = (completedHabits: number) => {
    if (completedHabits >= 6) {
      return require('@/assets/images/owl-icon-gold.png');
    } else if (completedHabits >= 4 && completedHabits < 6) {
      return require('@/assets/images/owl-icon-silver.png');
    } else if (completedHabits == 3) {
      return require('@/assets/images/owl-icon.png');
    }
    return null;
  };

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
              {streak[index].completedHabits > 0 ? (
                <Image
                  source={getOwlIcon(streak[index].completedHabits)}
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

        <ThemedView style={styles.subSectionContainer}>
          <ThemedText type="subtitle">Mandatory Sleep Habits</ThemedText>
          <View style={styles.checklist}>
            <TouchableOpacity
              style={[styles.checklistItem, isDayCompleted && styles.disabledChecklistItem]}
              onPress={() => toggleHabit('goToBed')}
              disabled={isDayCompleted}
            >
              <View style={[styles.checkbox, habits.goToBed && styles.checkboxChecked]}>
                {habits.goToBed && <View style={styles.checkboxFill} />}
              </View>
              <ThemedText style={[styles.habitText, isDayCompleted && styles.disabledText]}>
                Go to bed at {bedtime ? formatTime(bedtime) : '10:00 PM'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.checklistItem, isDayCompleted && styles.disabledChecklistItem]}
              onPress={() => toggleHabit('avoidBlueLight')}
              disabled={isDayCompleted}
            >
              <View style={[styles.checkbox, habits.avoidBlueLight && styles.checkboxChecked]}>
                {habits.avoidBlueLight && <View style={styles.checkboxFill} />}
              </View>
              <ThemedText style={[styles.habitText, isDayCompleted && styles.disabledText]}>
                Avoided bluelight (no phones, tablets, etc, {formatDuration(blueLightMinutes, 'mins')} before bed)
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.checklistItem, isDayCompleted && styles.disabledChecklistItem]}
              onPress={() => toggleHabit('roomTemp')}
              disabled={isDayCompleted}
            >
              <View style={[styles.checkbox, habits.roomTemp && styles.checkboxChecked]}>
                {habits.roomTemp && <View style={styles.checkboxFill} />}
              </View>
              <ThemedText style={[styles.habitText, isDayCompleted && styles.disabledText]}>
                Set room temperature to 60-67°F(15-19°C)
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>

        {(didWindDownRoutine || (avoidCaffeineReminder && avoidCaffeineHours > 0) || (avoidLateEatingReminder && avoidLateEatingHours > 0)) && (
          <ThemedView style={styles.subSectionContainer}>
            <ThemedText type="subtitle">Bonus Sleep Habits</ThemedText>
            <View style={styles.checklist}>
              {didWindDownRoutine && (
                <TouchableOpacity
                  style={[styles.checklistItem, isDayCompleted && styles.disabledChecklistItem]}
                  onPress={() => toggleHabit('didWindDown')}
                  disabled={isDayCompleted}
                >
                  <View style={[styles.checkbox, habits.didWindDown && styles.checkboxChecked]}>
                    {habits.didWindDown && <View style={styles.checkboxFill} />}
                  </View>
                  <ThemedText style={[styles.habitText, isDayCompleted && styles.disabledText]}>
                    Did wind-down routine (e.g., yoga, reading, meditation)
                  </ThemedText>
                </TouchableOpacity>
              )}

              {avoidCaffeineReminder && avoidCaffeineHours > 0 && (
                <TouchableOpacity
                  style={[styles.checklistItem, isDayCompleted && styles.disabledChecklistItem]}
                  onPress={() => toggleHabit('avoidCaffeine')}
                  disabled={isDayCompleted}
                >
                  <View style={[styles.checkbox, habits.avoidCaffeine && styles.checkboxChecked]}>
                    {habits.avoidCaffeine && <View style={styles.checkboxFill} />}
                  </View>
                  <ThemedText style={[styles.habitText, isDayCompleted && styles.disabledText]}>
                    Avoided caffeine, nicotine, alcohol ({formatDuration(avoidCaffeineHours, 'hours')} before bed)
                  </ThemedText>
                </TouchableOpacity>
              )}

              {avoidLateEatingReminder && avoidLateEatingHours > 0 && (
                <TouchableOpacity
                  style={[styles.checklistItem, isDayCompleted && styles.disabledChecklistItem]}
                  onPress={() => toggleHabit('avoidLateEating')}
                  disabled={isDayCompleted}
                >
                  <View style={[styles.checkbox, habits.avoidLateEating && styles.checkboxChecked]}>
                    {habits.avoidLateEating && <View style={styles.checkboxFill} />}
                  </View>
                  <ThemedText style={[styles.habitText, isDayCompleted && styles.disabledText]}>
                    Avoided late night eating ({formatDuration(avoidLateEatingHours, 'hours')} before bed)
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </ThemedView>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.completeButton,
              (isDayCompleted || !Object.values({
                goToBed: habits.goToBed,
                avoidBlueLight: habits.avoidBlueLight,
                roomTemp: habits.roomTemp,
              }).every((habit) => habit)) && styles.completeButtonDisabled,
            ]}
            onPress={handleCompleteDay}
            disabled={isDayCompleted || !Object.values({
              goToBed: habits.goToBed,
              avoidBlueLight: habits.avoidBlueLight,
              roomTemp: habits.roomTemp,
            }).every((habit) => habit)}
          >
            <ThemedText
              style={[
                styles.completeButtonText,
                (isDayCompleted || !Object.values({
                  goToBed: habits.goToBed,
                  avoidBlueLight: habits.avoidBlueLight,
                  roomTemp: habits.roomTemp,
                }).every((habit) => habit)) && styles.completeButtonTextDisabled,
              ]}
            >
              Complete Day
            </ThemedText>
          </TouchableOpacity>

          {isDevMode && (
            <>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetStreak}
              >
                <ThemedText style={styles.resetButtonText}>
                  Reset Streak
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => {
                  console.log('Opening Date Picker, showDatePicker:', showDatePicker);
                  setShowDatePicker(true);
                }}
              >
                <ThemedText style={styles.datePickerButtonText}>
                  Set Last Completion Date: {lastCompletionDate || 'Not Set'}
                </ThemedText>
              </TouchableOpacity>

              {showDatePicker && (
                Platform.OS === 'ios' ? (
                  <Modal
                    transparent={true}
                    animationType="slide"
                    visible={showDatePicker}
                    onRequestClose={() => {
                      console.log('Modal Closed');
                      setShowDatePicker(false);
                    }}
                  >
                    <View style={styles.modalOverlay}>
                      <View style={styles.modalContent}>
                        <DateTimePicker
                          value={tempDate}
                          mode="date"
                          display="spinner"
                          onChange={onChangeDate}
                          textColor={Colors.light.text}
                        />
                        <View style={styles.modalButtonContainer}>
                          <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setShowDatePicker(false)}
                          >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.doneButton}
                            onPress={handleDateConfirm}
                          >
                            <Text style={styles.doneButtonText}>Done</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                ) : (
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                  />
                )
              )}
            </>
          )}
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
  subSectionContainer: {
    marginTop: 16,
    gap: 8,
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
    paddingHorizontal: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  disabledChecklistItem: {
    opacity: 0.5,
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
    width: 16,
    height: 16,
    borderRadius: 2,
    backgroundColor: '#0A7EA4',
  },
  habitText: {
    flex: 1,
    flexShrink: 1,
  },
  disabledText: {
    color: '#666',
  },
  buttonContainer: {
    marginTop: 16,
    gap: 12,
    paddingHorizontal: 16,
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
  datePickerButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  datePickerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    gap: 8,
  },
  cancelButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#FF4D4D',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  doneButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#0A7EA4',
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});