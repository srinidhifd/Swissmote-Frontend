// Base interface for common fields
export interface BaseEntity {
  id?: string; // Optional unique identifier for the entity
  title?: string; // Optional title of the entity
  createdAt?: string; // ISO 8601 formatted creation date
  updatedAt?: string; // ISO 8601 formatted last updated date
}

// Interface for automated job listings
export interface AutomatedJob extends BaseEntity {
  listing_name: string; // Required: Name of the listing
  listing_number: string; // Required: Unique identifier for the listing
  projectname?: string; // Optional: Project name
  date?: string; // Optional: Date associated with the listing
  conversion_rate?: string; // Optional: Conversion rate (string)
  assignment_link?: string[]; // Optional: Array of assignment links
  review_link?: string[]; // Optional: Array of review links
  posted_over?: string; // Added field
  day2followup?: FollowupDetail; // Optional: Day 2 follow-up details
  day4followup?: FollowupDetail; // Optional: Day 4 follow-up details
  messages?: {
    intro?: string; 
    assignment?: string;
  };
  metrics: {
    assignments_received_count: number;
    assignments_sent_count: number;
    total_new_count: number;
    total_applications_count: number;
  };
  followup2Message?: string; // Added property
  followup4Message?: string; // Added property
}

// Interface for not automated job listings
export interface NotAutomatedJob extends BaseEntity {
  listing_name: string; // Required: Name of the listing
  listing_number: string; // Required: Unique identifier for the listing
}

// Interface for closed automated job listings
export interface ClosedAutomatedJob extends BaseEntity {
  listing_name: string;
  listing_number: string;
  projectname?: string;
  date?: string;
  conversion_rate?: string;
  assignment_link?: string[];
  review_link?: string[];
}

// Shared interface for follow-up details
export interface FollowupDetail {
  followup: string; // Follow-up message
  status: number; // 1 = Completed, 0 = Pending
}

// Interface for assignments
export interface Assignment extends BaseEntity {
  description: string; // Required: Description of the assignment
  dueDate: string; // ISO 8601 format: Due date
  assignedTo?: string[]; // Optional: Array of users assigned to this task
  status?: "pending" | "completed" | "overdue"; // Optional: Status of the assignment
}

// Interface for announcements
export interface Announcement extends BaseEntity {
  content: string; // Required: Content of the announcement
  postedDate?: string; // ISO 8601 format: Posted date
  category?: string; // Optional: Category of the announcement
  author?: string; // Optional: Author name
}

// Interface for messages
export interface Message extends BaseEntity {
  sender: string; // Required: Sender of the message
  content: string; // Required: Message content
  timestamp?: string; // ISO 8601 format: Timestamp of the message
  recipient?: string; // Optional: Recipient of the message
  type?: "text" | "file" | "image"; // Optional: Type of the message
  status?: "sent" | "delivered" | "read"; // Optional: Status of the message
}
