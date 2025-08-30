import React from "react";

export default function Disclaimer() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
      <p className="mb-4">
        Sahara is a community aid platform designed to connect people in need
        with those who can help. However, it is not a substitute for emergency
        services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Not Emergency Services</h2>
      <p className="mb-4">
        If you are experiencing a life-threatening emergency, please call your
        local emergency number immediately.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">User Responsibility</h2>
      <p className="mb-4">
        Information shared on Sahara (help requests, stories, etc.) is provided
        by users. We are not responsible for verifying or guaranteeing the
        accuracy of this information.
      </p>

      <p>
        By using Sahara, you acknowledge that you understand this disclaimer.
      </p>
    </div>
  );
}
