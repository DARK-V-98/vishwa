
import type { Metadata } from 'next';

const pageTitle = "Color Palette Generator – Free Browser-Based Tool | Vishwa Vidarshana";
const pageDescription = "Use Color Palette Generator to create harmonious color schemes. Free, fast, and secure client-side tool. No login required.";

export const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: '/tools/color-palette-generator',
    }
};

export default function ToolLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
