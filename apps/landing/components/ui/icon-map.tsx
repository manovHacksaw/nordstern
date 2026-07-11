import { type SVGProps } from "react";
import {
  Bank,
  Bolt,
  Shield,
  Users,
  Chart,
  Grid,
  Code,
  Book,
  Box,
  Activity,
  Rocket,
  Layers,
} from "./icons";

/** Maps content string keys to icon components (keeps content.ts serializable). */
export const ICONS: Record<string, (p: SVGProps<SVGSVGElement>) => React.ReactElement> = {
  bank: Bank,
  bolt: Bolt,
  shield: Shield,
  users: Users,
  chart: Chart,
  grid: Grid,
  code: Code,
  book: Book,
  box: Box,
  activity: Activity,
  rocket: Rocket,
  layers: Layers,
};
