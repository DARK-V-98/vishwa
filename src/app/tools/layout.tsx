
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Developer Tools Suite – Free Browser-Based Utilities | Vishwa Vidarshana',
    description: 'Explore a collection of free, fast, and secure client-side developer tools including file converters, image utilities, password generators, and more. No uploads required.',
};

export default function ToolLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
