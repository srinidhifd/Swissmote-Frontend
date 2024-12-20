import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  FaClock,
  FaCheck,
} from "react-icons/fa";
import { TailSpin } from "react-loader-spinner";
import { HiOutlineBriefcase, HiOutlineClock } from "react-icons/hi";
import { MdOutlineErrorOutline } from "react-icons/md";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Listing {
  listing_number: string;
  [key: string]: any;
}

const DashboardHome = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL; // Dynamic: Base API URL from environment variables
  const authToken = import.meta.env.VITE_AUTH_TOKEN; // Dynamic: Auth token from environment variables

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic: State variables for API data
  const [automatedListings, setAutomatedListings] = useState<Listing[]>([]);
  const [notAutomatedListings, setNotAutomatedListings] = useState<Listing[]>([]);
  const [expiredListings, setExpiredListings] = useState<Listing[]>([]);
  const [activeListings, setActiveListings] = useState<Listing[]>([]);
  const [closedListings, setClosedListings] = useState<Listing[]>([]);

  // Mock Data
  const avgTimeToHire = "15d"; // Mock Data: Average time to hire
  const candidateFeedback = `"Rapid process, very welcoming at every stage."`; // Mock Data: Feedback

  // Default parameters
  const empType = "job";
  const account = "pv";

  // Fetch Data (Dynamic: Fetches data from API)
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);

        // Fetch Automated, Not Automated, and Expired Listings
        const autoResponse = await fetch(
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

        if (!autoResponse.ok) {
          throw new Error("Failed to fetch automated listings.");
        }

        const autoData = await autoResponse.json();
        setAutomatedListings(autoData.automated || []);
        setNotAutomatedListings(autoData.not_automated || []);
        setExpiredListings(autoData.cl_automated ? [autoData.cl_automated] : []);

        // Fetch Active Listings
        const activeResponse = await fetch(`${apiUrl}/active_listing`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!activeResponse.ok) {
          throw new Error("Failed to fetch active listings.");
        }

        const activeData = await activeResponse.json();
        setActiveListings(activeData);

        // Fetch Closed Listings
        const closedResponse = await fetch(`${apiUrl}/closed_listings`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!closedResponse.ok) {
          throw new Error("Failed to fetch closed listings.");
        }

        const closedData = await closedResponse.json();
        setClosedListings(closedData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [apiUrl, authToken]);

  // Totals Calculation (Dynamic: Calculated based on fetched data)
  const totalJobs =
    automatedListings.length +
    notAutomatedListings.length +
    expiredListings.length;
  const automatedCount = automatedListings.length;
  const notAutomatedCount = notAutomatedListings.length;
  const expiredCount = expiredListings.length;
  const activeCount = activeListings.length;
  const closedCount = closedListings.length;

  // Chart Data (Dynamic: Fetched data or calculated based on state)
  const barChartData = {
    labels: ["Active", "Closed"],
    datasets: [
      {
        label: "Listings",
        data: [activeCount, closedCount], // Dynamic
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(153, 102, 255, 0.6)"],
      },
    ],
  };

  const pieChartData = {
    labels: ["Automated", "Not Automated", "Expired"],
    datasets: [
      {
        label: "Listings",
        data: [automatedCount, notAutomatedCount, expiredCount], // Dynamic
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
      },
    ],
  };

  const lineChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // Mock Data
    datasets: [
      {
        label: "Messages Sent",
        data: [50, 75, 60, 90, 80, 120, 100], // Mock Data
        borderColor: "rgba(255, 99, 132, 0.6)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <TailSpin height="80" width="80" color="#4caf50" ariaLabel="loading" />
      </div>
    );
  }

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Swissmote Dashboard</h1>
      {/* KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-subtle rounded-lg p-4 flex items-center space-x-4">
          <div className="bg-blue-500 text-white p-4 rounded-full">
            <HiOutlineBriefcase className="text-3xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">{totalJobs}</h2>
            <p className="text-gray-600">Total Jobs</p>
          </div>
        </div>
        <div className="bg-white shadow-subtle rounded-lg p-4 flex items-center space-x-4">
          <div className="bg-green-500 text-white p-4 rounded-full">
            <FaCheck className="text-3xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">{automatedCount}</h2>
            <p className="text-gray-600">Automated Listings</p>
          </div>
        </div>
        <div className="bg-white shadow-subtle rounded-lg p-4 flex items-center space-x-4">
          <div className="bg-yellow-500 text-white p-4 rounded-full">
            <HiOutlineClock className="text-3xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">{notAutomatedCount}</h2>
            <p className="text-gray-600">Not Automated Listings</p>
          </div>
        </div>
        <div className="bg-white shadow-subtle rounded-lg p-4 flex items-center space-x-4">
          <div className="bg-red-500 text-white p-4 rounded-full">
            <MdOutlineErrorOutline className="text-3xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">{expiredCount}</h2>
            <p className="text-gray-600">Expired Listings</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow-subtle rounded-lg p-4 max-w-[100%]">
          <h2 className="text-xl font-bold mb-2">Active vs Closed</h2>
          <Bar data={barChartData} options={options} />
        </div>
        <div className="bg-white shadow-subtle rounded-lg p-4 max-w-[100%]">
          <h2 className="text-xl font-bold mb-2">Listings Breakdown</h2>
          <Pie data={pieChartData} options={options} />
        </div>
        <div className="col-span-2 bg-white shadow-subtle rounded-lg p-4 max-w-[100%]">
          <h2 className="text-xl font-bold mb-2">Messages Sent This Week</h2>
          <Line data={lineChartData} options={options} />
        </div>
      </div>

      {/* Additional Insights Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Avg. Time to Hire */}
        <div className="bg-white shadow-subtle rounded-lg p-4 flex items-center">
          <div className="bg-gray-300 text-gray-800 p-4 rounded-full">
            <FaClock className="text-3xl" />
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold">{avgTimeToHire}</h2>
            <p className="text-gray-600">Avg. Time to Hire</p>
          </div>
        </div>
        {/* Candidate Feedback */}
        <div className="bg-white shadow-subtle rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">Candidate Feedback</h2>
          <p className="text-gray-600">{candidateFeedback}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
