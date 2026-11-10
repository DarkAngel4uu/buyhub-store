import { getStore } from "@netlify/blobs";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
export default async (req) => {
  const id=new URL(req.url).searchParams.get("order");
  if(!id) return Response.json({error:"Missing order reference."},{status:400});
  const store=getStore("buyhub-orders"),saved=await store.get(id);
  if(!saved) return Response.json({error:"Order not found."},{status:404});
  const order=JSON.parse(saved);
  if(order.status!=="finished") return Response.json({error:"Payment is not confirmed yet."},{status:402});
  const s3=new S3Client({region:"auto",endpoint:"https://"+process.env.R2_ACCOUNT_ID+".r2.cloudflarestorage.com",credentials:{accessKeyId:process.env.R2_ACCESS_KEY_ID,secretAccessKey:process.env.R2_SECRET_ACCESS_KEY}});
  const url=await getSignedUrl(s3,new GetObjectCommand({Bucket:process.env.R2_BUCKET_NAME,Key:order.r2Key}),{expiresIn:300});
  return Response.json({url});
};