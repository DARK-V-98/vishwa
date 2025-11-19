
import type { Metadata } from 'next';

const pageTitle = "About Vishwa Vidarshana – Developer & Entrepreneur";
const pageDescription = "Learn about Vishwa Vidarshana’s journey, skills, expertise, and achievements in web development, design, and e-sports solutions.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/about",
  }
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
