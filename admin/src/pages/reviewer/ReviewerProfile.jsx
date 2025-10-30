import React, { useState, useEffect } from "react";
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

const ReviewerProfile = () => {
   const [profile, setProfile] = useState(null);
   const [loading, setLoading] = useState(true);
   const [isEditing, setIsEditing] = useState(false);
   const [formData, setFormData] = useState({
      name: "",
      phone: "",
      affiliation: "",
   });

   const backendUrl = "http://localhost:4000";
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

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
         </div>
      );
   }

   if (!profile) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
               <p className="text-xl text-gray-600">Profile not found</p>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50 p-6">
         <div className="max-w-4xl mx-auto">
            <div className="mb-8">
               <h1 className="text-4xl font-bold text-gray-800">
                  Reviewer Profile
               </h1>
               <p className="text-gray-600 mt-2">
                  Manage your personal information and preferences
               </p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
               {/* Header Section */}
               <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                           {profile.image ? (
                              <img
                                 src={profile.image}
                                 alt={profile.name}
                                 className="w-20 h-20 rounded-full object-cover"
                              />
                           ) : (
                              <User className="w-10 h-10 text-blue-600" />
                           )}
                        </div>
                        <div>
                           <h2 className="text-2xl font-bold text-white">
                              {profile.name}
                           </h2>
                           <p className="text-blue-100 mt-1 flex items-center gap-2">
                              <Shield size={16} />
                              Reviewer
                           </p>
                        </div>
                     </div>
                     {!isEditing ? (
                        <button
                           onClick={() => setIsEditing(true)}
                           className="bg-white text-blue-600 px-5 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-all flex items-center gap-2"
                        >
                           <Edit2 size={18} />
                           Edit Profile
                        </button>
                     ) : (
                        <div className="flex gap-2">
                           <button
                              onClick={handleUpdateProfile}
                              className="bg-white text-green-600 px-5 py-2.5 rounded-lg font-medium hover:bg-green-50 transition-all flex items-center gap-2"
                           >
                              <Save size={18} />
                              Save
                           </button>
                           <button
                              onClick={handleCancelEdit}
                              className="bg-white text-red-600 px-5 py-2.5 rounded-lg font-medium hover:bg-red-50 transition-all flex items-center gap-2"
                           >
                              <X size={18} />
                              Cancel
                           </button>
                        </div>
                     )}
                  </div>
               </div>

               {/* Profile Information */}
               <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Name Field */}
                     <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                           <User className="text-blue-600" size={18} />
                           <p className="text-xs text-gray-500 font-semibold uppercase">
                              Full Name
                           </p>
                        </div>
                        {isEditing ? (
                           <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter your name"
                           />
                        ) : (
                           <p className="text-gray-900 font-medium">
                              {profile.name}
                           </p>
                        )}
                     </div>

                     {/* Email Field (Non-editable) */}
                     <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                           <Mail className="text-blue-600" size={18} />
                           <p className="text-xs text-gray-500 font-semibold uppercase">
                              Email Address
                           </p>
                        </div>
                        <p className="text-gray-900 font-medium break-all">
                           {profile.email}
                        </p>
                        {isEditing && (
                           <p className="text-xs text-gray-500 mt-1">
                              Email cannot be changed
                           </p>
                        )}
                     </div>

                     {/* Phone Field */}
                     <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                           <Phone className="text-blue-600" size={18} />
                           <p className="text-xs text-gray-500 font-semibold uppercase">
                              Phone Number
                           </p>
                        </div>
                        {isEditing ? (
                           <input
                              type="text"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter phone number"
                           />
                        ) : (
                           <p className="text-gray-900 font-medium">
                              {profile.phone || "Not provided"}
                           </p>
                        )}
                     </div>

                     {/* Affiliation Field */}
                     <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                           <Building className="text-blue-600" size={18} />
                           <p className="text-xs text-gray-500 font-semibold uppercase">
                              Affiliation/Organization
                           </p>
                        </div>
                        {isEditing ? (
                           <input
                              type="text"
                              name="affiliation"
                              value={formData.affiliation}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter your organization"
                           />
                        ) : (
                           <p className="text-gray-900 font-medium">
                              {profile.affiliation ||
                                 profile.organization ||
                                 "Not provided"}
                           </p>
                        )}
                     </div>

                     {/* Designation (Non-editable) */}
                     {profile.designation && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <div className="flex items-center gap-2 mb-3">
                              <BookOpen className="text-blue-600" size={18} />
                              <p className="text-xs text-gray-500 font-semibold uppercase">
                                 Designation
                              </p>
                           </div>
                           <p className="text-gray-900 font-medium">
                              {profile.designation}
                           </p>
                        </div>
                     )}

                     {/* Gender (Non-editable) */}
                     {profile.gender && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <div className="flex items-center gap-2 mb-3">
                              <User className="text-blue-600" size={18} />
                              <p className="text-xs text-gray-500 font-semibold uppercase">
                                 Gender
                              </p>
                           </div>
                           <p className="text-gray-900 font-medium">
                              {profile.gender}
                           </p>
                        </div>
                     )}
                  </div>

                  {/* Specialization */}
                  {profile.specialization &&
                     profile.specialization.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <div className="flex items-center gap-2 mb-3">
                              <BookOpen className="text-blue-600" size={18} />
                              <p className="text-xs text-gray-500 font-semibold uppercase">
                                 Specialization
                              </p>
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {profile.specialization.map((spec, idx) => (
                                 <span
                                    key={idx}
                                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium"
                                 >
                                    {spec}
                                 </span>
                              ))}
                           </div>
                        </div>
                     )}

                  {/* Bio */}
                  {profile.bio && (
                     <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                           <User className="text-blue-600" size={18} />
                           <p className="text-xs text-gray-500 font-semibold uppercase">
                              Bio
                           </p>
                        </div>
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                           {profile.bio}
                        </p>
                     </div>
                  )}

                  {/* Address */}
                  {profile.address && (
                     <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                           <Building className="text-blue-600" size={18} />
                           <p className="text-xs text-gray-500 font-semibold uppercase">
                              Address
                           </p>
                        </div>
                        <p className="text-gray-900 leading-relaxed">
                           {profile.address}
                        </p>
                     </div>
                  )}

                  {/* Account Information */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                     <div className="flex items-center gap-2 mb-3">
                        <Calendar className="text-blue-600" size={18} />
                        <p className="text-xs text-blue-600 font-semibold uppercase">
                           Account Information
                        </p>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <p className="text-xs text-gray-500 mb-1">
                              Member Since
                           </p>
                           <p className="text-gray-900 font-medium">
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
                           <p className="text-xs text-gray-500 mb-1">
                              Account Status
                           </p>
                           <p className="text-gray-900 font-medium">
                              <span
                                 className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    profile.isActive
                                       ? "bg-green-100 text-green-800"
                                       : "bg-red-100 text-red-800"
                                 }`}
                              >
                                 {profile.isActive ? "Active" : "Inactive"}
                              </span>
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Assigned Submissions Count */}
                  {profile.assignedSubmissions && (
                     <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                           <BookOpen className="text-blue-600" size={18} />
                           <p className="text-xs text-gray-500 font-semibold uppercase">
                              Total Assigned Submissions
                           </p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                           {Array.isArray(profile.assignedSubmissions)
                              ? profile.assignedSubmissions.length
                              : 0}
                        </p>
                     </div>
                  )}
               </div>
            </div>

            {/* Additional Information Note */}
            {isEditing && (
               <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
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
