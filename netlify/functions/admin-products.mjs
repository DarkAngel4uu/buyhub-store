import {randomUUID} from "node:crypto";
import {getStore} from "@netlify/blobs";
import {requireAdmin,jsonError} from "./lib/admin.mjs";
const store=()=>getStore("buyhub-catalogue");
export default async req=>{
 if(!requireAdmin(req))return jsonError("Please sign in again.",401);
 const db=store();let products=[];try{products=JSON.parse(await db.get("products")||"[]")}catch{}
 if(req.method==="GET")return Response.json({products});
 if(req.method==="POST"){try{const p=await req.json();if(!p.name?.trim()||!p.description?.trim()||!Number.isFinite(p.price)||p.price<0.5||p.price>10000||!/^pdfs\/[a-f0-9-]+\.pdf$/i.test(p.blobKey||""))return jsonError("Enter a title, description, valid price and uploaded PDF.");const product={id:randomUUID(),name:p.name.trim(),description:p.description.trim(),price:Number(p.price.toFixed(2)),currency:"USD",blobKey:p.blobKey,published:true};products.push(product);await db.set("products",JSON.stringify(products));return Response.json({product})}catch{return jsonError("Could not save product.",500)}}
 if(req.method==="DELETE"){try{const {id}=await req.json();const product=products.find(p=>p.id===id);if(product?.blobKey)await getStore("buyhub-pdfs").delete(product.blobKey);products=products.filter(p=>p.id!==id);await db.set("products",JSON.stringify(products));return Response.json({ok:true})}catch{return jsonError("Could not delete product.",400)}}
 return jsonError("Method not allowed",405)
};