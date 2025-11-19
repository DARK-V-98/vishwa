
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Free Online JWT Decoder | Secure Client-Side Tool',
    description: 'Instantly decode and inspect JWT (JSON Web Token) headers and payloads. Our tool is 100% client-side, ensuring your sensitive tokens are never sent to a server. Fast, free, and secure.',
    keywords: ['jwt decoder', 'json web token', 'decode jwt', 'jwt inspector', 'client-side tool', 'jwt online', 'jwt debugging', 'secure jwt decoder'],
};

export default function ToolLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
