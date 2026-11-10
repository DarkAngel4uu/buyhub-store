import {getStore} from "@netlify/blobs";
import {requireAdmin,jsonError} from "./lib/admin.mjs";
import crypto from "node:crypto";
export default async req=>{
 if(req.method!=="POST")return jsonError("Method not allowed",405);
 if(!requireAdmin(req))return jsonError("Please sign in again.",401);
 try{
  const form=await req.formData(),file=form.get("file");
  if(!file||typeof file.arrayBuffer!=="function"||!String(file.name||"").toLowerCase().endsWith(".pdf")||file.type!=="application/pdf")return jsonError("Choose a valid PDF file.");
  if(file.size<1||file.size>4*1024*1024)return jsonError("For this free setup, PDFs must be 4 MB or smaller.");
  const key="pdfs/"+crypto.randomUUID()+".pdf";
  await getStore("buyhub-pdfs").set(key,file,{metadata:{contentType:"application/pdf",originalName:String(file.name).slice(0,180)}});
  return Response.json({key});
 }catch(e){return jsonError("Could not save the PDF to Netlify storage. Please try again.",500)}
};