import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

interface BadgeProps {
  text: string;
  color?: string;
}

export const darkColors = [
  '#FF4500', // Orange red
  '#D2691E', // Chocolate
  '#A0522D', // Sienna
  '#8B4513', // Saddle brown
  '#CD5C5C', // Indian red
  '#B22222', // Firebrick
  '#800000', // Maroon
  '#E9967A', // Dark salmon
  '#FA8072', // Salmon
  '#F08080', // Light coral
  '#DC143C', // Crimson
  '#FF0000', // Red
  '#C71585', // Medium violet red
  '#DB7093', // Pale violet red
  '#FF69B4', // Hot pink
  '#FF1493', // Deep pink
  '#FF00FF', // Magenta
  '#8B008B', // Dark magenta
  '#800080', // Purple
  '#9400D3', // Dark violet
  '#9932CC', // Dark orchid
  '#BA55D3', // Medium orchid
  '#8A2BE2', // Blue violet
  '#4B0082', // Indigo
  '#6A5ACD', // Slate blue
  '#483D8B', // Dark slate blue
  '#7B68EE', // Medium slate blue
  '#6495ED', // Cornflower blue
  '#0000FF', // Blue
  '#0000CD', // Medium blue
  '#00008B', // Dark blue
  '#1E90FF', // Dodger blue
  '#ADD8E6', // Light blue
  '#87CEFA', // Light sky blue
  '#87CEEB', // Sky blue
  '#00BFFF', // Deep sky blue
  '#B0E0E6', // Powder blue
  '#5F9EA0', // Cadet blue
  '#4682B4', // Steel blue
  '#4169E1', // Royal blue
  '#00CED1', // Dark turquoise
  '#48D1CC', // Medium turquoise
  '#AFEEEE', // Pale turquoise
  '#E0FFFF', // Light cyan
  '#00FFFF', // Cyan
  '#00FFFF', // Aqua
  '#008B8B', // Dark cyan
  '#008080', // Teal
  '#708090', // Slate gray
  '#2F4F4F', // Dark slate gray
  '#000000', // Black
];

export function Badge({ text, color }) {
  const colorScheme = useColorScheme();
  const defaultPrimary = Colors[colorScheme]?.primary || '#FF0000'; // Fallback color
  const backgroundColor = color || defaultPrimary;
  const textColor = 'white';

  const badgeStyles = StyleSheet.create({
    container: {
      backgroundColor: backgroundColor,
      borderRadius: 999, // Makes it pill-shaped
      paddingVertical: 6,
      paddingHorizontal: 12,
      marginRight: 8,
      marginBottom: 8,
    },
    text: {
      color: textColor,
      fontSize: 14,
    },
  });

  return (
    <View style={badgeStyles.container}>
      <Text style={badgeStyles.text}>{text}</Text>
    </View>
  );
};