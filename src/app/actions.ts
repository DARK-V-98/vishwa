"use server";

import { generateQuotation, type GenerateQuotationInput } from "@/ai/flows/automated-quotation-generation";

interface FormState {
  message: string;
  quotation?: string;
  isError: boolean;
}

export async function handleGenerateQuotation(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const input: GenerateQuotationInput = {
    projectType: formData.get("projectType") as string,
    projectDescription: formData.get("projectDescription") as string,
    budget: formData.get("budget") as string,
    timeline: formData.get("timeline") as string,
    features: formData.get("features") as string,
  };

  if (!input.projectType || !input.projectDescription || !input.budget || !input.timeline || !input.features) {
    return {
        message: "All fields are required. Please fill out the form completely.",
        isError: true,
    };
  }

  try {
    const result = await generateQuotation(input);
    return {
      message: "Quotation generated successfully!",
      quotation: result.quotation,
      isError: false,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "An error occurred while generating the quotation. Please try again later.",
      isError: true,
    };
  }
}
