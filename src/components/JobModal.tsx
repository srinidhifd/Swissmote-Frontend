import { useState } from "react";
import { Job } from "../types";

interface JobModalProps {
  job?: Job;
  onSave: (jobData: Job) => void;
  onClose: () => void;
}

const JobModal: React.FC<JobModalProps> = ({ job, onSave, onClose }) => {
  const [title, setTitle] = useState(job?.title || "");
  const [location, setLocation] = useState(job?.location || "");
  const [type, setType] = useState(job?.type || "full-time"); // New field for job type
  const [status, setStatus] = useState(job?.status || "open");
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!title.trim() || !location.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    onSave({ id: job?.id || "", title, location, type, status });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="job-modal-title"
      aria-modal="true"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 id="job-modal-title" className="text-2xl font-bold mb-4">
          {job ? "Edit Job" : "Add Job"}
        </h2>
        
        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}
        
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null);
          }}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setError(null);
          }}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        >
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
          <option value="internship">Internship</option>
          <option value="contract">Contract</option>
        </select>
        
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobModal;
