export interface Job {
  id: string;
  title: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "freelance" | "internship"; 
  // Restricted type values
  status: "active" | "closed" | "draft"; // Restricted status options
  skillsRequired?: string[]; // Optional field for required skills
  postedDate?: string; // Optional field for when the job was posted
  applicationDeadline?: string; // Optional field for the application deadline
  companyName?: string; // Optional field for company name
  minSalary?: number; // Optional field for minimum salary
  maxSalary?: number; // Optional field for maximum salary
  description?: string; 
  duration?:number;
  salary?: number;
  minExperience?: number;
  skills?: string[];
  numPosition: number;
  account: string;// Optional field for job description
  jobPartFull: 'part' | 'full';
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO 8601 date format
  assignedTo?: string[]; // Optional field for assigned users (user IDs)
  status?: "pending" | "completed" | "overdue"; // Optional status field
  createdAt?: string; // Optional field for assignment creation date
  updatedAt?: string; // Optional field for last updated date
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  postedDate?: string; // Optional field for when the announcement was posted
  category?: string; // Optional field for categorizing announcements
  author?: string; // Optional field for the author of the announcement
}

export interface Message {
  id: string;
  sender: string; // Sender's name or ID
  content: string;
  timestamp?: string; // Optional field for message timestamp
  recipient?: string; // Optional field for the recipient's name or ID
  type?: "text" | "file" | "image"; // Optional field for the type of message
  status?: "sent" | "delivered" | "read"; // Optional field for message status
}
