import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
   User,
   Mail,
   Phone,
   Edit2,
   Save,
   X,
   Briefcase,
   Building,
   Link2,
   MapPin,
} from "lucide-react";

const ProfilePage = () => {
   const { token, userData, backendUrl, getUserData, loading } =
      useContext(AppContext);

   const [isEditing, setIsEditing] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const [formData, setFormData] = useState({
      name: "",
      phone: "",
      gender: "",
      designation: "",
      personalUrl: "",
      organization: "",
      address: "",
      bio: "",
      image: "",
   });

   const [imageFile, setImageFile] = useState(null);

   useEffect(() => {
      if (userData)
         setFormData({
            name: userData.name || "",
            phone: userData.phone || "",
            gender: userData.gender || "",
            designation: userData.designation || "",
            personalUrl: userData.personalUrl || "",
            organization: userData.organization || "",
            address: userData.address || "",
            bio: userData.bio || "",
            image: userData.image || "",
         });
   }, [userData]);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () =>
         setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSaving(true);

      try {
         const payload = new FormData();
         Object.keys(formData).forEach((key) => {
            if (key !== "image") payload.append(key, formData[key]);
         });

         if (imageFile) payload.append("image", imageFile);

         const { data } = await axios.post(
            `${backendUrl}/api/user/update-profile`,
            payload,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
               },
            },
         );

         if (data.success) {
            toast.success("Profile updated successfully!");
            getUserData();
            setIsEditing(false);
            setImageFile(null);
         } else {
            toast.error(data.message);
         }
      } catch (e) {
         toast.error(e.response?.data?.message || "Update failed.");
      } finally {
         setIsSaving(false);
      }
   };

   const handleCancel = () => {
      setIsEditing(false);
      setImageFile(null);
      setFormData({
         name: userData.name || "",
         phone: userData.phone || "",
         gender: userData.gender || "",
         designation: userData.designation || "",
         personalUrl: userData.personalUrl || "",
         organization: userData.organization || "",
         address: userData.address || "",
         bio: userData.bio || "",
         image: userData.image || "",
      });
   };

   if (loading)
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
         </div>
      );

   return (
      <div className="min-h-screen bg-gray-50 p-6 -m-8">
         <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
               My Profile
            </h1>

            {/* Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
               {/* Gradient Header like Reviewer UI */}
               <div className="bg-linear-to-r from-blue-600 to-yellow-700 p-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        {/* Profile Image */}
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-lg">
                           <img
                              src={
                                 formData.image ||
                                 "https://via.placeholder.com/150"
                              }
                              alt="Profile"
                              className="w-full h-full object-cover"
                           />
                        </div>

                        <div>
                           <h2 className="text-2xl font-bold text-white">
                              {formData.name}
                           </h2>
                           <p className="text-blue-100">
                              {formData.designation || "User"}
                           </p>
                        </div>
                     </div>

                     {!isEditing ? (
                        <button
                           onClick={() => setIsEditing(true)}
                           className="bg-white text-blue-600 px-5 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors flex gap-2"
                        >
                           <Edit2 size={18} /> Edit Profile
                        </button>
                     ) : (
                        <div className="flex gap-2">
                           <button
                              type="button"
                              onClick={handleCancel}
                              className="bg-red-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors flex gap-2"
                           >
                              <X size={18} /> Cancel
                           </button>

                           <button
                              type="submit"
                              form="profileForm"
                              disabled={isSaving}
                              className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors flex gap-2"
                           >
                              <Save size={18} />
                              {isSaving ? "Saving..." : "Save"}
                           </button>
                        </div>
                     )}
                  </div>
               </div>

               {/* FORM BODY */}
               <form
                  id="profileForm"
                  onSubmit={handleSubmit}
                  className="p-6 space-y-6"
               >
                  {/* Image Upload */}
                  {isEditing && (
                     <div className="flex justify-center">
                        <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700">
                           Change Image
                           <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                           />
                        </label>
                     </div>
                  )}

                  {/* INFO GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {/* NAME */}
                     <ProfileField
                        icon={<User size={20} className="text-blue-600" />}
                        label="Full Name"
                        editing={isEditing}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                     />

                     {/* EMAIL */}
                     <StaticField
                        icon={<Mail size={20} className="text-blue-600" />}
                        label="Email"
                        value={userData.email}
                     />

                     {/* PHONE */}
                     <ProfileField
                        icon={<Phone size={20} className="text-blue-600" />}
                        label="Phone Number"
                        editing={isEditing}
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                     />

                     <ProfileField
                        icon={<Briefcase size={20} className="text-blue-600" />}
                        label="Designation"
                        editing={isEditing}
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                     />

                     <ProfileField
                        icon={<Building size={20} className="text-blue-600" />}
                        label="Organization"
                        editing={isEditing}
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                     />

                     <ProfileField
                        icon={<Link2 size={20} className="text-blue-600" />}
                        label="Personal URL"
                        editing={isEditing}
                        name="personalUrl"
                        value={formData.personalUrl}
                        onChange={handleChange}
                     />

                     <ProfileField
                        icon={<MapPin size={20} className="text-blue-600" />}
                        label="Address"
                        editing={isEditing}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                     />
                  </div>

                  {/* BIO */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                     <p className="text-xs text-gray-600 font-semibold">Bio</p>
                     {isEditing ? (
                        <textarea
                           name="bio"
                           value={formData.bio}
                           onChange={handleChange}
                           rows="3"
                           className="mt-1 w-full bg-white border border-gray-300 rounded-lg p-3 text-sm"
                        />
                     ) : (
                        <p className="text-gray-800 mt-1 whitespace-pre-wrap">
                           {formData.bio || "No bio added"}
                        </p>
                     )}
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

// ✅ Reusable editable field
const ProfileField = ({ icon, label, editing, name, value, onChange }) => (
   <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
         {icon}
         <p className="text-xs text-gray-500 font-semibold uppercase">
            {label}
         </p>
      </div>
      {editing ? (
         <input
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
         />
      ) : (
         <p className="text-gray-900 font-semibold">
            {value || "Not Provided"}
         </p>
      )}
   </div>
);

// ✅ Read-only field
const StaticField = ({ icon, label, value }) => (
   <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
         {icon}
         <p className="text-xs text-gray-500 font-semibold uppercase">
            {label}
         </p>
      </div>
      <p className="text-gray-900 font-semibold">{value}</p>
   </div>
);

export default ProfilePage;
