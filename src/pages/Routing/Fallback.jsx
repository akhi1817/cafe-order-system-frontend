import React from "react";
import { useNavigate } from "react-router-dom";

const FallbackRoute = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="text-center p-4 bg-white shadow rounded">
        <div className="mb-3">
          <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: "3rem" }}></i>
        </div>
        <h1 className="h3 mb-3">Page not found</h1>
        <p className="text-muted mb-4">
          Sorry, the page you are looking for does not exist.
        </p>
        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/")}
          >
            Go to Home
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default FallbackRoute;
