export interface Job {
  id: string;
  title: string;
  location: string;
  type: string; // Added 'type' field
  status: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
}
