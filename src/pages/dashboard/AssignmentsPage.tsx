// src/pages/dashboard/AssignmentsPage.tsx

import { useEffect, useState } from "react";
import { getAssignments } from "../../services/assignmentService";
import { Assignment } from "../../types";

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getAssignments();
        setAssignments(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch assignments.");
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Assignments</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Title</th>
            <th className="py-2">Description</th>
            <th className="py-2">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td className="py-2">{assignment.title}</td>
              <td className="py-2">{assignment.description}</td>
              <td className="py-2">{assignment.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentsPage;
