
import type { Metadata } from 'next';

const pageTitle = "API Tester – Free Browser-Based Tool | Vishwa Vidarshana";
const pageDescription = "Use API Tester to send HTTP requests and test your endpoints. Free, fast, and secure client-side tool. No login required.";

export const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: '/tools/api-tester',
    }
};

export default function ToolLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
