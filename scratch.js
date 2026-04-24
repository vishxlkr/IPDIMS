const fs = require('fs');
let data = fs.readFileSync('c:/Users/PC/Desktop/PROJECT/IPDIMS - VERSIONS/ipdims - css modification 2/admin/src/pages/reviewer/ReviewerDashboard.jsx', 'utf8');

const startMarker = '{/* Statistics Cards */}';
const endMarker = '{/* Recent Submissions */}';

const startIndex = data.indexOf(startMarker);
const endIndex = data.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newHtml = startMarker + '\n' +
    '            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">\n' +
    '               <div className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-6 ">\n' +
    '                  <div className="flex items-center justify-between">\n' +
    '                     <div>\n' +
    '                        <p className="text-sm text-slate-500 font-semibold uppercase">\n' +
    '                           Total Assigned\n' +
    '                        </p>\n' +
    '                        <p className="text-3xl font-bold text-slate-950 mt-2">\n' +
    '                           {stats.total}\n' +
    '                        </p>\n' +
    '                     </div>\n' +
    '                     <FileText className="w-12 h-12 text-cyan-600" />\n' +
    '                  </div>\n' +
    '               </div>\n' +
    '\n' +
    '               <div className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-6 ">\n' +
    '                  <div className="flex items-center justify-between">\n' +
    '                     <div>\n' +
    '                        <p className="text-sm text-slate-500 font-semibold uppercase">\n' +
    '                           Pending Review\n' +
    '                        </p>\n' +
    '                        <p className="text-3xl font-bold text-slate-950 mt-2">\n' +
    '                           {stats.pending}\n' +
    '                        </p>\n' +
    '                     </div>\n' +
    '                     <Clock className="w-12 h-12 text-yellow-500" />\n' +
    '                  </div>\n' +
    '               </div>\n' +
    '\n' +
    '               <div className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-6 ">\n' +
    '                  <div className="flex items-center justify-between">\n' +
    '                     <div>\n' +
    '                        <p className="text-sm text-slate-500 font-semibold uppercase">\n' +
    '                           Completed Reviews\n' +
    '                        </p>\n' +
    '                        <p className="text-3xl font-bold text-slate-950 mt-2">\n' +
    '                           {stats.completed}\n' +
    '                        </p>\n' +
    '                     </div>\n' +
    '                     <CheckCircle className="w-12 h-12 text-green-500" />\n' +
    '                  </div>\n' +
    '               </div>\n' +
    '            </div>\n\n            ';
    
  data = data.substring(0, startIndex) + newHtml + data.substring(endIndex);
  fs.writeFileSync('c:/Users/PC/Desktop/PROJECT/IPDIMS - VERSIONS/ipdims - css modification 2/admin/src/pages/reviewer/ReviewerDashboard.jsx', data);
  console.log('Success');
} else {
  console.log('Markers not found');
}
