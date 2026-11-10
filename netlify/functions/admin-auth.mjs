import crypto from "node:crypto";
import {makeToken,validSession,sessionCookie,clearCookie,jsonError} from "./lib/admin.mjs";
export default async req=>{
 if(req.method==="GET")return Response.json({authenticated:validSession(req)});
 if(req.method==="DELETE")return new Response(JSON.stringify({ok:true}),{headers:{"Content-Type":"application/json","Set-Cookie":clearCookie()}});
 if(req.method!=="POST")return jsonError("Method not allowed",405);
 try{const {password}=await req.json();if(!process.env.ADMIN_PASSWORD||!process.env.ADMIN_SESSION_SECRET)return jsonError("Admin login is not configured yet.",503);const a=crypto.createHash("sha256").update(String(password||"")).digest(),b=crypto.createHash("sha256").update(process.env.ADMIN_PASSWORD).digest();if(!crypto.timingSafeEqual(a,b))return jsonError("Incorrect password.",401);return new Response(JSON.stringify({authenticated:true}),{headers:{"Content-Type":"application/json","Set-Cookie":sessionCookie(makeToken())}})}catch{return jsonError("Could not sign in.",400)}
};