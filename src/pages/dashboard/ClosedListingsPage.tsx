import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Pagination from "../../components/Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";
import { BsThreeDotsVertical } from "react-icons/bs";

const ClosedListingsPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const authToken = import.meta.env.VITE_AUTH_TOKEN;

  const [listings, setListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiUrl}/closed_listings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch closed listings. Please try again.");
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

  const handlePageChange = (page: number) => setCurrentPage(page);

  // Extract and parse the Assignment link
  const parseLink = (link: string) => {
    try {
      const parsedLinks = JSON.parse(link);
      if (Array.isArray(parsedLinks)) {
        return parsedLinks;
      }
      return [parsedLinks];
    } catch {
      return link ? [link] : [];
    }
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

      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
          <h1 className="text-4xl font-semibold text-gray-900">Closed Listings</h1>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full lg:w-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select
              onChange={(e) => handleSort(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sort By</option>
              <option value="date_asc">Date Asc</option>
              <option value="date_desc">Date Desc</option>
              <option value="name_asc">Name Asc</option>
              <option value="name_desc">Name Desc</option>
            </select>
          </div>
        </div>
         {/* Error Message */}
         {error && <p className="text-red-500 text-center my-4">{error}</p>}
        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow">
          <table className="w-full bg-white">
            <thead className="bg-gray-100 text-gray-700 font-medium">
              <tr>
                <th className="px-4 py-3 text-left">Project Name</th>
                <th className="px-4 py-3 text-left">Organization</th>
                <th className="px-4 py-3 text-center">Listing No</th>
                <th className="px-4 py-3 text-center">Process</th>
                <th className="px-4 py-3 text-center">Designation</th>
                <th className="px-4 py-3 text-center">Date</th>
                <th className="px-4 py-3 text-center">Conversion Rate</th>
                <th className="px-4 py-3 text-center">Links</th>
              </tr>
            </thead>
            <tbody>
              {currentListings.map((listing, index) => (
                <tr key={index} className="hover:bg-gray-50 border-b transition">
                  <td className="px-4 py-3">{listing["Project Name"]}</td>
                  <td className="px-4 py-3">{listing.Organisation}</td>
                  <td className="px-4 py-3 text-center">{listing["Listing No"]}</td>
                  <td className="px-4 py-3 text-center">{listing.Process}</td>
                  <td className="px-4 py-3 text-center">{listing.Designation}</td>
                  <td className="px-4 py-3 text-center">
                    {dayjs(listing.Date).format("DD MMM YYYY")}
                  </td>
                  <td className="px-4 py-3 text-center">{listing["Conversion Rate"]}</td>
                  <td className="px-4 py-3 text-center relative">
                    <button
                      onClick={() =>
                        setDropdownOpen(dropdownOpen === index ? null : index)
                      }
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <BsThreeDotsVertical />
                    </button>
                    {dropdownOpen === index && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        {["Internshala", "Leader link", "Candidate link", "Assignment link"].map(
                          (key, idx) => {
                            const links = key === "Assignment link" ? parseLink(listing[key]) : [listing[key]];
                            return (
                              links &&
                              links.map((link: string, i: number) => (
                                <a
                                  key={`${idx}-${i}`}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  {key.replace(/_/g, " ")} {links.length > 1 ? `(${i + 1})` : ""}
                                </a>
                              ))
                            );
                          }
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
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

export default ClosedListingsPage;
