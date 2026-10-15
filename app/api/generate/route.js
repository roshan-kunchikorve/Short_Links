import clientPromise from "@/lib/mongodb"

export async function POST(request) {
try {
        // 1. Parse the request body
        const body = await request.json();

        // 2. Connect to MongoDB
        const client = await clientPromise;
        const db = client.db("ShortLinks");
        const collection = db.collection("url");

        const doc = await collection.findOne({shorturl: body.shorturl})
        if(doc){
            return Response.json({success: false, error: true, message:'URL already Exists'})
        }

        // 3. Insert the URL into MongoDB
        const result = await collection.insertOne({
            url: body.url,
            shorturl: body.shorturl
        });

        // 4. Return the response
        return Response.json({
            success: true,
            error: false,
            message: "URL Generated Successfully",
            id: result.insertedId
        });
} catch (error){
    console.log(error);

    return Response.json({
        success: false,
        error: true,
        message: "Failed to generate URL"
    },{ status: 500});
}
};