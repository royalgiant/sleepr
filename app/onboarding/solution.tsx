import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSuperwall } from '@/hooks/useSuperwall';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { SUPERWALL_TRIGGERS } from '@/config/superwall';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SolutionScreen() {
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

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="lightbulb-on" size={48} color="#A2D9C3" />
          <ThemedText type="title" style={styles.title}>
            A Better Way to Sleep
          </ThemedText>
        </View>

        <View style={styles.mainFeature}>
          <ThemedText type="defaultSemiBold" style={styles.mainTitle}>
            Sleep better, feel better, and crush every day!
          </ThemedText>
        </View>

        <View style={styles.benefits}>
          <View style={styles.benefit}>
            <MaterialCommunityIcons name="check-circle" size={24} color="#A2D9C3" />
            <ThemedText style={styles.benefitText}>
              Build 3 simple habits that'll change your sleep for better – forever
            </ThemedText>
          </View>
          <View style={styles.benefit}>
            <MaterialCommunityIcons name="check-circle" size={24} color="#A2D9C3" />
            <ThemedText style={styles.benefitText}>
              Get reminders to stay on track and avoid sleep disruptors.
            </ThemedText>
          </View>
          <View style={styles.benefit}>
            <MaterialCommunityIcons name="check-circle" size={24} color="#A2D9C3" />
            <ThemedText style={styles.benefitText}>
              Reduce risks of heart disease, diabetes, alzheimer’s, dementia and other health issues – ALL SLEEP-RELATED.
            </ThemedText>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Show Me How!
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.restoreButton} onPress={handleRestorePurchases}>
            <ThemedText style={styles.restoreButtonText}>
              Restore Purchases
            </ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
  },
  mainFeature: {
    backgroundColor: '#A2D9C310',
    padding: 24,
    borderRadius: 20,
    gap: 8,
  },
  mainTitle: {
    fontSize: 22,
    textAlign: 'center',
  },
  benefits: {
    gap: 12,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#A2D9C308',
    padding: 16,
    borderRadius: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  button: {
    backgroundColor: '#8A7FBA',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  restoreButton: {
    padding: 10,
    alignItems: 'center',
  },
  restoreButtonText: {
    color: '#8A7FBA',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});