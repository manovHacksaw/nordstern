import { type SVGProps } from "react";
import { Bank, Bolt, Shield, Users } from "./icons";

/** Maps content string keys to icon components (keeps content.ts serializable). */
export const ICONS: Record<string, (p: SVGProps<SVGSVGElement>) => React.ReactElement> = {
  bank: Bank,
  bolt: Bolt,
  shield: Shield,
  users: Users,
};
