import { NextRequest, NextResponse } from "next/server";
import { getGroupMembers } from "@/lib/group";

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

    const members = await getGroupMembers(groupId);
    return NextResponse.json(members);
  } catch (error: any) {
    console.error("Error fetching group members:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch group members" },
      { status: 500 }
    );
  }
}
