import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";
import dayjs from "dayjs";

const AutoListingsPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const authToken = import.meta.env.VITE_AUTH_TOKEN;

  const [empType, setEmpType] = useState("internship");
  const [account, setAccount] = useState("pv");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("automated");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [process, setProcess] = useState("assignment");

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await fetch(
        `${apiUrl}/get_auto_listings?emp_type=${empType}&account=${account}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch listings. Please try again.");
      }

      const fetchedData = await response.json();
      setData(fetchedData);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutomate = async (listing: any) => {
    const payload = {
      listing: listing.listing_number,
      listing_name: listing.listing_name,
      name: "Project Name",
      process,
      post_over: "normal",
      assignment_link: "www.example.com",
      designation: "intern",
      active_status: true,
      emp_type: empType,
      ctc: "10,000",
      account,
    };

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/automateListing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Automation failed. Please try again.");
      }

      const result = await response.json();
      toast.success(`Successfully automated listing ${result.Listing_num}`);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const renderTableRows = (listings: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = listings.slice(startIndex, startIndex + itemsPerPage);

    return paginatedData.map((item: any, index: number) => (
      <tr
        key={index}
        className="hover:bg-gray-100 transition border-b border-gray-300"
      >
        <td className="px-4 py-2">{item.listing_name}</td>
        <td className="px-4 py-2">{item.listing_number}</td>
        {activeTab !== "not_automated" && (
          <>
            <td className="px-4 py-2">{item.projectname || "N/A"}</td>
            <td className="px-4 py-2">{dayjs(item.date).format("D MMMM YYYY")}</td>
            <td className="px-4 py-2">{item.conversion_rate || "N/A"}</td>
            <td className="px-4 py-2 max-w-[150px] truncate text-blue-600">
              {item.assignment_link ? (
                item.assignment_link.map((link: string, idx: number) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm hover:underline"
                  >
                    {link.length > 20 ? `${link.substring(0, 20)}...` : link}
                  </a>
                ))
              ) : (
                "N/A"
              )}
            </td>
          </>
        )}
        <td className="px-4 py-2 text-center">
          {activeTab === "automated" && (
            <div className="flex gap-2 justify-center">
              <button className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">
                Get Assignment
              </button>
              <button className="px-3 py-1 bg-blue-500 text-sm text-white rounded hover:bg-blue-600">
                Post Assignment
              </button>
            </div>
          )}
          {activeTab === "not_automated" && (
            <div className="flex gap-2 items-center">
              <select
                className="border p-2 rounded"
                value={process}
                onChange={(e) => setProcess(e.target.value)}
              >
                <option value="assignment">Assignment</option>
                <option value="offer">Offer</option>
              </select>
              <button
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => handleAutomate(item)}
              >
                Automate
              </button>
            </div>
          )}
        </td>
      </tr>
    ));
  };

  const renderTable = () => {
    if (loading) return <p className="text-gray-500">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    if (activeTab === "automated" && data?.automated) {
      return (
        <div>
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Listing Name</th>
                <th className="px-4 py-2 text-left">Listing Number</th>
                <th className="px-4 py-2 text-left">Project Name</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Conversion Rate</th>
                <th className="px-4 py-2 text-left">Assignment Links</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>{renderTableRows(data.automated)}</tbody>
          </table>
          {renderPagination(data.automated.length)}
        </div>
      );
    }

    if (activeTab === "not_automated" && data?.not_automated) {
      return (
        <div>
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Listing Name</th>
                <th className="px-4 py-2 text-left">Listing Number</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>{renderTableRows(data.not_automated)}</tbody>
          </table>
          {renderPagination(data.not_automated.length)}
        </div>
      );
    }

    if (activeTab === "closed_automated" && data?.cl_automated) {
      return (
        <div>
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Listing Number</th>
                <th className="px-4 py-2 text-left">Project Name</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2">{data.cl_automated.listing_number}</td>
                <td className="px-4 py-2">{data.cl_automated.projectname}</td>
                <td className="px-4 py-2">
                  {dayjs(data.cl_automated.date).format("D MMMM YYYY")}
                </td>
                <td className="px-4 py-2">{data.cl_automated.conversion_rate}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    return <p className="text-gray-500">No data available.</p>;
  };

  const renderPagination = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-600">
          Showing {currentPage} of {totalPages} pages
        </p>
        <div className="flex items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-3 py-1 ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } rounded`}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-500"
              } rounded`}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-3 py-1 ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } rounded`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <TailSpin height="80" width="80" color="#4fa94d" ariaLabel="loading" />
        </div>
      )}

      <ToastContainer />

      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Manage Listings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Employment Type</label>
            <select
              value={empType}
              onChange={(e) => setEmpType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
            >
              <option value="internship">Internship</option>
              <option value="job">Job</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Account</label>
            <select
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
            >
              <option value="pv">PV</option>
              <option value="sa">SA</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchListings}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded"
            >
              Fetch Listings
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("automated")}
            className={`px-4 py-2 rounded ${
              activeTab === "automated" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Automated Listings
          </button>
          <button
            onClick={() => setActiveTab("not_automated")}
            className={`px-4 py-2 rounded ${
              activeTab === "not_automated" ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            Not Automated Listings
          </button>
          <button
            onClick={() => setActiveTab("closed_automated")}
            className={`px-4 py-2 rounded ${
              activeTab === "closed_automated" ? "bg-red-600 text-white" : "bg-gray-200"
            }`}
          >
            Closed Listings
          </button>
        </div>

        {renderTable()}
      </div>
    </div>
  );
};

export default AutoListingsPage;
