import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-emerald-600 mb-4">
            About <span className="text-slate-700">VyapaarSetu</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Empowering businesses with smarter inventory management, automated GST reports,
            and next-gen digital tools designed to simplify trade and accelerate growth.
          </p>
        </div>

        {/* Our Story */}
        <section className="mb-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-semibold text-emerald-600 mb-3">
              Our Story
            </h2>
            <p className="text-gray-600 leading-relaxed">
              VyapaarSetu was founded with a simple vision — to make business management
              effortless for every entrepreneur. We began by creating an
              <span className="font-medium text-emerald-700">
                {" "}Inventory Management System with GST reporting
              </span>{" "}
              tailored for wholesalers, traders, and shop owners.
              <br />
              <br />
              Along the way, we also expanded into
              <span className="font-medium text-emerald-700">
                {" "}custom e-commerce solutions
              </span>{" "}
              — building websites for clothing brands, jewellery stores, and
              online sellers with complete order management systems.
              <br />
              <br />
              Our goal has always been to make digital transformation simple,
              smart, and accessible for every business.
            </p>
          </div>
          <div>
            <img
              src="https://img.freepik.com/free-vector/team-concept-illustration_114360-678.jpg"
              alt="Our Story"
              className="rounded-2xl shadow-lg"
            />
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="grid md:grid-cols-2 gap-10 mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold text-emerald-600 mb-4">
              Our Vision
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To become India’s trusted digital bridge for businesses —
              connecting manufacturers, wholesalers, and retailers through
              automation and intelligence.
              <br />
              <br />
              In the coming years, VyapaarSetu aims to expand into diverse
              industries such as{" "}
              <span className="font-medium text-emerald-700">
                hospitality, healthcare, and large-scale e-commerce
              </span>, helping them digitalize their operations with ease.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold text-emerald-600 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To simplify business workflows through technology — whether it’s
              managing inventory, generating GST-compliant reports, or running
              online stores efficiently.
              <br />
              <br />
              Our mission is to empower every entrepreneur to work smarter,
              automate operations, and focus on what truly matters — growth.
            </p>
          </div>
        </section>

        {/* Founder / Closing Section */}
        <section className="text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold text-emerald-600 mb-3">
            Meet the Founder
          </h3>
          <p className="text-gray-600 mb-6">
            Hi, I’m{" "}
            <span className="font-medium text-slate-800">Akhilesh Kumbhar</span>,  
            the creator of VyapaarSetu.  
            As a passionate MERN developer, I focus on building modern
            business solutions — from inventory and GST automation to
            full-scale e-commerce websites.
          </p>
          <p className="text-emerald-700 font-semibold">
            “Technology should empower, not complicate — and that’s the bridge we’re building.”
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
