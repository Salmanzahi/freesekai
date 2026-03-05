'use client';

import { CreateCard } from './cardComponent';
import { RoomBreadcrumb } from '../roomBreadcrumb';
import { useParams } from 'next/navigation';
import { useRoom } from "@/app/room/[roomId]/roomContext"


export default function CreatePage() {
    const params = useParams();
    const roomId = params.roomId as string;
    const {room} = useRoom();
    return (
        <div className="flex flex-col items-center justify-center mt-16 md:w-3/4 md:mx-auto">
            <RoomBreadcrumb
                trail={[
                    { label: "Rooms", href: "/room" },
                    { label: room.roomName, href: `/room/${roomId}` },
                ]}
                currentPage="Create Post"
                className="mt-4 w-full ml-12"
            />
            <CreateCard />
        </div>
    )
}
