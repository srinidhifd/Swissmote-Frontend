// src/pages/dashboard/AnnouncementsPage.tsx

import { useEffect, useState } from "react";
import { getAnnouncements } from "../../services/announcementService";
import { Announcement } from "../../types";

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch announcements.");
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Announcements</h1>
      <ul className="space-y-4">
        {announcements.map((announcement) => (
          <li key={announcement.id} className="bg-white p-4 shadow rounded">
            <h3 className="font-bold">{announcement.title}</h3>
            <p>{announcement.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnnouncementsPage;
