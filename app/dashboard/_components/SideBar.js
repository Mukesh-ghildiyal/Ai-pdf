import { Button } from '@/components/ui/button'
import { Layout, Shield } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Progress } from "@/components/ui/progress"
import UploadPdf from './UploadPdf'


const SideBar = () => {
    return (
        <div className='shadow-md h-screen p-7'>
            <Image src={'/logo.svg'} alt='logo' width={90} height={100} />
            <div className='mt-10'>
                <UploadPdf>
                    <Button className='w-full'>+Upload PDF</Button>
                </UploadPdf>
                <div className='flex gap-2 items-center p-3 mt-5 hover:bg-slate-100
                rounded-lg cursor-pointer'>
                    <Layout />
                    <h2>Workspace</h2>
                </div>
                <div className='flex gap-2 items-center p-3 mt-1 hover:bg-slate-100
                rounded-lg cursor-pointer'>
                    <Shield />
                    <h2>Upgrade</h2>
                </div>
            </div>
            <div className='absolute bottom-16 w-[80%]'>
                <Progress value={33} />
                <p className='text-sm mt-1'>2 out of 5 Pdf Uploaded</p>
                <p className='text-sm text-gray-400 mt-2'>Upgrade to Upload more Pdf</p>

            </div>
        </div>
    )
}

export default SideBar
