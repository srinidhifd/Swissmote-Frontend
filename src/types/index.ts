
// Base interface for common fields
export interface BaseEntity {
  id?: string; // Optional unique identifier for the entity
  title?: string; // Optional title of the entity
  createdAt?: string; // Optional field for entity creation date
  updatedAt?: string; // Optional field for the last updated date
}

// Interface for automated job listings
export interface AutomatedJob extends BaseEntity {
  listing_name: string; // Name of the listing
  listing_number: string; // Unique identifier for the listing
  projectname?: string; // Optional project name
  date?: string; // Optional, date associated with the listing
  conversion_rate?: string; // Optional, conversion rate as a string
  assignment_link?: string[]; // Optional, array of assignment links
  review_link?: string[]; // Optional, array of review links
}

// Interface for not automated job listings
export interface NotAutomatedJob extends BaseEntity {
  listing_name: string; // Name of the listing
  listing_number: string; // Unique identifier for the listing
}

// Interface for closed automated job listings
export interface ClosedAutomatedJob extends BaseEntity {
  listing_number: string; // Unique identifier for the listing
  projectname?: string; // Optional project name
  date?: string; // Optional, date associated with the listing
  conversion_rate?: string; // Optional, conversion rate as a string
  assignment_link?: string[]; // Optional, array of assignment links
  review_link?: string[]; // Optional, array of review links
}

// Interface for assignments
export interface Assignment extends BaseEntity {
  description: string; // Description of the assignment
  dueDate: string; // ISO 8601 date format for the due date
  assignedTo?: string[]; // Optional, list of users assigned to this assignment
  status?: "pending" | "completed" | "overdue"; // Optional, status of the assignment
}

// Interface for announcements
export interface Announcement extends BaseEntity {
  content: string; // Content of the announcement
  postedDate?: string; // Optional, date the announcement was posted
  category?: string; // Optional, category of the announcement
  author?: string; // Optional, author of the announcement
}

// Interface for messages
export interface Message extends BaseEntity {
  sender: string; // Sender of the message
  content: string; // Content of the message
  timestamp?: string; // Optional, timestamp of the message
  recipient?: string; // Optional, recipient of the message
  type?: "text" | "file" | "image"; // Optional, type of the message
  status?: "sent" | "delivered" | "read"; // Optional, status of the message
}
