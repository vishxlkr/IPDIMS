// import React, { useContext, useState } from "react";
// import { assets } from "../../assets/assets";
// import { AdminContext } from "../../context/AdminContext";
// import { toast } from "react-toastify";
// import axios from "axios";

// const AddReviewer = () => {
//    const [reviewerImg, setReviewerImg] = useState(false);
//    const [name, setName] = useState("");
//    const [email, setEmail] = useState("");
//    const [password, setPassword] = useState("");

//    const [about, setAbout] = useState("");

//    const [address, setAddress] = useState("");

//    //
//    const { backendUrl, aToken } = useContext(AdminContext);

//    const onSubmitHandler = async (event) => {
//       event.preventDefault();

//       try {
//          if (!docImg) {
//             return toast.error("Image not selected.");
//          }

//          const formData = new FormData();
//          formData.append("image", reviewerImg); // same field name as multer
//          formData.append("name", name);
//          formData.append("email", email);
//          formData.append("password", password);

//          formData.append("about", about);

//          formData.append("address", address);

//          // Send request
//          const { data } = await axios.post(
//             backendUrl + "/api/admin/add-reviewer",
//             formData,
//             { headers: { aToken } },
//          );

//          if (data.success) {
//             toast.success(data.message);

//             // Reset form
//             setReviewerImg(false);
//             setName("");
//             setPassword("");
//             setEmail("");
//             setAddress("");

//             setAbout("");
//          } else {
//             toast.error(data.message);
//          }
//       } catch (error) {
//          // Handle Axios errors properly
//          toast.error(error.response?.data?.message || error.message);
//          console.log(error);
//       }
//    };

//    return (
//       <form onSubmit={onSubmitHandler} className="m-5 w-full">
//          <p className="mb-3 text-lg font-medium">Add Reviewer</p>
//          <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh]  overflow-y-scroll">
//             <div className="flex items-center gap-4 mb-8 text-gray-500">
//                <label htmlFor="doc-img">
//                   <img
//                      className="w-16 bg-gray-100 rounded-full cursor-pointer"
//                      src={
//                         docImg
//                            ? URL.createObjectURL(reviewerImg)
//                            : assets.upload_area
//                      }
//                      alt=""
//                   />
//                </label>
//                <input
//                   onChange={(e) => setReviewerImg(e.target.files[0])}
//                   type="file"
//                   id="doc-img"
//                   hidden
//                />
//                <p>
//                   Upload Reviewer <br /> picture
//                </p>
//             </div>

//             <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
//                <div className="w-full lg:flex-1 flex flex-col gap-4">
//                   <div className="flex-1 flex flex-col gap-1">
//                      <p>Reviewer name</p>
//                      <input
//                         onChange={(e) => setName(e.target.value)}
//                         value={name}
//                         className="border rounded px-3 py-2"
//                         type="text"
//                         placeholder="Name"
//                         required
//                      />
//                   </div>
//                   <div className="flex-1 flex flex-col gap-1">
//                      <p>Reviewer Email</p>
//                      <input
//                         onChange={(e) => setEmail(e.target.value)}
//                         value={email}
//                         className="border rounded px-3 py-2"
//                         type="email"
//                         placeholder="Email"
//                         required
//                      />
//                   </div>
//                   <div className="flex-1 flex flex-col gap-1">
//                      <p>Reviewer Password</p>
//                      <input
//                         onChange={(e) => setPassword(e.target.value)}
//                         value={password}
//                         className="border rounded px-3 py-2"
//                         type="password"
//                         placeholder="Password"
//                         required
//                      />
//                   </div>
//                   <div className="flex-1 flex flex-col gap-1">
//                      <p> Experience</p>
//                      <select
//                         onChange={(e) => setExperience(e.target.value)}
//                         value={experience}
//                         className="border rounded px-3 py-2"
//                      >
//                         <option value="1 Year">1 Year</option>
//                         <option value="2 Year">2 Year</option>
//                         <option value="3 Year">3 Year</option>
//                         <option value="4 Year">4 Year</option>
//                         <option value="5 Year">5 Year</option>
//                         <option value="6 Year">6 Year</option>
//                         <option value="7 Year">7 Year</option>
//                         <option value="8 Year">8 Year</option>
//                         <option value="9 Year">9 Year</option>
//                         <option value="10 Year">10 Year</option>
//                      </select>
//                   </div>
//                   <div className="flex-1 flex flex-col gap-1">
//                      <p>Fees</p>
//                      <input
//                         onChange={(e) => setFees(e.target.value)}
//                         value={fees}
//                         className="border rounded px-3 py-2"
//                         type="number"
//                         placeholder="Fees"
//                         required
//                      />
//                   </div>
//                </div>
//                <div className="w-full lg:flex-1 flex-col gap-4">
//                   <div className="flex-1 flex flex-col gap-1">
//                      <p>Speciality</p>
//                      <select
//                         onChange={(e) => setSpeciality(e.target.value)}
//                         value={speciality}
//                         className="border rounded px-3 py-2"
//                      >
//                         <option value="General physician">
//                            General physician
//                         </option>
//                         <option value="Gynecologist">Gynecologist</option>
//                         <option value="Dermatologist">Dermatologist</option>
//                         <option value="Pediatricians">Pediatricians</option>
//                         <option value="Neurologist">Neurologist</option>
//                         <option value="Gastroenterologist">
//                            Gastroenterologist
//                         </option>
//                      </select>
//                   </div>
//                   <div className="flex-1 flex flex-col gap-1">
//                      <p>Education</p>
//                      <input
//                         onChange={(e) => setDegree(e.target.value)}
//                         value={degree}
//                         className="border rounded px-3 py-2"
//                         type="text"
//                         placeholder="Education"
//                         required
//                      />
//                   </div>
//                   <div className="flex-1 flex flex-col gap-1">
//                      <p>Address</p>
//                      <input
//                         onChange={(e) => setAddress(e.target.value)}
//                         value={address}
//                         className="border rounded px-3 py-2"
//                         type="text"
//                         placeholder="address"
//                         required
//                      />
//                   </div>
//                </div>
//             </div>
//             <div>
//                <p className="mt-4 mb-2">About Reviewer</p>
//                <textarea
//                   onChange={(e) => setAbout(e.target.value)}
//                   value={about}
//                   className="w-full px-4 pt-2 border rounded"
//                   placeholder="write about doctor"
//                   rows={5}
//                   required
//                />
//             </div>
//             <button
//                type="submit"
//                className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
//             >
//                Add Reviewer
//             </button>
//          </div>
//       </form>
//    );
// };

// export default AddReviewer;
