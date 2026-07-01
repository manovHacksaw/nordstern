import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { LogoStrip } from "@/components/sections/logo-strip";
import { Outcomes } from "@/components/sections/outcomes";
import { PrimitivesBento } from "@/components/sections/primitives-bento";
import { BuildPaths } from "@/components/sections/build-paths";
import { Audiences } from "@/components/sections/audiences";
import { Trust } from "@/components/sections/trust";
import { Resources } from "@/components/sections/resources";
import { FinalCTA } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="top">
        <Hero />
        <LogoStrip />
        <Outcomes />
        <PrimitivesBento />
        <BuildPaths />
        <Audiences />
        <Trust />
        <Resources />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
