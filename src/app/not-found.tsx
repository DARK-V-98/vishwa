import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Frown } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4">
        <Frown className="w-24 h-24 text-primary mb-4" />
        <h1 className="text-6xl font-bold font-headline mb-2">404</h1>
        <h2 className="text-2xl font-semibold font-headline mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
            Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Button asChild size="lg">
            <Link href="/">Return to Homepage</Link>
        </Button>
    </div>
  )
}
