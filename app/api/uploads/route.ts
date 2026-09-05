import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { readSession } from "@/lib/auth"
import { userById } from "@/lib/data"
import { uploadUrl } from "@/lib/railway-storage"
export const runtime="nodejs"
export async function POST(request:NextRequest){const session=readSession(request.cookies.get("ryvn_discord_user")?.value);const user=session?await userById(session.id):null;if(!user||!["owner","editor"].includes(user.role))return NextResponse.json({error:"Staff access required."},{status:403});const body=await request.json();const filename=String(body.filename||"").replace(/[^a-zA-Z0-9._-]/g,"_");const type=String(body.contentType||"application/octet-stream");if(!filename)return NextResponse.json({error:"File name required."},{status:400});const key=`products/${Date.now()}-${randomUUID()}-${filename}`;try{return NextResponse.json({key,uploadUrl:uploadUrl(key,type),assetUrl:`/api/media?key=${encodeURIComponent(key)}`})}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Storage unavailable"},{status:503})}}
