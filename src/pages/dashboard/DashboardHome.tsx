const DashboardHome = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to the Dashboard</h1>
      <p className="text-gray-600 mt-4">
        Navigate through the dashboard to manage job listings, view messages, and fetch candidate information.
      </p>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-lg font-bold text-gray-700">Job Listings</h2>
          <p className="text-sm text-gray-600 mt-2">
            Manage all active and closed job listings.
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-lg font-bold text-gray-700">Messages</h2>
          <p className="text-sm text-gray-600 mt-2">
            Access and manage system messages.
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-lg font-bold text-gray-700">Candidate Emails</h2>
          <p className="text-sm text-gray-600 mt-2">
            Retrieve candidate email details quickly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
