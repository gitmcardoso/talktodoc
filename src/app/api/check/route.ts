import { NextResponse, NextRequest } from "next/server";  // Agora importamos o NextRequest
import { checkSubscription } from "@/lib/subscription";

export async function GET(req: NextRequest) {  // Usando NextRequest
  try {
    // Passando req para a função checkSubscription
    const isPro = await checkSubscription(req); 
    return NextResponse.json({ isPro });
  } catch (error) {
    return NextResponse.json({ error: "Error checking subscription" }, { status: 500 });
  }
}
