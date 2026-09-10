import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';
import { useEffect, useRef, useState } from 'react';
import { RECORDING } from '@/config/constants';

export type ClipRecorderStatus =
  | 'idle'
  | 'requesting'
  | 'denied'
  | 'recording'
  | 'captured';

export type CapturedClip = {
  /** Temp uri owned by the recorder; move it into the library to keep it. */
  uri: string;
  durationSec: number;
};

type ClipRecorder = {
  status: ClipRecorderStatus;
  elapsedSec: number;
  /** Countdown shown while recording, floored at 0. */
  secondsLeft: number;
  clip: CapturedClip | null;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  /** Discards the captured clip and returns the recorder to `idle`. */
  reset: () => Promise<void>;
};

/**
 * Captures a single clip, hard-capped at `RECORDING.maxDurationSec`. The cap is
 * enforced from the same ticker that drives the countdown, so what the user
 * sees and what gets written can never drift apart.
 */
export function useClipRecorder(): ClipRecorder {
  const recorder = useAudioRecorder(RecordingPresets.LOW_QUALITY);
  const [status, setStatus] = useState<ClipRecorderStatus>('idle');
  const [elapsedSec, setElapsedSec] = useState(0);
  const [clip, setClip] = useState<CapturedClip | null>(null);

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTicker = () => {
    if (!tickRef.current) return;
    clearInterval(tickRef.current);
    tickRef.current = null;
  };

  const stop = async () => {
    clearTicker();
    if (!recorder.isRecording) return;

    const durationSec = Math.min(recorder.currentTime, RECORDING.maxDurationSec);
    await recorder.stop();

    const uri = recorder.uri;
    if (!uri) {
      setStatus('idle');
      return;
    }
    setClip({ uri, durationSec: Math.max(durationSec, 0.1) });
    setStatus('captured');
  };

  const start = async () => {
    setStatus('requesting');
    const permission = await AudioModule.requestRecordingPermissionsAsync();
    if (!permission.granted) {
      setStatus('denied');
      return;
    }

    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();

    setClip(null);
    setElapsedSec(0);
    setStatus('recording');

    tickRef.current = setInterval(() => {
      const next = recorder.currentTime;
      setElapsedSec(next);
      if (next >= RECORDING.maxDurationSec) void stop();
    }, RECORDING.statusIntervalMs);
  };

  const reset = async () => {
    clearTicker();
    if (recorder.isRecording) await recorder.stop();
    setClip(null);
    setElapsedSec(0);
    setStatus('idle');
  };

  useEffect(
    () => () => {
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = null;
    },
    [],
  );

  return {
    status,
    elapsedSec,
    secondsLeft: Math.max(0, Math.ceil(RECORDING.maxDurationSec - elapsedSec)),
    clip,
    start,
    stop,
    reset,
  };
}
