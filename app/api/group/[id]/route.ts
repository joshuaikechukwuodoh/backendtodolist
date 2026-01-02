import { NextRequest, NextResponse } from "next/server";
import { deleteGroup } from "@/lib/group";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Group ID is required" },
        { status: 400 }
      );
    }

    const deletedGroup = await deleteGroup(id);
    return NextResponse.json({
      message: "Group deleted successfully",
      deletedGroup,
    });
  } catch (error: any) {
    console.error("Error deleting group:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete group" },
      { status: 500 }
    );
  }
}
