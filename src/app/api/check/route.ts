import { NextResponse, NextRequest } from "next/server";  // Agora importamos o NextRequest
import { checkSubscription } from "@/lib/subscription";

export async function GET(req: NextRequest) {  // Usando NextRequest
  try {
    // Passando req para a função checkSubscription
    const isPro = await checkSubscription(req); 
    return NextResponse.json({ isPro });
  } catch (error) {
    console.error("Error checking subscription:", error);  // Log do erro para fins de debug
    return NextResponse.json(
      { error: "Error checking subscription", details: error instanceof Error ? error.message : "Unknown error" }, 
      { status: 500 }
    );
  }
}
