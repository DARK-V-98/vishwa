import React from 'react'

const RefundPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 pt-24 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-hero bg-clip-text text-transparent">Refund Policy</h1>
      <div className="prose dark:prose-invert max-w-none bg-card p-8 rounded-lg shadow-medium">
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <p>Thank you for shopping at Vishwa Vidarshana. We value your satisfaction and strive to provide you with the best online shopping experience possible. If, for any reason, you are not completely satisfied with your purchase, we are here to help.</p>

        <h2>Returns</h2>
        <p>We accept returns within 7 days from the date of purchase. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>

        <h2>Refunds</h2>
        <p>Once we receive your return and inspect the item, we will notify you of the status of your refund. If your return is approved, we will initiate a refund to your original method of payment. Please note that the refund amount will exclude any shipping charges incurred during the initial purchase.</p>

        <h2>Exchanges</h2>
        <p>If you would like to exchange your item for a different size, color, or style, please contact our customer support team within 7 days of receiving your order. We will provide you with further instructions on how to proceed with the exchange.</p>

        <h2>Non-Returnable Items</h2>
        <p>Certain items are non-returnable and non-refundable. These include:</p>
        <ul>
            <li>Gift cards</li>
            <li>Downloadable software products or in-game currency</li>
            <li>Personalized or custom-made items</li>
            <li>Perishable goods</li>
        </ul>

        <h2>Damaged or Defective Items</h2>
        <p>In the unfortunate event that your item arrives damaged or defective, please contact us immediately. We will arrange for a replacement or issue a refund, depending on your preference and product availability.</p>

        <h2>Return Shipping</h2>
        <p>You will be responsible for paying the shipping costs for returning your item unless the return is due to our error (e.g., wrong item shipped, defective product). In such cases, we will provide you with a prepaid shipping label.</p>

        <h2>Processing Time</h2>
        <p>Refunds and exchanges will be processed within 5-7 business days after we receive your returned item. Please note that it may take additional time for the refund to appear in your account, depending on your payment provider.</p>

        <h2>Contact Us</h2>
        <p>If you have any questions or concerns regarding our refund policy, please contact our customer support team. We are here to assist you and ensure your shopping experience with us is enjoyable and hassle-free.</p>
      </div>
    </div>
  )
}

export default RefundPolicyPage
