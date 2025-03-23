import * as Notifications from 'expo-notifications';
import { StyleSheet, Platform, View, Modal, Alert, Linking, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useRef } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

export default function SettingsScreen() {
  const [bedtime, setBedtime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  // State for Avoid Blue Light Reminder (now only minutes, 0 to 60)
  const [blueLightReminder, setBlueLightReminder] = useState(false);
  const [blueLightMinutes, setBlueLightMinutes] = useState(60);
  const [showBlueLightPicker, setShowBlueLightPicker] = useState(false);

  // State for Room Temperature Reminder (already minutes-only, unchanged)
  const [roomTempReminder, setRoomTempReminder] = useState(false);
  const [roomTempMinutes, setRoomTempMinutes] = useState(15);
  const [showRoomTempPicker, setShowRoomTempPicker] = useState(false);

  // State for Avoid Caffeine, Nicotine, Alcohol Reminder (now hours, 0 to 12)
  const [avoidCaffeineReminder, setAvoidCaffeineReminder] = useState(false);
  const [avoidCaffeineHours, setAvoidCaffeineHours] = useState(6);
  const [showAvoidCaffeinePicker, setShowAvoidCaffeinePicker] = useState(false);

  // State for Avoid Late Night Eating Reminder (now hours, 0 to 12)
  const [avoidLateEatingReminder, setAvoidLateEatingReminder] = useState(false);
  const [avoidLateEatingHours, setAvoidLateEatingHours] = useState(3);
  const [showAvoidLateEatingPicker, setShowAvoidLateEatingPicker] = useState(false)

  // State for Did Wind-Down Routine (boolean toggle)
  const [didWindDownRoutine, setDidWindDownRoutine] = useState(false);

  // Debounce ref for scheduling
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

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
      setShowPermissionPrompt(true);
      return false;
    }
    setShowPermissionPrompt(false);
    return true;
  };

  // Function to schedule all notifications
  const scheduleBedtimeNotifications = async (bedtime: Date) => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const now = new Date();
    const scheduleForTomorrow = (time: Date) => {
      const nowTime = now.getTime();
      const targetTime = new Date(now);
      targetTime.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), 0);
      const timeDifference = nowTime - targetTime.getTime();
      return timeDifference > 60000; // 60 seconds
    };

    // Wind Down Notification (1 hour before bedtime)
    const windDownTime = new Date(bedtime);
    windDownTime.setHours(bedtime.getHours() - 1);
    windDownTime.setMinutes(bedtime.getMinutes());
    windDownTime.setSeconds(0);

    const windDownTrigger = new Date(now);
    windDownTrigger.setHours(windDownTime.getHours());
    windDownTrigger.setMinutes(windDownTime.getMinutes());
    windDownTrigger.setSeconds(0);
    if (scheduleForTomorrow(windDownTime)) {
      windDownTrigger.setDate(windDownTrigger.getDate() + 1);
    }

    console.log('Wind Down Notification scheduled for:', windDownTrigger.toLocaleString());

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time to Wind Down',
        body: 'Start winding down and avoid blue light to prepare for bed.',
      },
      trigger: {
        date: windDownTrigger,
      },
    });

    // Avoid Blue Light Reminder
    if (blueLightReminder) {
      const blueLightTime = new Date(bedtime);
      blueLightTime.setMinutes(bedtime.getMinutes() - blueLightMinutes);
      blueLightTime.setSeconds(0);

      const blueLightTrigger = new Date(now);
      blueLightTrigger.setHours(blueLightTime.getHours());
      blueLightTrigger.setMinutes(blueLightTime.getMinutes());
      blueLightTrigger.setSeconds(0);
      if (scheduleForTomorrow(blueLightTime)) {
        blueLightTrigger.setDate(blueLightTrigger.getDate() + 1);
      }

      console.log('Avoid Blue Light Notification scheduled for:', blueLightTrigger.toLocaleString());

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Avoid Blue Light',
          body: 'Stop using screens to reduce blue light exposure before bed.',
        },
        trigger: {
          date: blueLightTrigger,
        },
      });
    }

    // Room Temperature Reminder
    if (roomTempReminder) {
      const tempTime = new Date(bedtime);
      tempTime.setMinutes(bedtime.getMinutes() - roomTempMinutes);
      tempTime.setSeconds(0);

      const tempTrigger = new Date(now);
      tempTrigger.setHours(tempTime.getHours());
      tempTrigger.setMinutes(tempTime.getMinutes());
      tempTrigger.setSeconds(0);
      if (scheduleForTomorrow(tempTime)) {
        tempTrigger.setDate(tempTrigger.getDate() + 1);
      }

      console.log('Room Temperature Notification scheduled for:', tempTrigger.toLocaleString());

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Prepare Your Room',
          body: 'Set your room temperature to 60-67°F / 15-19°C for optimal sleep.',
        },
        trigger: {
          date: tempTrigger,
        },
      });
    }

    // Avoid Caffeine, Nicotine, Alcohol Reminder
    if (avoidCaffeineReminder && avoidCaffeineHours > 0) {
      const avoidCaffeineTime = new Date(bedtime);
      avoidCaffeineTime.setHours(bedtime.getHours() - avoidCaffeineHours);
      avoidCaffeineTime.setSeconds(0);

      const avoidCaffeineTrigger = new Date(now);
      avoidCaffeineTrigger.setHours(avoidCaffeineTime.getHours());
      avoidCaffeineTrigger.setMinutes(avoidCaffeineTime.getMinutes());
      avoidCaffeineTrigger.setSeconds(0);
      if (scheduleForTomorrow(avoidCaffeineTime)) {
        avoidCaffeineTrigger.setDate(avoidCaffeineTrigger.getDate() + 1);
      }

      console.log('Avoid Caffeine Notification scheduled for:', avoidCaffeineTrigger.toLocaleString());

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Avoid Caffeine, Nicotine, Alcohol',
          body: 'Avoid consuming caffeine, nicotine, or alcohol to improve sleep quality.',
        },
        trigger: {
          date: avoidCaffeineTrigger,
        },
      });
    }

    // Avoid Late Night Eating Reminder
    if (avoidLateEatingReminder && avoidLateEatingHours > 0) {
      const avoidLateEatingTime = new Date(bedtime);
      avoidLateEatingTime.setHours(bedtime.getHours() - avoidLateEatingHours);
      avoidLateEatingTime.setSeconds(0);

      const avoidLateEatingTrigger = new Date(now);
      avoidLateEatingTrigger.setHours(avoidLateEatingTime.getHours());
      avoidLateEatingTrigger.setMinutes(avoidLateEatingTime.getMinutes());
      avoidLateEatingTrigger.setSeconds(0);
      if (scheduleForTomorrow(avoidLateEatingTime)) {
        avoidLateEatingTrigger.setDate(avoidLateEatingTrigger.getDate() + 1);
      }

      console.log('Avoid Late Night Eating Notification scheduled for:', avoidLateEatingTrigger.toLocaleString());

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Avoid Late Night Eating',
          body: 'Stop eating to allow your body to prepare for sleep.',
        },
        trigger: {
          date: avoidLateEatingTrigger,
        },
      });
    }
  };

  // Function to check and fire notifications immediately if the time matches
  const checkAndFireNotifications = () => {
    const now = new Date();
    const nowTime = now.getTime();

    // Wind Down Notification (1 hour before bedtime)
    const windDownTime = new Date(bedtime);
    windDownTime.setHours(bedtime.getHours() - 1);
    windDownTime.setMinutes(bedtime.getMinutes());
    windDownTime.setSeconds(0);

    const windDownTrigger = new Date(now);
    windDownTrigger.setHours(windDownTime.getHours());
    windDownTrigger.setMinutes(windDownTime.getMinutes());
    windDownTrigger.setSeconds(0);
    const windDownTimeMs = windDownTrigger.getTime();
    if (nowTime >= windDownTimeMs && nowTime - windDownTimeMs <= 60000) {
      console.log('Firing Wind Down Notification immediately');
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time to Wind Down',
          body: 'Start winding down and avoid blue light to prepare for bed.',
        },
        trigger: null,
      });
    }

    // Avoid Blue Light Reminder
    if (blueLightReminder) {
      const blueLightTime = new Date(bedtime);
      blueLightTime.setMinutes(bedtime.getMinutes() - blueLightMinutes);
      blueLightTime.setSeconds(0);

      const blueLightTrigger = new Date(now);
      blueLightTrigger.setHours(blueLightTime.getHours());
      blueLightTrigger.setMinutes(blueLightTime.getMinutes());
      blueLightTrigger.setSeconds(0);
      const blueLightTimeMs = blueLightTrigger.getTime();
      if (nowTime >= blueLightTimeMs && nowTime - blueLightTimeMs <= 60000) {
        console.log('Firing Avoid Blue Light Notification immediately');
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Avoid Blue Light',
            body: 'Stop using screens to reduce blue light exposure before bed.',
          },
          trigger: null,
        });
      }
    }

    // Room Temperature Reminder
    if (roomTempReminder) {
      const tempTime = new Date(bedtime);
      tempTime.setMinutes(bedtime.getMinutes() - roomTempMinutes);
      tempTime.setSeconds(0);

      const tempTrigger = new Date(now);
      tempTrigger.setHours(tempTime.getHours());
      tempTrigger.setMinutes(tempTime.getMinutes());
      tempTrigger.setSeconds(0);
      const tempTimeMs = tempTrigger.getTime();
      if (nowTime >= tempTimeMs && nowTime - tempTimeMs <= 60000) {
        console.log('Firing Room Temperature Notification immediately');
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Prepare Your Room',
            body: 'Set your room temperature to 60-67°F / 15-19°C for optimal sleep.',
          },
          trigger: null,
        });
      }
    }

    // Avoid Caffeine, Nicotine, Alcohol Reminder
    if (avoidCaffeineReminder && avoidCaffeineHours > 0) {
      const avoidCaffeineTime = new Date(bedtime);
      avoidCaffeineTime.setHours(bedtime.getHours() - avoidCaffeineHours);
      avoidCaffeineTime.setSeconds(0);

      const avoidCaffeineTrigger = new Date(now);
      avoidCaffeineTrigger.setHours(avoidCaffeineTime.getHours());
      avoidCaffeineTrigger.setMinutes(avoidCaffeineTime.getMinutes());
      avoidCaffeineTrigger.setSeconds(0);
      const avoidCaffeineTimeMs = avoidCaffeineTrigger.getTime();
      if (nowTime >= avoidCaffeineTimeMs && nowTime - avoidCaffeineTimeMs <= 60000) {
        console.log('Firing Avoid Caffeine Notification immediately');
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Avoid Caffeine, Nicotine, Alcohol',
            body: 'Avoid consuming caffeine, nicotine, or alcohol to improve sleep quality.',
          },
          trigger: null,
        });
      }
    }

    // Avoid Late Night Eating Reminder
    if (avoidLateEatingReminder && avoidLateEatingHours > 0) {
      const avoidLateEatingTime = new Date(bedtime);
      avoidLateEatingTime.setHours(bedtime.getHours() - avoidLateEatingHours);
      avoidLateEatingTime.setSeconds(0);

      const avoidLateEatingTrigger = new Date(now);
      avoidLateEatingTrigger.setHours(avoidLateEatingTime.getHours());
      avoidLateEatingTrigger.setMinutes(avoidLateEatingTime.getMinutes());
      avoidLateEatingTrigger.setSeconds(0);
      const avoidLateEatingTimeMs = avoidLateEatingTrigger.getTime();
      if (nowTime >= avoidLateEatingTimeMs && nowTime - avoidLateEatingTimeMs <= 60000) {
        console.log('Firing Avoid Late Night Eating Notification immediately');
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Avoid Late Night Eating',
            body: 'Stop eating to allow your body to prepare for sleep.',
          },
          trigger: null,
        });
      }
    }
  };

  // Load saved settings from AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load bedtime
        const savedBedtime = await AsyncStorage.getItem('bedtime');
        if (savedBedtime !== null) {
          const bedtimeDate = new Date(savedBedtime);
          setBedtime(bedtimeDate);
        } else {
          const defaultBedtime = new Date();
          defaultBedtime.setHours(22, 0, 0, 0);
          setBedtime(defaultBedtime);
        }

        // Load Blue Light Reminder settings
        const savedBlueLightReminder = await AsyncStorage.getItem('blueLightReminder');
        if (savedBlueLightReminder !== null) {
          setBlueLightReminder(JSON.parse(savedBlueLightReminder));
        }
        const savedBlueLightMinutes = await AsyncStorage.getItem('blueLightMinutes');
        if (savedBlueLightMinutes !== null) {
          setBlueLightMinutes(parseInt(savedBlueLightMinutes));
        }

        // Load Room Temperature Reminder settings
        const savedRoomTempReminder = await AsyncStorage.getItem('roomTempReminder');
        if (savedRoomTempReminder !== null) {
          setRoomTempReminder(JSON.parse(savedRoomTempReminder));
        }
        const savedRoomTempMinutes = await AsyncStorage.getItem('roomTempMinutes');
        if (savedRoomTempMinutes !== null) {
          setRoomTempMinutes(parseInt(savedRoomTempMinutes));
        }

        // Load Avoid Caffeine Reminder settings
        const savedAvoidCaffeineReminder = await AsyncStorage.getItem('avoidCaffeineReminder');
        if (savedAvoidCaffeineReminder !== null) {
          setAvoidCaffeineReminder(JSON.parse(savedAvoidCaffeineReminder));
        }
        const savedAvoidCaffeineHours = await AsyncStorage.getItem('avoidCaffeineHours');
        if (savedAvoidCaffeineHours !== null) {
          setAvoidCaffeineHours(parseInt(savedAvoidCaffeineHours));
        }

        // Load Avoid Late Night Eating Reminder settings
        const savedAvoidLateEatingReminder = await AsyncStorage.getItem('avoidLateEatingReminder');
        if (savedAvoidLateEatingReminder !== null) {
          setAvoidLateEatingReminder(JSON.parse(savedAvoidLateEatingReminder));
        }
        const savedAvoidLateEatingHours = await AsyncStorage.getItem('avoidLateEatingHours');
        if (savedAvoidLateEatingHours !== null) {
          setAvoidLateEatingHours(parseInt(savedAvoidLateEatingHours));
        }

        // Load Did Wind-Down Routine setting
        const savedDidWindDownRoutine = await AsyncStorage.getItem('didWindDownRoutine');
        if (savedDidWindDownRoutine !== null) {
          setDidWindDownRoutine(JSON.parse(savedDidWindDownRoutine));
        }

        // Log loaded values for debugging
        console.log('Loaded settings:', {
          bedtime: savedBedtime,
          blueLightReminder: savedBlueLightReminder,
          blueLightMinutes: savedBlueLightMinutes,
          roomTempReminder: savedRoomTempReminder,
          roomTempMinutes: savedRoomTempMinutes,
          avoidCaffeineReminder: savedAvoidCaffeineReminder,
          avoidCaffeineHours: savedAvoidCaffeineHours,
          avoidLateEatingReminder: savedAvoidLateEatingReminder,
          avoidLateEatingHours: savedAvoidLateEatingHours,
          didWindDownRoutine: savedDidWindDownRoutine,
        });

        // Schedule notifications after loading settings
        const hasPermission = await requestNotificationPermissions();
        if (hasPermission) {
          await scheduleBedtimeNotifications(bedtime);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  // Save settings to AsyncStorage
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem('bedtime', bedtime.toISOString());
        await AsyncStorage.setItem('blueLightReminder', JSON.stringify(blueLightReminder));
        await AsyncStorage.setItem('blueLightMinutes', blueLightMinutes.toString());
        await AsyncStorage.setItem('roomTempReminder', JSON.stringify(roomTempReminder));
        await AsyncStorage.setItem('roomTempMinutes', roomTempMinutes.toString());
        await AsyncStorage.setItem('avoidCaffeineReminder', JSON.stringify(avoidCaffeineReminder));
        await AsyncStorage.setItem('avoidCaffeineHours', avoidCaffeineHours.toString());
        await AsyncStorage.setItem('avoidLateEatingReminder', JSON.stringify(avoidLateEatingReminder));
        await AsyncStorage.setItem('avoidLateEatingHours', avoidLateEatingHours.toString());
        await AsyncStorage.setItem('didWindDownRoutine', JSON.stringify(didWindDownRoutine));

        // Log saved values for debugging
        console.log('Saved settings:', {
          bedtime: bedtime.toISOString(),
          blueLightReminder,
          blueLightMinutes,
          roomTempReminder,
          roomTempMinutes,
          avoidCaffeineReminder,
          avoidCaffeineHours,
          avoidLateEatingReminder,
          avoidLateEatingHours,
          didWindDownRoutine,
        });
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    };
    saveSettings();
  }, [
    bedtime,
    blueLightReminder,
    blueLightMinutes,
    roomTempReminder,
    roomTempMinutes,
    avoidCaffeineReminder,
    avoidCaffeineHours,
    avoidLateEatingReminder,
    avoidLateEatingHours,
    didWindDownRoutine,
  ]);

  // Consolidated useEffect for rescheduling notifications with debounce
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        const hasPermission = await requestNotificationPermissions();
        if (hasPermission) {
          await scheduleBedtimeNotifications(bedtime);
        }
      } catch (error) {
        console.error('Error rescheduling notifications:', error);
      }
    }, 1000);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [
    bedtime,
    blueLightReminder,
    blueLightMinutes,
    roomTempReminder,
    roomTempMinutes,
    avoidCaffeineReminder,
    avoidCaffeineHours,
    avoidLateEatingReminder,
    avoidLateEatingHours,
  ]);

  // UseEffect to check and fire notifications every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkAndFireNotifications();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [
    bedtime,
    blueLightReminder,
    blueLightMinutes,
    roomTempReminder,
    roomTempMinutes,
    avoidCaffeineReminder,
    avoidCaffeineHours,
    avoidLateEatingReminder,
    avoidLateEatingHours,
  ]);

  const onChangeTime = async (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      const today = new Date();
      const newBedtime = new Date(today);
      newBedtime.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
      setBedtime(newBedtime);

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

  const formatDuration = (value: number, unit: 'hours' | 'minutes') => {
    if (unit === 'hours') {
      return value === 0 ? '0 hrs (off)' : `${value} hr${value !== 1 ? 's' : ''}`;
    } else {
      return `${value} min${value !== 1 ? 's' : ''}`;
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Sleep Settings</ThemedText>
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Mandatory Sleep Habits</ThemedText>
      </ThemedView>

      {/* Bedtime Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.smallerText}>Bedtime</ThemedText>
        <TouchableOpacity
          style={styles.timePickerButton}
          onPress={() => setShowTimePicker(true)}
        >
          <ThemedText>{formatTime(bedtime)}</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Avoid Blue Light Reminder Section */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.toggleContainer}>
          <View style={styles.labelContainer}>
            <ThemedText type="subtitle" style={styles.smallerText}>
              Avoid Blue Light Reminder
            </ThemedText>
          </View>
          <Switch
            value={blueLightReminder}
            onValueChange={(value) => setBlueLightReminder(value)}
          />
        </ThemedView>
        {blueLightReminder && (
          <TouchableOpacity
            style={styles.timePickerButton}
            onPress={() => setShowBlueLightPicker(true)}
          >
            <ThemedText>{formatDuration(blueLightMinutes, 'minutes')}</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      {/* Room Temperature Reminder Section */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.toggleContainer}>
          <View style={styles.labelContainer}>
            <ThemedText type="subtitle" style={styles.smallerText}>
              Room Temperature Reminder
            </ThemedText>
          </View>
          <Switch
            value={roomTempReminder}
            onValueChange={(value) => setRoomTempReminder(value)}
          />
        </ThemedView>
        {roomTempReminder && (
          <TouchableOpacity
            style={styles.timePickerButton}
            onPress={() => setShowRoomTempPicker(true)}
          >
            <ThemedText>{formatDuration(roomTempMinutes, 'minutes')}</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">More Sleep Habits & Reminders</ThemedText>
      </ThemedView>

      {/* Did Wind-Down Routine Section */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.toggleContainer}>
          <View style={styles.labelContainer}>
            <ThemedText type="subtitle" style={styles.smallerText}>
              Did Wind-Down Routine (e.g., yoga, meditation, etc.)
            </ThemedText>
          </View>
          <Switch
            value={didWindDownRoutine}
            onValueChange={(value) => setDidWindDownRoutine(value)}
          />
        </ThemedView>
      </ThemedView>

      {/* Avoid Caffeine, Nicotine, Alcohol Reminder Section */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.toggleContainer}>
          <View style={styles.labelContainer}>
            <ThemedText type="subtitle" style={styles.smallerText}>
              Avoid Caffeine, Nicotine, Alcohol
            </ThemedText>
          </View>
          <Switch
            value={avoidCaffeineReminder}
            onValueChange={(value) => setAvoidCaffeineReminder(value)}
          />
        </ThemedView>
        {avoidCaffeineReminder && (
          <TouchableOpacity
            style={styles.timePickerButton}
            onPress={() => setShowAvoidCaffeinePicker(true)}
          >
            <ThemedText>{formatDuration(avoidCaffeineHours, 'hours')}</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      {/* Avoid Late Night Eating Reminder Section */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.toggleContainer}>
          <View style={styles.labelContainer}>
            <ThemedText type="subtitle" style={styles.smallerText}>
              Avoid Late Night Eating
            </ThemedText>
          </View>
          <Switch
            value={avoidLateEatingReminder}
            onValueChange={(value) => setAvoidLateEatingReminder(value)}
          />
        </ThemedView>
        {avoidLateEatingReminder && (
          <TouchableOpacity
            style={styles.timePickerButton}
            onPress={() => setShowAvoidLateEatingPicker(true)}
          >
            <ThemedText>{formatDuration(avoidLateEatingHours, 'hours')}</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      {/* Permission Prompt */}
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
                Alert.alert(
                  'Enable Notifications',
                  'You can enable notifications in your device settings.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Open Settings',
                      onPress: () => Linking.openSettings(),
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

      {/* Bedtime Picker Modal */}
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

      {/* Blue Light Reminder Picker Modal (now minutes only, 0 to 60) */}
      {showBlueLightPicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showBlueLightPicker}
          onRequestClose={() => setShowBlueLightPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ThemedText type="subtitle" style={styles.smallerText}>Set Blue Light Reminder Time</ThemedText>
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.widerPicker}
                  selectedValue={blueLightMinutes}
                  onValueChange={(itemValue) => setBlueLightMinutes(itemValue)}
                >
                  {[...Array(61).keys()].map((minute) => (
                    <Picker.Item key={minute} label={`${minute} minutes`} value={minute} />
                  ))}
                </Picker>
              </View>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowBlueLightPicker(false)}
              >
                <ThemedText style={styles.doneButtonText}>Done</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Room Temperature Reminder Picker Modal (unchanged) */}
      {showRoomTempPicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showRoomTempPicker}
          onRequestClose={() => setShowRoomTempPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ThemedText type="subtitle" style={styles.smallerText}>Set Room Temperature Reminder Time</ThemedText>
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.widerPicker}
                  selectedValue={roomTempMinutes}
                  onValueChange={(itemValue) => setRoomTempMinutes(itemValue)}
                >
                  {[...Array(61).keys()].map((minute) => (
                    <Picker.Item key={minute} label={`${minute} minutes`} value={minute} />
                  ))}
                </Picker>
              </View>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowRoomTempPicker(false)}
              >
                <ThemedText style={styles.doneButtonText}>Done</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Avoid Caffeine Reminder Picker Modal (now hours, 0 to 12) */}
      {showAvoidCaffeinePicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showAvoidCaffeinePicker}
          onRequestClose={() => setShowAvoidCaffeinePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ThemedText type="subtitle">Set Avoid Caffeine Reminder Time</ThemedText>
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.widerPicker}
                  selectedValue={avoidCaffeineHours}
                  onValueChange={(itemValue) => setAvoidCaffeineHours(itemValue)}
                >
                  {[...Array(13).keys()].map((hour) => (
                    <Picker.Item
                      key={hour}
                      label={hour === 0 ? '0 hrs (off)' : `${hour} hr${hour !== 1 ? 's' : ''}`}
                      value={hour}
                    />
                  ))}
                </Picker>
              </View>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowAvoidCaffeinePicker(false)}
              >
                <ThemedText style={styles.doneButtonText}>Done</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Avoid Late Night Eating Reminder Picker Modal (now hours, 0 to 12) */}
      {showAvoidLateEatingPicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showAvoidLateEatingPicker}
          onRequestClose={() => setShowAvoidLateEatingPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ThemedText type="subtitle">Set Avoid Late Night Eating Reminder Time</ThemedText>
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.widerPicker}
                  selectedValue={avoidLateEatingHours}
                  onValueChange={(itemValue) => setAvoidLateEatingHours(itemValue)}
                >
                  {[...Array(13).keys()].map((hour) => (
                    <Picker.Item
                      key={hour}
                      label={hour === 0 ? '0 hrs (off)' : `${hour} hr${hour !== 1 ? 's' : ''}`}
                      value={hour}
                    />
                  ))}
                </Picker>
              </View>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowAvoidLateEatingPicker(false)}
              >
                <ThemedText style={styles.doneButtonText}>Done</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    marginVertical: 8,
    gap: 8,
    paddingHorizontal: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    flex: 0.8,
  },
  timePickerButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
    width: '100%',
  },
  picker: {
    width: 120,
    height: 150,
  },
  widerPicker: {
    width: 200,
    height: 150,
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
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#856404',
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
  smallerText: {
    fontSize: 16,
    lineHeight: 24,
  },
});