import { StyleSheet, View, Platform, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

interface AudioTrack {
  name: string;
  url: string;
  description: string;
  duration?: number;
}

export default function MusicScreen() {
  const colorScheme = useColorScheme();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([
    {
      name: 'Brown Noise',
      url: 'https://music.sleeprapp.com/brown_noise.m4a',
      description: 'A deep, soothing brown noise to help you relax and fall asleep by masking distracting sounds.',
    },
    {
      name: 'Green Noise',
      url: 'https://music.sleeprapp.com/green_noise.m4a',
      description: 'A calming green noise with a more natural sound profile, ideal for relaxation and sleep.',
    },
    {
      name: 'Pink Noise',
      url: 'https://music.sleeprapp.com/pink_noise.m4a',
      description: 'A balanced pink noise with more low-frequency energy, often preferred for promoting restful sleep.',
    },
    {
      name: 'White Noise',
      url: 'https://music.sleeprapp.com/white_noise.m4a',
      description: 'A classic white noise that evenly distributes sound frequencies to effectively block out distractions and aid sleep.',
    },
    {
      name: 'Delta Waves',
      url: 'https://music.sleeprapp.com/delta_waves_10h.m4a',
      description: 'Extended 10-hour track of delta brainwaves, associated with deep sleep and relaxation. Ideal for prolonged sleep sessions.',
    },
    {
      name: 'Binaural Beats',
      url: 'https://music.sleeprapp.com/binaural_beats_3h.m4a',
      description: '3-hour session of binaural beats designed to induce specific brainwave frequencies for enhanced focus, relaxation, or sleep (depending on the target frequency)',
    },
    {
      name: '528 Hz Healing Frequency',
      url: 'https://music.sleeprapp.com/528hz_anti_anxiety_emotional_healing_music.m4a',
      description: 'Music tuned to 528 Hz, often associated with emotional healing, reduced anxiety, and promoting a sense of well-being. Aids in relaxation and sleep.',
    },
    {
      name: '432 Hz Deep Relaxation Music',
      url: 'https://music.sleeprapp.com/432_hz_deep_healing_relaxation_meditation_music.m4a',
      description: 'Deeply relaxing and meditative music tuned to 432 Hz, believed by some to resonate with a more natural and harmonious frequency, promoting tranquility and aiding sleep.',
    },
  ]);

  const playSound = async (track: AudioTrack) => {
    try {
      setIsLoadingMusic(true);

      if (sound && currentTrack === track.name && !isPlaying) {
        await sound.playAsync();
        setIsPlaying(true);
        setIsLoadingMusic(false);
        return;
      }

      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { shouldPlay: true }
      );

      setSound(newSound);
      setCurrentTrack(track.name);
      setIsPlaying(true);
      setIsLoadingMusic(false);
    } catch (error) {
      console.error(`Error playing ${track.name}:`, error);
      setIsLoadingMusic(false);
      setIsPlaying(false);
      setCurrentTrack(null);
    }
  };

  const pauseSound = async () => {
    try {
      if (sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error pausing sound:', error);
    }
  };

  const resetSound = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.setPositionAsync(0);
        setIsPlaying(false);
        setCurrentTrack(null);
      }
    } catch (error) {
      console.error('Error resetting sound:', error);
    }
  };

  const fetchTrackDurations = async () => {
    const updatedTracks = await Promise.all(
      audioTracks.map(async (track) => {
        try {
          const { sound: tempSound } = await Audio.Sound.createAsync(
            { uri: track.url },
            { shouldPlay: false }
          );
          const status = await tempSound.getStatusAsync();
          await tempSound.unloadAsync();
          if (status.isLoaded && status.durationMillis) {
            return { ...track, duration: status.durationMillis };
          }
          return track;
        } catch (error) {
          console.error(`Error fetching duration for ${track.name}:`, error);
          return track;
        }
      })
    );
    setAudioTracks(updatedTracks);
  };

  useEffect(() => {
    fetchTrackDurations();
  }, []);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.error('Error configuring audio mode:', error);
      }
    };
    configureAudio();
  }, []);

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    let timeString = '';
    if (hours > 0) {
      timeString += `${hours}h `;
    }
    if (minutes > 0 || hours > 0) {
      timeString += `${minutes}m `;
    }
    if (seconds > 0 || (hours === 0 && minutes === 0)) {
      timeString += `${seconds}s`;
    }
  
    return timeString.trim();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors[colorScheme].background, paddingTop: Platform.OS === 'android' ? 40 : 0 }]}>
      <ScrollView contentContainerStyle={[styles.scrollViewContent, { backgroundColor: Colors[colorScheme].background }]}>
        <ThemedView style={[styles.titleContainer, { backgroundColor: Colors[colorScheme].background }]}>
          <ThemedText type="title">Sleep Music</ThemedText>
        </ThemedView>

        {audioTracks.map((track) => (
          <ThemedView key={track.name} style={[styles.section, { backgroundColor: Colors[colorScheme].background }]}>
            <ThemedText type="subtitle" style={styles.smallerText}>
              {track.name} {track.duration ? `(${formatTime(track.duration)})` : ''}
            </ThemedText>
            <ThemedText style={styles.descriptionText}>
              {track.description}
            </ThemedText>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.controlButton,
                  (isLoadingMusic && currentTrack === track.name) && styles.disabledButton,
                ]}
                onPress={() => playSound(track)}
                disabled={isLoadingMusic && currentTrack === track.name}
              >
                <ThemedText style={styles.buttonText}>Play</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.controlButton,
                  (!isPlaying || currentTrack !== track.name) && styles.disabledButton,
                ]}
                onPress={pauseSound}
                disabled={!isPlaying || currentTrack !== track.name}
              >
                <ThemedText style={styles.buttonText}>Pause</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.controlButton,
                  (!sound || currentTrack !== track.name) && styles.disabledButton,
                ]}
                onPress={resetSound}
                disabled={!sound || currentTrack !== track.name}
              >
                <ThemedText style={styles.buttonText}>Reset</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
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
    paddingVertical: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  controlButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: Colors.light.tint,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  descriptionText: {
    fontSize: 14,
    opacity: 0.8,
  },
  smallerText: {
    fontSize: 16,
    lineHeight: 24,
  },
});