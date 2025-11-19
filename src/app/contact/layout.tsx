
import type { Metadata } from 'next';

const pageTitle = "Contact Vishwa Vidarshana – Get In Touch";
const pageDescription = "Reach out to Vishwa Vidarshana for web development, design, and e-sports solutions. Fill the form, email, or call directly.";

export const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: '/contact',
    }
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
