# expo-speech-recognition demo

Utilizes [https://github.com/jamsch/expo-speech-recognition](https://github.com/jamsch/expo-speech-recognition) for speech recognition.

This library in turn utilizes speech recognition services provided by the Platform (Apple/Google). Note that this does not (usually – yet anyway) imply on-device transcription. 

## Pros:
- No need to pay anything. Free, easy, speech recognition! 
- There is a boolean flag to enforce ON-device translation if supported, so future transition is probably easy if that's desirable.
- It (surprisingly) works on Mac + Chrome

## Con
- Consider recording duration limited to < 1 minute.
- Limited things to play with: can't turn on e.g. actor detection.
- Can't use Expo Go with this lib. You'll have to run e.g. `expo run:ios` with a simulator instead.

#### Limitations: long sessions

Is not suitable for a long recording session, because that's not what it's intended to offer.

[Apple's own docs](https://developer.apple.com/documentation/speech/sfspeechrecognizer) says 
> Because speech recognition is a network-based service, limits are enforced so that the service can remain freely available to all apps. Individual devices may be limited in the number of recognitions that can be performed per day, and each app may be throttled globally based on the number of requests it makes per day
> Plan for a one-minute limit on audio duration. Speech recognition places a relatively high burden on battery life and network usage. To minimize this burden, the framework stops speech recognition tasks that last longer than one minute. This limit is similar to the one for keyboard-related dictation.

