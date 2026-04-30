import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../components/Loading"; // import your Loading component

const AddSubmission = () => {
   const { token, userData, loading, setLoading, backendUrl } =
      useContext(AppContext);
   const navigate = useNavigate();
   const location = useLocation();

   const eventOptions = ["IPDIMS 2025", "IPDIMS 2026", "IPDIMS 2027"];

   // Form state
   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");
   const [keywords, setKeywords] = useState("");
   const [authorName, setAuthorName] = useState(userData?.name || "");
   const [authorEmail, setAuthorEmail] = useState(userData?.email || "");
   const [authorOrganization, setAuthorOrganization] = useState("");
   const [eventName, setEventName] = useState("IPDIMS 2025");
   const [attachment, setAttachment] = useState(null);
   const [fileError, setFileError] = useState("");

   const fileInputRef = useRef(null);

   const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
   const ALLOWED_FILE_TYPES = ["application/pdf"];

   const handleFileChange = (e) => {
      const file = e.target.files[0];
      setFileError(""); // Clear previous errors

      if (!file) {
         setAttachment(null);
         return;
      }

      // Check file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
         setFileError("Only PDF files are accepted");
         setAttachment(null);
         e.target.value = ""; // Clear the file input
         return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
         setFileError("File size should be less than 5 MB");
         setAttachment(null);
         e.target.value = ""; // Clear the file input
         return;
      }

      setAttachment(file);
   };

   useEffect(() => {
      if (!token || !userData) {
         navigate("/login", { state: { from: location.pathname } });
      }
   }, [token, userData, navigate, location]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      // Validate file if present
      if (attachment) {
         if (!ALLOWED_FILE_TYPES.includes(attachment.type)) {
            toast.error("Only PDF files are accepted");
            setLoading(false);
            return;
         }
         if (attachment.size > MAX_FILE_SIZE) {
            toast.error("File size should be less than 5 MB");
            setLoading(false);
            return;
         }
      }

      try {
         const formData = new FormData();
         formData.append("title", title);
         formData.append("description", description);
         formData.append("keywords", keywords);
         formData.append("authorName", authorName);
         formData.append("authorEmail", authorEmail);
         formData.append("authorOrganization", authorOrganization);
         formData.append("eventName", eventName);
         if (attachment) formData.append("attachment", attachment);

         const res = await axios.post(
            `${backendUrl}/api/user/add-submission`,
            formData,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
               },
            },
         );

         if (res.data.success) {
            toast.success("Submission added successfully!");
            // Redirect to dashboard after successful submission
            navigate("/dashboard/submissions");
         } else {
            toast.error(
               res.data.message || "Submission failed. Please try again.",
            );
         }
      } catch (error) {
         console.error(error);
         toast.error(error.response?.data?.message || error.message);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      if (userData) {
         setAuthorName(userData.name || "");
         setAuthorEmail(userData.email || "");
         setAuthorOrganization(userData.organization || ""); // or userData.organization
      }
   }, [userData]);

   if (!token || !userData) return null;

   return (
      <div className="bg-black text-white min-h-screen py-12 px-6 md:px-16 font-sans relative">
         {/* Show loading overlay */}
         {loading && <Loading />}

         <div className="max-w-5xl mx-auto space-y-12">
            <header className="text-center">
               <h2 className="text-3xl md:text-4xl font-bold text-indigo-400 mb-6">
                  Add Submission
               </h2>
            </header>

            <div className="bg-white/10 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-lg p-8">
               <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Manuscript Info */}
                  <div>
                     <label className="block font-semibold mb-2 text-indigo-300">
                        Title
                     </label>
                     <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter Title"
                        className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none  placeholder:text-gray-500"
                        required
                     />

                     <label className="block mt-4 mb-2 font-semibold text-indigo-300">
                        Description
                     </label>
                     <textarea
                        rows="6"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description here (Word limit: 250)"
                        className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none  placeholder:text-gray-500"
                     />

                     <label className="block mt-4 mb-2 font-semibold text-indigo-300">
                        Keywords
                     </label>
                     <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="Enter comma separated keywords"
                        className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none  placeholder:text-gray-500"
                     />
                  </div>

                  {/* Attachment */}
                  <div>
                     <h4 className="text-lg font-bold text-indigo-300 mb-4">
                        Attachments
                     </h4>
                     <p className="text-sm text-gray-400 mb-2">
                        Only PDF file accepted (Max size: 5 MB)
                     </p>
                     <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf"
                        className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2 "
                     />
                     {fileError && (
                        <p className="mt-2 text-sm text-red-500">
                           ⚠ {fileError}
                        </p>
                     )}
                     {attachment && !fileError && (
                        <p className="mt-2 text-sm text-green-400">
                           ✓ Selected File: {attachment.name} (
                           {(attachment.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                     )}
                  </div>

                  {/* Event */}
                  <div>
                     <label className="block font-semibold mb-2 text-indigo-300">
                        Event Name
                     </label>
                     <select
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2 "
                     >
                        {eventOptions.map((event) => (
                           <option key={event} value={event}>
                              {event}
                           </option>
                        ))}
                     </select>
                  </div>

                  {/* Author Info */}
                  <div>
                     <h4 className="text-lg font-bold text-indigo-300 mb-4">
                        Author Information
                     </h4>
                     <div className="grid md:grid-cols-2 gap-6">
                        <div>
                           <label className="block font-medium mb-2">
                              Name
                           </label>
                           <input
                              type="text"
                              value={authorName}
                              onChange={(e) => setAuthorName(e.target.value)}
                              className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                              required
                           />
                        </div>
                        <div>
                           <label className="block font-medium mb-2">
                              Email
                           </label>
                           <input
                              type="email"
                              value={authorEmail}
                              onChange={(e) => setAuthorEmail(e.target.value)}
                              className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                              required
                           />
                        </div>
                        <div>
                           <label className="block font-medium mb-2">
                              Organization
                           </label>
                           <input
                              type="text"
                              value={authorOrganization}
                              onChange={(e) =>
                                 setAuthorOrganization(e.target.value)
                              }
                              className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Submit */}
                  <div className="text-center">
                     <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-700 hover:scale-105 transition-transform duration-300"
                     >
                        {loading ? "Submitting..." : "Submit"}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default AddSubmission;
