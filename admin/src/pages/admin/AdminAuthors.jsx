import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
   Search,
   Eye,
   X,
   User,
   Mail,
   Building,
   FileText,
   Calendar,
} from "lucide-react";

const AdminAuthors = () => {
   const [authors, setAuthors] = useState([]);
   const [filteredAuthors, setFilteredAuthors] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedAuthor, setSelectedAuthor] = useState(null);
   const [showDetailsModal, setShowDetailsModal] = useState(false);
   const [authorSubmissions, setAuthorSubmissions] = useState([]);

   const backendUrl = "http://localhost:4000";
   const atoken = localStorage.getItem("aToken");

   useEffect(() => {
      fetchAuthors();
   }, []);

   useEffect(() => {
      filterAuthors();
   }, [searchTerm, authors]);

   const fetchAuthors = async () => {
      try {
         setLoading(true);
         const { data } = await axios.get(`${backendUrl}/api/admin/users`, {
            headers: { atoken },
         });

         if (data.success) {
            setAuthors(data.users || []);
         } else {
            toast.error(data.message || "Failed to fetch authors");
         }
      } catch (error) {
         console.error("Error fetching authors:", error);
         toast.error(error.response?.data?.message || "Error fetching authors");
      } finally {
         setLoading(false);
      }
   };

   const filterAuthors = () => {
      let filtered = authors;

      if (searchTerm) {
         filtered = filtered.filter(
            (author) =>
               author.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               author.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               author.organization
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase())
         );
      }

      setFilteredAuthors(filtered);
   };

   const handleViewDetails = async (authorId) => {
      try {
         const { data } = await axios.get(
            `${backendUrl}/api/admin/user/${authorId}`,
            {
               headers: { atoken },
            }
         );

         if (data.success) {
            setSelectedAuthor(data.user);
            fetchAuthorSubmissions(authorId);
            setShowDetailsModal(true);
         }
      } catch (error) {
         console.error("Error fetching author details:", error);
         toast.error("Failed to load author details");
      }
   };

   const fetchAuthorSubmissions = async (authorId) => {
      try {
         const { data } = await axios.get(
            `${backendUrl}/api/admin/user/${authorId}/submissions`,
            {
               headers: { atoken },
            }
         );

         if (data.success) {
            setAuthorSubmissions(data.submissions || []);
         }
      } catch (error) {
         console.error("Error fetching author submissions:", error);
         setAuthorSubmissions([]);
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
               <h1 className="text-4xl font-bold text-gray-800">
                  Manage Authors
               </h1>
               <p className="text-gray-600 mt-2">
                  View and manage all registered authors
               </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
               <div className="flex items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                     <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                     <input
                        type="text"
                        placeholder="Search by name, email, organization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                  </div>
                  <span className="text-gray-700 font-semibold">
                     Total:{" "}
                     <span className="text-blue-600">
                        {filteredAuthors.length}
                     </span>{" "}
                     authors
                  </span>
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              #
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Name
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Email
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Organization
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Registered
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Actions
                           </th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAuthors.length > 0 ? (
                           filteredAuthors.map((author, index) => (
                              <tr
                                 key={author._id}
                                 className="hover:bg-gray-50 transition-colors"
                              >
                                 <td className="px-6 py-4 text-sm text-gray-600">
                                    {index + 1}
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                       {author.image ? (
                                          <img
                                             src={author.image}
                                             alt={author.name}
                                             className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                          />
                                       ) : (
                                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                             <User className="w-5 h-5 text-blue-600" />
                                          </div>
                                       )}
                                       <div className="text-sm font-medium text-gray-900">
                                          {author.name || "N/A"}
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">
                                       {author.email}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="text-sm text-gray-700">
                                       {author.organization || "N/A"}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(
                                       author.createdAt
                                    ).toLocaleDateString()}
                                 </td>
                                 <td className="px-6 py-4">
                                    <button
                                       onClick={() =>
                                          handleViewDetails(author._id)
                                       }
                                       className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                       <Eye size={16} />
                                       View
                                    </button>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td
                                 colSpan="6"
                                 className="px-6 py-12 text-center text-gray-500"
                              >
                                 No authors found
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Author Details Modal */}
         {showDetailsModal && selectedAuthor && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                     <h2 className="text-2xl font-bold text-gray-800">
                        Author Details
                     </h2>
                     <button
                        onClick={() => {
                           setShowDetailsModal(false);
                           setAuthorSubmissions([]);
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                     >
                        <X size={24} />
                     </button>
                  </div>

                  <div className="p-6 space-y-6">
                     {/* Author Info */}
                     <div className="flex items-center gap-4">
                        {selectedAuthor.image ? (
                           <img
                              src={selectedAuthor.image}
                              alt={selectedAuthor.name}
                              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                           />
                        ) : (
                           <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="w-12 h-12 text-blue-600" />
                           </div>
                        )}
                        <div>
                           <h3 className="text-2xl font-bold text-gray-900">
                              {selectedAuthor.name || "N/A"}
                           </h3>
                           <p className="text-gray-600">
                              {selectedAuthor.email}
                           </p>
                           <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                              <Calendar size={16} />
                              Joined{" "}
                              {new Date(
                                 selectedAuthor.createdAt
                              ).toLocaleDateString("en-US", {
                                 year: "numeric",
                                 month: "long",
                                 day: "numeric",
                              })}
                           </div>
                        </div>
                     </div>

                     {/* Author Details Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <div className="flex items-center gap-2 mb-2">
                              <Mail className="text-blue-600" size={18} />
                              <p className="text-xs text-gray-500 font-semibold">
                                 EMAIL
                              </p>
                           </div>
                           <p className="text-gray-900 font-medium break-all">
                              {selectedAuthor.email}
                           </p>
                        </div>

                        {selectedAuthor.phone && (
                           <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-2">
                                 <User className="text-blue-600" size={18} />
                                 <p className="text-xs text-gray-500 font-semibold">
                                    PHONE
                                 </p>
                              </div>
                              <p className="text-gray-900 font-medium">
                                 {selectedAuthor.phone}
                              </p>
                           </div>
                        )}

                        {selectedAuthor.organization && (
                           <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 md:col-span-2">
                              <div className="flex items-center gap-2 mb-2">
                                 <Building
                                    className="text-blue-600"
                                    size={18}
                                 />
                                 <p className="text-xs text-gray-500 font-semibold">
                                    ORGANIZATION
                                 </p>
                              </div>
                              <p className="text-gray-900 font-medium">
                                 {selectedAuthor.organization}
                              </p>
                           </div>
                        )}

                        {selectedAuthor.address && (
                           <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 md:col-span-2">
                              <div className="flex items-center gap-2 mb-2">
                                 <Building
                                    className="text-blue-600"
                                    size={18}
                                 />
                                 <p className="text-xs text-gray-500 font-semibold">
                                    ADDRESS
                                 </p>
                              </div>
                              <p className="text-gray-900 font-medium">
                                 {selectedAuthor.address}
                              </p>
                           </div>
                        )}
                     </div>

                     {/* Submissions Section */}
                     <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-2">
                              <FileText className="text-purple-600" size={20} />
                              <h3 className="text-lg font-bold text-gray-800">
                                 Submissions
                              </h3>
                           </div>
                           <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {authorSubmissions.length} Total
                           </span>
                        </div>

                        {authorSubmissions.length > 0 ? (
                           <div className="space-y-3">
                              {authorSubmissions.map((submission) => (
                                 <div
                                    key={submission._id}
                                    className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all"
                                 >
                                    <div className="flex items-start justify-between">
                                       <div className="flex-1">
                                          <h4 className="font-semibold text-gray-900 mb-1">
                                             {submission.title || "Untitled"}
                                          </h4>
                                          {submission.eventName && (
                                             <p className="text-sm text-gray-600 mb-2">
                                                Event: {submission.eventName}
                                             </p>
                                          )}
                                          <div className="flex items-center gap-2 text-xs text-gray-500">
                                             <Calendar size={14} />
                                             {new Date(
                                                submission.createdAt
                                             ).toLocaleDateString()}
                                          </div>
                                       </div>
                                       <span
                                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                             submission.status === "Accepted"
                                                ? "bg-green-100 text-green-800"
                                                : submission.status ===
                                                  "Rejected"
                                                ? "bg-red-100 text-red-800"
                                                : submission.status ===
                                                  "Under Review"
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-yellow-100 text-yellow-800"
                                          }`}
                                       >
                                          {submission.status}
                                       </span>
                                    </div>
                                    {submission.reviewer && (
                                       <div className="mt-3 pt-3 border-t border-gray-200">
                                          <p className="text-xs text-gray-500">
                                             Reviewer:{" "}
                                             <span className="font-medium text-gray-700">
                                                {submission.reviewer.name}
                                             </span>
                                          </p>
                                       </div>
                                    )}
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="text-center py-8 text-gray-500">
                              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                              <p>No submissions yet</p>
                           </div>
                        )}
                     </div>

                     {/* Statistics */}
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                           <p className="text-2xl font-bold text-yellow-700">
                              {
                                 authorSubmissions.filter(
                                    (s) => s.status === "Pending"
                                 ).length
                              }
                           </p>
                           <p className="text-xs text-yellow-600 font-semibold mt-1">
                              Pending
                           </p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                           <p className="text-2xl font-bold text-blue-700">
                              {
                                 authorSubmissions.filter(
                                    (s) => s.status === "Under Review"
                                 ).length
                              }
                           </p>
                           <p className="text-xs text-blue-600 font-semibold mt-1">
                              Under Review
                           </p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                           <p className="text-2xl font-bold text-green-700">
                              {
                                 authorSubmissions.filter(
                                    (s) => s.status === "Accepted"
                                 ).length
                              }
                           </p>
                           <p className="text-xs text-green-600 font-semibold mt-1">
                              Accepted
                           </p>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                           <p className="text-2xl font-bold text-red-700">
                              {
                                 authorSubmissions.filter(
                                    (s) => s.status === "Rejected"
                                 ).length
                              }
                           </p>
                           <p className="text-xs text-red-600 font-semibold mt-1">
                              Rejected
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end">
                     <button
                        onClick={() => {
                           setShowDetailsModal(false);
                           setAuthorSubmissions([]);
                        }}
                        className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-all"
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

export default AdminAuthors;
