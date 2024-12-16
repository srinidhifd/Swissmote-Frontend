import { useEffect, useState } from "react";
import dayjs from "dayjs";
import SearchBar from "../../components/SearchBar";
import SortDropdown from "../../components/SortDropdown";
import Pagination from "../../components/Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";

const ActiveListingsPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const authToken = import.meta.env.VITE_AUTH_TOKEN;

  const [listings, setListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiUrl}/active_listing`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch active listings. Please try again.");
        }
        const data = await response.json();
        setListings(data || []);
        setFilteredListings(data || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
        toast.error(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleSearch = (keyword: string) => {
    setCurrentPage(1);
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
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentListings = filteredListings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8 bg-gray-50 min-h-screen relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <TailSpin height="80" width="80" color="#4fa94d" ariaLabel="loading" />
        </div>
      )}

      <ToastContainer />

      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Active Listings</h1>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <SearchBar onSearch={handleSearch} />
            <SortDropdown onSort={handleSort} />
          </div>
        </div>

        {/* Error Display */}
        {error && <p className="text-red-500 font-semibold">{error}</p>}

        {/* Listings Table */}
        {currentListings.length > 0 ? (
          <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100 border-b">
                <tr className="text-sm font-semibold text-gray-600 uppercase">
                  <th className="px-6 py-4 text-left">Project Name</th>
                  <th className="px-6 py-4 text-left">Organization</th>
                  <th className="px-6 py-4 text-center">Listing No</th>
                  <th className="px-6 py-4 text-center">Process</th>
                  <th className="px-6 py-4 text-center">Designation</th>
                  <th className="px-6 py-4 text-center">Date</th>
                  <th className="px-6 py-4 text-center">Conversion Rate</th>
                  <th className="px-6 py-4 text-center">Links</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentListings.map((listing, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition duration-150 ease-in-out border-b last:border-b-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium">{listing["Project Name"]}</td>
                    <td className="px-6 py-4 text-sm">{listing.Organisation}</td>
                    <td className="px-6 py-4 text-sm text-center">{listing["Listing No"]}</td>
                    <td className="px-6 py-4 text-sm text-center text-green-600 font-medium">
                      {listing.Process}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">{listing.Designation}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      {dayjs(listing.Date).format("DD MMM YYYY")}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">{listing["Conversion Rate"]}</td>
                    <td className="px-6 py-4 text-sm text-center space-y-2">
                      {["Internshala", "Leader link", "Candidate link", "Assignment link"].map(
                        (key, idx) =>
                          listing[key] && (
                            <a
                              key={idx}
                              href={listing[key]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-4 py-2 text-blue-600 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition duration-150 ease-in-out"
                            >
                              {key.replace(/_/g, " ")}
                            </a>
                          )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-6">No active listings found.</p>
        )}

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <Pagination
            totalItems={filteredListings.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ActiveListingsPage;
