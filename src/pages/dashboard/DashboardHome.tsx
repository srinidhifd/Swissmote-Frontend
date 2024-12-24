import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { setDashboardData } from "../../store/slices/dashboardSlice";
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
import { FaCheck } from "react-icons/fa";
import { HiOutlineBriefcase, HiOutlineClock } from "react-icons/hi";
import { MdOutlineErrorOutline } from "react-icons/md";
import { TailSpin } from "react-loader-spinner";

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

const DashboardHome = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const authToken = import.meta.env.VITE_AUTH_TOKEN;

  const dispatch = useDispatch<AppDispatch>();

  const {
    automatedListings,
    notAutomatedListings,
    expiredListings,
    activeListings,
    closedListings,
    followupStats,
    isFetched,
  } = useSelector((state: RootState) => state.dashboard);

  const [loading, setLoading] = useState(!isFetched);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const autoResponse = await fetch(
        `${apiUrl}/get_auto_listings?emp_type=job&account=pv`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!autoResponse.ok) throw new Error("Failed to fetch automated listings.");
      const autoData = await autoResponse.json();

      const activeResponse = await fetch(`${apiUrl}/active_listing`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!activeResponse.ok) throw new Error("Failed to fetch active listings.");
      const activeData = await activeResponse.json();

      const closedResponse = await fetch(`${apiUrl}/closed_listings`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!closedResponse.ok) throw new Error("Failed to fetch closed listings.");
      const closedData = await closedResponse.json();

      // Calculate follow-up stats
      const day2Stats = { sent: 0, pending: 0 };
      const day4Stats = { sent: 0, pending: 0 };
      const reviewStats = { added: 0, pending: 0 };

      autoData.automated?.forEach((listing: any) => {
        if (listing.day2followup?.status === 1) day2Stats.sent++;
        else day2Stats.pending++;

        if (listing.day4followup?.status === 1) day4Stats.sent++;
        else day4Stats.pending++;

        if (listing.review_link?.length > 0) reviewStats.added++;
        else reviewStats.pending++;
      });

      dispatch(
        setDashboardData({
          automatedListings: autoData.automated || [],
          notAutomatedListings: autoData.not_automated || [],
          expiredListings: autoData.cl_automated ? [autoData.cl_automated] : [],
          activeListings: activeData,
          closedListings: closedData,
          followupStats: {
            day2: day2Stats,
            day4: day4Stats,
            reviews: reviewStats,
          },
          isFetched: true,
        })
      );
    } catch (err: any) {
      setError(err.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isFetched) fetchDashboardData();
  }, [isFetched]);

  // Calculate totals
  const totalJobs = automatedListings.length + notAutomatedListings.length + expiredListings.length;
  const automatedCount = automatedListings.length;
  const notAutomatedCount = notAutomatedListings.length;
  const expiredCount = expiredListings.length;
  const activeCount = activeListings.length;
  const closedCount = closedListings.length;

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // Chart data
  const followupChartData = {
    labels: ['Day 2 Sent', 'Day 2 Pending', 'Day 4 Sent', 'Day 4 Pending'],
    datasets: [{
      data: [
        followupStats?.day2?.sent || 0,
        followupStats?.day2?.pending || 0,
        followupStats?.day4?.sent || 0,
        followupStats?.day4?.pending || 0
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 99, 132, 0.6)',
      ],
    }],
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
    datasets: [{
      data: Object.values(getConversionRateStats(automatedListings)),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(75, 192, 192, 0.6)',
      ],
    }],
  };

  const reviewChartData = {
    labels: ['Reviews Added', 'Reviews Pending'],
    datasets: [{
      data: [
        followupStats?.reviews?.added || 0,
        followupStats?.reviews?.pending || 0
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)',
      ],
    }],
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
