import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
   FileText,
   Clock,
   CheckCircle,
   XCircle,
   Download,
   X,
   Calendar,
   User,
   Mail,
   Building,
   Tag,
   AlignLeft,
   Eye,
   Search,
   MessageSquare,
} from "lucide-react";

const MySubmissions = () => {
   const { token, backendUrl } = useContext(AppContext);
   const [submissions, setSubmissions] = useState([]);
   const [filtered, setFiltered] = useState([]);
   const [loading, setLoading] = useState(true);
   const [selectedSubmission, setSelectedSubmission] = useState(null);
   const [feedbackSubmission, setFeedbackSubmission] = useState(null);
   const [isEditing, setIsEditing] = useState(false);
   const [editFormData, setEditFormData] = useState({
      title: "",
      description: "",
      keywords: "",
      file: null,
   });
   const [searchTerm, setSearchTerm] = useState("");

   // Helper to fetch submissions (moved out of useEffect to be reusable)
   const fetchSubmissions = async () => {
      try {
         const { data } = await axios.get(
            `${backendUrl}/api/user/my-submissions`,
            { headers: { Authorization: `Bearer ${token}` } },
         );

         if (data.success) {
            setSubmissions(data.submissions || []);
            setFiltered(data.submissions || []);
         } else {
            toast.error(data.message || "Failed to fetch submissions");
         }
      } catch (error) {
         toast.error(
            error.response?.data?.message || "Error fetching submissions",
         );
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchSubmissions();
   }, [token, backendUrl]);

   // Handle Edit Click
   const handleEditClick = () => {
      setIsEditing(true);
      setEditFormData({
         title: selectedSubmission.title || "",
         description: selectedSubmission.description || "",
         keywords: selectedSubmission.keywords
            ? selectedSubmission.keywords.join(", ")
            : "",
         file: null,
      });
   };

   // Handle Input Change
   const handleInputChange = (e) => {
      setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
   };

   // Handle File Change
   const handleFileChange = (e) => {
      setEditFormData({ ...editFormData, file: e.target.files[0] });
   };

   // Handle Save
   const handleSave = async () => {
      try {
         const formData = new FormData();
         formData.append("title", editFormData.title);
         formData.append("description", editFormData.description);
         formData.append("keywords", editFormData.keywords);
         if (editFormData.file) {
            formData.append("attachment", editFormData.file);
         }

         const { data } = await axios.put(
            `${backendUrl}/api/user/update-submission/${selectedSubmission._id}`,
            formData,
            { headers: { Authorization: `Bearer ${token}` } },
         );

         if (data.success) {
            toast.success("Submission updated successfully!");
            setSelectedSubmission(data.submission);
            setIsEditing(false);
            fetchSubmissions(); // Refresh list
         } else {
            toast.error(data.message || "Failed to update submission");
         }
      } catch (error) {
         console.error("Update error:", error);
         toast.error("An error occurred while updating.");
      }
   };

   // Handle Cancel
   const handleCancel = () => {
      setIsEditing(false);
      setEditFormData({
         title: "",
         description: "",
         keywords: "",
         file: null,
      });
   };

   // Handle Modal Close
   const handleCloseModal = () => {
      setSelectedSubmission(null);
      setIsEditing(false);
   };

   const handleSearch = (value) => {
      setSearchTerm(value);
      if (!value.trim()) return setFiltered(submissions);
      const results = submissions.filter(
         (s) =>
            s.title?.toLowerCase().includes(value.toLowerCase()) ||
            s.eventName?.toLowerCase().includes(value.toLowerCase()),
      );
      setFiltered(results);
   };

   const statusStats = {
      pending: submissions.filter((s) => s.status === "Pending").length,
      underReview: submissions.filter((s) => s.status === "Under Review")
         .length,
      accepted: submissions.filter((s) => s.status === "Accepted").length,
      rejected: submissions.filter((s) => s.status === "Rejected").length,
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
            {/* Page header */}
            <h1 className="text-4xl font-bold text-gray-800 mb-8">
               My Submissions
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
               <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
                  <div>
                     <p className="text-xs text-gray-500 font-semibold uppercase">
                        Pending
                     </p>
                     <p className="text-2xl font-bold text-gray-700">
                        {statusStats.pending}
                     </p>
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
                  <div>
                     <p className="text-xs text-gray-500 font-semibold uppercase">
                        Under Review
                     </p>
                     <p className="text-2xl font-bold text-gray-700">
                        {statusStats.underReview}
                     </p>
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
                  <div>
                     <p className="text-xs text-gray-500 font-semibold uppercase">
                        Accepted
                     </p>
                     <p className="text-2xl font-bold text-gray-700">
                        {statusStats.accepted}
                     </p>
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
                  <div>
                     <p className="text-xs text-gray-500 font-semibold uppercase">
                        Rejected
                     </p>
                     <p className="text-2xl font-bold text-gray-700">
                        {statusStats.rejected}
                     </p>
                  </div>
               </div>
            </div>

            {/* Search bar */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
               <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                     type="text"
                     placeholder="Search by title or event name..."
                     value={searchTerm}
                     onChange={(e) => handleSearch(e.target.value)}
                     className="w-full pl-10 pr-4 text-gray-700 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
               </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase w-12">
                              #
                           </th>
                           <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase w-1/2">
                              Title
                           </th>
                           <th className="px-2 py-4 text-left text-xs font-semibold text-gray-600 uppercase w-24">
                              Status
                           </th>
                           <th className="px-2 py-4 text-center text-xs font-semibold text-gray-600 uppercase w-20">
                              View
                           </th>
                           <th className="px-2 py-4 text-center text-xs font-semibold text-gray-600 uppercase w-24">
                              Feedback
                           </th>
                        </tr>
                     </thead>

                     <tbody className="bg-white divide-y divide-gray-200">
                        {filtered.length > 0 ? (
                           filtered.map((sub, index) => (
                              <tr
                                 key={sub._id}
                                 className="hover:bg-gray-50 transition cursor-pointer"
                              >
                                 <td className="px-4 py-4 text-sm text-gray-800">
                                    {index + 1}
                                 </td>
                                 <td
                                    className="px-4 py-4 font-medium text-gray-800 break-words"
                                    title={sub.title}
                                 >
                                    {sub.title || "Untitled"}
                                 </td>
                                 <td className="px-2 py-4 whitespace-nowrap">
                                    <span
                                       className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                          sub.status === "Accepted"
                                             ? "bg-green-100 text-green-700"
                                             : sub.status === "Rejected"
                                               ? "bg-red-100 text-red-700"
                                               : sub.status === "Under Review"
                                                 ? "bg-blue-100 text-blue-700"
                                                 : "bg-yellow-100 text-yellow-700"
                                       }`}
                                    >
                                       {sub.status}
                                    </span>
                                 </td>
                                 <td className="px-2 py-4 text-center whitespace-nowrap">
                                    <button
                                       onClick={() =>
                                          setSelectedSubmission(sub)
                                       }
                                       className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
                                    >
                                       <Eye size={16} /> View
                                    </button>
                                 </td>
                                 <td className="px-2 py-4 text-center whitespace-nowrap">
                                    {sub.feedback &&
                                       sub.feedback.length > 0 && (
                                          <button
                                             onClick={() =>
                                                setFeedbackSubmission(sub)
                                             }
                                             className="inline-flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
                                          >
                                             <MessageSquare size={16} />{" "}
                                             Feedback
                                          </button>
                                       )}
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td
                                 colSpan="6"
                                 className="px-6 py-12 text-center text-gray-500"
                              >
                                 No submis5ions found
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Details Modal (Same UI as Admin) */}
         {selectedSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                     <h2 className="text-2xl font-bold text-gray-800">
                        {isEditing ? "Edit Submission" : "Submission Details"}
                     </h2>
                     <button onClick={handleCloseModal}>
                        <X
                           size={24}
                           className="text-gray-400 hover:text-gray-600"
                        />
                     </button>
                  </div>

                  <div className="p-6 space-y-6">
                     {/* Edit Mode Content */}
                     {isEditing ? (
                        <div className="space-y-4">
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                 Title
                              </label>
                              <input
                                 type="text"
                                 name="title"
                                 value={editFormData.title}
                                 onChange={handleInputChange}
                                 className="w-full px-4 py-2 text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                 Description
                              </label>
                              <textarea
                                 name="description"
                                 rows="4"
                                 value={editFormData.description}
                                 onChange={handleInputChange}
                                 className="w-full px-4 text-gray-900 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                 Keywords (comma separated)
                              </label>
                              <input
                                 type="text"
                                 name="keywords"
                                 value={editFormData.keywords}
                                 onChange={handleInputChange}
                                 className="w-full px-4 py-2 text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                 Update PDF File (optional)
                              </label>
                              <input
                                 type="file"
                                 accept=".pdf"
                                 onChange={handleFileChange}
                                 className="w-full px-4 py-2 text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                           </div>
                        </div>
                     ) : (
                        // View Mode Content
                        <>
                           {/* Status */}
                           <span
                              className={`px-4 py-2 rounded-full text-sm font-semibold  ${
                                 selectedSubmission.status === "Accepted"
                                    ? "bg-green-100 text-green-800"
                                    : selectedSubmission.status === "Rejected"
                                      ? "bg-red-100 text-red-800"
                                      : selectedSubmission.status ===
                                          "Under Review"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-yellow-100 text-yellow-800"
                              }`}
                           >
                              {selectedSubmission.status}
                           </span>

                           {/* Title */}
                           <div className="bg-gray-50 rounded-xl p-4 border">
                              <h3 className="text-lg font-bold text-gray-900">
                                 {selectedSubmission.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                 Event: {selectedSubmission.eventName}
                              </p>
                           </div>

                           {/* Description */}
                           {selectedSubmission.description && (
                              <div className="bg-gray-50 rounded-xl p-4 border">
                                 <p className="text-sm text-gray-500 font-semibold">
                                    Description
                                 </p>
                                 <p className="text-gray-800 whitespace-pre-wrap">
                                    {selectedSubmission.description}
                                 </p>
                              </div>
                           )}

                           {/* Keywords */}
                           {selectedSubmission.keywords?.length > 0 && (
                              <div className="bg-gray-50 rounded-xl p-4 border">
                                 <p className="text-sm text-gray-500 font-semibold mb-2">
                                    Keywords
                                 </p>
                                 <div className="flex flex-wrap gap-2">
                                    {selectedSubmission.keywords.map((k, i) => (
                                       <span
                                          key={i}
                                          className="bg-blue-100 px-3 py-1 rounded-lg text-sm text-blue-800"
                                       >
                                          {k}
                                       </span>
                                    ))}
                                 </div>
                              </div>
                           )}

                           {/* Attachment */}
                           {selectedSubmission.attachment && (
                              <div className="bg-gray-50 rounded-xl p-4 border flex flex-col gap-4">
                                 <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                       <FileText
                                          size={20}
                                          className="text-blue-600"
                                       />
                                       <p className="text-gray-700 font-medium">
                                          Paper Submission
                                       </p>
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
                                       className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                                    >
                                       <Download size={18} /> Download
                                    </button>
                                 </div>

                                 {/* {selectedSubmission.attachment.viewUrl && (
                              <iframe
                                 src={selectedSubmission.attachment.viewUrl}
                                 className="w-full h-96 rounded-lg border border-gray-200"
                                 title="PDF Preview"
                              />
                           )} */}
                              </div>
                           )}
                        </>
                     )}
                  </div>

                  <div className="sticky bottom-0 p-6 border-t flex justify-end bg-white gap-3">
                     {isEditing ? (
                        <>
                           <button
                              onClick={handleCancel}
                              className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium"
                           >
                              Cancel
                           </button>
                           <button
                              onClick={handleSave}
                              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
                           >
                              Save Changes
                           </button>
                        </>
                     ) : (
                        <>
                           {selectedSubmission.status ===
                              "Revision Requested" && (
                              <button
                                 onClick={handleEditClick}
                                 className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium"
                              >
                                 Edit
                              </button>
                           )}
                           <button
                              onClick={handleCloseModal}
                              className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium"
                           >
                              Close
                           </button>
                        </>
                     )}
                  </div>
               </div>
            </div>
         )}

         {/* Feedback Modal */}
         {feedbackSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                     <h2 className="text-2xl font-bold text-gray-800">
                        Reviewer Feedback
                     </h2>
                     <button onClick={() => setFeedbackSubmission(null)}>
                        <X
                           size={24}
                           className="text-gray-400 hover:text-gray-600"
                        />
                     </button>
                  </div>

                  <div className="p-6 space-y-6">
                     {feedbackSubmission.feedback.map((feed, index) => (
                        <div
                           key={index}
                           className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                        >
                           <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-700">
                                 Reviewer {index + 1}
                              </h3>
                              <span
                                 className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    feed.recommendation === "Accepted"
                                       ? "bg-green-100 text-green-700"
                                       : feed.recommendation === "Rejected"
                                         ? "bg-red-100 text-red-700"
                                         : "bg-yellow-100 text-yellow-700"
                                 }`}
                              >
                                 {feed.recommendation}
                              </span>
                           </div>

                           <div className="mt-3">
                              <p className="text-sm text-gray-500 font-medium mb-1">
                                 Comments
                              </p>
                              <p className="text-gray-800 whitespace-pre-wrap">
                                 {feed.comment}
                              </p>
                           </div>
                        </div>
                     ))}

                     {feedbackSubmission.feedback.length === 0 && (
                        <p className="text-center text-gray-500 py-4">
                           No feedback available yet.
                        </p>
                     )}
                  </div>

                  <div className="sticky bottom-0 p-6 border-t flex justify-end bg-white">
                     <button
                        onClick={() => setFeedbackSubmission(null)}
                        className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium"
                     >
                        Close
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default MySubmissions;
