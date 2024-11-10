import { ConvexVectorStore } from '@langchain/community/vectorstores/convex'
import { action } from './_generated/server'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { TaskType } from '@google/generative-ai'
import { v } from 'convex/values'



export const ingest = action({
    args: {
        splitText: v.any(),
        fileId: v.string()
    },
    handler: async (ctx, args) => {
        await ConvexVectorStore.fromTexts(
            args.splitText,//arr
            args.fileId,//str
            new GoogleGenerativeAIEmbeddings({
                apiKey: "AIzaSyDXie20BwgzuT788EsdBZ9FmfU55aPGhHo",
                model: "text-embedding-004",
                taskType: TaskType.RETRIEVAL_DOCUMENT,
                title: "Document Title",
            }),
            { ctx }
        )
        return 'Completed'
    }
})

export const search = action({
    args: {
        query: v.string(),
        fileId: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const vectorStore = new ConvexVectorStore(
                new GoogleGenerativeAIEmbeddings({
                    apiKey: "AIzaSyDXie20BwgzuT788EsdBZ9FmfU55aPGhHo",
                    model: "text-embedding-004",
                    taskType: TaskType.RETRIEVAL_DOCUMENT,
                    title: "Document Title",
                }),
                { ctx }
            );

            // Perform similarity search without filtering first
            const rawResults = await vectorStore.similaritySearch(args.query, 1);
            console.log("Raw Search Results:", rawResults);

            // Parse metadata if it's JSON and then filter by fileId
            const filteredResults = rawResults.filter(q => {
                try {
                    const metadata = JSON.parse(q.metadata);
                    return metadata.fileId === args.fileId;
                } catch (error) {
                    console.error("Metadata parsing error:", error);
                    return false;
                }
            });

            console.log("Filtered Results (after fileId check):", filteredResults);

            // Fallback to check if we can retrieve documents by fileId directly from Convex DB
            if (!filteredResults.length) {
                console.log("No results from similarity search, attempting direct fileId match.");
                const documentsByFileId = await ctx.db.documents.findMany({
                    where: { metadata: { contains: args.fileId } }
                });
                console.log("Documents found by direct fileId match:", documentsByFileId);
                return documentsByFileId.length ? documentsByFileId : "No matching content found.";
            }

            return filteredResults.length ? filteredResults : "No matching content found.";
        } catch (error) {
            console.error("Error during search:", error);
            return "An error occurred during the search.";
        }
    },
});
