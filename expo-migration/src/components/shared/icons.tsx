import { createIcon } from '@ui/icon';
import { Path } from 'react-native-svg';

/**
 * Domain icons the gluestack set does not ship, drawn in the same 24px stroke
 * style so they sit correctly next to the generated ones. Stroke colour comes
 * from the `text-*` class on the icon, so never hardcode `stroke`/`fill` here.
 */

const strokeProps = {
  strokeWidth: '2',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export const MicIcon = createIcon({
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" {...strokeProps} />
      <Path d="M19 10v2a7 7 0 0 1-14 0v-2" {...strokeProps} />
      <Path d="M12 19v3M8 22h8" {...strokeProps} />
    </>
  ),
});

export const PauseIcon = createIcon({
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path d="M9 5v14" strokeWidth="3" strokeLinecap="round" />
      <Path d="M15 5v14" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
});

export const StopIcon = createIcon({
  viewBox: '0 0 24 24',
  path: (
    <Path
      d="M7 6h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"
      strokeWidth="3"
      strokeLinejoin="round"
    />
  ),
});

export const WaveformIcon = createIcon({
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path d="M4 11v2" {...strokeProps} />
      <Path d="M8 7v10" {...strokeProps} />
      <Path d="M12 3v18" {...strokeProps} />
      <Path d="M16 8v8" {...strokeProps} />
      <Path d="M20 11v2" {...strokeProps} />
    </>
  ),
});

export const FingerprintIcon = createIcon({
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path d="M12 10a2 2 0 0 1 2 2v2c0 1-.2 2-.5 2.9" {...strokeProps} />
      <Path d="M9 20a13 13 0 0 0 1.3-4.2" {...strokeProps} />
      <Path d="M5.4 16.5A10 10 0 0 1 5 13v-1" {...strokeProps} />
      <Path d="M12 3a9 9 0 0 1 9 9v2" {...strokeProps} />
      <Path d="M3.6 8.5A9 9 0 0 1 8 4.1" {...strokeProps} />
      <Path d="M17.6 18.5c.3-1.5.4-3 .4-4.5v-2a6 6 0 0 0-9.9-4.6" {...strokeProps} />
    </>
  ),
});

export const KeypadIcon = createIcon({
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path d="M6 4h.01M12 4h.01M18 4h.01" strokeWidth="2.6" strokeLinecap="round" />
      <Path d="M6 10h.01M12 10h.01M18 10h.01" strokeWidth="2.6" strokeLinecap="round" />
      <Path d="M6 16h.01M12 16h.01M18 16h.01" strokeWidth="2.6" strokeLinecap="round" />
      <Path d="M12 21h.01" strokeWidth="2.6" strokeLinecap="round" />
    </>
  ),
});

export const LanguageIcon = createIcon({
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path d="M2 5h9M6.5 3v2c0 4.5-2 8-4.5 9.5" {...strokeProps} />
      <Path d="M3.5 9.5c0 2.5 2.7 5 6 6" {...strokeProps} />
      <Path d="m12 20 4.5-11L21 20M14 16.5h5" {...strokeProps} />
    </>
  ),
});

export const ShuffleIcon = createIcon({
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path d="M16 3h5v5" {...strokeProps} />
      <Path d="M4 20 21 3" {...strokeProps} />
      <Path d="M21 16v5h-5" {...strokeProps} />
      <Path d="M15 15l6 6" {...strokeProps} />
      <Path d="M4 4l5 5" {...strokeProps} />
    </>
  ),
});

export const CloudIcon = createIcon({
  viewBox: '0 0 24 24',
  path: (
    <Path
      d="M17.5 19a4.5 4.5 0 0 0 .3-9 6 6 0 0 0-11.6 1.5A3.75 3.75 0 0 0 6.7 19h10.8Z"
      {...strokeProps}
    />
  ),
});

export const CloudDownloadIcon = createIcon({
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M17.5 16.5a4.5 4.5 0 0 0 .3-8.5 6 6 0 0 0-11.6 1.5A3.75 3.75 0 0 0 6.7 16.5"
        {...strokeProps}
      />
      <Path d="M12 12v8" {...strokeProps} />
      <Path d="m8.5 16.5 3.5 3.5 3.5-3.5" {...strokeProps} />
    </>
  ),
});

export const CloudUploadIcon = createIcon({
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M17.5 18.5a4.5 4.5 0 0 0 .3-8.5 6 6 0 0 0-11.6 1.5A3.75 3.75 0 0 0 6.7 18.5"
        {...strokeProps}
      />
      <Path d="M12 21v-8" {...strokeProps} />
      <Path d="m8.5 16.5 3.5-3.5 3.5 3.5" {...strokeProps} />
    </>
  ),
});
