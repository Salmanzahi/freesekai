// import ComingSoon from "./comingsoon";

// import { TabsDemo } from "../components/tab";
import HeroPage from "./home/heropage";
import dynamic from "next/dynamic";
const CardLoad = dynamic(() => import("./home/cardload"), {
  loading: () => <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
  </div>,
  // ssr: false
});
export default function Home() {
  return (
    <div className="text-center text-4xl font-semibold ">
      {/* <TabsDemo /> */}
      <HeroPage />
 <CardLoad/>
      {/* <SecHero /> */}
    </div>
  );
}
