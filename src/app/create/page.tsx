'use client';

import { CreateCard } from './createcard';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
export default function CreatePage() {
    return (
            <div className="flex flex-col items-center justify-center mt-4 md:mt-24 md:w-3/4 md:mx-auto">
               <Breadcrumb className='self-start ml-6'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/create" className='font-semibold underline'>Create</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <CreateCard />
        </div>
    )
}
