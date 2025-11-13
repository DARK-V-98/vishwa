import React from 'react'

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 pt-24 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-hero bg-clip-text text-transparent">Terms and Conditions</h1>
      <div className="prose dark:prose-invert max-w-none bg-card p-8 rounded-lg shadow-medium">
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>Welcome to Vishwa Vidarshana. These Terms and Conditions govern your use of our website and the purchase and sale of products from our platform. By accessing and using our website, you agree to comply with these terms. Please read them carefully before proceeding with any transactions.</p>

        <h2>Use of the Website</h2>
        <ol type="a">
            <li>You must be at least 18 years old to use our website or make purchases.</li>
            <li>You are responsible for maintaining the confidentiality of your account information, including your username and password.</li>
            <li>You agree to provide accurate and current information during the registration and checkout process.</li>
            <li>You may not use our website for any unlawful or unauthorized purposes.</li>
        </ol>

        <h2>Product Information and Pricing</h2>
        <ol type="a">
            <li>We strive to provide accurate product descriptions, images, and pricing information. However, we do not guarantee the accuracy or completeness of such information.</li>
            <li>Prices are subject to change without notice. Any promotions or discounts are valid for a limited time and may be subject to additional terms and conditions.</li>
        </ol>

        <h2>Orders and Payments</h2>
        <ol type="a">
            <li>By placing an order on our website, you are making an offer to purchase the selected products.</li>
            <li>We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in pricing or product information, or suspected fraudulent activity.</li>
            <li>You agree to provide valid and up-to-date payment information and authorize us to charge the total order amount, including applicable taxes and shipping fees, to your chosen payment method.</li>
            <li>We use trusted third-party payment processors to handle your payment information securely. We do not store or have access to your full payment details.</li>
        </ol>

        <h2>Shipping and Delivery</h2>
        <ol type="a">
            <li>We will make reasonable efforts to ensure timely shipping and delivery of your orders.</li>
            <li>Shipping and delivery times provided are estimates and may vary based on your location and other factors.</li>
        </ol>

        <h2>Returns and Refunds</h2>
        <ol type="a">
            <li>Our Returns and Refund Policy governs the process and conditions for returning products and seeking refunds. Please refer to the policy provided on our website for more information.</li>
        </ol>

        <h2>Intellectual Property</h2>
        <ol type="a">
            <li>All content and materials on our website, including but not limited to text, images, logos, and graphics, are protected by intellectual property rights and are the property of Vishwa Vidarshana or its licensors.</li>
            <li>You may not use, reproduce, distribute, or modify any content from our website without our prior written consent.</li>
        </ol>

        <h2>Limitation of Liability</h2>
        <ol type="a">
            <li>In no event shall Vishwa Vidarshana, its directors, employees, or affiliates be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of our website or the purchase and use of our products.</li>
            <li>We make no warranties or representations, express or implied, regarding the quality, accuracy, or suitability of the products offered on our website.</li>
        </ol>

        <h2>Amendments and Termination</h2>
        <p>We reserve the right to modify, update, or terminate these Terms and Conditions at any time without prior notice. It is your responsibility to review these terms periodically for any changes.</p>
        
      </div>
    </div>
  )
}

export default TermsPage