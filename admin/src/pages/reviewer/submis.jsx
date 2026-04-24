import React, { useState, useEffect, useContext } from "react";
import Loading from "../../components/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import packageJson from "../../../package.json"; // To get pdfjs-dist version

const pdfjsVersion = "3.11.174"; // Hardcode stable version or use package.json logic

const ReviewerSubmissions = () => {
   const [submissions, setSubmissions] = useState([]);
   const [filteredSubmissions, setFilteredSubmissions] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [statusFilter, setStatusFilter] = useState("All");
   const [selectedSubmission, setSelectedSubmission] = useState(null);
   const [showDetailsModal, setShowDetailsModal] = useState(false);
   const [showReviewModal, setShowReviewModal] = useState(false);
   const [feedbackText, setFeedbackText] = useState("");
   const [decision, setDecision] = useState("Under Review");
   // const [rating, setRating] = useState(""); // Replaced by detailed scores
   const [feedbacks, setFeedbacks] = useState([]);

   // New State for Detailed Evaluation Form
   const [reviewScores, setReviewScores] = useState({
      q1: "", // Engineering significance
      q2: "", // Scientific significance
      q3: "", // Completeness
      q4: "", // Acknowledgement
      q5: "", // Quality
   });
   const [bestPaper, setBestPaper] = useState("");
   const [confidentialComments, setConfidentialComments] = useState("");
   const [authorComments, setAuthorComments] = useState("");

   // Create new plugin instance
   const defaultLayoutPluginInstance = defaultLayoutPlugin();

   // const backendUrl = "http://localhost:4000";
   const { backendUrl } = useContext(AdminContext);
   const rtoken = localStorage.getItem("rToken");

   useEffect(() => {
      fetchSubmissions();
   }, []);

   useEffect(() => {
      filterSubmissions();
   }, [searchTerm, statusFilter, submissions]);

   const fetchSubmissions = async () => {
      try {
         setLoading(true);
         const { data } = await axios.get(
            `${backendUrl}/api/reviewer/submissions`,
            {
               headers: { rtoken },
            },
         );

         if (data.success) {
            setSubmissions(data.submissions || []);
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

   const filterSubmissions = () => {
      let filtered = submissions;
      if (statusFilter !== "All") {
         filtered = filtered.filter((sub) => sub.status === statusFilter);
      }
      if (searchTerm) {
         filtered = filtered.filter(
            (sub) =>
               sub.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               sub.user?.name
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
               sub.author?.name
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()),
         );
      }
      setFilteredSubmissions(filtered);
   };

   const handleViewDetails = async (submissionId) => {
      try {
         const { data } = await axios.get(
            `${backendUrl}/api/reviewer/submissions/${submissionId}`,
            { headers: { rtoken } },
         );

         if (data.success) {
            const sortedFeedbacks = (data.submission.feedback || []).sort(
               (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            );
            setFeedbacks(sortedFeedbacks);
            setSelectedSubmission(data.submission);
            setShowDetailsModal(true);
         }
      } catch (error) {
         console.error("Error fetching submission details:", error);
         toast.error("Failed to load submission details");
      }
   };

   const openReviewModal = (submission) => {
      setSelectedSubmission(submission);
      setFeedbackText("");
      setDecision("Under Review");
      setRating("");
      setShowReviewModal(true);
   };

   const handleSubmitReview = async (customFeedback) => {
      // Allow passing constructed feedback string directly
      const finalFeedback =
         typeof customFeedback === "string" ? customFeedback : feedbackText;

      if (!finalFeedback.trim()) {
         toast.error("Please provide feedback");
         return;
      }

      try {
         const { data } = await axios.post(
            `${backendUrl}/api/reviewer/submissions/${selectedSubmission._id}/review`,
            {
               feedbackText: finalFeedback,
               rating: rating || null,
               decision,
            },
            { headers: { rtoken } },
         );

         if (data.success) {
            toast.success("Review submitted successfully!");
            setShowReviewModal(false);
            setFeedbackText("");
            setDecision("Under Review");
            setRating("");
            fetchSubmissions();
         } else {
            toast.error(data.message || "Failed to submit review");
         }
      } catch (error) {
         console.error("Error submitting review:", error);
         toast.error(
            error.response?.data?.message || "Failed to submit review",
         );
      }
   };

   if (loading) return <Loading />;

   return (
      <div className="min-h-screen bg-gray-50 p-6 -m-8">
         <div className="max-w-7xl mx-auto">
            <div className="mb-8">
               <h1 className="text-4xl font-bold text-gray-800">
                  Assigned Submissions
               </h1>
               <p className="text-gray-600 mt-2">
                  Review and provide feedback on assigned manuscripts
               </p>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                     <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                     <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-black pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                  </div>

                  <div className="relative">
                     <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                     <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full text-gray-800 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                     >
                        <option value="All">All Status</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Revision Required">
                           Revision Required
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
                              Paper ID
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
                                 <td className="px-6 py-4 font-semibold text-gray-700">
                                    {submission.paperId ?? "-"}
                                 </td>
                                 <td className="px-6 py-4 text-gray-700">
                                    {submission.title || "Untitled"}
                                 </td>
                                 <td className="px-6 py-4">
                                    <div>
                                       {submission.author?.name || "N/A"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                       {submission.author?.email}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span
                                       className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                                          submission.status === "Accepted"
                                             ? "bg-green-100 text-green-800"
                                             : submission.status === "Rejected"
                                               ? "bg-red-100 text-red-800"
                                               : submission.status ===
                                                   "Revision Required"
                                                 ? "bg-orange-100 text-orange-800"
                                                 : "bg-blue-100 text-blue-800"
                                       }`}
                                    >
                                       {submission.status}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                       <button
                                          onClick={() =>
                                             handleViewDetails(submission._id)
                                          }
                                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                       >
                                          <Eye className="w-5 h-5" />
                                       </button>
                                       <button
                                          onClick={() =>
                                             openReviewModal(submission)
                                          }
                                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
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
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
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
                     {/* Paper Details */}
                     <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-gray-900">
                           {selectedSubmission.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                           Paper ID: {selectedSubmission.paperId}
                        </p>
                        <p className="text-sm text-gray-600">
                           Event: {selectedSubmission.eventName}
                        </p>
                        <p className="text-sm text-gray-600">
                           Submitted on:{" "}
                           {new Date(
                              selectedSubmission.createdAt,
                           ).toLocaleString()}
                        </p>
                     </div>

                     {/* Author Details */}
                     <div className="bg-gray-50 p-4 rounded-xl border">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                           <User size={18} /> Author Information
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                           <p>
                              <span className="font-semibold">Name:</span>{" "}
                              {selectedSubmission.authorName}
                           </p>
                           <p>
                              <span className="font-semibold">Email:</span>{" "}
                              {selectedSubmission.authorEmail}
                           </p>
                           <p>
                              <span className="font-semibold">
                                 Affiliation:
                              </span>{" "}
                              {selectedSubmission.authorAffiliation ||
                                 "Not Provided"}
                           </p>
                        </div>
                     </div>

                     {/* Keywords */}
                     {selectedSubmission.keywords?.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-xl border">
                           <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              <Tag size={18} /> Keywords
                           </h4>
                           <div className="flex gap-2 flex-wrap mt-2">
                              {selectedSubmission.keywords.map((kw, idx) => (
                                 <span
                                    key={idx}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                 >
                                    {kw}
                                 </span>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* Abstract / Description */}
                     <div className="bg-white p-4 rounded-xl border">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                           <AlignLeft size={18} /> Description
                        </h4>
                        <p className="mt-2 text-gray-700 text-sm leading-relaxed">
                           {selectedSubmission.description}
                        </p>
                     </div>

                     {/* Manuscript Attachment */}
                     {selectedSubmission.attachment && (
                        <div className="bg-gray-50 p-4 rounded-xl border">
                           <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                              <FileText size={18} /> Manuscript File
                           </h4>

                           {/* Download Button Only - Iframe removed as requested */}
                           <a
                              href={selectedSubmission.attachment.downloadUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                           >
                              <Download size={16} /> Download PDF
                           </a>
                        </div>
                     )}

                     {/* Previous Reviewer Feedback */}
                     {feedbacks.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-xl border">
                           <h4 className="text-lg font-semibold text-gray-900">
                              Previous Feedback
                           </h4>
                           {feedbacks.map((fb, idx) => (
                              <div
                                 key={idx}
                                 className="bg-white p-3 rounded-lg border shadow-sm mb-2"
                              >
                                 <p className="text-sm text-gray-700">
                                    {fb.comment}
                                 </p>
                                 <p className="text-xs text-gray-500 mt-1">
                                    Recommendation:{" "}
                                    <strong>{fb.recommendation}</strong>
                                 </p>
                                 <p className="text-xs text-gray-400">
                                    {new Date(fb.createdAt).toLocaleString()}
                                 </p>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>

                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end">
                     <button
                        onClick={() => {
                           setShowDetailsModal(false);
                           openReviewModal(selectedSubmission);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                     >
                        <MessageSquare size={16} /> Submit Review
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Feedback Modal - Split View */}
         {showReviewModal && selectedSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] h-[90vh] flex flex-col overflow-hidden">
                  {/* Header */}
                  <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center flex-shrink-0">
                     <h2 className="text-xl font-bold text-gray-800 truncate pr-4">
                        Review Submission: {selectedSubmission.title}
                     </h2>
                     <button
                        onClick={() => {
                           setShowReviewModal(false);
                           setAuthorComments("");
                           setConfidentialComments("");
                           setDecision("Under Review");
                           setBestPaper("");
                           setReviewScores({
                              q1: "",
                              q2: "",
                              q3: "",
                              q4: "",
                              q5: "",
                           });
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                     >
                        <X size={24} />
                     </button>
                  </div>

                  {/* Content Body */}
                  <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                     {/* Left Side: PDF Viewer */}
                     <div className="w-full md:w-1/2 bg-gray-100 border-r border-gray-200 h-full">
                        {selectedSubmission.attachment?.downloadUrl ? (
                           <iframe
                              src={selectedSubmission.attachment.downloadUrl}
                              className="w-full h-full border-none"
                              title="Manuscript PDF"
                           ></iframe>
                        ) : (
                           <div className="flex items-center justify-center h-full text-gray-500">
                              No PDF available to view
                           </div>
                        )}
                     </div>

                     {/* Right Side: Evaluation Form */}
                     <div className="w-full md:w-1/2 bg-white overflow-y-auto p-6">
                        <div className="space-y-6">
                           <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                                 Evaluation Criteria
                              </h3>

                              {/* 5 Questions */}
                              <div className="space-y-4">
                                 {[
                                    {
                                       id: "q1",
                                       label: "1. Originality and Significance of the Work",
                                    },
                                    {
                                       id: "q2",
                                       label: "2. Technical Quality and Correctness",
                                    },
                                    {
                                       id: "q3",
                                       label: "3. Clarity of Presentation and Structure",
                                    },
                                    {
                                       id: "q4",
                                       label: "4. Relevance to the Conference Scope",
                                    },
                                    {
                                       id: "q5",
                                       label: "5. Sufficiency of References and Previous Work",
                                    },
                                 ].map((q) => (
                                    <div key={q.id}>
                                       <label className="block text-sm font-semibold text-gray-700 mb-1">
                                          {q.label}
                                       </label>
                                       <textarea
                                          value={reviewAnswers[q.id]}
                                          onChange={(e) =>
                                             setReviewAnswers({
                                                ...reviewAnswers,
                                                [q.id]: e.target.value,
                                             })
                                          }
                                          rows={2}
                                          placeholder="Enter specific comments..."
                                          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                       />
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                 Final Overall Feedback *
                              </label>
                              <textarea
                                 value={feedbackText}
                                 onChange={(e) =>
                                    setFeedbackText(e.target.value)
                                 }
                                 rows={4}
                                 placeholder="Summarize your recommendation..."
                                 className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-sm font-bold text-gray-900 mb-1">
                                    Overall Rating
                                 </label>
                                 <select
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                 >
                                    <option value="">Select Rating...</option>
                                    <option value="Strong Accept">
                                       Strong Accept
                                    </option>
                                    <option value="Accept">Accept</option>
                                    <option value="Weak Accept">
                                       Weak Accept
                                    </option>
                                    <option value="Borderline">
                                       Borderline
                                    </option>
                                    <option value="Weak Reject">
                                       Weak Reject
                                    </option>
                                    <option value="Reject">Reject</option>
                                    <option value="Strong Reject">
                                       Strong Reject
                                    </option>
                                 </select>
                              </div>

                              <div>
                                 <label className="block text-sm font-bold text-gray-900 mb-1">
                                    Final Decision *
                                 </label>
                                 <select
                                    value={decision}
                                    onChange={(e) =>
                                       setDecision(e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
                                 >
                                    <option value="Under Review">
                                       Under Review
                                    </option>
                                    <option value="Accepted">Accept</option>
                                    <option value="Rejected">Reject</option>
                                    <option value="Revision Required">
                                       Revision Required
                                    </option>
                                 </select>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3 flex-shrink-0">
                     <button
                        onClick={() => setShowReviewModal(false)}
                        className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={() => {
                           // Construct full feedback message
                           const fullFeedback = `
Evaluation Criteria:
1. Originality: ${reviewAnswers.q1}
2. Technical Quality: ${reviewAnswers.q2}
3. Clarity: ${reviewAnswers.q3}
4. Relevance: ${reviewAnswers.q4}
5. References: ${reviewAnswers.q5}

Overall Comments:
${feedbackText}
                           `.trim();

                           // Override local state just for submission if needed, or update handleSubmitReview separately
                           // For now, I'll update feedbackText state logic or just pass this concatenated string if I could.
                           // Actually, handleSubmitReview uses 'feedbackText' state variable.
                           // I will hacking-ly update the state before calling submit?
                           // No, setFeedbackText is async.
                           // I should assume the user will type into the specific boxes and the "Final Feedback" box is the one sent,
                           // OR I should concatenate everything.
                           // Let's assume the user wants ALL this info saved.
                           // But the backend likely expects a single string for 'comment'.

                           // So I will update handleSubmitReview instead to read from these states.
                           handleSubmitReview(fullFeedback);
                        }}
                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200"
                     >
                        <Send size={18} /> Submit Review
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default ReviewerSubmissions;
