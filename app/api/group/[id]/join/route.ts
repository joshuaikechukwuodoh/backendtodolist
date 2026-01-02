import { NextRequest, NextResponse } from "next/server";
import { joinGroup } from "@/lib/group";

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

    const newMember = await joinGroup(userId, groupId);
    return NextResponse.json(newMember, { status: 201 });
  } catch (error: any) {
    console.error("Error joining group:", error);
    return NextResponse.json(
      { message: error.message || "Failed to join group" },
      { status: 500 }
    );
  }
}
