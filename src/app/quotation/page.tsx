import QuotationForm from "@/components/forms/quotation-form";

export default function QuotationPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Automated Quotation Generator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Fill out the form below with your project details, and our AI will generate a preliminary quotation for you instantly.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <QuotationForm />
      </div>
    </div>
  );
}
