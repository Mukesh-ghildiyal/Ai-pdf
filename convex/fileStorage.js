import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const AddFileEntryToDb = mutation({
    args: {
        fileId: v.string(),
        storageId: v.string(),
        fileName: v.string(),
        fileUrl: v.string(),
        createdBy: v.string()
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert('pdfFiles', {
            fileId: args.fileId,
            fileName: args.fileName,
            storageId: args.storageId,
            fileUrl: args.fileUrl,
            createdBy: args.createdBy
        })
        return "Inserted"
    }
})
//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
export const getFileUrl = mutation({
    args: {
        storageId: v.string()
    },
    handler: async (ctx, args) => {
        const url = await ctx.storage.getUrl(args.storageId);
        return url;
    }
})


export const GetFileRecord = query({
    args: {
        fileId: v.string()
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query('pdfFiles').filter((q) => q.eq(q.field('fileId'), args.fileId))
            .collect()
        console.log(result)
        return result[0]
    }
})