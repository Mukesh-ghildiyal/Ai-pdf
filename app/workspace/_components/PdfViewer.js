import React from 'react'

const PdfViewer = ({ fileUrl }) => {
    console.log(fileUrl)
    return (
        <div>
            <iframe src={fileUrl + "#toolbar=0"} height="90vh" width="100%" className='h-[90vh] w-[100%]' />
        </div>
    )
}

export default PdfViewer