"use client"
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import WorkspaceHeader from '../_components/WorkspaceHeader'
import PdfViewer from '../_components/PdfViewer'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import TextEditor from '../_components/TextEditor'


const Workspace = () => {
    const { fileId } = useParams()
    const fileInfo = useQuery(api.fileStorage.GetFileRecord, {
        fileId: fileId
    })
    useEffect(() => {
        console.log(fileInfo)
    }, [fileInfo])


    return (
        <div>
            <WorkspaceHeader />

            <div className='grid grid-cols-2 gap-5'>
                <div className=''>
                    {/* Text Editor */}
                    <TextEditor />
                </div>
                <div className=''>
                    {/* Pdf Viewer */}
                    <PdfViewer fileUrl={fileInfo?.fileUrl} />
                </div>
            </div>
        </div>
    )
}

export default Workspace
