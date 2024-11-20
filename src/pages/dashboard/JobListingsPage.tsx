import { useEffect, useState } from "react";
import { getActiveListings, getClosedListings } from "../../services/jobService";

const JobListingsPage = () => {
  const [activeListings, setActiveListings] = useState([]);
  const [closedListings, setClosedListings] = useState([]);
  const [currentTab, setCurrentTab] = useState<"active" | "closed">("active");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        if (currentTab === "active") {
          const activeData = await getActiveListings();
          setActiveListings(activeData);
        } else if (currentTab === "closed") {
          const closedData = await getClosedListings();
          setClosedListings(closedData);
        }
      } catch (error) {
        console.error("Failed to fetch listings", error);
      }
    };

    fetchListings();
  }, [currentTab]);

  const renderListings = () => {
    const listings = currentTab === "active" ? activeListings : closedListings;

    if (!listings || listings.length === 0) {
      return <p className="text-gray-500">No listings found.</p>;
    }

    return (
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="p-4 border-b">Project Name</th>
            <th className="p-4 border-b">Organisation</th>
            <th className="p-4 border-b">Listing Number</th>
            <th className="p-4 border-b">Process</th>
            <th className="p-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing: any, index: number) => (
            <tr key={index}>
              <td className="p-4 border-b">{listing["Project Name"]}</td>
              <td className="p-4 border-b">{listing.Organisation}</td>
              <td className="p-4 border-b">{listing["Listing No"]}</td>
              <td className="p-4 border-b">{listing.Process}</td>
              <td className="p-4 border-b">
                <button className="text-blue-500 hover:underline">Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Job Listings</h1>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              currentTab === "active" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setCurrentTab("active")}
          >
            Active Listings
          </button>
          <button
            className={`px-4 py-2 rounded ${
              currentTab === "closed" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setCurrentTab("closed")}
          >
            Closed Listings
          </button>
        </div>
      </div>
      <div className="bg-white shadow rounded">{renderListings()}</div>
    </div>
  );
};

export default JobListingsPage;
