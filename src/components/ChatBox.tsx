import React from "react";
import { FaFileAlt, FaVideo, FaLink, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../App.css";

interface ChatBoxProps {
  messages: any[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  const renderMessageContent = (message: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return message.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  const parseDate = (dateString: string) => {
    // Split the date into day, month, and year
    const [day, month, year] = dateString.split("/").map(Number);

    // Construct the date object
    return new Date(year, month - 1, day); // Month is 0-indexed
  };

  const formatDate = (dateString: string) => {
    const date = parseDate(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    }

    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const groupedMessages = messages.reduce((acc: any, message) => {
    const dateLabel = formatDate(message.conversation_time || message.date);
    if (!acc[dateLabel]) acc[dateLabel] = [];
    acc[dateLabel].push(message);
    return acc;
  }, {});

  return (
    <div className="flex-grow overflow-y-auto hide-scrollbar p-4">
      {Object.entries(groupedMessages).map(([date, msgs]: any) => (
        <div key={date} className="mb-6">
          {/* Date Header */}
          <div className="text-center text-gray-600 text-sm font-semibold mb-3">
            {date}
          </div>
          {msgs.map((msg: any, index: number) => (
            <div
              key={index}
              className={`flex ${msg.was_me ? "justify-end" : "justify-start"} mb-4`}
            >
              <div
                className={`p-4 rounded-lg max-w-lg shadow-sm ${
                  msg.was_me ? "bg-slate-200 text-black" : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="space-y-3">
                  {/* Title Section */}
                  {msg.submission && (
                    <div className="bg-blue-100 p-2 rounded-md">
                      <h3 className="text-base font-bold text-blue-800 text-center">
                        Assignment Submission
                      </h3>
                    </div>
                  )}

                  {/* Content Section */}
                  <div>
                    <p className="text-sm break-words mb-2">
                      {renderMessageContent(msg.message)}
                    </p>
                    {msg.submission && (
                      <div>
                        {msg.submission.attachments?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                              Attachments:
                            </p>
                            {msg.submission.attachments.map(
                              (attachment: any, idx: number) => (
                                <a
                                  key={idx}
                                  href={attachment.attachment_url || attachment.attachment_path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-2 text-blue-500 hover:underline text-sm mt-1"
                                >
                                  {attachment.attachment_filename ? (
                                    attachment.attachment_filename.endsWith(".mp4") ? (
                                      <>
                                        <FaVideo />{" "}
                                        <span>{attachment.attachment_filename}</span>
                                      </>
                                    ) : (
                                      <>
                                        <FaFileAlt />{" "}
                                        <span>{attachment.attachment_filename}</span>
                                      </>
                                    )
                                  ) : (
                                    <>
                                      <FaLink /> <span>Attachment</span>
                                    </>
                                  )}
                                </a>
                              )
                            )}
                          </div>
                        )}
                        <p
                          className={`flex items-center text-sm font-medium mt-3 ${
                            msg.submission.is_submitted_after_due_date
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {msg.submission.is_submitted_after_due_date ? (
                            <>
                              <FaTimesCircle className="mr-2" />
                              Submitted Late
                            </>
                          ) : (
                            <>
                              <FaCheckCircle className="mr-2" />
                              Submitted On Time
                            </>
                          )}
                        </p>
                        {typeof msg.submission.is_evaluated === "number" && (
                          <p
                            className={`flex items-center text-sm font-medium mt-1 ${
                              msg.submission.is_evaluated
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}
                          >
                            {msg.submission.is_evaluated ? (
                              <>
                                <FaCheckCircle className="mr-2" />
                                Evaluated
                              </>
                            ) : (
                              <>
                                <FaTimesCircle className="mr-2" />
                                Not Evaluated
                              </>
                            )}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Time at Bottom Right */}
                <p className="text-xs text-gray-500 mt-2 text-right">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
