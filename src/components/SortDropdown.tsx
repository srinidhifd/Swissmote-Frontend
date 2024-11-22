const SortDropdown = ({ onSort }: { onSort: (sortBy: string) => void }) => {
    return (
      <div className="mb-10">
        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
        <select
          onChange={(e) => onSort(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="date_asc">Date (Ascending)</option>
          <option value="date_desc">Date (Descending)</option>
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
        </select>
      </div>
    );
  };
  
  export default SortDropdown;
  