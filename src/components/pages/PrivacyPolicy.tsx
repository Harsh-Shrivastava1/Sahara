import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        At Sahara, your privacy is very important to us. This Privacy Policy
        explains how we collect, use, and protect your information.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <p className="mb-4">
        We may collect your name, email address, phone number, and location
        details when you create an account or request help. We also collect
        anonymous usage statistics to improve our services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Data</h2>
      <ul className="list-disc list-inside mb-4">
        <li>To provide community aid and connect you with helpers.</li>
        <li>To secure and maintain your account.</li>
        <li>To improve features and user experience.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Security</h2>
      <p className="mb-4">
        We use secure technologies like Supabase to store and manage your data.
        Your information is never sold or shared with third parties.
      </p>

      <p>
        If you have questions about this Privacy Policy, please contact us at
        <span className="font-medium"> sahara-support@example.com</span>.
      </p>
    </div>
  );
}
