import React, { useState, useEffect, useContext } from "react";
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
   Trash2,
} from "lucide-react";
import { AdminContext } from "../../context/AdminContext";

const AdminAuthors = () => {
   const [authors, setAuthors] = useState([]);
   const [filteredAuthors, setFilteredAuthors] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedAuthor, setSelectedAuthor] = useState(null);
   const [showDetailsModal, setShowDetailsModal] = useState(false);
   const [authorSubmissions, setAuthorSubmissions] = useState([]);

   const atoken = localStorage.getItem("aToken");
   const { backendUrl } = useContext(AdminContext);

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

   const handleDeleteAuthor = async (authorId) => {
      if (!window.confirm("Are you sure you want to delete this author?"))
         return;

      try {
         const { data } = await axios.delete(
            `${backendUrl}/api/admin/user/${authorId}`,
            { headers: { atoken } }
         );

         if (data.success) {
            toast.success("Author deleted successfully ✅");
            fetchAuthors();
         } else {
            toast.error(data.message || "Failed to delete author");
         }
      } catch (error) {
         toast.error(error.response?.data?.message || "Error deleting author");
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
                        className="w-full text-black pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
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
                           filteredAuthors.map((author) => (
                              <tr
                                 key={author._id}
                                 className="hover:bg-gray-50 transition-colors"
                              >
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

                                 <td className="px-6 py-4 text-sm text-gray-900">
                                    {author.email}
                                 </td>

                                 <td className="px-6 py-4 text-sm text-gray-600">
                                    {author.organization || "N/A"}
                                 </td>

                                 <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(
                                       author.createdAt
                                    ).toLocaleDateString()}
                                 </td>

                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                       <button
                                          onClick={() =>
                                             handleViewDetails(author._id)
                                          }
                                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                       >
                                          <Eye size={16} />
                                          View
                                       </button>

                                       <button
                                          onClick={() =>
                                             handleDeleteAuthor(author._id)
                                          }
                                          className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                       >
                                          <Trash2 className="w-5 h-5" />
                                       </button>
                                    </div>
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

         {/* ---- DETAILS MODAL ---- */}
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
                     <div className="flex items-center gap-4">
                        <div>
                           <h3 className="text-2xl font-bold text-gray-900">
                              {selectedAuthor.name}
                           </h3>
                           <p className="text-gray-600">
                              {selectedAuthor.email}
                           </p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <Mail className="text-blue-600 mb-1" size={18} />
                           <p className="font-medium">{selectedAuthor.email}</p>
                        </div>

                        {selectedAuthor.organization && (
                           <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                              <Building
                                 className="text-blue-600 mb-1"
                                 size={18}
                              />
                              <p className="font-medium">
                                 {selectedAuthor.organization}
                              </p>
                           </div>
                        )}
                     </div>

                     {/* Submissions will show here */}
                     <div className="border border-gray-200 rounded-xl p-4">
                        <h3 className="text-lg font-bold text-gray-700 mb-3">
                           Submissions
                        </h3>

                        {authorSubmissions.length > 0 ? (
                           authorSubmissions.map((sub) => (
                              <div
                                 key={sub._id}
                                 className="border p-4 rounded-lg bg-white mt-2"
                              >
                                 <div className="flex justify-between">
                                    <h4 className="font-semibold">
                                       {sub.title}
                                    </h4>

                                    <span
                                       className={`px-3 py-1 text-xs rounded-full font-semibold ${
                                          sub.status === "Accepted"
                                             ? "bg-green-100 text-green-700"
                                             : sub.status === "Rejected"
                                             ? "bg-red-100 text-red-700"
                                             : "bg-blue-100 text-blue-700"
                                       }`}
                                    >
                                       {sub.status}
                                    </span>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <p className="text-gray-500">No submissions yet</p>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default AdminAuthors;
