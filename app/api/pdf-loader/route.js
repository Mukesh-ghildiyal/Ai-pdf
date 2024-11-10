import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf"
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

// const pdfUrl = "https://outstanding-cuttlefish-241.convex.cloud/api/storage/6b50110c-eaa4-4b15-b00b-08b39d8ee0d2"
export async function GET(req) {

    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl)
    const pdfUrl = searchParams.get('pdfUrl')
    console.log(pdfUrl)
    //load to pdf file
    const response = await fetch(pdfUrl)
    const data = await response.blob();
    const loader = new WebPDFLoader(data);
    const docs = await loader.load();

    let pdfTextContent = ''
    docs.forEach(doc => {
        pdfTextContent = pdfTextContent + doc.pageContent;
    });

    //split text into small chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20
    })
    const output = await splitter.createDocuments([pdfTextContent]);

    let splitterList = [];
    output.forEach(doc => {
        splitterList.push(doc.pageContent)
    })

    return NextResponse.json({ result: splitterList })
}