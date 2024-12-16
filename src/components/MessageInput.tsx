import React from "react";
import { FaPaperclip, FaPaperPlane } from "react-icons/fa"; // Icons for modern UI

interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  onFileSelect: (file: File) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  onFileSelect,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center space-x-4 bg-white border-t border-gray-300 p-4">
      <textarea
        value={value}
        onChange={onChange}
        placeholder="Type your message..."
        className="flex-grow p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer text-gray-500 hover:text-blue-500 flex items-center"
      >
        <FaPaperclip size={20} />
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      <button
        onClick={onSend}
        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 flex items-center justify-center"
        title="Send Message"
      >
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default MessageInput;
