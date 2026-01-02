import { NextRequest, NextResponse } from "next/server";
import { getAllGroups, createGroup } from "@/lib/group";

export async function GET() {
  try {
    const groups = await getAllGroups();
    return NextResponse.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { message: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, creatorId } = await request.json();

    if (!name || !description || !creatorId) {
      return NextResponse.json(
        { message: "Name, description, and creatorId are required" },
        { status: 400 }
      );
    }

    const newGroup = await createGroup(name, description, creatorId);
    return NextResponse.json(newGroup, { status: 201 });
  } catch (error: any) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create group" },
      { status: 500 }
    );
  }
}
