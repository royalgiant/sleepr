import { StyleSheet, View, Image, TouchableOpacity, Platform, Modal } from 'react-native';
 import { useRouter } from 'expo-router';
 import { ThemedText } from '@/components/ThemedText';
 import { ThemedView } from '@/components/ThemedView';
 import { SafeAreaView } from 'react-native-safe-area-context';
 import { StatusBar } from 'expo-status-bar';
 import { Colors } from '@/constants/Colors';
 import { useColorScheme } from 'react-native';
 import SleepImage from '../../assets/images/onboarding/step_2_consistency.png';
 import DateTimePicker from '@react-native-community/datetimepicker';
 import AsyncStorage from '@react-native-async-storage/async-storage';
 import { useState } from 'react';

 export default function Step2ConsistencyScreen() {
   const router = useRouter();
   const colorScheme = useColorScheme();
   const textColor = Colors[colorScheme].text;
   const [bedtime, setBedtime] = useState<Date>(() => {
     const defaultBedtime = new Date();
     defaultBedtime.setHours(22, 0, 0, 0);
     return defaultBedtime;
   });
   const [showTimePicker, setShowTimePicker] = useState(false);

   const handleContinue = async () => {
     try {
       await AsyncStorage.setItem('bedtime', bedtime.toISOString());
       router.push('/onboarding/step2_consistency'); // Navigate to the next onboarding step
     } catch (error) {
       console.error('Error saving bedtime:', error);
       // Optionally show an error message to the user
     }
   };

   const onChangeTime = (event: any, selectedTime?: Date) => {
     if (Platform.OS === 'android') {
       setShowTimePicker(false);
     }
     if (selectedTime) {
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
     <ThemedView style={styles.container}>
       <StatusBar style="auto" />
       <SafeAreaView style={styles.safeArea}>
         <View style={styles.content}>
           <View style={styles.main}>
             <Image source={SleepImage} style={styles.image} resizeMode="cover" />
             <ThemedText style={styles.questionText}>
               Around what time do you typically like to go to bed?
             </ThemedText>
             <TouchableOpacity onPress={() => setShowTimePicker(true)}>
               <ThemedText style={styles.bedtimeText}>
                 {formatTime(bedtime)}
               </ThemedText>
             </TouchableOpacity>
           </View>

           <View style={styles.buttonContainer}>
             <TouchableOpacity style={[styles.pillButton, {
               backgroundColor: Colors[colorScheme].background,
               borderColor: textColor,
             }]} onPress={handleContinue}>
               <ThemedText style={styles.pillButtonText}>Continue</ThemedText>
             </TouchableOpacity>
           </View>

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
                   <View style={[styles.modalContent, { backgroundColor: Colors[colorScheme].background }]}>
                     <DateTimePicker
                       value={bedtime}
                       mode="time"
                       display="spinner"
                       onChange={onChangeTime}
                       textColor={Colors[colorScheme].text}
                     />
                     <TouchableOpacity
                       style={[styles.doneButton, { backgroundColor: '#0A7EA4' }]}
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
   content: {
     flex: 1,
     paddingHorizontal: 24,
     justifyContent: 'space-around',
     paddingVertical: 48,
   },
   main: {
     alignItems: 'center',
   },
   image: {
     width: 300,
     height: 150,
   },
   hookText: {
     fontSize: 20,
     textAlign: 'center',
     marginVertical: 24,
     lineHeight: 28,
   },
   questionText: {
     fontSize: 22,
     textAlign: 'center',
     fontWeight: 'bold',
     marginBottom: 16,
   },
   bedtimeText: {
     fontSize: 28,
     fontWeight: 'bold',
     textAlign: 'center',
     color: '#8A7FBA',
     marginBottom: 32,
     paddingTop: 8,
   },
   buttonContainer: {
     paddingHorizontal: 24,
     paddingVertical: 12,
     gap: 12,
   },
   pillButton: {
     paddingVertical: 14,
     paddingHorizontal: 32,
     borderRadius: 50,
     borderWidth: 1,
     alignItems: 'center',
     justifyContent: 'center',
   },
   pillButtonText: {
     fontSize: 18,
     fontWeight: 'bold',
   },
   modalOverlay: {
     flex: 1,
     justifyContent: 'flex-end',
     backgroundColor: 'rgba(0, 0, 0, 0.5)',
   },
   modalContent: {
     backgroundColor: 'white',
     paddingTop: 16,
     borderTopLeftRadius: 10,
     borderTopRightRadius: 10,
     alignItems: 'center',
   },
   doneButton: {
     padding: 16,
     alignItems: 'center',
     borderRadius: 8,
     margin: 16,
   },
   doneButtonText: {
     color: 'white',
     fontWeight: 'bold',
     fontSize: 18,
   },
 });