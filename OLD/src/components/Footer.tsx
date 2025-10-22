import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-background to-muted border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center font-bold text-primary-foreground text-xl shadow-medium">
                VV
              </div>
              <span className="text-lg font-bold bg-gradient-hero bg-clip-text text-transparent">
                Vishwa Vidarshana
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Web Developer | Designer | Entrepreneur
            </p>
            <p className="text-sm text-muted-foreground">
              6+ years of professional experience in delivering top-tier digital solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About Me
                </Link>
              </li>
              <li>
                <Link
                  to="/esystemlk"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ESystemLK
                </Link>
              </li>
              <li>
                <Link
                  to="/marketplace"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  to="/design-services"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Design Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Web & App Development</li>
              <li>Logo & Post Design</li>
              <li>Business Systems</li>
              <li>Hosting & Maintenance</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Mail className="h-4 w-4 text-primary mt-1" />
                <a
                  href="mailto:info@vishwavidarshana.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  info@vishwavidarshana.com
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 text-primary mt-1" />
                <span className="text-sm text-muted-foreground">+94 XX XXX XXXX</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary mt-1" />
                <span className="text-sm text-muted-foreground">Sri Lanka</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Vishwa Vidarshana. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
