import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  verificationPhoto: f({
    image: { 
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // Auth check
      const session = await getServerSession(authOptions);
      if (!session) throw new Error("Unauthorized");
      
      return { userId: (session.user as any).id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Log upload
      console.log("Upload complete for user:", metadata.userId);
      console.log("File URL:", file.url);
      
      return { 
        uploadedBy: metadata.userId, 
        url: file.url,
        key: file.key,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
