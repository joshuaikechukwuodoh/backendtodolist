import { NextRequest, NextResponse } from "next/server";
import { leaveGroup } from "@/lib/group";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: groupId } = await params;
    const { userId } = await request.json();

    if (!userId || !groupId) {
      return NextResponse.json(
        { message: "User ID and Group ID are required" },
        { status: 400 }
      );
    }

    const deletedMember = await leaveGroup(userId, groupId);
    return NextResponse.json({
      message: "Left group successfully",
      deletedMember,
    });
  } catch (error: any) {
    console.error("Error leaving group:", error);
    return NextResponse.json(
      { message: error.message || "Failed to leave group" },
      { status: 500 }
    );
  }
}
