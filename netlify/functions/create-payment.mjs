import { randomUUID } from "node:crypto";
import { getStore } from "@netlify/blobs";
const products = []; // Add the same product IDs, names, prices and R2 keys as assets/products.js.
export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed",{status:405});
  try {
    const { productId } = await req.json();
    const product = products.find(p => p.id === productId);
    if (!product) return Response.json({error:"This product is not available yet."},{status:400});
    const orderId = randomUUID();
    const base = process.env.NOWPAYMENTS_API_URL || "https://api.nowpayments.io/v1";
    const response = await fetch(base + "/invoice", {method:"POST",headers:{"x-api-key":process.env.NOWPAYMENTS_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({price_amount:product.price,price_currency:"usd",order_id:orderId,order_description:product.name,ipn_callback_url:process.env.SITE_URL+"/.netlify/functions/nowpayments-ipn",success_url:process.env.SITE_URL+"/success.html?order="+orderId,cancel_url:process.env.SITE_URL+"/"})});
    const invoice = await response.json();
    if (!response.ok) throw new Error(invoice.message || "Payment provider error");
    const store = getStore("buyhub-orders");
    await store.set(orderId,JSON.stringify({orderId,productId:product.id,r2Key:product.r2Key,status:"pending",createdAt:new Date().toISOString()}));
    return Response.json({invoice_url:invoice.invoice_url});
  } catch(e) { return Response.json({error:e.message || "Could not create payment."},{status:500}); }
};