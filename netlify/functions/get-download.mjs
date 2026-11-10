import {getStore} from "@netlify/blobs";
export default async req=>{
 if(req.method!=="GET")return new Response("Method not allowed",{status:405});
 const id=new URL(req.url).searchParams.get("order");
 if(!id)return Response.json({error:"Missing order reference."},{status:400});
 const saved=await getStore("buyhub-orders").get(id);
 if(!saved)return Response.json({error:"Order not found."},{status:404});
 let order;try{order=JSON.parse(saved)}catch{return Response.json({error:"Invalid order."},{status:400})}
 if(order.status!=="finished")return Response.json({error:"Payment is not confirmed yet."},{status:402});
 if(!/^pdfs\/[a-f0-9-]+\.pdf$/i.test(order.blobKey||""))return Response.json({error:"This download is not configured."},{status:404});
 const file=await getStore("buyhub-pdfs").get(order.blobKey,{type:"blob"});
 if(!file)return Response.json({error:"The PDF file could not be found."},{status:404});
 const catalogue= getStore("buyhub-catalogue");
 let products=[];try{products=JSON.parse(await catalogue.get("products")||"[]")}catch{}
 const product=products.find(p=>p.id===order.productId);
 const safeName=(product?.name||"BuyHub-download").replace(/[^a-z0-9_-]+/gi,"-").slice(0,80)||"BuyHub-download";
 return new Response(file,{headers:{"Content-Type":"application/pdf","Content-Disposition":'attachment; filename="'+safeName+'.pdf"',"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
};