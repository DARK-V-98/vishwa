
import type { Metadata } from 'next';

const pageTitle = "Bridal & Beauty NVQ Level 4 Notes – Complete Model Packs";
const pageDescription = "Unlock all NVQ Level 4 theory notes, practical guidelines, assignments, and sample answers for bridal and beauty courses in Sri Lanka. Prepare for your exams efficiently.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/notes/bridal-beauty-nvq-level-4",
  },
  keywords: ["NVQ Level 4 Bridal Notes", "Beauty Courses Notes Sri Lanka", "Bridal NVQ PDF", "Salon Management Notes", "Makeup Assignments"],
};

export default function NotesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
