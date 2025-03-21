import * as Notifications from 'expo-notifications';
import { StyleSheet, Platform, View, Modal, Alert, Linking } from 'react-native';
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
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  
  // Function to request notification permissions
  const requestNotificationPermissions = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('bedtime-reminders', {
        name: 'Bedtime Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      setShowPermissionPrompt(true); // Show prompt if permission is denied
      return false;
    }
    setShowPermissionPrompt(false); // Hide prompt if permission is granted
    return true;
  };

  // Function to schedule bedtime notifications
  const scheduleBedtimeNotifications = async (bedtime: Date) => {
    // Cancel any existing scheduled notifications to avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Calculate times for notifications
    const windDownTime = new Date(bedtime);
    windDownTime.setHours(bedtime.getHours() - 1); // 1 hour before bedtime
    windDownTime.setMinutes(bedtime.getMinutes());

    const tempTime = new Date(bedtime);
    tempTime.setMinutes(bedtime.getMinutes() - 30); // 30 minutes before bedtime

    // Get the current time to determine if we need to schedule for today or tomorrow
    const now = new Date();
    const scheduleForTomorrow = (time: Date) =>
      now.getHours() > time.getHours() ||
      (now.getHours() === time.getHours() && now.getMinutes() > time.getMinutes());

    // Schedule Wind Down Notification (1 hour before bedtime)
    const windDownTrigger = new Date(now);
    windDownTrigger.setHours(windDownTime.getHours());
    windDownTrigger.setMinutes(windDownTime.getMinutes());
    windDownTrigger.setSeconds(0);
    if (scheduleForTomorrow(windDownTime)) {
      windDownTrigger.setDate(windDownTrigger.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time to Wind Down',
        body: 'Start winding down and avoid blue light to prepare for bed.',
      },
      trigger: windDownTrigger,
    });

    // Schedule Room Temperature Notification (30 minutes before bedtime)
    const tempTrigger = new Date(now);
    tempTrigger.setHours(tempTime.getHours());
    tempTrigger.setMinutes(tempTime.getMinutes());
    tempTrigger.setSeconds(0);
    if (scheduleForTomorrow(tempTime)) {
      tempTrigger.setDate(tempTrigger.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Prepare Your Room',
        body: 'Set your room temperature to 60-67°F / 15-19°C for optimal sleep.',
      },
      trigger: tempTrigger,
    });
  };

  // Load the saved bedtime from AsyncStorage when the component mounts
  useEffect(() => {
    const loadBedtime = async () => {
      try {
        const savedBedtime = await AsyncStorage.getItem('bedtime');
        if (savedBedtime) {
          const bedtimeDate = new Date(savedBedtime);
          setBedtime(bedtimeDate);
          const hasPermission = await requestNotificationPermissions();
          if (hasPermission) {
            await scheduleBedtimeNotifications(bedtimeDate);
          }
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

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(async () => {
      // Reschedule notifications for the next day
      const savedBedtime = await AsyncStorage.getItem('bedtime');
      if (savedBedtime) {
        const hasPermission = await requestNotificationPermissions();
        if (hasPermission) {
          await scheduleBedtimeNotifications(new Date(savedBedtime));
        }
      }
    });
    return () => subscription.remove();
  }, []);

  const onChangeTime = async (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      // Ensure the date part is set to today to avoid timezone issues with the date
      const today = new Date();
      const newBedtime = new Date(today);
      newBedtime.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
      setBedtime(newBedtime);
  
      // Schedule notifications after updating bedtime
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        await scheduleBedtimeNotifications(newBedtime);
      }
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
  
      {showPermissionPrompt && (
        <ThemedView style={styles.permissionPrompt}>
          <ThemedText style={styles.permissionText}>
            Notifications are required for bedtime reminders. Please enable them to receive alerts.
          </ThemedText>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={async () => {
              const hasPermission = await requestNotificationPermissions();
              if (hasPermission) {
                await scheduleBedtimeNotifications(bedtime);
              } else {
                // If denied again, offer to open settings
                Alert.alert(
                  'Enable Notifications',
                  'You can enable notifications in your device settings.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Open Settings',
                      onPress: () => Linking.openSettings(), // Opens device settings
                    },
                  ]
                );
              }
            }}
          >
            <ThemedText style={styles.permissionButtonText}>Enable Notifications</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
  
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
                  textColor={Colors.light.text}
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
  permissionPrompt: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FFF3CD', // Light yellow background for alert
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#856404', // Dark yellow text for contrast
  },
  permissionButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.light.tint,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});