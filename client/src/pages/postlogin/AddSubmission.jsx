import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../components/Loading"; // import your Loading component

const AddSubmission = () => {
   const { token, userData, loading, setLoading } = useContext(AppContext);
   const navigate = useNavigate();
   const location = useLocation();

   const eventOptions = ["IPDIMS 2025", "IPDIMS 2026", "IPDIMS 2027"];

   // Form state
   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");
   const [keywords, setKeywords] = useState("");
   const [authorName, setAuthorName] = useState(userData?.name || "");
   const [authorEmail, setAuthorEmail] = useState(userData?.email || "");
   const [authorAffiliation, setAuthorAffiliation] = useState("");
   const [eventName, setEventName] = useState("IPDIMS 2025");
   const [attachment, setAttachment] = useState(null);

   const fileInputRef = useRef(null);

   useEffect(() => {
      if (!token || !userData) {
         navigate("/login", { state: { from: location.pathname } });
      }
   }, [token, userData, navigate, location]);

   if (!token || !userData) return null;

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
         const formData = new FormData();
         formData.append("title", title);
         formData.append("description", description);
         formData.append("keywords", keywords);
         formData.append("authorName", authorName);
         formData.append("authorEmail", authorEmail);
         formData.append("authorAffiliation", authorAffiliation);
         formData.append("eventName", eventName);
         if (attachment) formData.append("attachment", attachment);

         const res = await axios.post(
            "http://localhost:4000/api/user/add-submission",
            formData,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
               },
            }
         );

         if (res.data.success) {
            toast.success("Submission added successfully!");
            // Reset form
            setTitle("");
            setDescription("");
            setKeywords("");
            setAuthorName(userData?.name || "");
            setAuthorEmail(userData?.email || "");
            setAuthorAffiliation(userData?.organization || "");
            setEventName("IPDIMS 2025");
            setAttachment(null);

            if (fileInputRef.current) {
               fileInputRef.current.value = "";
            }
         } else {
            toast.error(
               res.data.message || "Submission failed. Please try again."
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
         setAuthorAffiliation(userData.organization || ""); // or userData.affiliation
      }
   }, [userData]);

   useEffect(() => {
      console.log("Affiliation:", authorAffiliation);
   }, [authorAffiliation]);

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
                     <input
                        ref={fileInputRef}
                        type="file"
                        onChange={(e) => setAttachment(e.target.files[0])}
                        accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip,.txt,.rtf,.jpg,.png"
                        className="w-full border border-gray-600 bg-black/30 rounded-lg px-4 py-2 "
                     />
                     {attachment && (
                        <p className="mt-2 text-sm text-gray-400">
                           Selected File: {attachment.name}
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
                              Affiliation
                           </label>
                           <input
                              type="text"
                              value={authorAffiliation}
                              onChange={(e) =>
                                 setAuthorAffiliation(e.target.value)
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



git quickgit quickgit quickgit quickgit quickgit quickgit quickgit quickgit quickgit quickgit quick
git quick
git quickgit quickgit quickgit quick