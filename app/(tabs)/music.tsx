import { StyleSheet, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

interface AudioTrack {
  name: string;
  url: string;
  description: string;
  duration?: number;
}

export default function MusicScreen() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([
    {
      name: 'Brown Noise',
      url: 'https://f005.backblazeb2.com/file/sleepr/brown_noise.m4a',
      description: 'A deep, soothing brown noise to help you relax and fall asleep.',
    },
    {
      name: 'Green Noise',
      url: 'https://f005.backblazeb2.com/file/sleepr/green_noise.m4a',
      description: 'A calming green noise, perfect for relaxation and sleep.',
    },
    {
      name: 'Pink Noise',
      url: 'https://f005.backblazeb2.com/file/sleepr/pink_noise.m4a',
      description: 'A balanced pink noise to promote restful sleep.',
    },
    {
      name: 'White Noise',
      url: 'https://f005.backblazeb2.com/file/sleepr/white_noise.m4a',
      description: 'A classic white noise to block out distractions and aid sleep.',
    },
  ]);

  const playSound = async (track: AudioTrack) => {
    try {
      setIsLoading(true);

      if (sound && currentTrack === track.name && !isPlaying) {
        await sound.playAsync();
        setIsPlaying(true);
        setIsLoading(false);
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
      setIsLoading(false);
    } catch (error) {
      console.error(`Error playing ${track.name}:`, error);
      setIsLoading(false);
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.scrollViewContent, { paddingBottom: 80 }]}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Sleep Music</ThemedText>
        </ThemedView>

        {audioTracks.map((track) => (
          <ThemedView key={track.name} style={styles.section}>
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
                  (isLoading && currentTrack === track.name) && styles.disabledButton,
                ]}
                onPress={() => playSound(track)}
                disabled={isLoading && currentTrack === track.name}
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
    backgroundColor: Colors.light.background,
  },
  scrollViewContent: {
    paddingBottom: 20, // This will be overridden by the inline style
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
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
    backgroundColor: Colors.light.tint,
    marginHorizontal: 4,
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
    color: Colors.light.text,
    opacity: 0.8,
  },
  smallerText: {
    fontSize: 16,
    lineHeight: 24,
  },
});