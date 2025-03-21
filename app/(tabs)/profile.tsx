import { StyleSheet, Platform, View, Modal } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

export default function SettingsScreen() {
  const [bedtime, setBedtime] = useState<Date>(new Date()); // Default bedtime to now
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Load the saved bedtime from AsyncStorage when the component mounts
  useEffect(() => {
    const loadBedtime = async () => {
      try {
        const savedBedtime = await AsyncStorage.getItem('bedtime');
        if (savedBedtime) {
          setBedtime(new Date(savedBedtime));
        } else {
          // Default bedtime if none is set
          const defaultBedtime = new Date();
          defaultBedtime.setHours(22, 0, 0, 0); // Default to 10:00 PM
          setBedtime(defaultBedtime);
        }
      } catch (error) {
        console.error('Error loading bedtime:', error);
      }
    };
    loadBedtime();
  }, []);

  // Save the bedtime to AsyncStorage whenever it changes
  useEffect(() => {
    const saveBedtime = async () => {
      try {
        await AsyncStorage.setItem('bedtime', bedtime.toISOString());
      } catch (error) {
        console.error('Error saving bedtime:', error);
      }
    };
    saveBedtime();
  }, [bedtime]);

  const onChangeTime = (event: any, selectedTime?: Date) => {
    // On iOS, we keep the modal open until the user presses "Done"
    // On Android, we close the picker after selection
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      // Ensure the date part is set to today to avoid timezone issues with the date
      const today = new Date();
      const newBedtime = new Date(today);
      newBedtime.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
      setBedtime(newBedtime);
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Bedtime</ThemedText>
        <TouchableOpacity
          style={styles.timePickerButton}
          onPress={() => setShowTimePicker(true)}
        >
          <ThemedText>{formatTime(bedtime)}</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {showTimePicker && (
        Platform.OS === 'ios' ? (
          <Modal
            transparent={true}
            animationType="slide"
            visible={showTimePicker}
            onRequestClose={() => setShowTimePicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <DateTimePicker
                  value={bedtime}
                  mode="time"
                  display="spinner"
                  onChange={onChangeTime}
                  textColor={Colors.light.text} // Ensure text is visible in dark mode
                />
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => setShowTimePicker(false)}
                >
                  <ThemedText style={styles.doneButtonText}>Done</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={bedtime}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginTop: 16,
    gap: 8,
    paddingHorizontal: 16,
  },
  timePickerButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'white', // Changed to white background
    borderWidth: 1, // Added black border
    borderColor: 'black',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: Colors.light.background, // Use theme background color
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
  },
  doneButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.light.tint,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});