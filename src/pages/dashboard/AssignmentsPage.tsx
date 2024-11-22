import { useState, useEffect } from "react";

interface Assignment {
  title: string;
  // Add other properties as needed
}

const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://api.example.com/assignments");
        if (!response.ok) throw new Error("Failed to fetch assignments.");
        const data = await response.json();
        setAssignments(data);
      } catch (err) {
        setError("Error fetching assignments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Assignments</h1>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <ul>
          {assignments.map((assignment, index) => (
            <li key={index} className="mb-2">
              {assignment.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssignmentsPage;
