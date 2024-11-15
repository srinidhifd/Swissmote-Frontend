// src/pages/dashboard/JobListingsPage.tsx

import { useEffect, useState } from "react";
import { getJobListings } from "../../services/jobService";
import { Job } from "../../types";

const JobListingsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const data = await getJobListings();
        setJobs(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch job listings.");
        setLoading(false);
      }
    };

    fetchJobListings();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Job Listings</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Title</th>
            <th className="py-2">Type</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td className="py-2">{job.title}</td>
              <td className="py-2">{job.type}</td>
              <td className="py-2">{job.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobListingsPage;
