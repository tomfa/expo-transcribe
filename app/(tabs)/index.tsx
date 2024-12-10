import {  StyleSheet, View, Button, ScrollView , Text} from 'react-native';

import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { useState, useEffect } from 'react';

export default function HomeScreen() {
  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supportedLocales, setSupportedLocales] = useState<string[]>([]);

  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
    setTranscript(event.results[0]?.transcript);
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("error code:", event.error, "error message:", event.message);
  });

  const handleStart = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    }

    // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: "nb-NO",
      interimResults: true,
      maxAlternatives: 1,
      continuous: false,
      requiresOnDeviceRecognition: false,
      addsPunctuation: true,
      contextualStrings: [],
    });
  };

  const updateSupportedLocales = async () => {
    const supportedLocales = await ExpoSpeechRecognitionModule.getSupportedLocales({});
    setSupportedLocales(supportedLocales.installedLocales);
  };

  useEffect(() => {
    // updateSupportedLocales();
  }, []);

  return (
    <View>
      <Text>{JSON.stringify(supportedLocales, null, 2)}</Text>
      {!recognizing ? (
        <Button title="Start" onPress={handleStart} />
      ) : (
        <Button
          title="Stop"
          onPress={() => ExpoSpeechRecognitionModule.stop()}
        />
      )}

      <ScrollView>
        <Text>{transcript}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
