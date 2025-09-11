import React from "react";

const Submission = () => {
   return (
      <div className="bg-gray-50 min-h-screen py-12 px-6 md:px-16 font-sans text-gray-800">
         {/* Header Section */}
         <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
            {/* Title */}
            <div className="text-xl md:text-2xl font-bold text-indigo-700">
               Submit your Manuscript here
            </div>

            {/* Button */}
            <a
               href="https://example.com/text2" // replace with your link
               target="_blank"
               rel="noopener noreferrer"
               className="px-6 py-3 rounded-md bg-green-600 text-white font-semibold shadow-lg 
                     hover:bg-green-700 hover:scale-105 transition-transform duration-300"
            >
               Click here
            </a>
         </div>

         {/* Content Section */}
         <div className="space-y-8 max-w-4xl mx-auto">
            {/* Submission Guidelines */}
            <div
               id="guidelines"
               className="bg-white shadow-lg rounded-2xl p-6 md:p-10 leading-relaxed"
            >
               <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
                  Submission Guidelines
               </h2>
               <p className="mb-4">
                  Prospective authors from India are invited to submit
                  manuscripts reporting original, unpublished research and
                  recent developments in the topics related to the conference.
                  Submissions must include title, abstract, author affiliation
                  with the email address and keywords as per template which is
                  available in the website. The paper should not contain page
                  numbers or any special headers or footers.
               </p>
               <p className="mb-4">
                  Regular papers should present novel perspectives within the
                  general scope of the conference. Short papers
                  (Work-in-Progress) are an opportunity to present preliminary
                  or interim results. The paper length should be in{" "}
                  <span className="font-semibold">6–8 pages</span>. Literature
                  reviews/survey papers will only be considered if they present
                  a new perspective or benefit the field. To be published, such
                  papers must go beyond a review of the literature to define the
                  field in a new way or highlight exciting new technologies or
                  areas of research.
               </p>
               <p className="mb-4">
                  All submitted papers will be subjected to a{" "}
                  <span className="font-semibold">“similarity test”</span> by
                  Turnitin Software. Papers achieving a minimal similarity index
                  i.e. less than <span className="font-semibold">15%</span> will
                  be examined, and those deemed unacceptable will be
                  rejected/withdrawn without a formal review.
               </p>
            </div>

            {/* Policy on Plagiarism */}
            <div className="bg-white shadow-lg rounded-2xl p-6 md:p-10 leading-relaxed">
               <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
                  Policy on Plagiarism
               </h2>
               <p className="mb-4">
                  Authors are requested to kindly refrain from plagiarism in any
                  form. Authors should submit their original and unpublished
                  research work not under consideration for publication
                  elsewhere.
               </p>
               <p className="mb-4">
                  Manuscript found to be plagiarised during any stage of review
                  shall be rejected. As per the copyright transfer agreement,
                  authors are deemed to be individually or collectively
                  responsible for the content of the manuscript published by
                  them.
               </p>
            </div>
         </div>
      </div>
   );
};

export default Submission;
