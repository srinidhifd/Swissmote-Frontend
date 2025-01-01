import { useEffect, useState} from "react";
import dayjs from "dayjs";
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
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch active listings. Please try again.");
        }
        const data = await response.json();
        const sortedData = data.sort((a: any, b: any) => 
          new Date(b.Date).getTime() - new Date(a.Date).getTime()
        );
        setListings(sortedData || []);
        setFilteredListings(sortedData || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
        toast.error(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [apiUrl, authToken]);

 

  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) {
      setFilteredListings(listings);
      return;
    }

    const filtered = listings.filter((listing) => {
      const searchStr = keyword.toLowerCase();
      return (
        listing["Project Name"]?.toLowerCase().includes(searchStr) ||
        listing["Organisation"]?.toLowerCase().includes(searchStr) ||
        listing["Process"]?.toLowerCase().includes(searchStr) ||
        listing["Designation"]?.toLowerCase().includes(searchStr) ||
        listing["Listing No"]?.toString().includes(searchStr)
      );
    });
    
    setFilteredListings(filtered);
    setCurrentPage(1);
  };

  const handleSort = (sortBy: string) => {
    const sorted = [...filteredListings];
    
    switch (sortBy) {
      case "date_asc":
        sorted.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
        break;
      case "date_desc":
        sorted.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
        break;
      case "name_asc":
        sorted.sort((a, b) => a["Project Name"].localeCompare(b["Project Name"]));
        break;
      case "name_desc":
        sorted.sort((a, b) => b["Project Name"].localeCompare(a["Project Name"]));
        break;
      default:
        // Default sort by date (latest first)
        sorted.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
    }
    
    setFilteredListings(sorted);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentListings = filteredListings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-3 bg-gray-50 min-h-screen relative max-h-[100vh]">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <TailSpin height="80" width="80" color="#4fa94d" ariaLabel="loading" />
        </div>
      )}
      <ToastContainer />

      <div className="p-6 max-w-7xl mx-auto bg-white shadow-xl rounded-lg">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
          <h1 className="text-4xl font-semibold text-gray-900">Active Listings</h1>

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
        <div className="overflow-x-auto">
          <table className="table-auto w-full border bg-white border-gray-300 rounded-lg shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Project Name</th>
                <th className="px-4 py-2 text-left">Organisation</th>
                <th className="px-4 py-2 text-left">Listing No</th>
                <th className="px-4 py-2 text-left">Process</th>
                <th className="px-4 py-2 text-left">Designation</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Created By</th>
                <th className="px-4 py-2 text-left">Created Platform</th>
                <th className="px-4 py-2 text-left">Automated By</th>
                <th className="px-4 py-2 text-left">Automated Platform</th>
                <th className="px-4 py-2 text-left">Expiry Date</th>
                <th className="px-4 py-2 text-left">Conversion Rate</th>
                <th className="px-4 py-2 text-left">Internshala Link</th>
                <th className="px-4 py-2 text-left">Leader Link</th>
                <th className="px-4 py-2 text-left">Candidate Link</th>
                <th className="px-4 py-2 text-left">Assignment Links</th>
              </tr>
            </thead>
            <tbody>
              {currentListings.map((item) => (
                <tr key={item.listing_no} className="hover:bg-gray-100 border-b border-gray-300">
                  <td className="px-4 py-2">{item["Project Name"]}</td>
                  <td className="px-4 py-2">{item.Organisation}</td>
                  <td className="px-4 py-2">{item["Listing No"]}</td>
                  <td className="px-4 py-2">{item.Process}</td>
                  <td className="px-4 py-2">{item.Designation}</td>
                  <td className="px-4 py-2">{dayjs(item.Date).format("DD MMMM YYYY")}</td>
                  <td className="px-4 py-2">{item.platform_data?.created_by || 'N/A'}</td>
                  <td className="px-4 py-2">{item.platform_data?.created_by_platform || 'N/A'}</td>
                  <td className="px-4 py-2">{item.platform_data?.automated_by || 'N/A'}</td>
                  <td className="px-4 py-2">{item.platform_data?.automated_by_platform || 'N/A'}</td>
                  <td className="px-4 py-2">{dayjs(item.expiry_at).format("DD MMMM YYYY")}</td>
                  <td className="px-4 py-2">{item["Conversion Rate"]}</td>
                  <td className="px-4 py-2">
                    <a href={item.Internshala} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Applications
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    <a href={item["Leader link"]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Leader Bot
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    <a href={item["Candidate link"]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Candidate Bot
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    {(() => {
                      try {
                        let links = [];
                        if (item["Assignment link"]) {
                          if (typeof item["Assignment link"] === 'string') {
                            // Try JSON parse first
                            try {
                              links = JSON.parse(item["Assignment link"]);
                            } catch {
                              // Split by newline and process each line
                              links = item["Assignment link"]
                                .split('\n')
                                .map(link => link.trim())
                                .filter(link => {
                                  // Check if it's a valid URL
                                  try {
                                    return link.startsWith('http') || 
                                           link.startsWith('https') || 
                                           link.includes('loom.com') || 
                                           link.includes('drive.google.com');
                                  } catch {
                                    return false;
                                  }
                                });
                            }
                          } else if (Array.isArray(item["Assignment link"])) {
                            links = item["Assignment link"];
                          }
                        }

                        return links.length > 0 ? (
                          <div className="space-y-2">
                            {links.map((link: string, idx: number) => (
                              <a 
                                key={idx} 
                                href={link.trim()} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="block text-blue-600 hover:underline"
                              >
                                {link.includes('loom.com') ? 'Loom Recording' : 
                                 link.includes('drive.google.com') ? 'Google Drive' : 
                                 `Assignment Link`} {links.length > 1 ? `#${idx + 1}` : ''}
                              </a>
                            ))}
                          </div>
                        ) : "No Links";
                      } catch (error) {
                        console.error("Error parsing assignment links:", error);
                        return "Invalid Links";
                      }
                    })()}
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

export default ActiveListingsPage;
