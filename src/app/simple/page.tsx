import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { BackComponent } from "@/components/myComponent/backComponent"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Button} from '@/components/ui/button'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
export default function Page() {
  return (
    <div className="md:mt-24  md:mx-24 mx-4  mt-4">
        <div className='mb-4'>
          <Breadcrumb>
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
           <Label htmlFor="post-title" className='mt-4'>Title</Label>
                <Input
                    id="post-title"
                    placeholder="What do you want to ask or share?"
                    className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring" 
                    />
        </div>
      <SimpleEditor />
      <Button className='mb-24'>Post</Button>
    </div>
  )
}
