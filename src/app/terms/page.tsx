import React from 'react'

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 pt-24 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-hero bg-clip-text text-transparent">Terms of Service</h1>
      <div className="prose dark:prose-invert max-w-none bg-card p-8 rounded-lg shadow-medium">
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Introduction</h2>
        <p>
          Welcome to the personal and business platform of R.M.T Vishwa Vidarshana ("we," "us," or "our"). These Terms of Service ("Terms") govern your use of our website and any related services provided by us (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.
        </p>

        <h2>2. Use of Our Services</h2>
        <p>
          You must use our Services in compliance with all applicable laws and regulations. You agree not to misuse our Services, such as by interfering with them or trying to access them using a method other than the interface and the instructions that we provide.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          To access certain features of our Services, you may need to create an account. You are responsible for safeguarding your account information, including your password, and for any activities or actions under your account. You agree to notify us immediately of any unauthorized use of your account.
        </p>

        <h2>4. Content</h2>
        <p>
          Our Services may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
        </p>
        
        <h2>5. Intellectual Property</h2>
        <p>
          The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of R.M.T Vishwa Vidarshana and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
        </p>

        <h2>6. Termination</h2>
        <p>
          We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
        </p>

        <h2>7. Disclaimer of Warranties</h2>
        <p>
          Our Services are provided on an "AS IS" and "AS AVAILABLE" basis. We make no representations or warranties of any kind, express or implied, as to the operation of our Services or the information, content, or materials included therein.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          In no event shall we, nor our directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>

        <h2>9. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice before any new terms take effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
        </p>

        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at <a href="mailto:esystemlk@gmail.com">esystemlk@gmail.com</a>.
        </p>
      </div>
    </div>
  )
}

export default TermsPage
