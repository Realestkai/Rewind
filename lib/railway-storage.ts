import { createHmac, createHash } from "node:crypto"
const endpoint = () => process.env.RAILWAY_S3_ENDPOINT?.replace(/\/$/, "")
const bucket = () => process.env.RAILWAY_S3_BUCKET
const keyId = () => process.env.RAILWAY_S3_ACCESS_KEY_ID
const secret = () => process.env.RAILWAY_S3_SECRET_ACCESS_KEY
function encode(value:string){return encodeURIComponent(value).replace(/[!'()*]/g,c=>`%${c.charCodeAt(0).toString(16).toUpperCase()}`)}
function hmac(key:Buffer|string,data:string){return createHmac("sha256",key).update(data).digest()}
function sign(method:string,key:string,contentType:string,expires=900){const base=endpoint(), name=bucket(), access=keyId(), secretKey=secret();if(!base||!name||!access||!secretKey)throw new Error("Railway Bucket is not configured");const url=new URL(base);const now=new Date();const stamp=now.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z");const day=stamp.slice(0,8);const region=process.env.RAILWAY_S3_REGION||"auto";const service="s3";const scope=`${day}/${region}/${service}/aws4_request`;const path=`/${encode(name)}/${key.split("/").map(encode).join("/")}`;const query=new URLSearchParams({"X-Amz-Algorithm":"AWS4-HMAC-SHA256","X-Amz-Credential":`${access}/${scope}`,"X-Amz-Date":stamp,"X-Amz-Expires":String(expires),"X-Amz-SignedHeaders":"host"});const payload="UNSIGNED-PAYLOAD";const headers=`host:${url.host}\n`;const canonical=`${method}\n${path}\n${query.toString().replace(/\+/g,"%20")}\n${headers}\nhost\n${payload}`;const stringToSign=`AWS4-HMAC-SHA256\n${stamp}\n${scope}\n${createHash("sha256").update(canonical).digest("hex")}`;const signingKey=hmac(hmac(hmac(hmac(`AWS4${secretKey}`,day),region),service),"aws4_request");query.set("X-Amz-Signature",hmac(signingKey,stringToSign).toString("hex"));return `${url.origin}${path}?${query.toString()}`}
export const uploadUrl=(key:string,contentType:string)=>sign("PUT",key,contentType)
export const downloadUrl=(key:string)=>sign("GET",key,"")
