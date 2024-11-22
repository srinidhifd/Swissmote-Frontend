import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import SortDropdown from "../../components/SortDropdown";
import Pagination from "../../components/Pagination";

const ClosedListingsPage = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://api.trollgold.org/persistventures/assignment/closedListings",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch closed listings. Please try again.");
        }
        const data = await response.json();
        setListings(data || []);
        setFilteredListings(data || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleSearch = (keyword: string) => {
    if (keyword) {
      setFilteredListings(
        listings.filter((listing) =>
          listing["Project Name"].toLowerCase().includes(keyword.toLowerCase())
        )
      );
    } else {
      setFilteredListings(listings);
    }
  };

  const handleSort = (sortBy: string) => {
    let sortedListings = [...filteredListings];
    if (sortBy === "date_asc") {
      sortedListings.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
    } else if (sortBy === "date_desc") {
      sortedListings.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
    } else if (sortBy === "name_asc") {
      sortedListings.sort((a, b) => a["Project Name"].localeCompare(b["Project Name"]));
    } else if (sortBy === "name_desc") {
      sortedListings.sort((a, b) => b["Project Name"].localeCompare(a["Project Name"]));
    }
    setFilteredListings(sortedListings);
  };

  const handlePageChange = (currentPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredListings(listings.slice(startIndex, endIndex));
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Closed Listings</h1>
          <div className="flex items-center space-x-4">
            <SearchBar onSearch={handleSearch} />
            <SortDropdown onSort={handleSort} />
          </div>
        </div>

        {loading && <p className="text-gray-500">Loading closed listings...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {filteredListings.length > 0 ? (
          <div className="overflow-x-auto mt-4">
            <table className="w-full bg-white border border-gray-300 rounded-md shadow-md">
              <thead className="bg-gray-100 rounded-t-md">
                <tr>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">
                    Project Name
                  </th>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">
                    Organization
                  </th>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">
                    Listing No
                  </th>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">
                    Process
                  </th>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">
                    Designation
                  </th>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">
                    Date
                  </th>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">
                    Conversion Rate
                  </th>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">
                    Links
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((listing, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="p-4 border-b border-gray-300 text-blue-600 font-semibold">
                      {listing["Project Name"]}
                    </td>
                    <td className="p-4 border-b border-gray-300 text-gray-600">
                      {listing.Organisation}
                    </td>
                    <td className="p-4 border-b border-gray-300 text-gray-600">
                      {listing["Listing No"]}
                    </td>
                    <td className="p-4 border-b border-gray-300 text-green-600 font-semibold">
                      {listing.Process}
                    </td>
                    <td className="p-4 border-b border-gray-300 text-gray-600">
                      {listing.Designation}
                    </td>
                    <td className="p-4 border-b border-gray-300 text-gray-600">
                      {listing.Date}
                    </td>
                    <td className="p-4 border-b border-gray-300 text-gray-600">
                      {listing["Conversion Rate"]}
                    </td>
                    <td className="p-4 border-b border-gray-300 text-center space-y-2">
                      <a
                        href={listing.Internshala}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
                      >
                        Internshala
                      </a>
                      <a
                        href={listing["Leader link"]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
                      >
                        Leader Link
                      </a>
                      <a
                        href={listing["Candidate link"]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
                      >
                        Candidate Link
                      </a>
                      <a
                        href={listing["Assignment link"]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
                      >
                        Assignment Link
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No closed listings found.</p>
        )}

        <Pagination
          totalItems={listings.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ClosedListingsPage;
