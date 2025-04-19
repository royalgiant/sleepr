import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 150,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 12,
  },
  hookText: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 12,
    lineHeight: 28,
  },
  questionText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 16,
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
    // Add your modalOverlay styles here if they are also repeated
  },
});

export default commonStyles;