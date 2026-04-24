import React, { useContext, useEffect, useState } from "react";
import Loading from "../../components/Loading";
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
                  (s) => s.status === "Pending",
               ).length,
               underReviewSubmissions: submissions.filter(
                  (s) => s.status === "Under Review",
               ).length,
               acceptedSubmissions: submissions.filter(
                  (s) => s.status === "Accepted",
               ).length,
               rejectedSubmissions: submissions.filter(
                  (s) => s.status === "Rejected",
               ).length,
            });

            // Sort submissions client-side for "Recent" to prioritize needsAdminAction
            const sortedSubmissions = submissions.sort((a, b) => {
               if (a.needsAdminAction === b.needsAdminAction) {
                  return new Date(b.updatedAt) - new Date(a.updatedAt);
               }
               return a.needsAdminAction ? -1 : 1;
            });
            setRecentSubmissions(sortedSubmissions.slice(0, 5));
         }
      } catch (error) {
         console.error("Error fetching dashboard data:", error);
         toast.error(error.response?.data?.message || "Failed to fetch data");
      } finally {
         setLoading(false);
      }
   };

   const StatCard = ({ icon, title, value, valueClass, iconClass, bgColor }) => (
      <div className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-6 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all border border-slate-200">
         <div className="flex items-center justify-between">
            <div>
               <p className="text-slate-500 text-sm font-medium mb-1">
                  {title}
               </p>
               <p className={`text-3xl font-bold ${valueClass}`}>
                  {value}
               </p>
            </div>
            <div className={`${bgColor} p-4 rounded-full`}>
               {React.createElement(icon, {
                  className: `w-8 h-8 ${iconClass}`,
               })}
            </div>
         </div>
      </div>
   );

   if (loading) return <Loading />;

   return (
      <div className="min-h-[calc(100vh-5rem)] bg-gray-50 px-7 py-8">
         <div className="w-full">
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-slate-950">
                  Admin Dashboard
               </h1>
               
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               <StatCard
                  icon={Users}
                  title="Total Authors"
                  value={stats.totalUsers}
                  valueClass="text-blue-500"
                  iconClass="text-blue-500"
                  bgColor="bg-cyan-100"
               />
               <StatCard
                  icon={FileText}
                  title="Total Submissions"
                  value={stats.totalSubmissions}
                  valueClass="text-violet-500"
                  iconClass="text-violet-500"
                  bgColor="bg-purple-100"
               />
               <StatCard
                  icon={UserCheck}
                  title="Total Reviewers"
                  value={stats.totalReviewers}
                  valueClass="text-emerald-500"
                  iconClass="text-emerald-500"
                  bgColor="bg-green-100"
               />
               <StatCard
                  icon={CheckCircle}
                  title="Active Reviewers"
                  value={stats.activeReviewers}
                  valueClass="text-amber-500"
                  iconClass="text-amber-500"
                  bgColor="bg-amber-100"
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               <div className="bg-white border border-slate-200 rounded p-6 hover:shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition-all">
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

               <div className="bg-cyan-50 border border-cyan-200 rounded p-6 hover:shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition-all">
                  <div className="flex items-center gap-3 mb-2">
                     <AlertCircle className="w-6 h-6 text-cyan-600" />
                     <p className="text-sm font-semibold text-cyan-700">
                        Under Review
                     </p>
                  </div>
                  <p className="text-3xl font-bold text-cyan-700">
                     {stats.underReviewSubmissions}
                  </p>
               </div>

               <div className="bg-white border border-slate-200 rounded p-6 hover:shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition-all">
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

               <div className="bg-white border border-slate-200 rounded p-6 hover:shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition-all">
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

            <div className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] border border-slate-200 overflow-hidden">
               <div className="p-6 border-b border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-950">
                     Recent Submissions
                  </h2>
               </div>
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-transparent">
                     <thead className="bg-white">
                        <tr>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              Title
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              Author
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              Status
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              Date
                           </th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-transparent">
                        {recentSubmissions.length > 0 ? (
                           recentSubmissions.map((submission) => (
                              <tr
                                 key={submission._id}
                                 className="hover:bg-gray-50 transition-colors"
                              >
                                 <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-slate-950 max-w-xs truncate">
                                       {submission.title || "Untitled"}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="text-sm text-slate-700">
                                       {submission.author?.name || "N/A"}
                                    </div>
                                    <div className="text-xs text-slate-500">
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
                                                 ? "bg-cyan-100 text-cyan-700"
                                                 : "bg-yellow-100 text-yellow-800"
                                       }`}
                                    >
                                       {submission.status}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 text-sm text-slate-500">
                                    {new Date(
                                       submission.createdAt,
                                    ).toLocaleDateString()}
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td
                                 colSpan="4"
                                 className="px-6 py-8 text-center text-slate-500"
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
