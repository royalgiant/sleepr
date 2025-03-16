import { StyleSheet, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProblemScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/onboarding/solution');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scroll} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Is this You?
            </ThemedText>
          </View>

          <View style={styles.content}>
            <View style={styles.example}>
              <MaterialCommunityIcons name="alert-circle" size={32} color="#F4A896" />
              <ThemedText style={styles.exampleText}>
                "I have trouble falling asleep and wake up feeling tired every day. It makes me grumpy and unfocused."
              </ThemedText>
            </View>
            <View style={styles.example}>
              <MaterialCommunityIcons name="alert-circle" size={32} color="#F4A896" />
              <ThemedText style={styles.exampleText}>
                "I can’t stick to a regular bedtime, and it messes up my whole day."
              </ThemedText>
            </View>
            <View style={styles.example}>
              <MaterialCommunityIcons name="alert-circle" size={32} color="#F4A896" />
              <ThemedText style={styles.exampleText}>
                "When I don’t sleep well, I feel tired, cranky, and can’t focus at school or work."
              </ThemedText>
            </View>
            <View style={styles.example}>
              <MaterialCommunityIcons name="alert-circle" size={32} color="#F4A896" />
              <ThemedText style={styles.exampleText}>
                "I spend too much time on my phone before bed, and it keeps me awake.."
              </ThemedText>
            </View>
            <View style={styles.example}>
              <MaterialCommunityIcons name="alert-circle" size={32} color="#F4A896" />
              <ThemedText style={styles.exampleText}>
                "I’ve tried a lot of sleep apps, but none of them really help me sleep better"
              </ThemedText>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Yes! That's me!
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    gap: 8,
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    paddingTop: 4
  },
  description: {
    fontSize: 16,
    opacity: 0.7,
    lineHeight: 22,
  },
  content: {
    gap: 24,
  },
  example: {
    backgroundColor: '#F4A89610',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  exampleText: {
    flex: 1,
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  points: {
    gap: 12,
  },
  point: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#E11D4810',
    padding: 14,
    borderRadius: 12,
  },
  pointText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: '#8A7FBA',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
  },
}); 