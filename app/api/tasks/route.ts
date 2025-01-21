import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Task from '@/models/Task';

export async function GET() {
  try {
    await connectDB();
    const tasks = await Task.find({});
    return NextResponse.json(tasks);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tasks';
    console.error(message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const task = await Task.create(body);
    return NextResponse.json(task, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create task';
    console.error(message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 