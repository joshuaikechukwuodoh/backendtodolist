import { NextRequest, NextResponse } from "next/server";
import { getUserGroups } from "@/lib/group";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const groups = await getUserGroups(userId);
    return NextResponse.json(groups);
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return NextResponse.json(
      { message: "Failed to fetch user groups" },
      { status: 500 }
    );
  }
}
