/**
 * Stroke-based icon set, recreated from the design's inline SVGs (24x24 viewBox,
 * 1.75–2px stroke, round caps/joins). Path data copied verbatim from the handoff.
 */
import Svg, { Path } from 'react-native-svg';

export const ICONS = {
  // tab bar
  walletTab: ['M3 8.5A2.5 2.5 0 0 1 5.5 6H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 12.5h.01', 'M3 10h18'],
  anchorsTab: ['M12 7.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM12 7.5V21M7 11H4.5m15 0H17M5 12a7 7 0 0 0 14 0'],
  activityTab: ['M4 12h3l2.5 6 4-14 2.5 8h4'],
  settingsTab: ['M4 8h9M17 8h3M4 16h3M11 16h9', 'M15 6v4M9 14v4'],

  // quick actions / transaction types
  deposit: ['M12 3v11m0 0 4-4m-4 4-4-4M5 20h14'],
  withdraw: ['M12 21V7m0 0 4 4m-4-4-4 4M5 4h14'],
  receive: ['M17 7 7 17M16 17H7V8'],
  send: ['M7 17 17 7M8 7h9v9'],
  swap: ['M16 4l4 4-4 4M20 8H8M8 20l-4-4 4-4M4 16h12'],
  crossborder: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18M12 3c2.4 2.7 2.4 15.3 0 18M12 3c-2.4 2.7-2.4 15.3 0 18'],

  // chrome
  scan: ['M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2'],
  back: ['M15 18l-6-6 6-6'],
  chevron: ['M9 18l6-6-6-6'],
  chevronDown: ['M6 9l6 6 6-6'],
  close: ['M18 6 6 18M6 6l12 12'],
  plus: ['M12 5v14M5 12h14'],
  copy: ['M9 9h10v10H9zM5 15V5a2 2 0 0 1 2-2h8'],
  check: ['M5 13l4 4L19 7'],
  checkSmall: ['M9 12l2 2 4-4'],
  info: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01'],
  shield: ['M12 2l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V6z', 'M9 12l2 2 4-4'],
  clock: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 7v5l3 2'],
  camera: ['M4 7h3l2-3h6l2 3h3v12H4z', 'M12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z'],
  cameraDoc: ['M4 7h3l2-3h6l2 3h3v12H4z', 'M12 13a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z'],
  person: ['M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M5.5 20a7 7 0 0 1 13 0'],
  arrowDown: ['M12 5v14M5 12l7 7 7-7'],

  // funding method icons (single combined subpaths, from the design's MICON)
  upi: ['M4 7h16v10H4zM4 11h16M8 15h3'],
  gpay: ['M4 7h16v10H4zM4 11h16M8 15h3'],
  bank: ['M3 21h18M4 10h16M6 10V7l6-4 6 4v3'],
  card: ['M3 7h18v10H3zM3 11h18M7 15h3'],
  cash: ['M3 7h18v10H3zM12 12h.01M6 12h.01M18 12h.01'],
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  size = 22,
  color = '#fff',
  strokeWidth = 1.9,
}: {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const paths = ICONS[name];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {paths.map((d, i) => (
        <Path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </Svg>
  );
}
