import {  StyleSheet, View, Button, ScrollView , Text} from 'react-native';

import {
  ExpoSpeechRecognitionModule,
  supportsOnDeviceRecognition,
  useSpeechRecognitionEvent
} from 'expo-speech-recognition';
import { useState, useEffect } from 'react';

export default function HomeScreen() {
  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [currentLine, setCurrentLine] = useState('');
  const [supportedLocales, setSupportedLocales] = useState<string[]>([]);

  useSpeechRecognitionEvent("start", () => {
    console.log("start")
    setRecognizing(true)
  });
  useSpeechRecognitionEvent("end", () => {
    console.log("end")
    setRecognizing(false)
  });
  useSpeechRecognitionEvent("result", (event) => {
    console.log(event.results)
    const transcript = event.results[0];
    if (!transcript) {
      return;
    }
    if (transcript.segments.length) {
      setCurrentLine(transcript.transcript)
    } else {
      setTranscript(ex => ex + ' ' + transcript.transcript);
      setCurrentLine('')
    }
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("error code:", event.error, "error message:", event.message);
  });
  useSpeechRecognitionEvent("speechend", () => {
    console.log('speechend')
  });
  useSpeechRecognitionEvent("speechstart", () => {
    console.log('speechstart')
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
      continuous: true,
      requiresOnDeviceRecognition: false,
      addsPunctuation: true,
      contextualStrings: [],
    });
  };

  const updateSupportedLocales = async () => {
    const supportedLocales = await ExpoSpeechRecognitionModule.getSupportedLocales({});
    console.log('supportedLocales', supportedLocales)
    const service = ExpoSpeechRecognitionModule.getDefaultRecognitionService()
    console.log('service', service)
    setSupportedLocales(supportedLocales.installedLocales);
  };

  useEffect(() => {
    const available = supportsOnDeviceRecognition();
    console.log("OnDevice recognition available:", available);
    updateSupportedLocales();
  }, []);

  return (
    <View>
      {!recognizing ? (
        <Button title="Start" onPress={handleStart} />
      ) : (
        <Button
          title="Stop"
          onPress={() => {
            console.log('button:stop')
            ExpoSpeechRecognitionModule.stop()
          }}
        />
      )}

      <ScrollView>
        <Text>{transcript}</Text>
        <Text>{currentLine}</Text>
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
