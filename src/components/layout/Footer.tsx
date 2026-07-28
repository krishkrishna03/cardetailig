import { Link } from 'react-router-dom';
import { Car, Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  Company: [
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Membership', path: '/membership' },
    { label: 'Blog', path: '/blog' },
  ],
  Service: [
    { label: 'Ceramic Coating', path: '/services' },
    { label: 'PPF Installation', path: '/services' },
    { label: 'Interior Detailing', path: '/services' },
  ],
  Support: [
    { label: 'Contact', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Book Appointment', path: '/booking' },
    { label: 'Sign In', path: '/login' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 py-10 sm:py-16">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gold-gradient text-black">
                <Car className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold">
                Detail<span className="text-gold">Pro</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed px-0.5">
              Premium car detailing studio specializing in ceramic coatings, PPF, and paint correction for luxury and performance vehicles.
            </p>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> +91 63008 52715</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> hello@detailpro.com</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> Bandra West, Mumbai 400050</p>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">{title}</h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-sm text-muted-foreground hover:text-gold transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2025 DetailPro. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-gold hover:border-gold transition-colors"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
