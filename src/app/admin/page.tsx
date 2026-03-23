'use client'
import { Card, CardContent, CardAction, CardHeader, CardTitle, CardFooter, CardDescription} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
export default function AdminDashboard(){
    return (
        <div className=' mt-4 md:mt-24 mx-4'>
            <Card className='md:w-3/4 mx-auto '>
                <CardHeader className="">
                    <CardTitle>Admin Dashboard</CardTitle>
                </CardHeader>
                <CardContent className=''>
                   <CardDescription className="border-2">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed suscipit a delectus doloribus porro, eos excepturi, deserunt veritatis est eveniet nulla id recusandae eius consequatur. Consequatur cumque nisi doloremque tempora.
                   </CardDescription>
                </CardContent>
                <CardAction className=' w-full'>
                    <div className=" border-1 border-amber-200 flex items-center justify-center gap-4 p-2">
                        <Button>Button 1</Button>
                        <Button>Button 2</Button>
                        <Button>Button 3</Button>
                    </div>
                    
                </CardAction>
                <CardFooter>
                    <p>Admin Dashboard</p>
                </CardFooter>
            </Card>
            </div>
    )
}