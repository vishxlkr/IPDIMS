import React, { useState, useEffect, useContext } from "react";
import Loading from "../../components/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import {
   UserPlus,
   Search,
   Eye,
   ToggleLeft,
   ToggleRight,
   X,
   Mail,
   Phone,
   Building,
   Award,
   FileText,
   Calendar,
   User,
   Trash2,
} from "lucide-react";
import { AdminContext } from "../../context/AdminContext";

const ManageReviewers = () => {
   const [reviewers, setReviewers] = useState([]);
   const [filteredReviewers, setFilteredReviewers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [showAddModal, setShowAddModal] = useState(false);
   const [showDetailsModal, setShowDetailsModal] = useState(false);
   const [selectedReviewer, setSelectedReviewer] = useState(null);
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      password: "",
      designation: "",
      organization: "",
      specialization: "",
      bio: "",
      gender: "",
      address: "",
   });
   const [imageFile, setImageFile] = useState(null);

   // const backendUrl = "http://localhost:4000";
   const { backendUrl } = useContext(AdminContext);
   const atoken = localStorage.getItem("aToken");

   useEffect(() => {
      fetchReviewers();
   }, []);

   useEffect(() => {
      filterReviewers();
   }, [searchTerm, reviewers]);

   const fetchReviewers = async () => {
      try {
         setLoading(true);
         const { data } = await axios.get(
            `${backendUrl}/api/admin/all-reviewer`,
            {
               headers: { atoken },
            },
         );

         if (data.success) {
            setReviewers(data.reviewers || []);
         } else {
            toast.error(data.message || "Failed to fetch reviewers");
         }
      } catch (error) {
         console.error("Error fetching reviewers:", error);
         toast.error(
            error.response?.data?.message || "Error fetching reviewers",
         );
      } finally {
         setLoading(false);
      }
   };

   const filterReviewers = () => {
      let filtered = reviewers;

      if (searchTerm) {
         filtered = filtered.filter(
            (reviewer) =>
               reviewer.name
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
               reviewer.email
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
               reviewer.organization
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()),
         );
      }

      setFilteredReviewers(filtered);
   };

   const handleViewDetails = async (reviewerId) => {
      try {
         const { data } = await axios.get(
            `${backendUrl}/api/admin/reviewer/${reviewerId}`,
            {
               headers: { atoken },
            },
         );

         if (data.success) {
            setSelectedReviewer(data.reviewer);
            setShowDetailsModal(true);
         }
      } catch (error) {
         console.error("Error fetching reviewer details:", error);
         toast.error("Failed to load reviewer details");
      }
   };

   const handleDeleteReviewer = async (reviewerId) => {
      if (
         window.confirm(
            "Are you sure you want to delete this reviewer? This action cannot be undone.",
         )
      ) {
         try {
            const { data } = await axios.delete(
               `${backendUrl}/api/admin/reviewer/${reviewerId}`,
               { headers: { atoken } },
            );

            if (data.success) {
               toast.success(data.message || "Reviewer deleted successfully!");
               fetchReviewers();
            } else {
               toast.error(data.message || "Failed to delete reviewer");
            }
         } catch (error) {
            console.error("Error deleting reviewer:", error);
            toast.error(
               error.response?.data?.message || "Failed to delete reviewer",
            );
         }
      }
   };

   const handleToggleStatus = async (reviewerId, currentStatus) => {
      try {
         const { data } = await axios.post(
            `${backendUrl}/api/admin/change-availability/${reviewerId}`,
            {
               isActive: !currentStatus,
            },
            { headers: { atoken } },
         );

         if (data.success) {
            toast.success(
               `Reviewer ${
                  !currentStatus ? "activated" : "deactivated"
               } successfully!`,
            );
            fetchReviewers();
         } else {
            toast.error(data.message || "Failed to update status");
         }
      } catch (error) {
         console.error("Error updating reviewer status:", error);
         toast.error(
            error.response?.data?.message || "Failed to update status",
         );
      }
   };

   const handleInputChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const handleImageChange = (e) => {
      setImageFile(e.target.files[0]);
   };

   const handleAddReviewer = async (e) => {
      e.preventDefault();

      if (!formData.name || !formData.email) {
         toast.error("Please fill in all required fields");
         return;
      }

      try {
         const submitData = new FormData();
         submitData.append("name", formData.name);
         submitData.append("email", formData.email);
         submitData.append("phone", formData.phone);
         submitData.append("password", formData.password);
         submitData.append("designation", formData.designation);
         submitData.append("organization", formData.organization);
         submitData.append("specialization", formData.specialization);
         submitData.append("bio", formData.bio);
         submitData.append("gender", formData.gender);
         submitData.append("address", formData.address);
         submitData.append("isActive", true);

         if (imageFile) {
            submitData.append("image", imageFile);
         }

         const { data } = await axios.post(
            `${backendUrl}/api/admin/add-reviewer`,
            submitData,
            {
               headers: {
                  atoken,
                  "Content-Type": "multipart/form-data",
               },
            },
         );

         if (data.success) {
            toast.success("Reviewer added successfully!");
            setShowAddModal(false);
            setFormData({
               name: "",
               email: "",
               phone: "",
               password: "",
               designation: "",
               organization: "",
               specialization: "",
               bio: "",
               gender: "",
               address: "",
            });
            setImageFile(null);
            fetchReviewers();
         } else {
            toast.error(data.message || "Failed to add reviewer");
         }
      } catch (error) {
         console.error("Error adding reviewer:", error);
         toast.error(error.response?.data?.message || "Failed to add reviewer");
      }
   };

   if (loading) return <Loading />;

   return (
      <div className="min-h-[calc(100vh-5rem)] bg-gray-50 px-7 py-8">
         <div className="w-full">
            <div className="mb-8 flex items-center justify-between">
               <div>
                  <h1 className="text-3xl font-bold text-slate-950">
                     Manage Reviewers
                  </h1>
               </div>
               <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-accent hover:bg-cyan-700 text-white px-6 py-3 rounded font-semibold transition-all shadow-[0_18px_45px_rgba(15,23,42,0.08)] hover:shadow-[0_22px_55px_rgba(15,23,42,0.10)]"
               >
                  <UserPlus size={20} />
                  Add Reviewer
               </button>
            </div>

            <div className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-6 mb-6 border border-slate-200">
               <div className="flex items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                     <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                     <input
                        type="text"
                        placeholder="Search by name, email, organization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 text-black pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                     />
                  </div>
                  <span className="text-slate-700 font-semibold">
                     Total:{" "}
                     <span className="text-cyan-600">
                        {filteredReviewers.length}
                     </span>{" "}
                     reviewers
                  </span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredReviewers.length > 0 ? (
                  filteredReviewers.map((reviewer) => (
                     <div
                        key={reviewer._id}
                        className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] border border-slate-200 overflow-hidden hover:shadow-[0_22px_55px_rgba(15,23,42,0.10)] transition-all"
                     >
                        <div className="p-6">
                           <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                 {reviewer.image ? (
                                    <img
                                       src={reviewer.image}
                                       alt={reviewer.name}
                                       className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                                    />
                                 ) : (
                                    <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center">
                                       <User className="w-8 h-8 text-cyan-600" />
                                    </div>
                                 )}
                                 <div>
                                    <h3 className="text-lg font-bold text-slate-950">
                                       {reviewer.name}
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                       {reviewer.designation || "Reviewer"}
                                    </p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                 <button
                                    onClick={() =>
                                       handleToggleStatus(
                                          reviewer._id,
                                          reviewer.isActive,
                                       )
                                    }
                                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                    title={
                                       reviewer.isActive
                                          ? "Deactivate"
                                          : "Activate"
                                    }
                                 >
                                    {reviewer.isActive ? (
                                       <ToggleRight className="w-6 h-6 text-green-600" />
                                    ) : (
                                       <ToggleLeft className="w-6 h-6 text-slate-400" />
                                    )}
                                 </button>
                                 <button
                                    onClick={() =>
                                       handleDeleteReviewer(reviewer._id)
                                    }
                                    className="p-1.5 hover:bg-white rounded-lg transition-colors text-red-500 hover:text-red-700"
                                    title="Delete Reviewer"
                                 >
                                    <Trash2 className="w-5 h-5" />
                                 </button>
                              </div>
                           </div>

                           <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                 <Mail className="w-4 h-4 text-slate-400" />
                                 <span className="truncate">
                                    {reviewer.email}
                                 </span>
                              </div>
                              {reviewer.phone && (
                                 <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <span>{reviewer.phone}</span>
                                 </div>
                              )}
                              {reviewer.organization && (
                                 <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Building className="w-4 h-4 text-slate-400" />
                                    <span className="truncate">
                                       {reviewer.organization}
                                    </span>
                                 </div>
                              )}
                           </div>

                           {reviewer.specialization &&
                              reviewer.specialization.length > 0 && (
                                 <div className="mb-4">
                                    <div className="flex flex-wrap gap-1">
                                       {reviewer.specialization
                                          .slice(0, 2)
                                          .map((spec, idx) => (
                                             <span
                                                key={idx}
                                                className="bg-cyan-100 text-cyan-700 text-xs px-2 py-1 rounded-full"
                                             >
                                                {spec}
                                             </span>
                                          ))}
                                       {reviewer.specialization.length > 2 && (
                                          <span className="bg-gray-100 text-slate-500 text-xs px-2 py-1 rounded-full">
                                             +
                                             {reviewer.specialization.length -
                                                2}
                                          </span>
                                       )}
                                    </div>
                                 </div>
                              )}

                           <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                              <span
                                 className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    reviewer.isActive
                                       ? "bg-green-100 text-green-700"
                                       : "bg-gray-100 text-slate-500"
                                 }`}
                              >
                                 {reviewer.isActive ? "Active" : "Inactive"}
                              </span>
                              <button
                                 onClick={() => handleViewDetails(reviewer._id)}
                                 className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                              >
                                 <Eye size={16} />
                                 View Details
                              </button>
                           </div>
                        </div>
                     </div>
                  ))
               ) : (
                  <div className="col-span-full text-center py-12 text-slate-500">
                     No reviewers found
                  </div>
               )}
            </div>
         </div>

         {/* Add Reviewer Modal */}
         {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
                     <h2 className="text-2xl font-bold text-slate-950">
                        Add New Reviewer
                     </h2>
                     <button
                        onClick={() => setShowAddModal(false)}
                        className="text-slate-400 hover:text-slate-500 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                     >
                        <X size={24} />
                     </button>
                  </div>

                  <form onSubmit={handleAddReviewer} className="p-6 space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Full Name *
                           </label>
                           <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              placeholder="Enter full name"
                           />
                        </div>

                        <div>
                           <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Email *
                           </label>
                           <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2.5 text-slate-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              placeholder="Enter email"
                           />
                        </div>

                        <div>
                           <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Password{" "}
                              <span className="text-slate-500 text-xs"></span>
                           </label>
                           <input
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              minLength={8}
                              className="w-full px-4 py-2.5 border text-slate-700 border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              placeholder="Enter Password"
                           />
                        </div>

                        <div>
                           <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Phone
                           </label>
                           <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 border text-slate-700 border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              placeholder="Enter phone number"
                           />
                        </div>

                        <div>
                           <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Designation
                           </label>
                           <input
                              type="text"
                              name="designation"
                              value={formData.designation}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 border text-slate-700 border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              placeholder="e.g. Professor, Associate Professor"
                           />
                        </div>

                        <div>
                           <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Organization
                           </label>
                           <input
                              type="text"
                              name="organization"
                              value={formData.organization}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 border text-slate-700 border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              placeholder="Enter organization"
                           />
                        </div>

                        <div>
                           <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Gender
                           </label>
                           <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 text-slate-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                           >
                              <option value="">Select gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                           </select>
                        </div>

                        <div>
                           <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Profile Image
                           </label>
                           <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="w-full px-4 py-2.5 text-slate-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                           />
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                           Specialization (comma-separated)
                        </label>
                        <input
                           type="text"
                           name="specialization"
                           value={formData.specialization}
                           onChange={handleInputChange}
                           className="w-full px-4 py-2.5 text-slate-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                           placeholder="e.g. Machine Learning, AI, Data Science"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                           Address
                        </label>
                        <input
                           type="text"
                           name="address"
                           value={formData.address}
                           onChange={handleInputChange}
                           className="w-full px-4 py-2.5 text-slate-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                           placeholder="Enter address"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                           Bio
                        </label>
                        <textarea
                           name="bio"
                           value={formData.bio}
                           onChange={handleInputChange}
                           rows="3"
                           className="w-full px-4 py-2.5 text-slate-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                           placeholder="Brief bio about the reviewer"
                        ></textarea>
                     </div>

                     <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                           type="button"
                           onClick={() => setShowAddModal(false)}
                           className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-slate-950 rounded font-medium transition-all"
                        >
                           Cancel
                        </button>
                        <button
                           type="submit"
                           className="px-6 py-2.5 bg-accent hover:bg-cyan-700 text-white rounded font-medium transition-all flex items-center gap-2"
                        >
                           <UserPlus size={18} />
                           Add Reviewer
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* Reviewer Details Modal */}
         {showDetailsModal && selectedReviewer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
                     <h2 className="text-2xl font-bold text-slate-950">
                        Reviewer Details
                     </h2>
                     <button
                        onClick={() => setShowDetailsModal(false)}
                        className="text-slate-400 hover:text-slate-500 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                     >
                        <X size={24} />
                     </button>
                  </div>

                  <div className="p-6 space-y-6">
                     <div className="flex items-center gap-4">
                        {selectedReviewer.image ? (
                           <img
                              src={selectedReviewer.image}
                              alt={selectedReviewer.name}
                              className="w-24 h-24 rounded-full object-cover border-4 border-slate-200"
                           />
                        ) : (
                           <div className="w-24 h-24 rounded-full bg-cyan-100 flex items-center justify-center">
                              <User className="w-12 h-12 text-cyan-600" />
                           </div>
                        )}
                        <div>
                           <h3 className="text-2xl font-bold text-slate-950">
                              {selectedReviewer.name}
                           </h3>
                           <p className="text-slate-500">
                              {selectedReviewer.designation || "Reviewer"}
                           </p>
                           <span
                              className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                 selectedReviewer.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-slate-500"
                              }`}
                           >
                              {selectedReviewer.isActive
                                 ? "Active"
                                 : "Inactive"}
                           </span>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded p-4 border border-slate-200">
                           <div className="flex items-center gap-2 mb-2">
                              <Mail className="text-cyan-600" size={18} />
                              <p className="text-xs text-slate-500 font-semibold">
                                 EMAIL
                              </p>
                           </div>
                           <p className="text-slate-950 font-medium break-all">
                              {selectedReviewer.email}
                           </p>
                        </div>

                        {selectedReviewer.phone && (
                           <div className="bg-gray-50 rounded p-4 border border-slate-200">
                              <div className="flex items-center gap-2 mb-2">
                                 <Phone className="text-cyan-600" size={18} />
                                 <p className="text-xs text-slate-500 font-semibold">
                                    PHONE
                                 </p>
                              </div>
                              <p className="text-slate-950 font-medium">
                                 {selectedReviewer.phone}
                              </p>
                           </div>
                        )}

                        {selectedReviewer.organization && (
                           <div className="bg-gray-50 rounded p-4 border border-slate-200 md:col-span-2">
                              <div className="flex items-center gap-2 mb-2">
                                 <Building
                                    className="text-cyan-600"
                                    size={18}
                                 />
                                 <p className="text-xs text-slate-500 font-semibold">
                                    ORGANIZATION
                                 </p>
                              </div>
                              <p className="text-slate-950 font-medium">
                                 {selectedReviewer.organization}
                              </p>
                           </div>
                        )}

                        {selectedReviewer.address && (
                           <div className="bg-gray-50 rounded p-4 border border-slate-200 md:col-span-2">
                              <div className="flex items-center gap-2 mb-2">
                                 <Building
                                    className="text-cyan-600"
                                    size={18}
                                 />
                                 <p className="text-xs text-slate-500 font-semibold">
                                    ADDRESS
                                 </p>
                              </div>
                              <p className="text-slate-950 font-medium">
                                 {selectedReviewer.address}
                              </p>
                           </div>
                        )}

                        {selectedReviewer.gender && (
                           <div className="bg-gray-50 rounded p-4 border border-slate-200">
                              <div className="flex items-center gap-2 mb-2">
                                 <User className="text-cyan-600" size={18} />
                                 <p className="text-xs text-slate-500 font-semibold">
                                    GENDER
                                 </p>
                              </div>
                              <p className="text-slate-950 font-medium">
                                 {selectedReviewer.gender}
                              </p>
                           </div>
                        )}
                     </div>

                     {selectedReviewer.specialization &&
                        selectedReviewer.specialization.length > 0 && (
                           <div className="bg-gray-50 rounded p-4 border border-slate-200">
                              <div className="flex items-center gap-2 mb-3">
                                 <Award className="text-cyan-600" size={18} />
                                 <p className="text-xs text-slate-500 font-semibold">
                                    SPECIALIZATION
                                 </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                 {selectedReviewer.specialization.map(
                                    (spec, idx) => (
                                       <span
                                          key={idx}
                                          className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-lg text-sm font-medium"
                                       >
                                          {spec}
                                       </span>
                                    ),
                                 )}
                              </div>
                           </div>
                        )}

                     {selectedReviewer.bio && (
                        <div className="bg-gray-50 rounded p-4 border border-slate-200">
                           <div className="flex items-center gap-2 mb-3">
                              <FileText className="text-cyan-600" size={18} />
                              <p className="text-xs text-slate-500 font-semibold">
                                 BIO
                              </p>
                           </div>
                           <p className="text-slate-950 leading-relaxed whitespace-pre-wrap">
                              {selectedReviewer.bio}
                           </p>
                        </div>
                     )}

                     {selectedReviewer.assignedSubmissions &&
                        selectedReviewer.assignedSubmissions.length > 0 && (
                           <div className="bg-gray-50 rounded p-4 border border-slate-200">
                              <div className="flex items-center gap-2 mb-3">
                                 <FileText
                                    className="text-purple-600"
                                    size={18}
                                 />
                                 <p className="text-xs text-slate-500 font-semibold">
                                    ASSIGNED SUBMISSIONS
                                 </p>
                              </div>
                              <p className="text-2xl font-bold text-purple-600">
                                 {selectedReviewer.assignedSubmissions.length}
                              </p>
                           </div>
                        )}
                  </div>

                  <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex justify-end">
                     <button
                        onClick={() => setShowDetailsModal(false)}
                        className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-slate-950 rounded font-medium transition-all"
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

export default ManageReviewers;
