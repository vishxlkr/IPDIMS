import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
   Users,
   FileText,
   UserCheck,
   CheckCircle,
   XCircle,
   Clock,
   AlertCircle,
} from "lucide-react";
import { AdminContext } from "../../context/AdminContext";

const AdminDashboard = () => {
   const [stats, setStats] = useState({
      totalUsers: 0,
      totalSubmissions: 0,
      totalReviewers: 0,
      activeReviewers: 0,
      pendingSubmissions: 0,
      underReviewSubmissions: 0,
      acceptedSubmissions: 0,
      rejectedSubmissions: 0,
   });
   const [recentSubmissions, setRecentSubmissions] = useState([]);
   const [loading, setLoading] = useState(true);

   // const backendUrl = "http://localhost:4000";
   const { backendUrl } = useContext(AdminContext);
   const atoken = localStorage.getItem("aToken");

   useEffect(() => {
      fetchDashboardData();
   }, []);

   const fetchDashboardData = async () => {
      try {
         setLoading(true);
         const headers = { atoken };

         const [usersRes, submissionsRes, reviewersRes] = await Promise.all([
            axios.get(`${backendUrl}/api/admin/users`, { headers }),
            axios.get(`${backendUrl}/api/admin/submissions`, { headers }),
            axios.get(`${backendUrl}/api/admin/all-reviewer`, { headers }),
         ]);

         if (
            usersRes.data.success &&
            submissionsRes.data.success &&
            reviewersRes.data.success
         ) {
            const users = usersRes.data.users || [];
            const submissions = submissionsRes.data.submissions || [];
            const reviewers = reviewersRes.data.reviewers || [];

            setStats({
               totalUsers: users.length,
               totalSubmissions: submissions.length,
               totalReviewers: reviewers.length,
               activeReviewers: reviewers.filter((r) => r.isActive).length,
               pendingSubmissions: submissions.filter(
                  (s) => s.status === "Pending"
               ).length,
               underReviewSubmissions: submissions.filter(
                  (s) => s.status === "Under Review"
               ).length,
               acceptedSubmissions: submissions.filter(
                  (s) => s.status === "Accepted"
               ).length,
               rejectedSubmissions: submissions.filter(
                  (s) => s.status === "Rejected"
               ).length,
            });

            setRecentSubmissions(submissions.slice(0, 5));
         }
      } catch (error) {
         console.error("Error fetching dashboard data:", error);
         toast.error(error.response?.data?.message || "Failed to fetch data");
      } finally {
         setLoading(false);
      }
   };

   const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all border border-gray-100">
         <div className="flex items-center justify-between">
            <div>
               <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
               <p className="text-3xl font-bold" style={{ color }}>
                  {value}
               </p>
            </div>
            <div className={`${bgColor} p-4 rounded-full`}>
               <Icon className="w-8 h-8" style={{ color }} />
            </div>
         </div>
      </div>
   );

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
                  Admin Dashboard
               </h1>
               <p className="text-gray-600 mt-2">
                  Overview of system statistics and recent activities
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               <StatCard
                  icon={Users}
                  title="Total Authors"
                  value={stats.totalUsers}
                  color="#3b82f6"
                  bgColor="bg-blue-100"
               />
               <StatCard
                  icon={FileText}
                  title="Total Submissions"
                  value={stats.totalSubmissions}
                  color="#8b5cf6"
                  bgColor="bg-purple-100"
               />
               <StatCard
                  icon={UserCheck}
                  title="Total Reviewers"
                  value={stats.totalReviewers}
                  color="#10b981"
                  bgColor="bg-green-100"
               />
               <StatCard
                  icon={CheckCircle}
                  title="Active Reviewers"
                  value={stats.activeReviewers}
                  color="#f59e0b"
                  bgColor="bg-amber-100"
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-2">
                     <Clock className="w-6 h-6 text-yellow-600" />
                     <p className="text-sm font-semibold text-yellow-800">
                        Pending
                     </p>
                  </div>
                  <p className="text-3xl font-bold text-yellow-700">
                     {stats.pendingSubmissions}
                  </p>
               </div>

               <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-2">
                     <AlertCircle className="w-6 h-6 text-blue-600" />
                     <p className="text-sm font-semibold text-blue-800">
                        Under Review
                     </p>
                  </div>
                  <p className="text-3xl font-bold text-blue-700">
                     {stats.underReviewSubmissions}
                  </p>
               </div>

               <div className="bg-green-50 border border-green-200 rounded-xl p-6 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-2">
                     <CheckCircle className="w-6 h-6 text-green-600" />
                     <p className="text-sm font-semibold text-green-800">
                        Accepted
                     </p>
                  </div>
                  <p className="text-3xl font-bold text-green-700">
                     {stats.acceptedSubmissions}
                  </p>
               </div>

               <div className="bg-red-50 border border-red-200 rounded-xl p-6 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-2">
                     <XCircle className="w-6 h-6 text-red-600" />
                     <p className="text-sm font-semibold text-red-800">
                        Rejected
                     </p>
                  </div>
                  <p className="text-3xl font-bold text-red-700">
                     {stats.rejectedSubmissions}
                  </p>
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">
                     Recent Submissions
                  </h2>
               </div>
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Title
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Author
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Status
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Date
                           </th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {recentSubmissions.length > 0 ? (
                           recentSubmissions.map((submission) => (
                              <tr
                                 key={submission._id}
                                 className="hover:bg-gray-50 transition-colors"
                              >
                                 <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                       {submission.title || "Untitled"}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="text-sm text-gray-700">
                                       {submission.author?.name || "N/A"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                       {submission.author?.email}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span
                                       className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          submission.status === "Accepted"
                                             ? "bg-green-100 text-green-800"
                                             : submission.status === "Rejected"
                                             ? "bg-red-100 text-red-800"
                                             : submission.status ===
                                               "Under Review"
                                             ? "bg-blue-100 text-blue-800"
                                             : "bg-yellow-100 text-yellow-800"
                                       }`}
                                    >
                                       {submission.status}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(
                                       submission.createdAt
                                    ).toLocaleDateString()}
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td
                                 colSpan="4"
                                 className="px-6 py-8 text-center text-gray-500"
                              >
                                 No submissions found
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AdminDashboard;
