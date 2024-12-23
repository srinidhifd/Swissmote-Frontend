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
import { Bar, Pie} from "react-chartjs-2";
import {
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

  const [listingsLoading, setListingsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic: State variables for API data
  const [automatedListings, setAutomatedListings] = useState<Listing[]>([]);
  const [notAutomatedListings, setNotAutomatedListings] = useState<Listing[]>([]);
  const [expiredListings, setExpiredListings] = useState<Listing[]>([]);
  const [activeListings, setActiveListings] = useState<Listing[]>([]);
  const [closedListings, setClosedListings] = useState<Listing[]>([]);

  // Default parameters
  const empType = "job";
  const account = "pv";

  // Fetch Data (Dynamic: Fetches data from API)
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setListingsLoading(true);

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
        setListingsLoading(false);
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

  const automationRateData = {
    labels: ["Automated", "Not Automated"],
    datasets: [{
      label: "Automation Rate",
      data: [automatedCount, notAutomatedCount],
      backgroundColor: [
        "rgba(75, 192, 192, 0.6)",
        "rgba(255, 206, 86, 0.6)",
      ],
    }],
  };

  // First, let's update the chart options for better presentation
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // This helps with consistent sizing
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false,
      },
    },
  };

  if (listingsLoading) {
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        {/* Active vs Closed Chart */}
        <div className="md:col-span-4 bg-white shadow-subtle rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Active vs Closed</h2>
          <div className="h-[300px] flex items-center justify-center">
            <Bar 
              data={barChartData} 
              options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: false
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Listings Breakdown Chart */}
        <div className="md:col-span-4 bg-white shadow-subtle rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Listings Breakdown</h2>
          <div className="h-[300px] flex items-center justify-center">
            <Pie 
              data={pieChartData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      usePointStyle: true,
                      font: {
                        size: 12
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Automation Status Chart */}
        <div className="md:col-span-4 bg-white shadow-subtle rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Automation Status</h2>
          <div className="h-[300px] flex items-center justify-center">
            <Bar 
              data={automationRateData} 
              options={{
                ...chartOptions,
                indexAxis: 'y',
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    display: false
                  }
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    grid: {
                      display: false
                    }
                  },
                  y: {
                    grid: {
                      display: false
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Additional Insights Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-subtle rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">Automation Rate</h2>
          <div className="text-3xl font-bold text-green-600">
            {((automatedCount / totalJobs) * 100).toFixed(1)}%
          </div>
          <p className="text-gray-600">of total listings automated</p>
        </div>
        <div className="bg-white shadow-subtle rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">Active vs Closed</h2>
          <div className="text-3xl font-bold text-blue-600">
            {activeCount} / {closedCount}
          </div>
          <p className="text-gray-600">current active to closed ratio</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
