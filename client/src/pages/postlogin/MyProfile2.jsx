// import React, { useState, useContext, useEffect } from "react";
// import { AppContext } from "../../context/AppContext";
// import axios from "axios";
// import { toast } from "react-toastify";
// import {
//    Edit2,
//    Save,
//    X,
//    Mail,
//    Phone,
//    Briefcase,
//    Link2,
//    Building,
//    MapPin,
//    User,
// } from "lucide-react";

// const ProfilePage = () => {
//    const { token, userData, setUserData, backendUrl, getUserData, loading } =
//       useContext(AppContext);

//    const [isEditing, setIsEditing] = useState(false);
//    const [isSaving, setIsSaving] = useState(false);
//    const [formData, setFormData] = useState({
//       name: "",
//       phone: "",
//       gender: "",
//       designation: "",
//       personalUrl: "",
//       organization: "",
//       address: "",
//       bio: "",
//       image: "",
//    });
//    const [imageFile, setImageFile] = useState(null);

//    useEffect(() => {
//       if (userData) {
//          setFormData({
//             name: userData.name || "",
//             phone: userData.phone || "",
//             gender: userData.gender || "Not Selected",
//             designation: userData.designation || "",
//             personalUrl: userData.personalUrl || "",
//             organization: userData.organization || "",
//             address: userData.address || "",
//             bio: userData.bio || "",
//             image: userData.image || "",
//          });
//       }
//    }, [userData]);

//    const handleChange = (e) => {
//       const { name, value } = e.target;
//       setFormData({ ...formData, [name]: value });
//    };

//    const handleImageChange = (e) => {
//       const file = e.target.files[0];
//       if (file) {
//          setImageFile(file);
//          const reader = new FileReader();
//          reader.onloadend = () => {
//             setFormData({ ...formData, image: reader.result });
//          };
//          reader.readAsDataURL(file);
//       }
//    };

//    const handleSubmit = async (e) => {
//       e.preventDefault();
//       setIsSaving(true);
//       try {
//          const payload = new FormData();

//          // Append only non-empty text fields
//          for (let key of [
//             "name",
//             "phone",
//             "gender",
//             "designation",
//             "personalUrl",
//             "organization",
//             "address",
//             "bio",
//          ]) {
//             if (formData[key] && formData[key].length > 0) {
//                payload.append(key, formData[key]);
//             }
//          }

//          // Append image file only if user selected a new file
//          if (imageFile) {
//             payload.append("image", imageFile);
//          }

//          const { data } = await axios.post(
//             `${backendUrl}/api/user/update-profile`,
//             payload,
//             {
//                headers: {
//                   Authorization: `Bearer ${token}`,
//                   "Content-Type": "multipart/form-data",
//                },
//             }
//          );

//          if (data.success) {
//             toast.success("Profile updated successfully!");
//             setImageFile(null);
//             setIsEditing(false);
//             getUserData(); // refresh context data
//          } else {
//             toast.error(data.message);
//          }
//       } catch (error) {
//          toast.error(error.response?.data?.message || error.message);
//       } finally {
//          setIsSaving(false);
//       }
//    };

//    const handleCancel = () => {
//       setIsEditing(false);
//       setImageFile(null);
//       // Reset form to original userData
//       if (userData) {
//          setFormData({
//             name: userData.name || "",
//             phone: userData.phone || "",
//             gender: userData.gender || "Not Selected",
//             designation: userData.designation || "",
//             personalUrl: userData.personalUrl || "",
//             organization: userData.organization || "",
//             address: userData.address || "",
//             bio: userData.bio || "",
//             image: userData.image || "",
//          });
//       }
//    };

//    if (loading) {
//       return (
//          <div className="flex items-center justify-center min-h-screen">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//          </div>
//       );
//    }

//    return (
//       <div className="max-w-5xl mx-auto p-6">
//          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
//             {/* Header Section */}
//             <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32"></div>

//             <div className="px-8 pb-8">
//                {/* Profile Image */}
//                <div className="flex justify-center -mt-16 mb-6">
//                   <div className="relative">
//                      <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-lg">
//                         <img
//                            src={
//                               formData.image ||
//                               "https://via.placeholder.com/150"
//                            }
//                            alt="Profile"
//                            className="w-full h-full object-cover"
//                         />
//                      </div>
//                      {isEditing && (
//                         <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg transition-colors">
//                            <Edit2 size={16} />
//                            <input
//                               type="file"
//                               accept="image/*"
//                               onChange={handleImageChange}
//                               className="hidden"
//                            />
//                         </label>
//                      )}
//                   </div>
//                </div>

//                {/* Profile Information */}
//                <div className="space-y-6">
//                   {/* Name Section */}
//                   <div className="text-center">
//                      {isEditing ? (
//                         <input
//                            type="text"
//                            name="name"
//                            placeholder="Your Name"
//                            value={formData.name}
//                            onChange={handleChange}
//                            className="text-3xl font-bold w-full text-center border-b-2 border-gray-300 focus:border-blue-600 outline-none pb-2 transition-colors bg-transparent text-white"
//                         />
//                      ) : (
//                         <h1 className="text-3xl font-bold text-white">
//                            {formData.name || "Your Name"}
//                         </h1>
//                      )}
//                   </div>

//                   {/* Grid Layout for Fields - 3 Columns */}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                      {/* Email (Read-only) */}
//                      <div className="flex items-start gap-3 p-4 bg-gray-900 rounded-lg">
//                         <Mail
//                            className="text-gray-400 mt-1 flex-shrink-0"
//                            size={20}
//                         />
//                         <div className="flex-1 min-w-0">
//                            <label className="text-sm font-medium text-gray-400 block mb-1">
//                               Email
//                            </label>
//                            <p className="text-white break-words">
//                               {userData?.email || "Not provided"}
//                            </p>
//                         </div>
//                      </div>

//                      {/* Phone */}
//                      <div className="flex items-start gap-3 p-4 bg-gray-900 rounded-lg">
//                         <Phone
//                            className="text-gray-400 mt-1 flex-shrink-0"
//                            size={20}
//                         />
//                         <div className="flex-1 min-w-0">
//                            <label className="text-sm font-medium text-gray-400 block mb-1">
//                               Phone
//                            </label>
//                            {isEditing ? (
//                               <input
//                                  type="text"
//                                  name="phone"
//                                  placeholder="Your phone number"
//                                  value={formData.phone}
//                                  onChange={handleChange}
//                                  className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               />
//                            ) : (
//                               <p className="text-white">
//                                  {formData.phone || "Not provided"}
//                               </p>
//                            )}
//                         </div>
//                      </div>

//                      {/* Gender */}
//                      <div className="flex items-start gap-3 p-4 bg-gray-900 rounded-lg">
//                         <User
//                            className="text-gray-400 mt-1 flex-shrink-0"
//                            size={20}
//                         />
//                         <div className="flex-1 min-w-0">
//                            <label className="text-sm font-medium text-gray-400 block mb-1">
//                               Gender
//                            </label>
//                            {isEditing ? (
//                               <select
//                                  name="gender"
//                                  value={formData.gender}
//                                  onChange={handleChange}
//                                  className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               >
//                                  <option>Not Selected</option>
//                                  <option>Male</option>
//                                  <option>Female</option>
//                                  <option>Other</option>
//                               </select>
//                            ) : (
//                               <p className="text-white">
//                                  {formData.gender || "Not Selected"}
//                               </p>
//                            )}
//                         </div>
//                      </div>

//                      {/* Designation */}
//                      <div className="flex items-start gap-3 p-4 bg-gray-900 rounded-lg">
//                         <Briefcase
//                            className="text-gray-400 mt-1 flex-shrink-0"
//                            size={20}
//                         />
//                         <div className="flex-1 min-w-0">
//                            <label className="text-sm font-medium text-gray-400 block mb-1">
//                               Designation
//                            </label>
//                            {isEditing ? (
//                               <input
//                                  type="text"
//                                  name="designation"
//                                  placeholder="Your designation"
//                                  value={formData.designation}
//                                  onChange={handleChange}
//                                  className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               />
//                            ) : (
//                               <p className="text-white">
//                                  {formData.designation || "Not provided"}
//                               </p>
//                            )}
//                         </div>
//                      </div>

//                      {/* Organization */}
//                      <div className="flex items-start gap-3 p-4 bg-gray-900 rounded-lg">
//                         <Building
//                            className="text-gray-400 mt-1 flex-shrink-0"
//                            size={20}
//                         />
//                         <div className="flex-1 min-w-0">
//                            <label className="text-sm font-medium text-gray-400 block mb-1">
//                               Organization
//                            </label>
//                            {isEditing ? (
//                               <input
//                                  type="text"
//                                  name="organization"
//                                  placeholder="Your organization"
//                                  value={formData.organization}
//                                  onChange={handleChange}
//                                  className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               />
//                            ) : (
//                               <p className="text-white">
//                                  {formData.organization || "Not provided"}
//                               </p>
//                            )}
//                         </div>
//                      </div>

//                      {/* Personal URL */}
//                      <div className="flex items-start gap-3 p-4 bg-gray-900 rounded-lg">
//                         <Link2
//                            className="text-gray-400 mt-1 flex-shrink-0"
//                            size={20}
//                         />
//                         <div className="flex-1 min-w-0">
//                            <label className="text-sm font-medium text-gray-400 block mb-1">
//                               Personal URL
//                            </label>
//                            {isEditing ? (
//                               <input
//                                  type="text"
//                                  name="personalUrl"
//                                  placeholder="Your website or portfolio"
//                                  value={formData.personalUrl}
//                                  onChange={handleChange}
//                                  className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               />
//                            ) : (
//                               <p className="text-white break-all">
//                                  {formData.personalUrl ? (
//                                     <a
//                                        href={formData.personalUrl}
//                                        target="_blank"
//                                        rel="noopener noreferrer"
//                                        className="text-blue-400 hover:underline"
//                                     >
//                                        {formData.personalUrl}
//                                     </a>
//                                  ) : (
//                                     "Not provided"
//                                  )}
//                               </p>
//                            )}
//                         </div>
//                      </div>
//                   </div>

//                   {/* Address - Full Width */}
//                   <div className="flex items-start gap-3 p-4 bg-gray-900 rounded-lg">
//                      <MapPin
//                         className="text-gray-400 mt-1 flex-shrink-0"
//                         size={20}
//                      />
//                      <div className="flex-1">
//                         <label className="text-sm font-medium text-gray-400 block mb-1">
//                            Address
//                         </label>
//                         {isEditing ? (
//                            <input
//                               type="text"
//                               name="address"
//                               placeholder="Your address"
//                               value={formData.address}
//                               onChange={handleChange}
//                               className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                            />
//                         ) : (
//                            <p className="text-white">
//                               {formData.address || "Not provided"}
//                            </p>
//                         )}
//                      </div>
//                   </div>

//                   {/* Bio - Full Width */}
//                   <div className="p-4 bg-gray-900 rounded-lg">
//                      <label className="text-sm font-medium text-gray-400 block mb-2">
//                         Bio
//                      </label>
//                      {isEditing ? (
//                         <textarea
//                            name="bio"
//                            placeholder="Tell us about yourself..."
//                            value={formData.bio}
//                            onChange={handleChange}
//                            rows="4"
//                            className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                         />
//                      ) : (
//                         <p className="text-white whitespace-pre-wrap">
//                            {formData.bio || "No bio provided"}
//                         </p>
//                      )}
//                   </div>

//                   {/* Action Buttons at Bottom */}
//                   <div className="flex justify-center pt-4">
//                      {!isEditing ? (
//                         <button
//                            onClick={() => setIsEditing(true)}
//                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
//                         >
//                            <Edit2 size={18} />
//                            Edit Profile
//                         </button>
//                      ) : (
//                         <div className="flex gap-3">
//                            <button
//                               onClick={handleSubmit}
//                               disabled={isSaving}
//                               className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//                            >
//                               {isSaving ? (
//                                  <>
//                                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                                     Saving...
//                                  </>
//                               ) : (
//                                  <>
//                                     <Save size={18} />
//                                     Save Changes
//                                  </>
//                               )}
//                            </button>
//                            <button
//                               onClick={handleCancel}
//                               disabled={isSaving}
//                               className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//                            >
//                               <X size={18} />
//                               Cancel
//                            </button>
//                         </div>
//                      )}
//                   </div>
//                </div>
//             </div>
//          </div>
//       </div>
//    );
// };

// export default ProfilePage;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState, useContext, useEffect } from "react";
// import { AppContext } from "../../context/AppContext";
// import axios from "axios";
// import { toast } from "react-toastify";
// import {
//    Edit2,
//    Save,
//    X,
//    Mail,
//    Phone,
//    Briefcase,
//    Link2,
//    Building,
//    MapPin,
//    User,
// } from "lucide-react";

// const ProfilePage = () => {
//    const { token, userData, setUserData, backendUrl, getUserData, loading } =
//       useContext(AppContext);

//    const [isEditing, setIsEditing] = useState(false);
//    const [isSaving, setIsSaving] = useState(false);
//    const [formData, setFormData] = useState({
//       name: "",
//       phone: "",
//       gender: "",
//       designation: "",
//       personalUrl: "",
//       organization: "",
//       address: "",
//       bio: "",
//       image: "",
//    });
//    const [imageFile, setImageFile] = useState(null);

//    useEffect(() => {
//       if (userData) {
//          setFormData({
//             name: userData.name || "",
//             phone: userData.phone || "",
//             gender: userData.gender || "Not Selected",
//             designation: userData.designation || "",
//             personalUrl: userData.personalUrl || "",
//             organization: userData.organization || "",
//             address: userData.address || "",
//             bio: userData.bio || "",
//             image: userData.image || "",
//          });
//       }
//    }, [userData]);

//    const handleChange = (e) => {
//       const { name, value } = e.target;
//       setFormData({ ...formData, [name]: value });
//    };

//    const handleImageChange = (e) => {
//       const file = e.target.files[0];
//       if (file) {
//          setImageFile(file);
//          const reader = new FileReader();
//          reader.onloadend = () => {
//             setFormData({ ...formData, image: reader.result });
//          };
//          reader.readAsDataURL(file);
//       }
//    };

//    const handleSubmit = async (e) => {
//       e.preventDefault();
//       setIsSaving(true);
//       try {
//          const payload = new FormData();

//          // Append only non-empty text fields
//          for (let key of [
//             "name",
//             "phone",
//             "gender",
//             "designation",
//             "personalUrl",
//             "organization",
//             "address",
//             "bio",
//          ]) {
//             if (formData[key] && formData[key].length > 0) {
//                payload.append(key, formData[key]);
//             }
//          }

//          // Append image file only if user selected a new file
//          if (imageFile) {
//             payload.append("image", imageFile);
//          }

//          const { data } = await axios.post(
//             `${backendUrl}/api/user/update-profile`,
//             payload,
//             {
//                headers: {
//                   Authorization: `Bearer ${token}`,
//                   "Content-Type": "multipart/form-data",
//                },
//             }
//          );

//          if (data.success) {
//             toast.success("Profile updated successfully!");
//             setImageFile(null);
//             setIsEditing(false);
//             getUserData(); // refresh context data
//          } else {
//             toast.error(data.message);
//          }
//       } catch (error) {
//          toast.error(error.response?.data?.message || error.message);
//       } finally {
//          setIsSaving(false);
//       }
//    };

//    const handleCancel = () => {
//       setIsEditing(false);
//       setImageFile(null);
//       // Reset form to original userData
//       if (userData) {
//          setFormData({
//             name: userData.name || "",
//             phone: userData.phone || "",
//             gender: userData.gender || "Not Selected",
//             designation: userData.designation || "",
//             personalUrl: userData.personalUrl || "",
//             organization: userData.organization || "",
//             address: userData.address || "",
//             bio: userData.bio || "",
//             image: userData.image || "",
//          });
//       }
//    };

//    if (loading) {
//       return (
//          <div className="flex items-center justify-center min-h-screen bg-gray-900">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//          </div>
//       );
//    }

//    return (
//       <div className="min-h-screen bg-gray-900 p-6">
//          <div className="max-w-6xl mx-auto">
//             {/* Top Section: Image + Email */}
//             <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
//                {/* Profile Image */}
//                <div className="relative flex-shrink-0">
//                   <div className="w-48 h-48 rounded-xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 shadow-2xl border-2 border-blue-500">
//                      <img
//                         src={
//                            formData.image || "https://via.placeholder.com/200"
//                         }
//                         alt="Profile"
//                         className="w-full h-full object-cover"
//                      />
//                   </div>
//                   {isEditing && (
//                      <label className="absolute bottom-3 right-3 bg-blue-600 text-white p-3 rounded-lg cursor-pointer hover:bg-blue-700 shadow-lg transition-all hover:scale-105">
//                         <Edit2 size={18} />
//                         <input
//                            type="file"
//                            accept="image/*"
//                            onChange={handleImageChange}
//                            className="hidden"
//                         />
//                      </label>
//                   )}
//                </div>

//                {/* Email Card */}
//                <div className="flex-1 w-full">
//                   <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700 h-full flex flex-col justify-center">
//                      <div className="flex items-center gap-4">
//                         <div className="bg-blue-600 p-3 rounded-lg">
//                            <Mail className="text-white" size={24} />
//                         </div>
//                         <div>
//                            <label className="text-sm font-medium text-gray-400 block mb-1">
//                               Email Address
//                            </label>
//                            <p className="text-white text-xl font-semibold break-words">
//                               {userData?.email || "Not provided"}
//                            </p>
//                         </div>
//                      </div>
//                   </div>
//                </div>
//             </div>

//             {/* Name Section */}
//             <div className="mb-8">
//                {isEditing ? (
//                   <input
//                      type="text"
//                      name="name"
//                      placeholder="Your Name"
//                      value={formData.name}
//                      onChange={handleChange}
//                      className="text-4xl font-bold w-full border-b-2 border-gray-700 focus:border-blue-600 outline-none pb-3 transition-colors bg-transparent text-white placeholder-gray-600"
//                   />
//                ) : (
//                   <h1 className="text-4xl font-bold text-white">
//                      {formData.name || "Your Name"}
//                   </h1>
//                )}
//             </div>

//             {/* Grid Layout for Fields - 3 Columns */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//                {/* Phone */}
//                <div className="bg-gray-800 rounded-xl p-5 shadow-xl border border-gray-700 hover:border-gray-600 transition-colors">
//                   <div className="flex items-start gap-3">
//                      <div className="bg-blue-600 bg-opacity-20 p-2 rounded-lg">
//                         <Phone className="text-blue-400" size={20} />
//                      </div>
//                      <div className="flex-1 min-w-0">
//                         <label className="text-xs font-semibold text-gray-400 block mb-2 uppercase tracking-wide">
//                            Phone
//                         </label>
//                         {isEditing ? (
//                            <input
//                               type="text"
//                               name="phone"
//                               placeholder="Your phone number"
//                               value={formData.phone}
//                               onChange={handleChange}
//                               className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                            />
//                         ) : (
//                            <p className="text-white text-lg font-medium">
//                               {formData.phone || "Not provided"}
//                            </p>
//                         )}
//                      </div>
//                   </div>
//                </div>

//                {/* Gender */}
//                <div className="bg-gray-800 rounded-xl p-5 shadow-xl border border-gray-700 hover:border-gray-600 transition-colors">
//                   <div className="flex items-start gap-3">
//                      <div className="bg-blue-600 bg-opacity-20 p-2 rounded-lg">
//                         <User className="text-blue-400" size={20} />
//                      </div>
//                      <div className="flex-1 min-w-0">
//                         <label className="text-xs font-semibold text-gray-400 block mb-2 uppercase tracking-wide">
//                            Gender
//                         </label>
//                         {isEditing ? (
//                            <select
//                               name="gender"
//                               value={formData.gender}
//                               onChange={handleChange}
//                               className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                            >
//                               <option>Not Selected</option>
//                               <option>Male</option>
//                               <option>Female</option>
//                               <option>Other</option>
//                            </select>
//                         ) : (
//                            <p className="text-white text-lg font-medium">
//                               {formData.gender || "Not Selected"}
//                            </p>
//                         )}
//                      </div>
//                   </div>
//                </div>

//                {/* Designation */}
//                <div className="bg-gray-800 rounded-xl p-5 shadow-xl border border-gray-700 hover:border-gray-600 transition-colors">
//                   <div className="flex items-start gap-3">
//                      <div className="bg-blue-600 bg-opacity-20 p-2 rounded-lg">
//                         <Briefcase className="text-blue-400" size={20} />
//                      </div>
//                      <div className="flex-1 min-w-0">
//                         <label className="text-xs font-semibold text-gray-400 block mb-2 uppercase tracking-wide">
//                            Designation
//                         </label>
//                         {isEditing ? (
//                            <input
//                               type="text"
//                               name="designation"
//                               placeholder="Your designation"
//                               value={formData.designation}
//                               onChange={handleChange}
//                               className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                            />
//                         ) : (
//                            <p className="text-white text-lg font-medium">
//                               {formData.designation || "Not provided"}
//                            </p>
//                         )}
//                      </div>
//                   </div>
//                </div>

//                {/* Organization */}
//                <div className="bg-gray-800 rounded-xl p-5 shadow-xl border border-gray-700 hover:border-gray-600 transition-colors">
//                   <div className="flex items-start gap-3">
//                      <div className="bg-blue-600 bg-opacity-20 p-2 rounded-lg">
//                         <Building className="text-blue-400" size={20} />
//                      </div>
//                      <div className="flex-1 min-w-0">
//                         <label className="text-xs font-semibold text-gray-400 block mb-2 uppercase tracking-wide">
//                            Organization
//                         </label>
//                         {isEditing ? (
//                            <input
//                               type="text"
//                               name="organization"
//                               placeholder="Your organization"
//                               value={formData.organization}
//                               onChange={handleChange}
//                               className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                            />
//                         ) : (
//                            <p className="text-white text-lg font-medium">
//                               {formData.organization || "Not provided"}
//                            </p>
//                         )}
//                      </div>
//                   </div>
//                </div>

//                {/* Personal URL */}
//                <div className="bg-gray-800 rounded-xl p-5 shadow-xl border border-gray-700 hover:border-gray-600 transition-colors">
//                   <div className="flex items-start gap-3">
//                      <div className="bg-blue-600 bg-opacity-20 p-2 rounded-lg">
//                         <Link2 className="text-blue-400" size={20} />
//                      </div>
//                      <div className="flex-1 min-w-0">
//                         <label className="text-xs font-semibold text-gray-400 block mb-2 uppercase tracking-wide">
//                            Personal URL
//                         </label>
//                         {isEditing ? (
//                            <input
//                               type="text"
//                               name="personalUrl"
//                               placeholder="Your website"
//                               value={formData.personalUrl}
//                               onChange={handleChange}
//                               className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                            />
//                         ) : (
//                            <p className="text-white text-lg font-medium break-all">
//                               {formData.personalUrl ? (
//                                  <a
//                                     href={formData.personalUrl}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
//                                  >
//                                     {formData.personalUrl}
//                                  </a>
//                               ) : (
//                                  "Not provided"
//                               )}
//                            </p>
//                         )}
//                      </div>
//                   </div>
//                </div>

//                {/* Address */}
//                <div className="bg-gray-800 rounded-xl p-5 shadow-xl border border-gray-700 hover:border-gray-600 transition-colors">
//                   <div className="flex items-start gap-3">
//                      <div className="bg-blue-600 bg-opacity-20 p-2 rounded-lg">
//                         <MapPin className="text-blue-400" size={20} />
//                      </div>
//                      <div className="flex-1 min-w-0">
//                         <label className="text-xs font-semibold text-gray-400 block mb-2 uppercase tracking-wide">
//                            Address
//                         </label>
//                         {isEditing ? (
//                            <input
//                               type="text"
//                               name="address"
//                               placeholder="Your address"
//                               value={formData.address}
//                               onChange={handleChange}
//                               className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                            />
//                         ) : (
//                            <p className="text-white text-lg font-medium">
//                               {formData.address || "Not provided"}
//                            </p>
//                         )}
//                      </div>
//                   </div>
//                </div>
//             </div>

//             {/* Bio - Full Width */}
//             <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700 mb-8">
//                <label className="text-xs font-semibold text-gray-400 block mb-3 uppercase tracking-wide">
//                   Bio
//                </label>
//                {isEditing ? (
//                   <textarea
//                      name="bio"
//                      placeholder="Tell us about yourself..."
//                      value={formData.bio}
//                      onChange={handleChange}
//                      rows="5"
//                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
//                   />
//                ) : (
//                   <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">
//                      {formData.bio || "No bio provided"}
//                   </p>
//                )}
//             </div>

//             {/* Action Buttons at Bottom */}
//             <div className="flex justify-center">
//                {!isEditing ? (
//                   <button
//                      onClick={() => setIsEditing(true)}
//                      className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-lg"
//                   >
//                      <Edit2 size={20} />
//                      Edit Profile
//                   </button>
//                ) : (
//                   <div className="flex gap-4">
//                      <button
//                         onClick={handleSubmit}
//                         disabled={isSaving}
//                         className="flex items-center gap-3 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-semibold text-lg"
//                      >
//                         {isSaving ? (
//                            <>
//                               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                               Saving...
//                            </>
//                         ) : (
//                            <>
//                               <Save size={20} />
//                               Save Changes
//                            </>
//                         )}
//                      </button>
//                      <button
//                         onClick={handleCancel}
//                         disabled={isSaving}
//                         className="flex items-center gap-3 px-8 py-4 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-semibold text-lg"
//                      >
//                         <X size={20} />
//                         Cancel
//                      </button>
//                   </div>
//                )}
//             </div>
//          </div>
//       </div>
//    );
// };

// export default ProfilePage;
// import React, { useState, useContext, useEffect } from "react";
// import { AppContext } from "../../context/AppContext";
// import axios from "axios";
// import { toast } from "react-toastify";
// import {
//    Edit2,
//    Save,
//    X,
//    Mail,
//    Phone,
//    Briefcase,
//    Link2,
//    Building,
//    MapPin,
//    User,
// } from "lucide-react";

// const ProfilePage = () => {
//    const { token, userData, backendUrl, getUserData, loading } =
//       useContext(AppContext);

//    const [isEditing, setIsEditing] = useState(false);
//    const [isSaving, setIsSaving] = useState(false);
//    const [formData, setFormData] = useState({
//       name: "",
//       phone: "",
//       gender: "",
//       designation: "",
//       personalUrl: "",
//       organization: "",
//       address: "",
//       bio: "",
//       image: "",
//    });
//    const [imageFile, setImageFile] = useState(null);

//    useEffect(() => {
//       if (userData) {
//          setFormData({
//             name: userData.name || "",
//             phone: userData.phone || "",
//             gender: userData.gender || "",
//             designation: userData.designation || "",
//             personalUrl: userData.personalUrl || "",
//             organization: userData.organization || "",
//             address: userData.address || "",
//             bio: userData.bio || "",
//             image: userData.image || "",
//          });
//       }
//    }, [userData]);

//    const handleChange = (e) => {
//       const { name, value } = e.target;
//       setFormData({ ...formData, [name]: value });
//    };

//    const handleImageChange = (e) => {
//       const file = e.target.files[0];
//       if (!file) return;

//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//          setFormData({ ...formData, image: reader.result });
//       };
//       reader.readAsDataURL(file);
//    };

//    const handleSubmit = async (e) => {
//       e.preventDefault();
//       setIsSaving(true);

//       try {
//          const payload = new FormData();

//          Object.keys(formData).forEach((key) => {
//             if (key !== "image") payload.append(key, formData[key]);
//          });

//          if (imageFile) payload.append("image", imageFile);

//          const { data } = await axios.post(
//             `${backendUrl}/api/user/update-profile`,
//             payload,
//             {
//                headers: {
//                   Authorization: `Bearer ${token}`,
//                   "Content-Type": "multipart/form-data",
//                },
//             }
//          );

//          if (data.success) {
//             toast.success("Profile updated successfully!");
//             setIsEditing(false);
//             setImageFile(null);
//             getUserData();
//          } else toast.error(data.message);
//       } catch (error) {
//          toast.error(error.response?.data?.message || "Update failed.");
//       } finally {
//          setIsSaving(false);
//       }
//    };

//    const handleCancel = () => {
//       setIsEditing(false);
//       setImageFile(null);
//       setFormData({
//          name: userData.name || "",
//          phone: userData.phone || "",
//          gender: userData.gender || "",
//          designation: userData.designation || "",
//          personalUrl: userData.personalUrl || "",
//          organization: userData.organization || "",
//          address: userData.address || "",
//          bio: userData.bio || "",
//          image: userData.image || "",
//       });
//    };

//    if (loading)
//       return (
//          <div className="flex items-center justify-center min-h-screen bg-slate-900">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//          </div>
//       );

//    return (
//       <div className="min-h-screen bg-gray-50 p-4 lg:p-6 -m-8">
//          <div className="max-w-7xl mx-auto">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
//                {/* LEFT SECTION */}
//                <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 flex flex-col items-center">
//                   {/* Profile Image */}
//                   <div className="relative mb-6 w-40 h-40 rounded-xl overflow-hidden border-4 border-blue-600 shadow-xl">
//                      <img
//                         src={
//                            formData.image || "https://via.placeholder.com/150"
//                         }
//                         alt="Profile"
//                         className="w-full h-full object-cover"
//                      />
//                      {isEditing && (
//                         <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-lg cursor-pointer hover:bg-blue-700 shadow-md transition-all hover:scale-110">
//                            <Edit2 size={18} />
//                            <input
//                               type="file"
//                               accept="image/*"
//                               onChange={handleImageChange}
//                               className="hidden"
//                            />
//                         </label>
//                      )}
//                   </div>

//                   {/* Email */}
//                   <div className="w-full bg-slate-900 rounded-xl p-4 border border-slate-700">
//                      <div className="flex items-center gap-3">
//                         <Mail className="text-blue-400 shrink-0" size={20} />
//                         <div>
//                            <p className="text-xs text-gray-400 mb-1">Email</p>
//                            <p className="text-white text-sm">
//                               {userData?.email}
//                            </p>
//                         </div>
//                      </div>
//                   </div>
//                </div>

//                {/* RIGHT SECTION */}
//                <div className="lg:col-span-2 bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 flex flex-col justify-between">
//                   <form
//                      onSubmit={handleSubmit}
//                      className="flex flex-col h-full"
//                   >
//                      {/* NAME */}
//                      <div className="mb-6">
//                         {isEditing ? (
//                            <input
//                               type="text"
//                               name="name"
//                               value={formData.name}
//                               onChange={handleChange}
//                               className="text-3xl font-bold w-full bg-slate-900 text-white border border-slate-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
//                            />
//                         ) : (
//                            <h1 className="text-3xl font-bold text-white">
//                               {formData.name}
//                            </h1>
//                         )}
//                      </div>

//                      {/* DETAILS GRID */}
//                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 grow">
//                         {[
//                            {
//                               icon: (
//                                  <Phone className="text-blue-400" size={18} />
//                               ),
//                               label: "PHONE",
//                               name: "phone",
//                            },
//                            {
//                               icon: (
//                                  <User className="text-purple-400" size={18} />
//                               ),
//                               label: "GENDER",
//                               name: "gender",
//                               type: "select",
//                            },
//                            {
//                               icon: (
//                                  <Briefcase
//                                     className="text-green-400"
//                                     size={18}
//                                  />
//                               ),
//                               label: "DESIGNATION",
//                               name: "designation",
//                            },
//                            {
//                               icon: (
//                                  <Building
//                                     className="text-orange-400"
//                                     size={18}
//                                  />
//                               ),
//                               label: "ORGANIZATION",
//                               name: "organization",
//                            },
//                            {
//                               icon: (
//                                  <Link2 className="text-cyan-400" size={18} />
//                               ),
//                               label: "PERSONAL URL",
//                               name: "personalUrl",
//                            },
//                            {
//                               icon: (
//                                  <MapPin className="text-pink-400" size={18} />
//                               ),
//                               label: "ADDRESS",
//                               name: "address",
//                            },
//                         ].map((field) => (
//                            <div
//                               key={field.name}
//                               className="bg-slate-900 rounded-xl p-4 border border-slate-700"
//                            >
//                               <div className="flex items-start gap-3">
//                                  <div className="bg-slate-800 p-2 rounded-lg">
//                                     {field.icon}
//                                  </div>
//                                  <div className="flex-1 min-w-0">
//                                     <p className="text-xs text-gray-400 mb-1.5 font-medium">
//                                        {field.label}
//                                     </p>

//                                     {isEditing ? (
//                                        field.type === "select" ? (
//                                           <select
//                                              name={field.name}
//                                              value={formData[field.name]}
//                                              onChange={handleChange}
//                                              className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm"
//                                           >
//                                              <option value="">
//                                                 Not Selected
//                                              </option>
//                                              <option value="Male">Male</option>
//                                              <option value="Female">
//                                                 Female
//                                              </option>
//                                              <option value="Other">
//                                                 Other
//                                              </option>
//                                           </select>
//                                        ) : (
//                                           <input
//                                              type="text"
//                                              name={field.name}
//                                              value={formData[field.name]}
//                                              onChange={handleChange}
//                                              className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm"
//                                           />
//                                        )
//                                     ) : (
//                                        <p className="text-white font-medium break-all">
//                                           {field.name === "personalUrl" &&
//                                           formData.personalUrl ? (
//                                              <a
//                                                 href={formData.personalUrl}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="text-cyan-400 hover:underline"
//                                              >
//                                                 {formData.personalUrl}
//                                              </a>
//                                           ) : (
//                                              formData[field.name] ||
//                                              "Not provided"
//                                           )}
//                                        </p>
//                                     )}
//                                  </div>
//                               </div>
//                            </div>
//                         ))}
//                      </div>

//                      {/* BIO SECTION */}
//                      <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 mt-6">
//                         <p className="text-xs text-gray-400 mb-2 font-medium">
//                            BIO
//                         </p>
//                         {isEditing ? (
//                            <textarea
//                               name="bio"
//                               value={formData.bio}
//                               onChange={handleChange}
//                               rows="3"
//                               className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm resize-none"
//                            />
//                         ) : (
//                            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
//                               {formData.bio || "No bio provided"}
//                            </p>
//                         )}
//                      </div>

//                      {/* ACTION BUTTONS */}
//                      <div className="flex justify-end gap-3 mt-6">
//                         {!isEditing ? (
//                            <button
//                               onClick={() => setIsEditing(true)}
//                               type="button"
//                               className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg"
//                            >
//                               <Edit2 size={18} /> Edit Profile
//                            </button>
//                         ) : (
//                            <>
//                               <button
//                                  type="button"
//                                  onClick={handleCancel}
//                                  disabled={isSaving}
//                                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 text-white rounded-xl"
//                               >
//                                  <X size={18} /> Cancel
//                               </button>
//                               <button
//                                  type="submit"
//                                  disabled={isSaving}
//                                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl"
//                               >
//                                  {isSaving ? (
//                                     <>
//                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                                        Saving...
//                                     </>
//                                  ) : (
//                                     <>
//                                        <Save size={18} /> Save Changes
//                                     </>
//                                  )}
//                               </button>
//                            </>
//                         )}
//                      </div>
//                   </form>
//                </div>
//             </div>
//          </div>
//       </div>
//    );
// };

// export default ProfilePage;

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
            }
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
