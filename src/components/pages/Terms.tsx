import React from "react";

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">
        By using Sahara, you agree to the following terms and conditions. Please
        read them carefully.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Use of Service</h2>
      <p className="mb-4">
        Sahara is a community-driven aid platform. You agree not to misuse the
        platform by posting false information, harassing others, or engaging in
        unlawful activities.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">No Guarantees</h2>
      <p className="mb-4">
        Sahara is provided “as is.” While we do our best to keep it running,
        we make no guarantees about availability, accuracy, or reliability of
        the services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Account Suspension</h2>
      <p className="mb-4">
        We reserve the right to suspend or terminate accounts that violate
        these terms without notice.
      </p>

      <p>
        If you have questions about these terms, please contact us at
        <span className="font-medium"> sahara-support@example.com</span>.
      </p>
    </div>
  );
}
