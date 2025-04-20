import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Dimensions, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuperwall } from '@/hooks/useSuperwall';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { SUPERWALL_TRIGGERS } from '@/config/superwall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import commonStyles from './common_styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, darkColors } from '@/components/Badge';

// Replace with the actual path to your image
import SleepIllustration from '../../assets/images/onboarding/step_11_solution.png';

const FinalSolutionScreen = () => {
  const [dailyImpacts, setDailyImpacts] = useState([]);
  const [emotionalImpacts, setEmotionalImpacts] = useState([]);
  const [longTermImpacts, setLongTermImpacts] = useState([]);
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme]?.text || 'white';

  const headlineAnim = useRef(new Animated.Value(0)).current;
  const panSentence1Anim = useRef(new Animated.Value(0)).current;
  const panQuestionAnim = useRef(new Animated.Value(0)).current;
  const panStatement1Anim = useRef(new Animated.Value(0)).current;
  const panStatement2Anim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;

  const { height, width } = Dimensions.get('window');
  const { showPaywall, checkSubscription, isSubscribed } = useSuperwall();
  const { setIsOnboarded } = useOnboarding();
  const router = useRouter();

  const handleGetStarted = async () => {
    try {
      if (__DEV__) {
        setIsOnboarded(true);
      } else {
        await showPaywall(SUPERWALL_TRIGGERS.ONBOARDING);
        setIsOnboarded(true);
      }
    } catch (error) {
      console.error('Failed to show paywall:', error);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      await checkSubscription();
      if (isSubscribed) {
        alert('Purchases restored successfully! You have an active subscription.');
        setIsOnboarded(true); // Let them in if subscribed
      } else {
        alert('No active subscriptions found to restore.');
      }
    } catch (error) {
      alert('Failed to restore purchases. Please try again.');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const dailyData = await AsyncStorage.getItem('step8DailyImpacts');
        const emotionalData = await AsyncStorage.getItem('step9EmotionalImpacts');
        const longTermData = await AsyncStorage.getItem('step10LongTermImpacts');

        if (dailyData) setDailyImpacts(JSON.parse(dailyData) || []);
        if (emotionalData) setEmotionalImpacts(JSON.parse(emotionalData) || []);
        if (longTermData) setLongTermImpacts(JSON.parse(longTermData) || []);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const [randomImpacts, setRandomImpacts] = useState<string[]>([]);

  useEffect(() => {
    const allImpacts = [...dailyImpacts, ...emotionalImpacts, ...longTermImpacts];
    if (allImpacts.length > 0) {
      const shuffled = [...allImpacts].sort(() => 0.5 - Math.random());
      setRandomImpacts(shuffled.slice(0, 5));
    }
  }, [dailyImpacts, emotionalImpacts, longTermImpacts]);

  const panUpTranslateY = (animValue) => animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  useEffect(() => {
    Animated.timing(imageAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(headlineAnim, {
        toValue: 1,
        duration: 1000,
        delay: 100,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(panSentence1Anim, {
          toValue: 1,
          duration: 1000,
          delay: 300,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(panQuestionAnim, {
            toValue: 1,
            duration: 1000,
            delay: 300,
            useNativeDriver: true,
          }).start(() => {
            Animated.timing(panStatement1Anim, {
              toValue: 1,
              duration: 1000,
              delay: 300,
              useNativeDriver: true,
            }).start(() => {
              Animated.timing(panStatement2Anim, {
                toValue: 1,
                duration: 1000,
                delay: 300,
                useNativeDriver: true,
              }).start(() => {
                Animated.timing(buttonAnim, {
                  toValue: 1,
                  duration: 1000,
                  delay: 300,
                  useNativeDriver: true,
                }).start();
              });
            });
          });
        });
      });
    });
  }, [headlineAnim, panSentence1Anim, panQuestionAnim, panStatement1Anim, panStatement2Anim, buttonAnim, imageAnim, randomImpacts]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <ScrollView contentContainerStyle={commonStyles.scrollViewContent}>
        <Animated.Image
          source={SleepIllustration}
          style={[
            styles.image,
            {
              opacity: imageAnim,
              transform: [{ translateY: panUpTranslateY(imageAnim) }],
            },
          ]}
          resizeMode="contain"
        />

        <Animated.Text style={[styles.headline, { transform: [{ translateY: panUpTranslateY(headlineAnim) }], opacity: headlineAnim, color: '#FFE81F' }]}>
          Imagine consistently waking up feeling refreshed, focused, and energized – all by building simple, effective sleep habits.
        </Animated.Text>

        <Animated.Text style={[styles.panSentence, { transform: [{ translateY: panUpTranslateY(panSentence1Anim) }], opacity: panSentence1Anim, color: '#FFE81F', marginBottom: 20 }]}>
          But here's what's stopping you from that goal:
        </Animated.Text>

        <View style={styles.badgesContainer}>
          {randomImpacts.map((impact, index) => (
            <Badge key={index} text={impact} color={darkColors[index % darkColors.length]} />
          ))}
        </View>

        <Animated.Text style={[styles.panUpText, { transform: [{ translateY: panUpTranslateY(panQuestionAnim) }], opacity: panQuestionAnim}]}>
          Don't you think life would be better well-rested?
        </Animated.Text>

        <Animated.Text style={[styles.panUpText, { transform: [{ translateY: panUpTranslateY(panStatement1Anim) }], opacity: panStatement1Anim}]}>
          We've already set up your sleep habits for you.
        </Animated.Text>

        <Animated.Text style={[styles.investText, { transform: [{ translateY: panUpTranslateY(panStatement2Anim) }], opacity: panStatement2Anim }]}>
          Now, it's time to invest in better sleep habits for your goal, you, and your entire life.
        </Animated.Text>

        <Animated.View style={{ opacity: buttonAnim, alignItems: 'center', marginTop: 20, color: '#FFE81F', }}>
          <TouchableOpacity style={[ commonStyles.pillButton, { borderColor: textColor, borderColor: '#FFE81F' }]} onPress={handleGetStarted}>
            <ThemedText style={[commonStyles.pillButtonText,{ color: '#FFE81F' }]}>
              I'm In!
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.restoreButton} onPress={handleRestorePurchases}>
            <ThemedText style={styles.restoreButtonText}>
              Restore Purchases
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200, // Adjust as needed
    height: 150, // Adjust as needed
    opacity: 0,
    transform: [{ translateY: Dimensions.get('window').height }],
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0,
    transform: [{ translateY: Dimensions.get('window').height }],
  },
  panSentence: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0,
    transform: [{ translateY: Dimensions.get('window').height }],
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  panUpText: {
    fontSize: 16,
    color: '#FFE81F',
    textAlign: 'center',
    marginTop: 20,
    opacity: 0,
    transform: [{ translateY: Dimensions.get('window').height }],
  },
  investText: {
    fontSize: 24,
    color: '#FFE81F',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
    opacity: 0,
    transform: [{ translateY: Dimensions.get('window').height }],
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  restoreButton: {
    padding: 10,
    alignItems: 'center',
  },
  restoreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default FinalSolutionScreen;