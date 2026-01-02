import React from "react";
import {
  Boxes,
  FileText,
  BarChart3,
  ShoppingBag,
  Users,
  ShieldCheck,
  Rocket,
} from "lucide-react";

const features = [
  {
    icon: <Boxes className="w-10 h-10 text-emerald-600" />,
    title: "Smart Inventory Management",
    desc: "Track stock levels, product batches, and reorder alerts in real-time with complete accuracy.",
  },
  {
    icon: <FileText className="w-10 h-10 text-emerald-600" />,
    title: "Automated GST Reports",
    desc: "Generate GST-compliant invoices and monthly reports effortlessly — no manual calculation needed.",
  },
  {
    icon: <BarChart3 className="w-10 h-10 text-emerald-600" />,
    title: "Sales & Purchase Dashboard",
    desc: "Monitor your business performance through intuitive charts and key insights.",
  },
  {
    icon: <ShoppingBag className="w-10 h-10 text-emerald-600" />,
    title: "E-Commerce Ready",
    desc: "Easily integrate online selling for your clothing, jewelry, or custom product businesses.",
  },
  {
    icon: <Users className="w-10 h-10 text-emerald-600" />,
    title: "Multi-User Access",
    desc: "Assign roles for Admins, Staff, and Accountants to streamline teamwork securely.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-emerald-600" />,
    title: "Secure & Scalable",
    desc: "Built with the MERN stack to ensure robust performance, data safety, and growth readiness.",
  },
  {
    icon: <Rocket className="w-10 h-10 text-emerald-600" />,
    title: "Future-Ready Vision",
    desc: "Expanding to hospitality, healthcare, and retail industries — one smart solution at a time.",
  },
];

const Features = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-emerald-600 mb-4">
            Key <span className="text-slate-700">Features</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            VyapaarSetu is built to simplify business operations — empowering you
            with automation, accuracy, and actionable insights.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-start"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-emerald-700 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Closing Section */}
        <div className="text-center mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold text-emerald-600 mb-3">
            Designed for Every Business
          </h3>
          <p className="text-gray-600">
            Whether you're managing a wholesale business, running a retail outlet,
            or scaling your e-commerce brand — VyapaarSetu adapts to your workflow
            and grows with you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;
