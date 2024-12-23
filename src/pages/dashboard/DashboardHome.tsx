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
import { Bar } from "react-chartjs-2";
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

interface FollowupStats {
  day2: {
    sent: number;
    pending: number;
  };
  day4: {
    sent: number;
    pending: number;
  };
  reviews: {
    added: number;
    pending: number;
  };
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
  const [followupStats, setFollowupStats] = useState<FollowupStats>({
    day2: { sent: 0, pending: 0 },
    day4: { sent: 0, pending: 0 },
    reviews: { added: 0, pending: 0 }
  });

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

        // Calculate follow-up and review statistics
        const day2Stats = { sent: 0, pending: 0 };
        const day4Stats = { sent: 0, pending: 0 };
        const reviewStats = { added: 0, pending: 0 };

        autoData.automated?.forEach((listing: any) => {
          if (listing.day2followup?.status === 1) {
            day2Stats.sent++;
          } else {
            day2Stats.pending++;
          }

          if (listing.day4followup?.status === 1) {
            day4Stats.sent++;
          } else {
            day4Stats.pending++;
          }

          if (listing.review_link && listing.review_link.length > 0) {
            reviewStats.added++;
          } else {
            reviewStats.pending++;
          }
        });

        setFollowupStats({
          day2: day2Stats,
          day4: day4Stats,
          reviews: reviewStats
        });

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
  const reviewChartData = {
    labels: ['Reviews Added', 'Reviews Pending'],
    datasets: [
      {
        label: 'Review Links',
        data: [
          followupStats.reviews.added,
          followupStats.reviews.pending
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',  // Added - Green
          'rgba(255, 99, 132, 0.6)',   // Pending - Red
        ],
      },
    ],
  };

  const getConversionRateStats = (listings: any[]) => {
    const stats = {
      '0-25': 0,
      '26-50': 0,
      '51-75': 0,
      '76-100': 0
    };

    listings.forEach(listing => {
      const rate = parseFloat(listing.conversion_rate?.replace('%', '') || '0');
      if (rate <= 25) stats['0-25']++;
      else if (rate <= 50) stats['26-50']++;
      else if (rate <= 75) stats['51-75']++;
      else stats['76-100']++;
    });

    return stats;
  };

  const conversionRateData = {
    labels: ['0-25%', '26-50%', '51-75%', '76-100%'],
    datasets: [
      {
        label: 'Number of Listings',
        data: Object.values(getConversionRateStats(automatedListings)),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',   // Red for lowest
          'rgba(255, 206, 86, 0.6)',   // Yellow for low-mid
          'rgba(54, 162, 235, 0.6)',   // Blue for high-mid
          'rgba(75, 192, 192, 0.6)',   // Green for highest
        ],
      },
    ],
  };

  const followupChartData = {
    labels: ['Day 2 Sent', 'Day 2 Pending', 'Day 4 Sent', 'Day 4 Pending'],
    datasets: [
      {
        label: 'Follow-ups',
        data: [
          followupStats.day2.sent,
          followupStats.day2.pending,
          followupStats.day4.sent,
          followupStats.day4.pending
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',  // Day 2 Sent - Green
          'rgba(255, 206, 86, 0.6)',  // Day 2 Pending - Yellow
          'rgba(54, 162, 235, 0.6)',  // Day 4 Sent - Blue
          'rgba(255, 99, 132, 0.6)',  // Day 4 Pending - Red
        ],
      },
    ],
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
        {/* Follow-up Status Chart */}
        <div className="md:col-span-4 bg-white shadow-subtle rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Follow-up Status</h2>
          <div className="h-[300px] flex items-center justify-center">
            <Bar
              data={followupChartData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const value = context.raw as number;
                        return `Count: ${value}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Listings'
                    }
                  }
                }
              }}
            />
          </div>

          {/* Add a summary below the chart */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="p-2 bg-gray-50 rounded">
              <p className="font-medium">Day 2 Follow-ups</p>
              <p className="text-green-600">Sent: {followupStats.day2.sent}</p>
              <p className="text-yellow-600">Pending: {followupStats.day2.pending}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <p className="font-medium">Day 4 Follow-ups</p>
              <p className="text-blue-600">Sent: {followupStats.day4.sent}</p>
              <p className="text-red-600">Pending: {followupStats.day4.pending}</p>
            </div>
          </div>
        </div>




        {/* Conversion Rate Distribution */}
        <div className="md:col-span-4 bg-white shadow-subtle rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Conversion Rate Distribution</h2>
          <div className="h-[300px] flex items-center justify-center">
            <Bar
              data={conversionRateData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const value = context.raw as number;
                        return `${value} Listings`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Listings'
                    }
                  }
                }
              }}
            />
          </div>

          {/* Add a summary below the chart */}
          <div className="mt-4 p-2 bg-gray-50 rounded">
            <p className="font-medium">Distribution Summary</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <p className="text-red-600">0-25%: {getConversionRateStats(automatedListings)['0-25']} listings</p>
              <p className="text-yellow-600">26-50%: {getConversionRateStats(automatedListings)['26-50']} listings</p>
              <p className="text-blue-600">51-75%: {getConversionRateStats(automatedListings)['51-75']} listings</p>
              <p className="text-green-600">76-100%: {getConversionRateStats(automatedListings)['76-100']} listings</p>
            </div>
          </div>
        </div>


        {/* Review Links Status Chart */}
        <div className="md:col-span-4 bg-white shadow-subtle rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Review Links Status</h2>
          <div className="h-[300px] flex items-center justify-center">
            <Bar
              data={reviewChartData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const value = context.raw as number;
                        return `Count: ${value}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Listings'
                    }
                  }
                }
              }}
            />
          </div>

          {/* Add a summary below the chart */}
          <div className="mt-4 p-2 bg-gray-50 rounded">
            <p className="font-medium">Review Links</p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <p className="text-green-600">Added: {followupStats.reviews.added}</p>
              <p className="text-red-600">Pending: {followupStats.reviews.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
