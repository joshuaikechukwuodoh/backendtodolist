import { NextRequest, NextResponse } from "next/server";
import { getGroupLeaderboard } from "@/lib/group";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: groupId } = await params;

    if (!groupId) {
      return NextResponse.json(
        { message: "Group ID is required" },
        { status: 400 }
      );
    }

    const leaderboard = await getGroupLeaderboard(groupId);
    return NextResponse.json(leaderboard);
  } catch (error: any) {
    console.error("Error fetching group leaderboard:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch group leaderboard" },
      { status: 500 }
    );
  }
}
