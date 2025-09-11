import React from "react";

const Submission = () => {
   return (
      <div className="bg-black text-white min-h-screen py-12 px-6 md:px-16 font-sans">
         {/* Header Section */}
         <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
            <h1 className="text-xl md:text-3xl font-extrabold text-blue-600 tracking-wide">
               Submit your Manuscript here
            </h1>

            {/* Button */}
            <a
               href="https://example.com/text2" // replace with your link
               target="_blank"
               rel="noopener noreferrer"
               className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold shadow-lg 
                  hover:bg-green-700 hover:scale-105 transition-transform duration-300"
            >
               Click here
            </a>
         </div>

         {/* Content Section */}
         <div className="space-y-8 max-w-5xl mx-auto">
            {/* Submission Guidelines */}
            <section className="bg-white/10 backdrop-blur-xl border border-gray-700 shadow-lg rounded-2xl p-6 md:p-10 leading-relaxed">
               <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4 border-b-2 border-green-500 pb-2">
                  Submission Guidelines
               </h2>
               <p className="mb-4 text-gray-300">
                  Prospective authors from India are invited to submit
                  manuscripts reporting original, unpublished research and
                  recent developments in the topics related to the conference.
                  Submissions must include title, abstract, author affiliation
                  with the email address and keywords as per template which is
                  available in the website. The paper should not contain page
                  numbers or any special headers or footers.
               </p>
               <p className="mb-4 text-gray-300">
                  Regular papers should present novel perspectives within the
                  general scope of the conference. Short papers
                  (Work-in-Progress) are an opportunity to present preliminary
                  or interim results. The paper length should be in{" "}
                  <span className="font-semibold text-white">6–8 pages</span>.
                  Literature reviews/survey papers will only be considered if
                  they present a new perspective or benefit the field. To be
                  published, such papers must go beyond a review of the
                  literature to define the field in a new way or highlight
                  exciting new technologies or areas of research.
               </p>
               <p className="mb-4 text-gray-300">
                  All submitted papers will be subjected to a{" "}
                  <span className="font-semibold text-white">
                     “similarity test”
                  </span>{" "}
                  by Turnitin Software. Papers achieving a minimal similarity
                  index i.e. less than{" "}
                  <span className="font-semibold text-white">15%</span> will be
                  examined, and those deemed unacceptable will be
                  rejected/withdrawn without a formal review.
               </p>
            </section>

            {/* Policy on Plagiarism */}
            <section className="bg-white/10 backdrop-blur-xl border border-gray-700 shadow-lg rounded-2xl p-6 md:p-10 leading-relaxed">
               <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4 border-b-2 border-green-500 pb-2">
                  Policy on Plagiarism
               </h2>
               <p className="mb-4 text-gray-300">
                  Authors are requested to kindly refrain from plagiarism in any
                  form. Authors should submit their original and unpublished
                  research work not under consideration for publication
                  elsewhere.
               </p>
               <p className="mb-4 text-gray-300">
                  Manuscript found to be plagiarised during any stage of review
                  shall be rejected. As per the copyright transfer agreement,
                  authors are deemed to be individually or collectively
                  responsible for the content of the manuscript published by
                  them.
               </p>
            </section>
         </div>
      </div>
   );
};

export default Submission;
