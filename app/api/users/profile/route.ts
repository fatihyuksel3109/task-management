import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return new NextResponse(null, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("task-management");
  
  const user = await db.collection("users").findOne({ email: session.user.email });
  
  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return new NextResponse(null, { status: 401 });
  }

  const data = await request.json();
  const client = await clientPromise;
  const db = client.db("task-management");
  
  await db.collection("users").updateOne(
    { email: session.user.email },
    { $set: data },
    { upsert: true }
  );
  
  const updatedUser = await db.collection("users").findOne({ email: session.user.email });
  
  return NextResponse.json(updatedUser);
} 