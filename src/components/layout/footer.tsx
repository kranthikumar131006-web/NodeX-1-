import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background/80 border-t border-border/50">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} NodeX Inc. All rights reserved.</p>
          </div>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact Support</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
