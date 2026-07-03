import { Logos19 } from "@/components/logos19";

/** Social-proof marquee. Two rows scrolling in opposite directions. */
export function LogoStrip() {
  return (
    <div className="flex flex-col gap-4">
      <Logos19 className="py-0" />
      <Logos19 className="py-3" reverse />
    </div>
  );
}
