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
  FaBriefcase,
  FaClipboardList,
  FaTasks,
  FaUserTie,
  FaClock,
} from "react-icons/fa";

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
  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Jobs Posted",
        data: [12, 19, 14, 20, 25, 18],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const pieChartData = {
    labels: ["Automated", "Not Automated", "Closed"],
    datasets: [
      {
        label: "Listings",
        data: [60, 30, 10],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
      },
    ],
  };

  const lineChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Messages Sent",
        data: [50, 75, 60, 90, 80, 120, 100],
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Dashboard Overview</h1>

      {/* KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-4">
          <div className="bg-blue-500 text-white p-4 rounded-full">
            <FaBriefcase className="text-3xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">120</h2>
            <p className="text-gray-600">Total Jobs</p>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-4">
          <div className="bg-yellow-500 text-white p-4 rounded-full">
            <FaClipboardList className="text-3xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">85</h2>
            <p className="text-gray-600">Active Listings</p>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-4">
          <div className="bg-red-500 text-white p-4 rounded-full">
            <FaTasks className="text-3xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">45</h2>
            <p className="text-gray-600">Assignments</p>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-4">
          <div className="bg-indigo-500 text-white p-4 rounded-full">
            <FaUserTie className="text-3xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">250</h2>
            <p className="text-gray-600">Candidates</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow-lg rounded-lg p-4 max-w-[100%]">
          <div className="flex flex-col justify-center">
          <h2 className="text-xl font-bold mb-2">Jobs Posted Over Time</h2>
          <Bar data={barChartData} options={options} />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4 max-w-[100%]">
          
          <h2 className="text-xl font-bold mb-2">Listings Breakdown</h2>
          <Pie data={pieChartData} options={options} />
        </div>

        <div className="col-span-2 bg-white shadow-lg rounded-lg p-4 max-w-[100%]">
          <h2 className="text-xl font-bold mb-2">Messages Sent This Week</h2>
          <Line data={lineChartData} options={options} />
        </div>
      </div>

      {/* Additional Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-4 flex items-center">
          <div className="bg-gray-300 text-gray-800 p-4 rounded-full">
            <FaClock className="text-3xl" />
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold">15d</h2>
            <p className="text-gray-600">Avg. Time to Hire</p>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">Candidate Feedback</h2>
          <p className="text-gray-600">"Rapid process, very welcoming at every stage."</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
