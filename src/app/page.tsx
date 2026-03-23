// import ComingSoon from "./comingsoon";
'use client '
// import { TabsDemo } from "../components/tab";
import HeroPage from "./home/heropage";
import dynamic from "next/dynamic";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { MessageSquareText, BookOpenText } from "lucide-react";
import BlogPage from "./home/blogPage";
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
      <Tabs defaultValue="posts" className="w-full mt-4">
  <TabsList className="flex mx-auto w-96" defaultValue="posts">
    <TabsTrigger value="posts" className="flex items-center gap-2 flex-1">
      <MessageSquareText className="w-4 h-4" />
      Posts
    </TabsTrigger>
    <TabsTrigger value="blogs" className="flex items-center gap-2 flex-1">
      <BookOpenText className="w-4 h-4" />
      Blogs
    </TabsTrigger>
  </TabsList>
  <TabsContent value="posts">
    <CardLoad/>
  </TabsContent>
  <TabsContent value="blogs">
   <BlogPage/>
  </TabsContent>

</Tabs>
      {/* <CardLoad/> */}
      {/* <SecHero /> */}
    </div>
  );
}
