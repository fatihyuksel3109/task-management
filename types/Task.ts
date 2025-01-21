export interface Task {
  _id?: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Done";
  addDate: string;
  dueDate: string;
}

export type TaskStatus = Task["status"]; 