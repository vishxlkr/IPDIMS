import React, { useState, useEffect, useContext } from "react";
import Loading from "../../components/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import {
   User,
   Mail,
   Phone,
   Building,
   Edit2,
   Save,
   X,
   BookOpen,
   Calendar,
   Shield,
} from "lucide-react";
import { AdminContext } from "../../context/AdminContext";

const ReviewerProfile = () => {
   const [profile, setProfile] = useState(null);
   const [loading, setLoading] = useState(true);
   const [isEditing, setIsEditing] = useState(false);
   const [formData, setFormData] = useState({
      name: "",
      phone: "",
      affiliation: "",
   });

   // const backendUrl = "http://localhost:4000";
   const { backendUrl } = useContext(AdminContext);
   const rtoken = localStorage.getItem("rToken");

   useEffect(() => {
      fetchProfile();
   }, []);

   const fetchProfile = async () => {
      try {
         setLoading(true);
         const { data } = await axios.get(
            `${backendUrl}/api/reviewer/profile`,
            {
               headers: { rtoken },
            }
         );

         if (data.success) {
            setProfile(data.reviewer);
            setFormData({
               name: data.reviewer.name || "",
               phone: data.reviewer.phone || "",
               affiliation:
                  data.reviewer.affiliation || data.reviewer.organization || "",
            });
         } else {
            toast.error("Failed to load profile");
         }
      } catch (error) {
         console.error("Error fetching profile:", error);
         toast.error("Failed to load profile");
      } finally {
         setLoading(false);
      }
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   const handleUpdateProfile = async () => {
      try {
         const { data } = await axios.put(
            `${backendUrl}/api/reviewer/profile`,
            formData,
            {
               headers: { rtoken },
            }
         );

         if (data.success) {
            toast.success("Profile updated successfully!");
            setProfile(data.reviewer);
            setIsEditing(false);
         } else {
            toast.error(data.message || "Failed to update profile");
         }
      } catch (error) {
         console.error("Error updating profile:", error);
         toast.error(
            error.response?.data?.message || "Failed to update profile"
         );
      }
   };

   const handleCancelEdit = () => {
      setFormData({
         name: profile.name || "",
         phone: profile.phone || "",
         affiliation: profile.affiliation || profile.organization || "",
      });
      setIsEditing(false);
   };

   if (loading) return <Loading />;

   if (!profile) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
               <p className="text-xl text-slate-500">Profile not found</p>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-[calc(100vh-5rem)] bg-gray-50 px-7 py-8">
         <div className="w-full">
            {/* Header - Consistent with Dashboard and Submissions */}
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-slate-950">
                  Reviewer Profile
               </h1>
               <p className="text-slate-500 mt-2">
                  Manage your personal information and preferences
               </p>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] overflow-hidden border border-slate-200 mb-8">
               {/* Gradient Header */}
               <div className="bg-linear-to-r from-cyan-600 to-cyan-400 p-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                           {profile.image ? (
                              <img
                                 src={profile.image}
                                 alt={profile.name}
                                 className="w-20 h-20 rounded-full object-cover"
                              />
                           ) : (
                              <User className="w-10 h-10 text-cyan-600" />
                           )}
                        </div>
                        <div>
                           <h2 className="text-2xl font-bold text-white">
                              {profile.name}
                           </h2>
                           <p className="text-cyan-50 mt-1 flex items-center gap-2">
                              <Shield size={16} />
                              Reviewer
                           </p>
                        </div>
                     </div>

                     {!isEditing ? (
                        <button
                           onClick={() => setIsEditing(true)}
                           className="bg-white text-cyan-600 px-5 py-2.5 rounded-lg font-medium hover:bg-cyan-50 transition-colors flex items-center gap-2"
                        >
                           <Edit2 size={18} />
                           Edit Profile
                        </button>
                     ) : (
                        <div className="flex gap-2">
                           <button
                              onClick={handleUpdateProfile}
                              className="bg-white text-green-600 px-5 py-2.5 rounded-lg font-medium hover:bg-white transition-colors flex items-center gap-2"
                           >
                              <Save size={18} />
                              Save
                           </button>
                           <button
                              onClick={handleCancelEdit}
                              className="bg-white text-red-600 px-5 py-2.5 rounded-lg font-medium hover:bg-white transition-colors flex items-center gap-2"
                           >
                              <X size={18} />
                              Cancel
                           </button>
                        </div>
                     )}
                  </div>
               </div>

               {/* Profile Information Grid */}
               <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                     {/* Name Field */}
                     <div className="bg-gray-50 rounded p-4 border border-slate-200 hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                           <User className="w-5 h-5 text-cyan-600" />
                           <p className="text-xs text-slate-500 font-semibold uppercase">
                              Full Name
                           </p>
                        </div>
                        {isEditing ? (
                           <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                              placeholder="Enter your name"
                           />
                        ) : (
                           <p className="text-slate-950 font-semibold">
                              {profile.name}
                           </p>
                        )}
                     </div>

                     {/* Email Field */}
                     <div className="bg-gray-50 rounded p-4 border border-slate-200 hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                           <Mail className="w-5 h-5 text-cyan-600" />
                           <p className="text-xs text-slate-500 font-semibold uppercase">
                              Email Address
                           </p>
                        </div>
                        <p className="text-slate-950 font-semibold break-all">
                           {profile.email}
                        </p>
                        {isEditing && (
                           <p className="text-xs text-slate-400 mt-2">
                              Email cannot be changed
                           </p>
                        )}
                     </div>

                     {/* Phone Field */}
                     <div className="bg-gray-50 rounded p-4 border border-slate-200 hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                           <Phone className="w-5 h-5 text-cyan-600" />
                           <p className="text-xs text-slate-500 font-semibold uppercase">
                              Phone Number
                           </p>
                        </div>
                        {isEditing ? (
                           <input
                              type="text"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                              placeholder="Enter phone number"
                           />
                        ) : (
                           <p className="text-slate-950 font-semibold">
                              {profile.phone || "Not provided"}
                           </p>
                        )}
                     </div>

                     {/* Affiliation Field */}
                     <div className="bg-gray-50 rounded p-4 border border-slate-200 hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                           <Building className="w-5 h-5 text-cyan-600" />
                           <p className="text-xs text-slate-500 font-semibold uppercase">
                              Affiliation/Organization
                           </p>
                        </div>
                        {isEditing ? (
                           <input
                              type="text"
                              name="affiliation"
                              value={formData.affiliation}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                              placeholder="Enter your organization"
                           />
                        ) : (
                           <p className="text-slate-950 font-semibold">
                              {profile.affiliation ||
                                 profile.organization ||
                                 "Not provided"}
                           </p>
                        )}
                     </div>

                     {/* Designation */}
                     {profile.designation && (
                        <div className="bg-gray-50 rounded p-4 border border-slate-200 hover:border-slate-300 transition-colors">
                           <div className="flex items-center gap-2 mb-3">
                              <BookOpen className="w-5 h-5 text-cyan-600" />
                              <p className="text-xs text-slate-500 font-semibold uppercase">
                                 Designation
                              </p>
                           </div>
                           <p className="text-slate-950 font-semibold">
                              {profile.designation}
                           </p>
                        </div>
                     )}

                     {/* Gender */}
                     {profile.gender && (
                        <div className="bg-gray-50 rounded p-4 border border-slate-200 hover:border-slate-300 transition-colors">
                           <div className="flex items-center gap-2 mb-3">
                              <User className="w-5 h-5 text-cyan-600" />
                              <p className="text-xs text-slate-500 font-semibold uppercase">
                                 Gender
                              </p>
                           </div>
                           <p className="text-slate-950 font-semibold">
                              {profile.gender}
                           </p>
                        </div>
                     )}
                  </div>

                  {/* Specialization */}
                  {profile.specialization &&
                     profile.specialization.length > 0 && (
                        <div className="bg-gray-50 rounded p-4 border border-slate-200 hover:border-slate-300 transition-colors mb-6">
                           <div className="flex items-center gap-2 mb-3">
                              <BookOpen className="w-5 h-5 text-cyan-600" />
                              <p className="text-xs text-slate-500 font-semibold uppercase">
                                 Specialization
                              </p>
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {profile.specialization.map((spec, idx) => (
                                 <span
                                    key={idx}
                                    className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-lg text-sm font-medium"
                                 >
                                    {spec}
                                 </span>
                              ))}
                           </div>
                        </div>
                     )}

                  {/* Bio */}
                  {profile.bio && (
                     <div className="bg-gray-50 rounded p-4 border border-slate-200 hover:border-slate-300 transition-colors mb-6">
                        <div className="flex items-center gap-2 mb-3">
                           <User className="w-5 h-5 text-cyan-600" />
                           <p className="text-xs text-slate-500 font-semibold uppercase">
                              Bio
                           </p>
                        </div>
                        <p className="text-slate-950 leading-relaxed whitespace-pre-wrap">
                           {profile.bio}
                        </p>
                     </div>
                  )}

                  {/* Address */}
                  {profile.address && (
                     <div className="bg-gray-50 rounded p-4 border border-slate-200 hover:border-slate-300 transition-colors mb-6">
                        <div className="flex items-center gap-2 mb-3">
                           <Building className="w-5 h-5 text-cyan-600" />
                           <p className="text-xs text-slate-500 font-semibold uppercase">
                              Address
                           </p>
                        </div>
                        <p className="text-slate-950 leading-relaxed">
                           {profile.address}
                        </p>
                     </div>
                  )}
               </div>
            </div>

            {/* Stats Cards Grid - Similar to Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               {/* Account Information Card */}
               <div className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-6 ">
                  <div className="flex items-center gap-3 mb-4">
                     <Calendar className="w-6 h-6 text-cyan-600" />
                     <h3 className="text-lg font-semibold text-slate-950">
                        Account Information
                     </h3>
                  </div>
                  <div className="space-y-4">
                     <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase mb-1">
                           Member Since
                        </p>
                        <p className="text-slate-950 font-semibold">
                           {new Date(profile.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                 year: "numeric",
                                 month: "long",
                                 day: "numeric",
                              }
                           )}
                        </p>
                     </div>
                     <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase mb-1">
                           Account Status
                        </p>
                        <span
                           className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                              profile.isActive
                                 ? "bg-green-100 text-green-800"
                                 : "bg-red-100 text-red-800"
                           }`}
                        >
                           {profile.isActive ? "Active" : "Inactive"}
                        </span>
                     </div>
                  </div>
               </div>

               {/* Assigned Submissions Card */}
               {profile.assignedSubmissions && (
                  <div className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-6 ">
                     <div className="flex items-center gap-3 mb-4">
                        <BookOpen className="w-6 h-6 text-cyan-600" />
                        <h3 className="text-lg font-semibold text-slate-950">
                           Assigned Submissions
                        </h3>
                     </div>
                     <p className="text-3xl font-bold text-slate-950">
                        {Array.isArray(profile.assignedSubmissions)
                           ? profile.assignedSubmissions.length
                           : 0}
                     </p>
                     <p className="text-sm text-slate-500 mt-2">
                        Total submissions assigned for review
                     </p>
                  </div>
               )}
            </div>

            {/* Edit Information Note */}
            {isEditing && (
               <div className="bg-white border border-slate-200 rounded p-4">
                  <p className="text-sm text-yellow-800">
                     <strong>Note:</strong> Only Name, Phone, and Affiliation
                     can be edited. For changes to other fields, please contact
                     the administrator.
                  </p>
               </div>
            )}
         </div>
      </div>
   );
};

export default ReviewerProfile;

