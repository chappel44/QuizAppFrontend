export interface Section {
  id: string;
  name: string;
  description: string;
  topics: Topic[]
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  dueDate: string;
  isActive: boolean;
}