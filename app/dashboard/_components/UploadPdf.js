"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { useAction, useMutation } from 'convex/react'
import { Loader2Icon } from 'lucide-react'
import { api } from '@/convex/_generated/api'
import uuid4 from 'uuid4'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'


const UploadPdf = ({ children }) => {
    const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl)

    const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb)

    const getFileUrl = useMutation(api.fileStorage.getFileUrl)

    const embedDocument = useAction(api.myActions.ingest)
    // console.log("embedDocument", embedDocument)
    const { user } = useUser();
    const [file, setFile] = useState();
    const [loading, setLoading] = useState(false)
    const [fileName, setFileName] = useState()
    const [open, setOpen] = useState(false)
    const OnFileSelect = (event) => {
        setFile(event.target.files[0])
    }

    const onUpload = async () => {
        setLoading(true)
        // Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl();

        // Step 2: POST the file to the URL
        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file?.type },
            body: file,
        });
        const { storageId } = await result.json();
        console.log("storageId", storageId)

        const fileId = uuid4();
        const fileUrl = await getFileUrl({ storageId: storageId })
        // Step 3: Save the newly allocated storage id to the database

        const response = await addFileEntry({
            fileId: fileId,
            storageId: storageId,
            fileName: fileName ?? " Untitled File",
            fileUrl: fileUrl,
            createdBy: user?.primaryEmailAddress?.emailAddress
        })
        console.log(response)

        //Api call to fetch Pdf process data
        const ApiResp = await axios.get('/api/pdf-loader?pdfUrl=' + fileUrl)
        console.log("API REs", ApiResp.data.result)
        const res = await embedDocument({
            splitText: ApiResp.data.result,
            fileId: fileId
        })


        console.log("result for pdf", res)
        setLoading(false)
        setOpen(false)


    }
    return (
        <Dialog open={open}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} className='w-full'>+ Upload Pdf File</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Pdf Files</DialogTitle>
                    <DialogDescription asChild>
                        <div className=''>
                            <h2 className='mt-5'>Select a File to Upload</h2>
                            <div className=' gap-2 p-3 rounded-md border'>

                                <input type='file' accept='application/pdf'
                                    onChange={(event) => OnFileSelect(event)} />
                            </div>
                            <div className='mt-2'>
                                <label>File Name *</label>
                                <Input placeholder='File name'
                                    onChange={(e) => setFileName(e.target.value)} />

                            </div>
                            <DialogFooter className="sm:justify-end mt-2">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button onClick={onUpload} disabled={loading} >
                                    {loading ?
                                        <Loader2Icon className='animate-spin' /> : "Upload"
                                    }
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}

export default UploadPdf
