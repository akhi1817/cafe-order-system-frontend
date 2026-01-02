import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import API_ENDPOINTS from "../../config/api.js"; // 👈 make sure path is correct

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(API_ENDPOINTS.SEND_MESSAGE, formData);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-emerald-600 mb-4">
            Contact <span className="text-slate-700">Us</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Have a question or want to collaborate?  
            We’d love to hear from you. Let’s build your business’s digital bridge together.
          </p>
        </div>

        {/* Contact Section */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Side - Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-emerald-600 mb-3">
                Let’s Talk Business
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Whether you’re a wholesaler, retailer, or entrepreneur, VyapaarSetu
                can help you digitize your business operations — from inventory
                to billing and beyond. Drop us a message and we’ll get back soon!
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">📍 Office</h3>
                <p className="text-gray-600">Pimpri, Pune, Maharashtra, India</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">📧 Email</h3>
                <a
                  href="mailto:vyapaarsetu2025@gmail.com"
                  className="text-emerald-600 hover:underline"
                >
                  vyapaarsetu2025@gmail.com
                </a>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">📞 Phone</h3>
                <p className="text-gray-600">+91 8177819283</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  rows="5"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${
                  loading ? "bg-emerald-400" : "bg-emerald-600 hover:bg-emerald-700"
                } text-white py-2 rounded-lg transition font-medium`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
