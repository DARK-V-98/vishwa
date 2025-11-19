
import type { Metadata } from 'next';

const pageTitle = "Barcode Generator – Free Browser-Based Tool | Vishwa Vidarshana";
const pageDescription = "Use Barcode Generator to create standard barcodes for products or inventory. Free, fast, and secure client-side tool. No login required.";

export const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: '/tools/barcode-generator',
    }
};

export default function ToolLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
