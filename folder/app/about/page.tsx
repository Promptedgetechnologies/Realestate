export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold mb-6">About Us</h1>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              Welcome to EstateHub, your trusted partner in finding the perfect property.
            </p>
            <p className="text-gray-600 mb-4">
              We specialize in connecting buyers with premium properties across India's top cities.
              Our platform offers a seamless experience with advanced search, detailed property
              information, and expert assistance through our AI-powered chatbot.
            </p>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              To make property search simple, transparent, and accessible to everyone. We believe
              everyone deserves to find their dream home.
            </p>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Why Choose Us</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Extensive property listings across major cities</li>
              <li>Advanced search and filter options</li>
              <li>Detailed property information and virtual tours</li>
              <li>AI-powered property recommendations</li>
              <li>Expert assistance and support</li>
              <li>Transparent pricing and EMI calculators</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

