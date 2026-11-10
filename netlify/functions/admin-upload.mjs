import {S3Client,PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {requireAdmin,jsonError} from "./lib/admin.mjs";
import crypto from "node:crypto";
export default async req=>{
 if(req.method!=="POST")return jsonError("Method not allowed",405);
 if(!requireAdmin(req))return jsonError("Please sign in again.",401);
 try{const {filename,contentType,size}=await req.json();if(contentType!=="application/pdf"||!String(filename||"").toLowerCase().endsWith(".pdf"))return jsonError("Only PDF files are allowed.");if(!Number.isFinite(size)||size<1||size>25*1024*1024)return jsonError("PDF must be 25 MB or smaller.");const key="products/"+crypto.randomUUID()+".pdf";const s3=new S3Client({region:"auto",endpoint:"https://"+process.env.R2_ACCOUNT_ID+".r2.cloudflarestorage.com",credentials:{accessKeyId:process.env.R2_ACCESS_KEY_ID,secretAccessKey:process.env.R2_SECRET_ACCESS_KEY}});const uploadUrl=await getSignedUrl(s3,new PutObjectCommand({Bucket:process.env.R2_BUCKET_NAME,Key:key,ContentType:"application/pdf"}),{expiresIn:300});return Response.json({uploadUrl,key})}catch(e){return jsonError("Could not prepare upload. Check your R2 settings.",500)}
};