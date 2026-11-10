import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";
export default async (req) => {
  if(req.method!=="POST") return new Response("Method not allowed",{status:405});
  const raw=await req.text(), signature=req.headers.get("x-nowpayments-sig");
  if(!signature || !process.env.NOWPAYMENTS_IPN_SECRET) return new Response("Unauthorized",{status:401});
  let parsed; try { parsed=JSON.parse(raw); } catch { return new Response("Bad request",{status:400}); }
  const sorted=JSON.stringify(sortObject(parsed));
  const expected=crypto.createHmac("sha512",process.env.NOWPAYMENTS_IPN_SECRET).update(sorted).digest("hex");
  const a=Buffer.from(expected),b=Buffer.from(signature);
  if(a.length!==b.length || !crypto.timingSafeEqual(a,b)) return new Response("Invalid signature",{status:401});
  if(parsed.payment_status==="finished" && parsed.order_id) {
    const store=getStore("buyhub-orders"), saved=await store.get(parsed.order_id);
    if(saved){const order=JSON.parse(saved);order.status="finished";order.paidAt=new Date().toISOString();await store.set(parsed.order_id,JSON.stringify(order));}
  }
  return new Response("OK");
};
function sortObject(o){if(Array.isArray(o))return o.map(sortObject);if(o&&typeof o==="object")return Object.keys(o).sort().reduce((a,k)=>(a[k]=sortObject(o[k]),a),{});return o;}