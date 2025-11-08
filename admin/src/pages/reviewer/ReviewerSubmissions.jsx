import React, { useState } from "react";
import {
   Eye,
   Search,
   Filter,
   Download,
   X,
   FileText,
   User,
   Mail,
   Building,
   Tag,
   AlignLeft,
   Calendar,
   MessageSquare,
   Send,
} from "lucide-react";

export default function ReviewerSubmissions() {
   const [submissions] = useState([
      {
         _id: "1",
         title: "Machine Learning Applications in Healthcare",
         user: {
            name: "Dr. Alice Johnson",
            email: "alice@university.edu",
            affiliation: "Stanford University",
         },
         status: "Under Review",
         createdAt: "2024-10-15",
         description:
            "This paper explores the applications of machine learning in healthcare diagnostics.",
         keywords: ["Machine Learning", "Healthcare", "AI"],
         attachment: "#",
         feedback: null,
      },
      {
         _id: "2",
         title: "Quantum Computing Fundamentals",
         user: {
            name: "Prof. Bob Smith",
            email: "bob@university.edu",
            affiliation: "MIT",
         },
         status: "Accepted",
         createdAt: "2024-10-10",
         description: "A comprehensive review of quantum computing principles.",
         keywords: ["Quantum", "Computing", "Physics"],
         attachment: "#",
         feedback: { text: "Excellent work!" },
      },
      {
         _id: "3",
         title: "Climate Change Impact Analysis",
         user: {
            name: "Dr. Carol Davis",
            email: "carol@university.edu",
            affiliation: "Oxford University",
         },
         status: "Revision Requested",
         createdAt: "2024-10-08",
         description: "Analysis of climate change impacts on global economies.",
         keywords: ["Climate", "Environment", "Economics"],
         attachment: "#",
         feedback: null,
      },
   ]);

   const [filteredSubmissions, setFilteredSubmissions] = useState(submissions);
   const [searchTerm, setSearchTerm] = useState("");
   const [statusFilter, setStatusFilter] = useState("All");
   const [selectedSubmission, setSelectedSubmission] = useState(null);
   const [showDetailsModal, setShowDetailsModal] = useState(false);
   const [showReviewModal, setShowReviewModal] = useState(false);
   const [feedbackText, setFeedbackText] = useState("");
   const [decision, setDecision] = useState("Under Review");
   const [rating, setRating] = useState("");

   const filterSubmissions = () => {
      let filtered = submissions;

      if (statusFilter !== "All") {
         filtered = filtered.filter((sub) => sub.status === statusFilter);
      }

      if (searchTerm) {
         filtered = filtered.filter(
            (sub) =>
               sub.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               sub.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
         );
      }

      setFilteredSubmissions(filtered);
   };

   React.useEffect(() => {
      filterSubmissions();
   }, [searchTerm, statusFilter]);

   const handleViewDetails = (submission) => {
      setSelectedSubmission(submission);
      setShowDetailsModal(true);
   };

   const openReviewModal = (submission) => {
      setSelectedSubmission(submission);
      setFeedbackText(submission.feedback?.text || "");
      setDecision(submission.status || "Under Review");
      setRating("");
      setShowReviewModal(true);
   };

   const handleSubmitReview = () => {
      if (!feedbackText.trim()) {
         alert("Please provide feedback");
         return;
      }
      setShowReviewModal(false);
      setFeedbackText("");
      setDecision("Under Review");
      setRating("");
   };

   const getStatusStyles = (status) => {
      const styles = {
         Accepted: "bg-green-100 text-green-800",
         Rejected: "bg-red-100 text-red-800",
         "Under Review": "bg-blue-100 text-blue-800",
         "Revision Requested": "bg-orange-100 text-orange-800",
      };
      return styles[status] || "bg-yellow-100 text-yellow-800";
   };

   return (
      <div className="min-h-screen bg-gray-50 p-6 -m-8">
         <div className="max-w-7xl mx-auto">
            {/* Header - Consistent with other pages */}
            <div className="mb-8">
               <h1 className="text-4xl font-bold text-gray-800">
                  Assigned Submissions
               </h1>
               <p className="text-gray-600 mt-2">
                  Review and provide feedback on assigned manuscripts
               </p>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Search Input */}
                  <div className="relative">
                     <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                     <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                  </div>

                  {/* Status Filter */}
                  <div className="relative">
                     <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                     <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                     >
                        <option value="All">All Status</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Revision Requested">
                           Revision Requested
                        </option>
                     </select>
                  </div>
               </div>
            </div>

            {/* Submissions Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Title
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Author
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Status
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Date Assigned
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Actions
                           </th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSubmissions.length > 0 ? (
                           filteredSubmissions.map((submission) => (
                              <tr
                                 key={submission._id}
                                 className="hover:bg-gray-50 transition-colors"
                              >
                                 <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                       {submission.title || "Untitled"}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">
                                       {submission.user?.name || "N/A"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                       {submission.user?.email}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span
                                       className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusStyles(
                                          submission.status
                                       )}`}
                                    >
                                       {submission.status}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(
                                       submission.createdAt
                                    ).toLocaleDateString()}
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                       <button
                                          onClick={() =>
                                             handleViewDetails(submission)
                                          }
                                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                          title="View Details"
                                       >
                                          <Eye className="w-5 h-5" />
                                       </button>
                                       <button
                                          onClick={() =>
                                             openReviewModal(submission)
                                          }
                                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                          title="Submit Review"
                                       >
                                          <MessageSquare className="w-5 h-5" />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td
                                 colSpan="5"
                                 className="px-6 py-12 text-center text-gray-500"
                              >
                                 No submissions found
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Details Modal */}
         {showDetailsModal && selectedSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                     <h2 className="text-2xl font-bold text-gray-800">
                        Submission Details
                     </h2>
                     <button
                        onClick={() => setShowDetailsModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                     >
                        <X size={24} />
                     </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 space-y-6">
                     {/* Status and Date */}
                     <div className="flex items-center justify-between">
                        <span
                           className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyles(
                              selectedSubmission.status
                           )}`}
                        >
                           {selectedSubmission.status}
                        </span>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                           <Calendar size={16} />
                           {new Date(
                              selectedSubmission.createdAt
                           ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                           })}
                        </div>
                     </div>

                     {/* Title */}
                     <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900">
                           {selectedSubmission.title || "Untitled"}
                        </h3>
                     </div>

                     {/* Author Info Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                           <div className="flex items-center gap-2 mb-2">
                              <User className="text-blue-600" size={18} />
                              <p className="text-xs text-gray-500 font-semibold uppercase">
                                 Author Name
                              </p>
                           </div>
                           <p className="text-gray-900 font-semibold">
                              {selectedSubmission.user?.name || "N/A"}
                           </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                           <div className="flex items-center gap-2 mb-2">
                              <Mail className="text-blue-600" size={18} />
                              <p className="text-xs text-gray-500 font-semibold uppercase">
                                 Author Email
                              </p>
                           </div>
                           <p className="text-gray-900 font-semibold break-all">
                              {selectedSubmission.user?.email || "N/A"}
                           </p>
                        </div>

                        {selectedSubmission.user?.affiliation && (
                           <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors md:col-span-2">
                              <div className="flex items-center gap-2 mb-2">
                                 <Building
                                    className="text-blue-600"
                                    size={18}
                                 />
                                 <p className="text-xs text-gray-500 font-semibold uppercase">
                                    Affiliation
                                 </p>
                              </div>
                              <p className="text-gray-900 font-semibold">
                                 {selectedSubmission.user?.affiliation}
                              </p>
                           </div>
                        )}
                     </div>

                     {/* Description */}
                     {selectedSubmission.description && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                           <div className="flex items-center gap-2 mb-3">
                              <AlignLeft className="text-blue-600" size={18} />
                              <p className="text-xs text-gray-500 font-semibold uppercase">
                                 Description
                              </p>
                           </div>
                           <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                              {selectedSubmission.description}
                           </p>
                        </div>
                     )}

                     {/* Keywords */}
                     {selectedSubmission.keywords &&
                        selectedSubmission.keywords.length > 0 && (
                           <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                              <div className="flex items-center gap-2 mb-3">
                                 <Tag className="text-blue-600" size={18} />
                                 <p className="text-xs text-gray-500 font-semibold uppercase">
                                    Keywords
                                 </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                 {selectedSubmission.keywords.map(
                                    (keyword, idx) => (
                                       <span
                                          key={idx}
                                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium"
                                       >
                                          {keyword}
                                       </span>
                                    )
                                 )}
                              </div>
                           </div>
                        )}

                     {/* Attachment */}
                     {selectedSubmission.attachment && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <FileText
                                    className="text-blue-600"
                                    size={20}
                                 />
                                 <div>
                                    <p className="text-xs text-gray-500 font-semibold mb-1">
                                       ATTACHMENT
                                    </p>
                                    <p className="text-gray-900 font-semibold text-sm">
                                       Paper Submission
                                    </p>
                                 </div>
                              </div>
                              <a
                                 href={selectedSubmission.attachment}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                              >
                                 <Download size={18} />
                                 Download
                              </a>
                           </div>
                        </div>
                     )}

                     {/* Existing Feedback */}
                     {selectedSubmission.feedback && (
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 hover:border-blue-300 transition-colors">
                           <div className="flex items-center gap-2 mb-3">
                              <MessageSquare
                                 className="text-blue-600"
                                 size={18}
                              />
                              <p className="text-xs text-blue-600 font-semibold uppercase">
                                 Your Feedback
                              </p>
                           </div>
                           <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                              {selectedSubmission.feedback.text ||
                                 selectedSubmission.feedback}
                           </p>
                        </div>
                     )}
                  </div>

                  {/* Modal Footer */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
                     <button
                        onClick={() => {
                           setShowDetailsModal(false);
                           openReviewModal(selectedSubmission);
                        }}
                        className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                     >
                        <MessageSquare size={18} />
                        Submit Review
                     </button>
                     <button
                        onClick={() => setShowDetailsModal(false)}
                        className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                     >
                        Close
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Review Modal */}
         {showReviewModal && selectedSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                     <h2 className="text-2xl font-bold text-gray-800">
                        Submit Review
                     </h2>
                     <button
                        onClick={() => {
                           setShowReviewModal(false);
                           setFeedbackText("");
                           setDecision("Under Review");
                           setRating("");
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                     >
                        <X size={24} />
                     </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 space-y-6">
                     {/* Submission Title */}
                     <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                           Submission Title
                        </label>
                        <p className="text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-200 font-medium">
                           {selectedSubmission.title}
                        </p>
                     </div>

                     {/* Decision Dropdown */}
                     <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                           Decision <span className="text-red-500">*</span>
                        </label>
                        <select
                           value={decision}
                           onChange={(e) => setDecision(e.target.value)}
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                        >
                           <option value="Under Review">Under Review</option>
                           <option value="Accepted">Accept</option>
                           <option value="Rejected">Reject</option>
                           <option value="Revision Requested">
                              Request Revision
                           </option>
                        </select>
                     </div>

                     {/* Rating Dropdown */}
                     <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                           Rating{" "}
                           <span className="text-gray-400">(Optional)</span>
                        </label>
                        <select
                           value={rating}
                           onChange={(e) => setRating(e.target.value)}
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                        >
                           <option value="">-- Select Rating --</option>
                           <option value="1">1 - Poor</option>
                           <option value="2">2 - Fair</option>
                           <option value="3">3 - Good</option>
                           <option value="4">4 - Very Good</option>
                           <option value="5">5 - Excellent</option>
                        </select>
                     </div>

                     {/* Feedback Textarea */}
                     <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                           Feedback <span className="text-red-500">*</span>
                        </label>
                        <textarea
                           value={feedbackText}
                           onChange={(e) => setFeedbackText(e.target.value)}
                           placeholder="Provide detailed feedback for the author..."
                           rows={10}
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-medium"
                        />
                     </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
                     <button
                        onClick={() => {
                           setShowReviewModal(false);
                           setFeedbackText("");
                           setDecision("Under Review");
                           setRating("");
                        }}
                        className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={handleSubmitReview}
                        disabled={!feedbackText.trim()}
                        className="px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2"
                     >
                        <Send size={18} />
                        Submit Review
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
