import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
   Info,
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
import { AdminContext } from "../../context/AdminContext";

// PDF Viewer Imports
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// Use a specific version of pdfjs-dist worker that matches the installed version
const pdfjsVersion = "3.11.174";

const ReviewerSubmissions = () => {
   const [submissions, setSubmissions] = useState([]);
   const [filteredSubmissions, setFilteredSubmissions] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [statusFilter, setStatusFilter] = useState("All");
   const [selectedSubmission, setSelectedSubmission] = useState(null);
   const [showDetailsModal, setShowDetailsModal] = useState(false);
   const [showReviewModal, setShowReviewModal] = useState(false);

   // Review Form State
   const [feedbackText, setFeedbackText] = useState(""); // This will be "Comments to the Author"
   const [confidentialComments, setConfidentialComments] = useState("");
   const [decision, setDecision] = useState("Under Review");
   const [rating, setRating] = useState(""); // Will hold "Overall Recommendation" like Accept/Reject for now or numerical
   const [isBestPaper, setIsBestPaper] = useState("No");

   const [scores, setScores] = useState({
      engineeringSignificance: "",
      scientificSignificance: "",
      completeness: "",
      acknowledgement: "",
      presentation: "",
   });

   const [initialFormState, setInitialFormState] = useState(null);

   const [feedbacks, setFeedbacks] = useState([]);

   // Create new plugin instance
   const defaultLayoutPluginInstance = defaultLayoutPlugin();

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

   const openReviewModal = (submission) => {
      setSelectedSubmission(submission);

      //Decode token to get current reviewer ID
      let currentReviewerId = null;
      if (rtoken) {
         try {
            const payload = JSON.parse(atob(rtoken.split(".")[1]));
            currentReviewerId = payload.id;
         } catch (e) {
            console.error("Error decoding token for reviewer ID", e);
         }
      }

      // Check if feedback already exists for this reviewer
      const existingFeedback = submission.feedback?.find((fb) => {
         const revId = fb.reviewer?._id || fb.reviewer;
         return String(revId) === String(currentReviewerId);
      });

      let startState = {};

      if (existingFeedback) {
         startState = {
            feedbackText: existingFeedback.comment || "",
            confidentialComments: existingFeedback.confidentialComments || "",
            isBestPaper: existingFeedback.bestPaperNomination || "No",
            scores: existingFeedback.scores || {
               engineeringSignificance: "",
               scientificSignificance: "",
               completeness: "",
               acknowledgement: "",
               presentation: "",
            },
            decision: existingFeedback.recommendation || "Under Review",
         };
      } else {
         startState = {
            feedbackText: "",
            confidentialComments: "",
            isBestPaper: "No",
            scores: {
               engineeringSignificance: "",
               scientificSignificance: "",
               completeness: "",
               acknowledgement: "",
               presentation: "",
            },
            decision: "Under Review",
         };
      }

      setFeedbackText(startState.feedbackText);
      setConfidentialComments(startState.confidentialComments);
      setIsBestPaper(startState.isBestPaper);
      setScores(startState.scores);
      setDecision(startState.decision);
      setInitialFormState(startState);

      setShowReviewModal(true);
   };

   const handleSubmitReview = async () => {
      // Validate all required fields
      if (!feedbackText.trim()) {
         toast.error("Please provide comments to the author");
         return;
      }

      // Check if all scores are filled
      const allScoresFilled = Object.values(scores).every((s) => s !== "");
      if (!allScoresFilled) {
         toast.error("Please complete all scoring criteria");
         return;
      }

      try {
         const { data } = await axios.post(
            `${backendUrl}/api/reviewer/submissions/${selectedSubmission._id}/review`,
            {
               feedbackText, // Comments to Author
               decision, // Recommendation
               scores, // Structured scores object
               bestPaperNomination: isBestPaper,
               confidentialComments,
            },
            { headers: { rtoken } },
         );

         if (data.success) {
            toast.success("Review submitted successfully!");
            setShowReviewModal(false);
            setFeedbackText("");
            setDecision("Under Review");
            setRating("");
            setConfidentialComments("");
            setIsBestPaper("No");
            setScores({
               engineeringSignificance: "",
               scientificSignificance: "",
               completeness: "",
               acknowledgement: "",
               presentation: "",
            });
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

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
         </div>
      );
   }

   const isFormDirty = () => {
      // If initialFormState is not set yet, assume false to disable button
      if (!initialFormState) return false;

      // Deep compare scores
      const scoresChanged =
         JSON.stringify(scores) !== JSON.stringify(initialFormState.scores);

      return (
         scoresChanged ||
         feedbackText !== initialFormState.feedbackText ||
         confidentialComments !== initialFormState.confidentialComments ||
         isBestPaper !== initialFormState.isBestPaper ||
         decision !== initialFormState.decision
      );
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
         </div>
      );
   }

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
                                 <td className="px-6 py-4 text-gray-800">
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
                                          <FileText className="w-5 h-5" />
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
               <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto no-scrollbar">
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
                              <span className="font-semibold text-gray-900">
                                 Name:
                              </span>
                              <p className="text-gray-700">
                                 {selectedSubmission.authorName}
                              </p>
                           </p>
                           <p>
                              <span className="font-semibold text-gray-900">
                                 Email:
                              </span>
                              <p className="text-gray-700">
                                 <p>{selectedSubmission.authorEmail}</p>
                              </p>
                           </p>
                           <p>
                              <span className="font-semibold text-gray-900">
                                 Affiliation:
                              </span>
                              <p className="text-gray-700">
                                 {selectedSubmission.authorAffiliation ||
                                    "Not Provided"}
                              </p>
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
                        <div className="bg-white p-4 rounded-xl border flex items-center justify-between">
                           <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              <FileText size={18} /> Manuscript
                           </h4>
                           <button
                              onClick={() =>
                                 handleDownload(
                                    selectedSubmission.attachment.downloadUrl,
                                    selectedSubmission.title || "submission",
                                 )
                              }
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                           >
                              <Download size={18} /> Download
                           </button>
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

         {/* Revier - Feedback Modal - Split Screen */}
         {showReviewModal && selectedSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-2xl shadow-2xl w-[98vw] h-[95vh] flex flex-col overflow-hidden">
                  <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shrink-0">
                     <h2 className="text-xl font-bold text-gray-800 truncate pr-4">
                        Reviewing: {selectedSubmission.title}
                     </h2>
                     <button
                        onClick={() => setShowReviewModal(false)}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg"
                     >
                        <X size={24} />
                     </button>
                  </div>

                  <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                     {/* Left: PDF Viewer */}
                     <div className="w-full md:w-3/5 lg:w-2/3 bg-gray-100 border-r border-gray-200 h-full relative">
                        {selectedSubmission.attachment ? (
                           <Worker
                              workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}
                           >
                              <div className="h-full w-full">
                                 <Viewer
                                    fileUrl={
                                       selectedSubmission.attachment
                                          .downloadUrl ||
                                       `${backendUrl}/${selectedSubmission.attachment}`
                                    }
                                    plugins={[defaultLayoutPluginInstance]}
                                 />
                              </div>
                           </Worker>
                        ) : (
                           <div className="flex items-center justify-center h-full text-gray-500">
                              No PDF Document Found
                           </div>
                        )}
                     </div>

                     {/* Right: Evaluation Form */}
                     <div className="w-full md:w-2/5 lg:w-1/3 bg-white h-full overflow-y-auto p-6 scrollbar-thin">
                        <div className="space-y-8 pb-20">
                           {/* Scores */}
                           <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                                 Score Sheet (1=Poor, 5=Outstanding)
                              </h3>

                              {[
                                 {
                                    id: "engineeringSignificance",
                                    label: "1. Engineering significance and originality",
                                 },
                                 {
                                    id: "scientificSignificance",
                                    label: "2. Scientific significance and originality",
                                 },
                                 {
                                    id: "completeness",
                                    label: "3. Completeness of the reported work",
                                 },
                                 {
                                    id: "acknowledgement",
                                    label: "4. Acknowledgement of previous work",
                                 },
                                 {
                                    id: "presentation",
                                    label: "5. Quality of presentation",
                                 },
                              ].map((criteria) => (
                                 <div key={criteria.id} className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                       {criteria.label} *
                                    </label>
                                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                       {[1, 2, 3, 4, 5].map((score) => (
                                          <label
                                             key={score}
                                             className="cursor-pointer flex flex-col items-center"
                                          >
                                             <input
                                                type="radio"
                                                name={criteria.id}
                                                value={score}
                                                checked={
                                                   Number(
                                                      scores[criteria.id],
                                                   ) === score
                                                }
                                                onChange={(e) =>
                                                   setScores({
                                                      ...scores,
                                                      [criteria.id]:
                                                         e.target.value,
                                                   })
                                                }
                                                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                             />
                                             <span className="text-xs mt-1 font-medium text-gray-600">
                                                {score}
                                             </span>
                                          </label>
                                       ))}
                                    </div>
                                 </div>
                              ))}
                           </div>

                           {/* Best Paper */}
                           <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                 Should this be considered for Best Paper?
                              </label>
                              <select
                                 value={isBestPaper}
                                 onChange={(e) =>
                                    setIsBestPaper(e.target.value)
                                 }
                                 className="w-full border text-gray-900 border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 bg-white"
                              >
                                 <option value="No">No</option>
                                 <option value="Yes">Yes</option>
                              </select>
                           </div>

                           {/* Recommendation */}
                           <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                 Recommendation *
                              </label>
                              <select
                                 value={decision}
                                 onChange={(e) => setDecision(e.target.value)}
                                 className="w-full border text-gray-900 border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 bg-white"
                              >
                                 <option value="Under Review">
                                    Select Recommendation...
                                 </option>
                                 <option value="Accepted">Accept</option>
                                 <option value="Revision Required">
                                    Minor Revision
                                 </option>
                                 {/* "Revision Required" maps to "Minor Revision" or "Major" conceptually depending on usage. I'll stick to backend values but display friendly text or match whatever backend expects. 
                                     The existing code used "Revision Required". I'll use that as value. 
                                 */}
                                 <option value="Rejected">Reject</option>
                              </select>
                           </div>

                           {/* Comments */}
                           <div>
                              <label className=" text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                                 Confidential Comments to Editor{" "}
                                 <span className="text-gray-400 font-normal text-xs">
                                    (Optional)
                                 </span>
                              </label>
                              <textarea
                                 value={confidentialComments}
                                 onChange={(e) =>
                                    setConfidentialComments(e.target.value)
                                 }
                                 rows={4}
                                 placeholder="Only visible to committee..."
                                 className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
                              />
                           </div>

                           <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                 Comments to the Author *
                              </label>
                              <textarea
                                 value={feedbackText}
                                 onChange={(e) =>
                                    setFeedbackText(e.target.value)
                                 }
                                 rows={6}
                                 placeholder="Constructive feedback for the authors..."
                                 className="w-full border text-gray-900 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3 shrink-0 z-10">
                     <button
                        onClick={() => setShowReviewModal(false)}
                        className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 shadow-sm"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={handleSubmitReview}
                        disabled={!isFormDirty()}
                        className={`px-6 py-2.5 font-medium rounded-lg flex items-center gap-2 shadow-md transition-all ${
                           isFormDirty()
                              ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
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
