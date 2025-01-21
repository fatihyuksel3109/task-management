import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Task from '@/models/Task';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    await connectDB();
    
    const updatedTask = await Task.findByIdAndUpdate(id, body, { new: true });
    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedTask);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update task';
    console.error(message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();
    
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete task';
    console.error(message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 