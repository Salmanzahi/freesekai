// import ComingSoon from "./comingsoon";

import { TabsDemo } from "../components/tab";
import HeroPage from "./home/heropage";
import SecHero from "./home/secHero";


export default function Home() {
  return (
    <div className="text-center text-4xl font-semibold ">
      {/* <TabsDemo /> */}
      <HeroPage />
      <SecHero />
      {/* <SecHero /> */}
    </div>
  );
}
