import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export  function RoomList() {
    return (
        <div>
           <Card>
            <CardHeader>
                <CardTitle>Room List</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>Room List</CardDescription>
            </CardContent>
            <CardFooter>
                <CardAction>
                    <CardAction>Join Room</CardAction>
                </CardAction>
            </CardFooter>
           </Card>
        </div>
    );
}