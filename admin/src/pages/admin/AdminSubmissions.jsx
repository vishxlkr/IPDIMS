import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
// import * as pdfjs from "pdfjs-dist"; // Not needed if using CDN for worker
import {
   Eye,
   Info,
   Trash2,
   Filter,
   Search,
   Download,
   UserPlus,
   X,
   FileText,
   User,
   Mail,
   Building,
   Tag,
   AlignLeft,
   Calendar,
   Clock,
   CheckCircle,
   XCircle,
   AlertCircle,
   FileEdit,
   UserCheck,
   MessageSquare,
   Bell,
} from "lucide-react";
import { AdminContext } from "../../context/AdminContext";

// Use hardcoded version to avoid import issues
const pdfjsVersion = "3.11.174";
const pdfjsWorker = `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`;

const AdminSubmissions = () => {
   const [submissions, setSubmissions] = useState([]);
   const [filteredSubmissions, setFilteredSubmissions] = useState([]);
   const [reviewers, setReviewers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [statusFilter, setStatusFilter] = useState("All");
   const [selectedSubmission, setSelectedSubmission] = useState(null);
   const [showDetailsModal, setShowDetailsModal] = useState(false);
   const defaultLayoutPluginInstance = defaultLayoutPlugin();
   const [showAssignModal, setShowAssignModal] = useState(false);
   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
   const [selectedReviewers, setSelectedReviewers] = useState([]);
   const [feedbacks, setFeedbacks] = useState([]);
   const [newFeedbackFlags, setNewFeedbackFlags] = useState({});
   const [tempStatus, setTempStatus] = useState("");

   // const backendUrl = "http://localhost:4000";
   const { backendUrl } = useContext(AdminContext);
   const atoken = localStorage.getItem("aToken");

   useEffect(() => {
      fetchSubmissions();
      fetchReviewers();
   }, []);

   useEffect(() => {
      filterSubmissions();
   }, [searchTerm, statusFilter, submissions]);

   const fetchSubmissions = async () => {
      try {
         setLoading(true);
         const { data } = await axios.get(
            `${backendUrl}/api/admin/submissions`,
            {
               headers: { atoken },
            },
         );

         if (data.success) {
            // Ensure client uses order from backend (which is sorted by priority)
            // Or explicitly sort client-side just to be safe
            const sortedSubmissions = (data.submissions || []).sort((a, b) => {
               // specific true > false check
               if (a.needsAdminAction === b.needsAdminAction) {
                  return new Date(b.updatedAt) - new Date(a.updatedAt);
               }
               return a.needsAdminAction ? -1 : 1;
            });
            setSubmissions(sortedSubmissions);
            // Force re-filtering to display correct order immediately
            setFilteredSubmissions(sortedSubmissions);

            // Track which submissions have new feedback
            const feedbackMap = {};
            (data.submissions || []).forEach((sub) => {
               feedbackMap[sub._id] = sub.hasNewFeedback || false;
            });
            setNewFeedbackFlags(feedbackMap);
         } else {
            toast.error(data.message || "Failed to fetch submissions");
         }
      } catch (error) {
         console.error("Error fetching submissions:", error);
         toast.error(
            error.response?.data?.message || "Error fetching submissions",
         );
      } finally {
         setLoading(false);
      }
   };

   const fetchReviewers = async () => {
      try {
         const { data } = await axios.get(
            `${backendUrl}/api/admin/all-reviewer`,
            {
               headers: { atoken },
            },
         );

         if (data.success) {
            setReviewers(data.reviewers || []);
         }
      } catch (error) {
         console.error("Error fetching reviewers:", error);
      }
   };

   const filterSubmissions = () => {
      let filtered = submissions;

      if (statusFilter !== "All") {
         filtered = filtered.filter((sub) => sub.status === statusFilter);
      }

      if (searchTerm) {
         filtered = filtered.filter(
            (sub) =>
               sub.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               sub.author?.name
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
               sub.author?.email
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()),
         );
      }

      setFilteredSubmissions(filtered);
   };

   const getStatistics = () => {
      return {
         pending: submissions.filter((s) => s.status === "Pending").length,
         underReview: submissions.filter((s) => s.status === "Under Review")
            .length,
         accepted: submissions.filter((s) => s.status === "Accepted").length,
         rejected: submissions.filter((s) => s.status === "Rejected").length,
         revisionRequested: submissions.filter(
            (s) => s.status === "Revision Requested",
         ).length,
         unassigned: submissions.filter(
            (s) => !s.reviewers || s.reviewers.length === 0,
         ).length,
      };
   };

   const stats = getStatistics();

   const handleViewDetails = async (submissionId) => {
      try {
         const { data } = await axios.get(
            `${backendUrl}/api/admin/submission/${submissionId}`,
            {
               headers: { atoken },
            },
         );

         if (data.success) {
            setSelectedSubmission(data.submission);
            setShowDetailsModal(true);
         }
      } catch (error) {
         console.error("Error fetching submission details:", error);
         toast.error("Failed to load submission details");
      }
   };

   const handleViewFeedback = async (submissionId) => {
      try {
         const { data } = await axios.get(
            `${backendUrl}/api/admin/submission/${submissionId}`,
            { headers: { atoken } },
         );

         console.log("Feedback data received:", data);

         if (data.success) {
            // Sort feedbacks newest first
            const sortedFeedbacks = (data.submission.feedback || []).sort(
               (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            );

            setFeedbacks(sortedFeedbacks);
            setSelectedSubmission(data.submission);
            setTempStatus(data.submission.status);
            setShowFeedbackModal(true);
            setShowDetailsModal(false); // Ensure details modal is closed

            // Remove green dot once opened
            setNewFeedbackFlags((prev) => ({ ...prev, [submissionId]: false }));

            // Optional: Mark as seen on backend
            // Commenting out to isolate potential error source if any
            /*
            try {
               await axios.put(
                  `${backendUrl}/api/admin/mark-feedback-seen/${submissionId}`,
                  {},
                  { headers: { atoken } },
               );
            } catch (err) {
               console.log("Could not mark feedback as seen:", err);
            }
            */
         } else {
            toast.error(data.message || "Failed to fetch submission data");
         }
      } catch (error) {
         console.error("Error fetching feedback:", error);
         toast.error("Failed to load feedbacks");
      }
   };

   const handleNotifyAuthor = async (feedbackId) => {
      if (!selectedSubmission) return;

      try {
         const { data } = await axios.post(
            `${backendUrl}/api/admin/notify-author`,
            {
               submissionId: selectedSubmission._id,
               feedbackId: feedbackId,
            },
            { headers: { atoken } },
         );

         if (data.success) {
            toast.success("Author notified successfully!");
         } else {
            toast.error(data.message || "Failed to notify author");
         }
      } catch (error) {
         console.error("Error notifying author:", error);
         toast.error(
            error.response?.data?.message || "Failed to notify author",
         );
      }
   };

   const handleDownload = async (url, filename) => {
      try {
         const response = await fetch(url);
         const blob = await response.blob();
         const blobUrl = window.URL.createObjectURL(
            new Blob([blob], { type: "application/pdf" }),
         );

         const link = document.createElement("a");
         link.href = blobUrl;
         link.download = filename.endsWith(".pdf")
            ? filename
            : `${filename}.pdf`;
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
         console.error("Download failed:", error);
         toast.error("Failed to download file");
      }
   };

   const openAssignModal = (submission) => {
      setSelectedSubmission(submission);
      // Map existing reviewers to their IDs
      const currentReviewerIds =
         submission.reviewers?.map((r) => r._id || r) || [];
      setSelectedReviewers(currentReviewerIds);
      setShowAssignModal(true);
   };

   const handleAssignReviewer = async () => {
      if (!selectedSubmission) {
         toast.error("No submission selected");
         return;
      }
      // Note: allow empty array to unassign

      try {
         const { data } = await axios.post(
            `${backendUrl}/api/admin/assign-submission`,
            {
               submissionId: selectedSubmission._id,
               reviewerIds: selectedReviewers,
            },
            { headers: { atoken } },
         );

         if (data.success) {
            toast.success("Reviewers assigned successfully!");
            setShowAssignModal(false);
            setSelectedReviewers([]);
            fetchSubmissions();
         } else {
            toast.error(data.message || "Failed to assign reviewers");
         }
      } catch (error) {
         console.error("Error assigning reviewers:", error);
         toast.error(
            error.response?.data?.message || "Failed to assign reviewers",
         );
      }
   };

   const toggleReviewerSelection = (reviewerId) => {
      setSelectedReviewers((prev) => {
         if (prev.includes(reviewerId)) {
            return prev.filter((id) => id !== reviewerId);
         } else {
            return [...prev, reviewerId];
         }
      });
   };

   const handleChangeStatus = async (submissionId, newStatus) => {
      try {
         const { data } = await axios.post(
            `${backendUrl}/api/admin/change-submission-status`,
            {
               submissionId,
               status: newStatus,
            },
            { headers: { atoken } },
         );

         if (data.success) {
            toast.success("Status updated successfully!");
            fetchSubmissions();
            if (selectedSubmission && selectedSubmission._id === submissionId) {
               setSelectedSubmission({
                  ...selectedSubmission,
                  status: newStatus,
               });
            }
         } else {
            toast.error(data.message || "Failed to update status");
         }
      } catch (error) {
         console.error("Error updating status:", error);
         toast.error(
            error.response?.data?.message || "Failed to update status",
         );
      }
   };

   const handleDeleteSubmission = async (submissionId) => {
      if (!window.confirm("Are you sure you want to delete this submission?"))
         return;

      try {
         const { data } = await axios.delete(
            `${backendUrl}/api/admin/submission/${submissionId}`,
            {
               headers: { atoken },
            },
         );

         if (data.success) {
            toast.success("Submission deleted successfully!");
            fetchSubmissions();
         } else {
            toast.error(data.message || "Failed to delete submission");
         }
      } catch (error) {
         console.error("Error deleting submission:", error);
         toast.error(
            error.response?.data?.message || "Failed to delete submission",
         );
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50 p-6 -m-8">
         <div className="max-w-7xl mx-auto">
            <div className="mb-8">
               <h1 className="text-4xl font-bold text-gray-800">Submissions</h1>
               <p className="text-gray-600 mt-2">
                  Manage and track all manuscript submissions
               </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
               <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">
                           Pending
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                           {stats.pending}
                        </p>
                     </div>
                     <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">
                           Under Review
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                           {stats.underReview}
                        </p>
                     </div>
                     <FileEdit className="w-8 h-8 text-blue-500" />
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">
                           Accepted
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                           {stats.accepted}
                        </p>
                     </div>
                     <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">
                           Rejected
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                           {stats.rejected}
                        </p>
                     </div>
                     <XCircle className="w-8 h-8 text-red-500" />
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">
                           Revision Req
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                           {stats.revisionRequested}
                        </p>
                     </div>
                     <AlertCircle className="w-8 h-8 text-orange-500" />
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">
                           Unassigned
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                           {stats.unassigned}
                        </p>
                     </div>
                     <UserCheck className="w-8 h-8 text-purple-500" />
                  </div>
               </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                     <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                     <input
                        type="text"
                        placeholder="Search by title, author, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                  </div>

                  <div className="relative">
                     <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                     <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-10 pr-0 py-2.5 border text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
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
                              Paper id
                           </th>
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
                              Reviewer
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Actions
                           </th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSubmissions.length > 0 ? (
                           filteredSubmissions.map((submission, index) => {
                              // const paperNumber = ... (unused if using paperId)
                              return (
                                 <tr
                                    key={submission._id}
                                    className="hover:bg-gray-50 transition-colors"
                                 >
                                    <td className="px-6 py-4">
                                       <div className="text-sm font-bold text-gray-700">
                                          {submission.paperId ?? "-"}
                                       </div>
                                    </td>
                                    <td className="px-6 py-4">
                                       <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                          {submission.title || "Untitled"}
                                       </div>
                                    </td>
                                    <td className="px-6 py-4">
                                       <div className="text-sm text-gray-900">
                                          {submission.author?.name || "N/A"}
                                       </div>
                                       <div className="text-xs text-gray-500">
                                          {submission.author?.email}
                                       </div>
                                    </td>
                                    <td className="px-6 py-4">
                                       <span
                                          className={`px-3 py-1.5 text-xs font-semibold rounded-full border-0 ${
                                             submission.status === "Accepted"
                                                ? "bg-green-100 text-green-800"
                                                : submission.status ===
                                                    "Rejected"
                                                  ? "bg-red-100 text-red-800"
                                                  : submission.status ===
                                                      "Under Review"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : submission.status ===
                                                        "Revision Requested"
                                                      ? "bg-orange-100 text-orange-800"
                                                      : "bg-yellow-100 text-yellow-800"
                                          }`}
                                       >
                                          {submission.status}
                                       </span>
                                    </td>
                                    <td className="px-6 py-4">
                                       <div className="flex items-center gap-2">
                                          {/* Square box for number of reviewers */}
                                          <div
                                             className={`w-10 h-10 flex items-center justify-center rounded-lg shadow-sm border ${
                                                submission.reviewers &&
                                                submission.reviewers.length > 0
                                                   ? "bg-blue-100 border-blue-200 text-blue-700"
                                                   : "bg-red-50 border-red-200 text-red-500 animate-pulse"
                                             }`}
                                             title={`${submission.reviewers?.length || 0} Reviewers Assigned`}
                                          >
                                             <span className="text-lg font-bold">
                                                {submission.reviewers?.length ||
                                                   0}
                                             </span>
                                          </div>

                                          {/* Square box for Add/Manage button */}
                                          <button
                                             onClick={() =>
                                                openAssignModal(submission)
                                             }
                                             className={`w-10 h-10 flex items-center justify-center rounded-lg shadow-sm border transition-all ${
                                                submission.reviewers &&
                                                submission.reviewers.length > 0
                                                   ? "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                                                   : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 shadow-blue-200"
                                             }`}
                                             title={
                                                submission.reviewers &&
                                                submission.reviewers.length > 0
                                                   ? "Manage Reviewers"
                                                   : "Add Reviewers"
                                             }
                                          >
                                             <UserPlus size={18} />
                                          </button>
                                       </div>
                                    </td>

                                    <td className="px-6 py-4">
                                       <div className="flex items-center gap-2">
                                          <button
                                             onClick={() =>
                                                handleViewDetails(
                                                   submission._id,
                                                )
                                             }
                                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                             title="View Details"
                                          >
                                             <FileText className="w-5 h-5" />
                                          </button>
                                          <button
                                             onClick={() =>
                                                handleViewFeedback(
                                                   submission._id,
                                                )
                                             }
                                             className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative"
                                             title="View Feedback"
                                          >
                                             <MessageSquare className="w-5 h-5" />
                                             {newFeedbackFlags[
                                                submission._id
                                             ] && (
                                                <span className="absolute top-1 right-1 block w-2 h-2 bg-green-500 rounded-full"></span>
                                             )}
                                          </button>
                                          <button
                                             onClick={() =>
                                                handleDeleteSubmission(
                                                   submission._id,
                                                )
                                             }
                                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                             title="Delete"
                                          >
                                             <Trash2 className="w-5 h-5" />
                                          </button>
                                       </div>
                                    </td>
                                 </tr>
                              );
                           })
                        ) : (
                           <tr>
                              <td
                                 colSpan="6"
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
               <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto no-scrollbar">
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

                  <div className="p-6 space-y-6">
                     <div className="flex items-center justify-between">
                        <span
                           className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              selectedSubmission.status === "Accepted"
                                 ? "bg-green-100 text-green-800"
                                 : selectedSubmission.status === "Rejected"
                                   ? "bg-red-100 text-red-800"
                                   : selectedSubmission.status ===
                                       "Under Review"
                                     ? "bg-blue-100 text-blue-800"
                                     : selectedSubmission.status ===
                                         "Revision Requested"
                                       ? "bg-orange-100 text-orange-800"
                                       : "bg-yellow-100 text-yellow-800"
                           }`}
                        >
                           {selectedSubmission.status}
                        </span>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                           <Calendar size={16} />
                           {new Date(
                              selectedSubmission.createdAt,
                           ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                           })}
                        </div>
                     </div>

                     <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                           {selectedSubmission.title || "Untitled"}
                        </h3>
                        {selectedSubmission.eventName && (
                           <p className="text-sm text-gray-600">
                              Event: {selectedSubmission.eventName}
                           </p>
                        )}
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <div className="flex items-center gap-2 mb-2">
                              <User className="text-blue-600" size={18} />
                              <p className="text-xs text-gray-500 font-semibold">
                                 AUTHOR NAME
                              </p>
                           </div>
                           <p className="text-gray-900 font-medium">
                              {selectedSubmission.author?.name ||
                                 selectedSubmission.authorName ||
                                 "N/A"}
                           </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <div className="flex items-center gap-2 mb-2">
                              <Mail className="text-blue-600" size={18} />
                              <p className="text-xs text-gray-500 font-semibold">
                                 AUTHOR EMAIL
                              </p>
                           </div>
                           <p className="text-gray-900 font-medium break-all">
                              {selectedSubmission.author?.email ||
                                 selectedSubmission.authorEmail ||
                                 "N/A"}
                           </p>
                        </div>

                        {(selectedSubmission.author?.organization ||
                           selectedSubmission.authorAffiliation) && (
                           <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 md:col-span-2">
                              <div className="flex items-center gap-2 mb-2">
                                 <Building
                                    className="text-blue-600"
                                    size={18}
                                 />
                                 <p className="text-xs text-gray-500 font-semibold">
                                    AFFILIATION
                                 </p>
                              </div>
                              <p className="text-gray-900 font-medium">
                                 {selectedSubmission.author?.organization ||
                                    selectedSubmission.authorAffiliation}
                              </p>
                           </div>
                        )}
                     </div>

                     {selectedSubmission.description && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <div className="flex items-center gap-2 mb-3">
                              <AlignLeft className="text-blue-600" size={18} />
                              <p className="text-xs text-gray-500 font-semibold">
                                 DESCRIPTION
                              </p>
                           </div>
                           <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                              {selectedSubmission.description}
                           </p>
                        </div>
                     )}

                     {selectedSubmission.keywords &&
                        selectedSubmission.keywords.length > 0 && (
                           <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-3">
                                 <Tag className="text-blue-600" size={18} />
                                 <p className="text-xs text-gray-500 font-semibold">
                                    KEYWORDS
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
                                    ),
                                 )}
                              </div>
                           </div>
                        )}

                     {selectedSubmission.attachment && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <div className="flex flex-col gap-4">
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
                                       <p className="text-gray-900 font-medium text-sm">
                                          Paper Submission
                                       </p>
                                    </div>
                                 </div>
                                 <button
                                    onClick={() =>
                                       handleDownload(
                                          selectedSubmission.attachment
                                             .downloadUrl,
                                          selectedSubmission.title ||
                                             "submission",
                                       )
                                    }
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                                 >
                                    <Download size={18} />
                                    Download
                                 </button>
                              </div>
                              {/* {selectedSubmission.attachment.viewUrl && (
                                 <iframe
                                    src={selectedSubmission.attachment.viewUrl}
                                    className="w-full h-96 rounded border border-gray-300 bg-white"
                                    title="PDF Preview"
                                 ></iframe>
                              )} */}
                           </div>
                        </div>
                     )}

                     {selectedSubmission.reviewer && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <div className="flex items-center gap-2 mb-2">
                              <User className="text-purple-600" size={18} />
                              <p className="text-xs text-gray-500 font-semibold">
                                 ASSIGNED REVIEWERS
                              </p>
                           </div>
                           <div className="space-y-2">
                              {selectedSubmission.reviewers &&
                              selectedSubmission.reviewers.length > 0 ? (
                                 selectedSubmission.reviewers.map((rev) => (
                                    <div
                                       key={rev._id}
                                       className="flex justify-between items-center bg-white p-2 rounded border"
                                    >
                                       <div>
                                          <p className="text-gray-900 font-medium text-sm">
                                             {rev.name}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                             {rev.email}
                                          </p>
                                       </div>
                                    </div>
                                 ))
                              ) : (
                                 <p className="text-sm italic text-gray-500">
                                    No reviewers assigned yet.
                                 </p>
                              )}
                           </div>
                        </div>
                     )}
                  </div>

                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
                     {/* <button
                        onClick={() => {
                           setShowDetailsModal(false);
                           openAssignModal(selectedSubmission);
                        }}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
                     >
                        <UserPlus size={18} />
                        Manage Reviewers
                     </button> */}
                     <button
                        onClick={() => setShowDetailsModal(false)}
                        className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-all"
                     >
                        Close
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Feedback Modal */}
         {showFeedbackModal && selectedSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col h-screen w-screen overflow-hidden">
               {/* Header */}
               <div className="bg-white border-b px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
                  <div className="flex items-center gap-4">
                     <h2 className="text-xl font-bold text-gray-800">
                        {selectedSubmission.title}
                     </h2>
                     <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                           selectedSubmission.status === "Accepted"
                              ? "bg-green-100 text-green-800"
                              : selectedSubmission.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : selectedSubmission.status === "Under Review"
                                  ? "bg-blue-100 text-blue-800"
                                  : selectedSubmission.status ===
                                      "Revision Requested"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-yellow-100 text-yellow-800"
                        }`}
                     >
                        {selectedSubmission.status}
                     </span>
                  </div>
                  <button
                     onClick={() => {
                        setShowFeedbackModal(false);
                        setFeedbacks([]);
                     }}
                     className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                  >
                     <X size={24} />
                  </button>
               </div>

               {/* Content - Split Screen */}
               <div className="flex-1 flex overflow-hidden">
                  {/* Left Side - PDF Viewer */}
                  <div className="w-1/2 bg-gray-100 relative border-r border-gray-200 ">
                     {selectedSubmission.attachment?.viewUrl ? (
                        <div className="h-full w-full">
                           <Worker workerUrl={pdfjsWorker}>
                              <Viewer
                                 fileUrl={selectedSubmission.attachment.viewUrl}
                                 plugins={[defaultLayoutPluginInstance]}
                              />
                           </Worker>
                        </div>
                     ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                           <div className="text-center">
                              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                              <p>No PDF available for preview</p>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Right Side - Feedback List & Actions */}
                  <div className="w-1/2 flex flex-col bg-white">
                     <div className="p-4 border-b bg-gray-50">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2">
                           <MessageSquare className="w-5 h-5 text-blue-600" />
                           Reviewer Feedback
                        </h3>
                     </div>

                     <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {feedbacks.length > 0 ? (
                           feedbacks.map((feedback, index) => (
                              <div
                                 key={feedback._id || index}
                                 className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-colors shadow-sm"
                              >
                                 <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                       <div className="bg-linear-to-br from-blue-500 to-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm shadow-sm">
                                          {feedback.reviewer?.name?.charAt(0) ||
                                             "R"}
                                       </div>
                                       <div>
                                          <p className="font-semibold text-gray-900 text-sm">
                                             {feedback.reviewer?.name ||
                                                "Reviewer"}
                                          </p>
                                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                             <Calendar size={10} />
                                             {new Date(
                                                feedback.createdAt,
                                             ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                             })}
                                          </p>
                                       </div>
                                    </div>

                                    {/* Recommendations Badge */}
                                    {feedback.recommendation && (
                                       <span
                                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                             feedback.recommendation ===
                                             "Accepted"
                                                ? "bg-green-100 text-green-700 border border-green-200"
                                                : feedback.recommendation ===
                                                    "Rejected"
                                                  ? "bg-red-100 text-red-700 border border-red-200"
                                                  : "bg-orange-100 text-orange-700 border border-orange-200"
                                          }`}
                                       >
                                          {feedback.recommendation}
                                       </span>
                                    )}
                                 </div>

                                 <div className="bg-white rounded-lg p-4 border border-gray-200 text-sm text-gray-700 leading-relaxed space-y-4">
                                    {/* Scores Display */}
                                    {feedback.scores && (
                                       <div className="grid grid-cols-1 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                                          <h4 className="font-bold text-xs text-gray-500 uppercase">
                                             Scores (1-5)
                                          </h4>
                                          <div className="text-xs space-y-1">
                                             <div className="flex justify-between">
                                                <span>Engineering Sig.:</span>
                                                <span className="font-bold">
                                                   {
                                                      feedback.scores
                                                         .engineeringSignificance
                                                   }
                                                   /5
                                                </span>
                                             </div>
                                             <div className="flex justify-between">
                                                <span>Scientific Sig.:</span>
                                                <span className="font-bold">
                                                   {
                                                      feedback.scores
                                                         .scientificSignificance
                                                   }
                                                   /5
                                                </span>
                                             </div>
                                             <div className="flex justify-between">
                                                <span>Completeness:</span>
                                                <span className="font-bold">
                                                   {
                                                      feedback.scores
                                                         .completeness
                                                   }
                                                   /5
                                                </span>
                                             </div>
                                             <div className="flex justify-between">
                                                <span>Acknowledgement:</span>
                                                <span className="font-bold">
                                                   {
                                                      feedback.scores
                                                         .acknowledgement
                                                   }
                                                   /5
                                                </span>
                                             </div>
                                             <div className="flex justify-between">
                                                <span>Presentation:</span>
                                                <span className="font-bold">
                                                   {
                                                      feedback.scores
                                                         .presentation
                                                   }
                                                   /5
                                                </span>
                                             </div>
                                          </div>
                                       </div>
                                    )}

                                    {/* Best Paper */}
                                    {feedback.bestPaperNomination && (
                                       <div className="flex items-center gap-2 text-xs">
                                          <span className="font-bold text-gray-600">
                                             Best Paper Nominated:
                                          </span>
                                          <span
                                             className={`px-2 py-0.5 rounded ${
                                                feedback.bestPaperNomination ===
                                                "Yes"
                                                   ? "bg-purple-100 text-purple-700"
                                                   : "bg-gray-100 text-gray-500"
                                             }`}
                                          >
                                             {feedback.bestPaperNomination}
                                          </span>
                                       </div>
                                    )}

                                    {/* Comments to Author */}
                                    <div>
                                       <h4 className="font-bold text-xs text-gray-500 uppercase mb-1">
                                          Comments to Author
                                       </h4>
                                       <p className="whitespace-pre-wrap">
                                          {feedback.comment ||
                                             "No comments provided."}
                                       </p>
                                    </div>

                                    {/* Confidential Comments */}
                                    {feedback.confidentialComments && (
                                       <div className="bg-yellow-50 p-3 rounded border border-yellow-100">
                                          <h4 className="font-bold text-xs text-yellow-700 uppercase mb-1 flex items-center gap-1">
                                             <Eye size={12} /> Confidential to
                                             Editor
                                          </h4>
                                          <p className="text-yellow-900 whitespace-pre-wrap">
                                             {feedback.confidentialComments}
                                          </p>
                                       </div>
                                    )}
                                 </div>

                                 <div className="mt-3 flex justify-end">
                                    <button
                                       onClick={() =>
                                          handleNotifyAuthor(feedback._id)
                                       }
                                       className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition-colors"
                                    >
                                       <Bell size={14} />
                                       Notify Author
                                    </button>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                              <div className="bg-gray-50 p-4 rounded-full mb-4">
                                 <MessageSquare className="w-8 h-8 opacity-50" />
                              </div>
                              <p className="font-medium">
                                 No feedback received yet
                              </p>
                              <p className="text-sm mt-1">
                                 Once reviewers submit feedback, it will appear
                                 here.
                              </p>
                           </div>
                        )}
                     </div>

                     {/* Status Change Footer */}
                     <div className="p-6 border-t bg-gray-50 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-8">
                           <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                 Current Status
                              </label>
                              <div className="font-medium text-gray-900">
                                 {selectedSubmission.status}
                              </div>
                           </div>

                           <div className="flex items-center gap-2 px-17">
                              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                 Change Status:
                              </label>
                              <select
                                 value={tempStatus}
                                 onChange={(e) => setTempStatus(e.target.value)}
                                 className="pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                              >
                                 <option value="Pending">Pending</option>
                                 <option value="Under Review">
                                    Under Review
                                 </option>
                                 <option value="Accepted">Accepted</option>
                                 <option value="Rejected">Rejected</option>
                                 <option value="Revision Requested">
                                    Revision Requested
                                 </option>
                              </select>
                           </div>
                        </div>

                        <button
                           onClick={() =>
                              handleChangeStatus(
                                 selectedSubmission._id,
                                 tempStatus,
                              )
                           }
                           disabled={tempStatus === selectedSubmission.status}
                           className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all mr-10 shadow-md ${
                              tempStatus === selectedSubmission.status
                                 ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                                 : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg text-white"
                           }`}
                        >
                           Save Changes
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Assign Reviewer Modal */}
         {showAssignModal && selectedSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col">
                  {/* Header */}
                  <div className="border-b border-gray-200 p-6 flex items-center justify-between">
                     <h2 className="text-xl font-bold text-gray-800">
                        Assign Reviewers
                     </h2>
                     <button
                        onClick={() => {
                           setShowAssignModal(false);
                           setSelectedReviewers([]);
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                     >
                        <X size={24} />
                     </button>
                  </div>

                  {/* Body - Scrollable */}
                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                     <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                           Select Reviewers ({selectedReviewers.length}{" "}
                           selected)
                        </label>
                        <div className="grid grid-cols-1 gap-2 border border-gray-200 rounded-lg p-2 max-h-64 overflow-y-auto">
                           {reviewers
                              .filter((r) => r.isActive)
                              .map((reviewer) => {
                                 const isSelected = selectedReviewers.includes(
                                    reviewer._id,
                                 );
                                 return (
                                    <div
                                       key={reviewer._id}
                                       onClick={() =>
                                          toggleReviewerSelection(reviewer._id)
                                       }
                                       className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                          isSelected
                                             ? "bg-blue-50 border-blue-500 shadow-sm"
                                             : "bg-white border-gray-200 hover:bg-gray-50"
                                       }`}
                                    >
                                       <div
                                          className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                                             isSelected
                                                ? "bg-blue-600 border-blue-600"
                                                : "bg-white border-gray-400"
                                          }`}
                                       >
                                          {isSelected && (
                                             <CheckCircle
                                                size={14}
                                                className="text-white"
                                             />
                                          )}
                                       </div>
                                       <div>
                                          <p className="text-sm font-medium text-gray-900">
                                             {reviewer.name}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                             {reviewer.email}
                                          </p>
                                       </div>
                                    </div>
                                 );
                              })}
                           {reviewers.length === 0 && (
                              <p className="text-center text-sm text-gray-500 py-4">
                                 No active reviewers found.
                              </p>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 p-6 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                     <button
                        onClick={() => {
                           setShowAssignModal(false);
                           setSelectedReviewers([]);
                        }}
                        className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={handleAssignReviewer}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-sm"
                     >
                        <UserPlus size={18} />
                        Save Assignments
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default AdminSubmissions;
