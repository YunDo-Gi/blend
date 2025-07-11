import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-line bg-background border-t">
      <div className="border-line mx-auto max-w-7xl border-x p-(--layout-grid-padding)">
        <div className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          {/* Logo/Brand */}
          <div className="flex flex-col gap-2">
            <h2 className="font-serif text-2xl font-bold">Blend</h2>
            <p className="text-sm text-gray-600">Mix Thoughts, Blend</p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4 md:flex-row md:gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Navigation</h3>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/posts" className="hover:text-primary transition-colors">
                    Posts
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Social</h3>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@blend.com" className="hover:text-primary transition-colors">
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-line border-t pt-6 pb-4">
          <div className="flex flex-col gap-2 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
            <p>&copy; 2025 Blend. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
