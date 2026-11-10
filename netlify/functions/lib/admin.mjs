import crypto from "node:crypto";
export function cookieValue(req){return (req.headers.get("cookie")||"").split(";").map(v=>v.trim()).find(v=>v.startsWith("buyhub_admin="))?.slice("buyhub_admin=".length)||""}
export function makeToken(){const payload=Buffer.from(JSON.stringify({exp:Date.now()+8*60*60*1000})).toString("base64url");const sig=crypto.createHmac("sha256",process.env.ADMIN_SESSION_SECRET||"").update(payload).digest("base64url");return payload+"."+sig}
export function validSession(req){try{if(!process.env.ADMIN_SESSION_SECRET)return false;const [payload,sig]=cookieValue(req).split(".");if(!payload||!sig)return false;const expected=crypto.createHmac("sha256",process.env.ADMIN_SESSION_SECRET).update(payload).digest();const actual=Buffer.from(sig,"base64url");if(expected.length!==actual.length||!crypto.timingSafeEqual(expected,actual))return false;return JSON.parse(Buffer.from(payload,"base64url").toString()).exp>Date.now()}catch{return false}}
export function sessionCookie(token){return "buyhub_admin="+token+"; HttpOnly; Secure; SameSite=Strict; Path=/.netlify/functions/; Max-Age=28800"}
export function clearCookie(){return "buyhub_admin=; HttpOnly; Secure; SameSite=Strict; Path=/.netlify/functions/; Max-Age=0"}
export function requireAdmin(req){return validSession(req)}
export function jsonError(message,status=400){return Response.json({error:message},{status})}
