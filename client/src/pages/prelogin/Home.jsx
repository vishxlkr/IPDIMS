import React from "react";
import logo from "../../assets/logo.png";
import nitr from "../../assets/nitr.png";
import { useNavigate } from "react-router-dom";

const App = () => {
   const navigate = useNavigate();
   return (
      <div className="bg-black text-white min-h-screen font-sans">
         <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
            {/* Main Title Section */}
            <header className="flex flex-col items-center justify-between mb-8 md:mb-16 md:flex-row">
               <img
                  src={logo}
                  alt="NIT Rourkela Logo"
                  className="w-24 md:w-32 h-auto object-contain"
               />
               <div className="text-center mx-4 flex-row">
                  <h1 className="text-xl md:text-4xl font-extrabold leading-tight tracking-wide mb-2">
                     9th International Conference on
                     <br />
                     Innovative Product Design and Intelligent
                     <br />
                     Manufacturing Systems
                  </h1>
                  <p className="text-xs md:text-sm text-gray-400">
                     (IPDIMS 2025)
                  </p>
                  <p className="text-sm md:text-base font-medium mt-2">
                     27th & 28th December 2025
                  </p>
               </div>
               <img
                  src={nitr}
                  alt="IPDIMS Logo"
                  className="w-24 md:w-32 h-auto object-contain"
               />
            </header>

            <div className="flex justify-evenly gap-6 mb-12">
               {/* Blue Button */}
               <a
                  href="https://ipdims.in/wp-content/uploads/2025/09/IPDIMS-Conference-Brochure_Invitation.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-sm bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 hover:scale-105 transition-transform duration-300"
               >
                  IPDIMS Brochure
               </a>
               {/* Button */}
               <button
                  onClick={() => navigate("/add-submission")}
                  className="px-6 py-3 rounded-lg bg-red-600 text-white font-semibold shadow-lg hover:bg-red-700 hover:scale-105 transition-transform duration-300"
               >
                  Add submission
               </button>

               {/* Green Button */}
               <button
                  onClick={() => navigate("/registration")}
                  className="px-6 py-3 rounded-sm bg-green-600 text-white font-semibold shadow-lg hover:bg-green-700 hover:scale-105 transition-transform duration-300"
               >
                  Online registration
               </button>
            </div>

            {/* Main Content Area */}
            <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Left Column - Main Content */}
               <div className="md:col-span-2">
                  {/* About IPDIMS Section */}
                  <section className="bg-gray-800  p-6 md:p-8 rounded-xl shadow-lg mb-8">
                     <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4 border-b-2 border-green-500 pb-2">
                        About IPDIMS 2025
                     </h2>
                     <p className="text-gray-300 leading-relaxed text-base">
                        Product Design is the idea generation to commercialize
                        the product by a systematic approach, which involves
                        analysis, conceptualization, and detailing to final
                        product realization. This field combines art, science,
                        and technology to create new products that people can
                        use. Their designers are innovative people who try to
                        improve the quality of living. At this conference, we
                        will have a discussion about the importance of Product
                        Design in the 21st century. The world is changing at a
                        faster pace due to the industrial revolution 4.0, which
                        involves the use of smart manufacturing technologies in
                        industries. This conference aims to take advantage of
                        advanced information and manufacturing technologies to
                        help manufacturers to create new products and to give
                        them a competitive edge in the market. The theme
                        IPDIMS-24 discusses the current issues that are facing
                        in industries. This conference will cover a variety of
                        subjects like Smart Manufacturing and Smart Automation,
                        Robotics, 3D Printing, Smart Manufacturing,
                        Mechatronics, Composite Materials, Sustainable Products,
                        and much more. The 9th IPDIMS conference will bring
                        together a lot of researchers, experts from industries
                        and academia around the keynote lecture at this
                        conference.
                     </p>
                  </section>

                  {/* About NIT Rourkela Section */}
                  <section className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg mb-8">
                     <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4 border-b-2 border-green-500 pb-2">
                        About NIT Rourkela
                     </h2>
                     <p className="text-gray-300 leading-relaxed text-base">
                        NIT Rourkela is an institution of national importance
                        with a reputation for excellence in research, academics
                        and co-curricular activities. It's located in the
                        western part of Odisha. It is a centrally funded
                        institution that provides a world-class environment for
                        education, research and development in science,
                        engineering and technology. The institute has
                        consistently been ranked among the top technical
                        institutions in India.
                     </p>
                  </section>

                  {/* About Industrial Design Department Section */}
                  <section className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg mb-8">
                     <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4 border-b-2 border-green-500 pb-2">
                        About Industrial Design Department
                     </h2>
                     <p className="text-gray-300 leading-relaxed text-base">
                        Industrial design is a professional service that helps
                        to create a variety of products, such as appliances,
                        furniture, home decor, packaging and branding, etc. to
                        make them more useful and appealing to the consumers.
                        These products are made with a focus on ease of use,
                        ergonomics and sustainability. The department of
                        Industrial Design at National Institute of Technology
                        Rourkela was established in 2011. Since then, the
                        department has grown and become a leader in the country.
                        This department has specialized in all the areas of
                        industrial design, such as product design,
                        conceptualization, and much more.
                     </p>
                  </section>

                  {/* Call for Papers Section */}
                  <section className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg mb-8">
                     <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4 border-b-2 border-green-500 pb-2 ">
                        Call for Papers
                     </h2>
                     <p className="text-gray-300 leading-relaxed text-sm italic text-center mb-6">
                        Technical papers are welcome on the topics listed in the
                        call for papers, however, this is not an exhaustive
                        list.
                     </p>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Track 1 */}
                        <div>
                           <h3 className="text-xl font-bold mb-2">
                              TRACK 1: Innovative Product Design
                           </h3>
                           <ul className="list-disc pl-5 space-y-2 text-gray-300">
                              <li>Design Aesthetics</li>
                              <li>Design Ergonomics</li>
                              <li>Design for Safety and Sustainability</li>
                              <li>Design Creativity & Optimization</li>
                              <li>Design of Smart Products</li>
                              <li>Human Factors and Ergonomics in Design</li>
                              <li>UI/UX Design</li>
                              <li>Product Styling & Detailing</li>
                              <li>Materials Selection for Design</li>
                           </ul>
                        </div>

                        {/* Track 2 */}
                        <div>
                           <h3 className="text-xl font-bold mb-2">
                              TRACK 2:Intelligent Manufacturing Systems
                           </h3>
                           <ul className="list-disc pl-5 space-y-2 text-gray-300">
                              <li>
                                 Smart Technologies for Manufacturing Processes
                              </li>
                              <li>Optimization and Simulation</li>
                              <li>Robotics & Autonomous Manufacturing</li>
                              <li>Smart Manufacturing</li>
                              <li>Smart Factory & Industry 4.0</li>
                              <li>Additive Manufacturing</li>
                              <li>Robotics, Mechatronics & Automation</li>
                              <li>Cyber-Physical Systems & IoT</li>
                              <li>Supply Chain Management</li>
                              <li>CAD/CAM/CAE</li>
                           </ul>
                        </div>
                     </div>
                  </section>
               </div>

               {/* Right Column - Past IPDIMS */}
               <div className="md:col-span-1">
                  <div className="bg-gray-800 p-4 rounded-xl shadow-lg sticky top-8 max-w-xs mx-auto">
                     <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4 border-b-2 border-green-500 pb-2 text-center">
                        Past IPDIMS
                     </h2>
                     <div className="space-y-8 ">
                        {/* Past IPDIMS 2023 */}
                        <a
                           href="https://link.springer.com/book/10.1007/978-981-97-6732-8"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="block w-48 mx-auto shadow-md hover:scale-105 transition-transform duration-200"
                        >
                           <img
                              src="https://media.springernature.com/w316/springer-static/cover-hires/book/978-981-97-6732-8?as=webp"
                              alt="IPDIMS 2024 Brochure"
                              className="w-full h-auto  mb-2 object-cover"
                           />
                           <p className="text-center text-gray-400">
                              IPDIMS 2023
                           </p>
                        </a>
                        {/* Past IPDIMS 2022 */}
                        <a
                           href="https://link.springer.com/book/10.1007/978-981-99-1665-8"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="block w-48 mx-auto shadow-md hover:scale-105 transition-transform duration-200"
                        >
                           <img
                              src="https://media.springernature.com/w316/springer-static/cover-hires/book/978-981-99-1665-8?as=webp"
                              alt="IPDIMS 2023 Brochure"
                              className="w-full h-auto  mb-2 object-cover"
                           />
                           <p className="text-center text-gray-400">
                              IPDIMS 2022
                           </p>
                        </a>
                        {/* Past IPDIMS 2021 */}
                        <a
                           href="https://link.springer.com/book/10.1007/978-981-19-4606-6"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="block w-48 mx-auto shadow-md hover:scale-105 transition-transform duration-200"
                        >
                           <img
                              src="https://media.springernature.com/w316/springer-static/cover-hires/book/978-981-19-4606-6?as=webp"
                              alt="IPDIMS 2022 Brochure"
                              className="w-full h-auto  mb-2 object-cover"
                           />
                           <p className="text-center text-gray-400">
                              IPDIMS 2021
                           </p>
                        </a>
                        <a
                           href="https://link.springer.com/book/10.1007/978-981-19-4606-6"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="block w-48 mx-auto shadow-md hover:scale-105 transition-transform duration-200"
                        >
                           <img
                              src="https://media.springernature.com/w316/springer-static/cover-hires/book/978-981-15-9853-1?as=webp"
                              alt="IPDIMS 2022 Brochure"
                              className="w-full h-auto  mb-2 object-cover"
                           />
                           <p className="text-center text-gray-400">
                              IPDIMS 2020 Vol 1
                           </p>
                        </a>
                        <a
                           href="https://link.springer.com/book/10.1007/978-981-19-0296-3"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="block w-48 mx-auto shadow-md hover:scale-105 transition-transform duration-200"
                        >
                           <img
                              src="https://media.springernature.com/w316/springer-static/cover-hires/book/978-981-19-0296-3?as=webp"
                              alt="IPDIMS 2022 Brochure"
                              className="w-full h-auto  mb-2 object-cover"
                           />
                           <p className="text-center text-gray-400">
                              IPDIMS 2020 Vol 2
                           </p>
                        </a>
                        <a
                           href="https://link.springer.com/book/10.1007/978-981-15-2696-1"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="block w-48 mx-auto shadow-md hover:scale-105 transition-transform duration-200"
                        >
                           <img
                              src="https://media.springernature.com/w316/springer-static/cover-hires/book/978-981-15-2696-1?as=webp"
                              alt="IPDIMS 2022 Brochure"
                              className="w-full h-auto  mb-2 object-cover"
                           />
                           <p className="text-center text-gray-400">
                              IPDIMS 2019
                           </p>
                        </a>
                     </div>
                  </div>
               </div>
            </main>
         </div>
      </div>
   );
};

export default App;
