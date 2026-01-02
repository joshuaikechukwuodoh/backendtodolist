import { NextRequest, NextResponse } from "next/server";
import { getGroupTasks } from "@/lib/group";

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

    const tasks = await getGroupTasks(groupId);
    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error("Error fetching group tasks:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch group tasks" },
      { status: 500 }
    );
  }
}
