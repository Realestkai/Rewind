import { NextRequest, NextResponse } from "next/server"
import { downloadUrl } from "@/lib/railway-storage"
export const runtime="nodejs"
export function GET(request:NextRequest){const key=request.nextUrl.searchParams.get("key");if(!key||key.includes(".."))return NextResponse.json({error:"Invalid file."},{status:400});try{return NextResponse.redirect(downloadUrl(key))}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Storage unavailable"},{status:503})}}
