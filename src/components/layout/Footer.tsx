import { FacebookIcon, InstagramIcon, TwitterIcon } from "../../icons";
import { BRAND_COLORS, BRAND_DOMAIN, BRAND_TAGLINE } from "../../constants";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {
  return (
    <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5"
        style={{ background: BRAND_COLORS.ORANGE }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3
              className="text-2xl font-semibold mb-4"
              style={{ color: BRAND_COLORS.ORANGE }}
            >
              {BRAND_DOMAIN}
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              {BRAND_TAGLINE}
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={<FacebookIcon />} />
              <SocialLink href="#" icon={<InstagramIcon />} />
              <SocialLink href="#" icon={<TwitterIcon />} />
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <FooterLink onClick={() => onNavigate("home")} label="Home" />
              <FooterLink
                onClick={() => onNavigate("tracker")}
                label="Track Order"
              />
              <FooterLink 
                onClick={() => onNavigate("farmers")} 
                label="Our Farmers" 
              />
              <FooterLink onClick={() => {}} label="Subscription Plans" />
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <FooterLink onClick={() => {}} label="FAQs" />
              <FooterLink onClick={() => {}} label="Contact Us" />
              <FooterLink onClick={() => {}} label="Delivery Info" />
              <FooterLink onClick={() => {}} label="Returns & Refunds" />
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Newsletter</h4>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Get weekly updates on new meals, nutrition tips, and exclusive
              offers.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
};

const FooterBottom = () => (
  <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
    <p className="text-gray-400">
      &copy; 2024 MoyoClub. All rights reserved.
    </p>
    <div className="flex gap-6 text-sm text-gray-400">
      <FooterLink onClick={() => {}} label="Privacy Policy" />
      <FooterLink onClick={() => {}} label="Terms of Service" />
      <FooterLink onClick={() => {}} label="Cookie Policy" />
    </div>
  </div>
);


const SocialLink = ({
  href,
  icon,
}: {
  href: string;
  icon: React.ReactNode;
}) => (
  <a
    href={href}
    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-orange-600 flex items-center justify-center transition-colors"
  >
    {icon}
  </a>
);

const FooterLink = ({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) => (
  <li>
    <button onClick={onClick} className="hover:text-orange-500 transition-colors">
      {label}
    </button>
  </li>
);

const NewsletterForm = () => (
  <div className="flex flex-col gap-3">
    <input
      type="email"
      placeholder="Enter your email"
      className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 flex-1 focus:outline-none focus:border-orange-500 transition-colors"
    />
    <button
      className="px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 hover:shadow-lg"
      style={{ backgroundColor: BRAND_COLORS.ORANGE }}
    >
      Subscribe
    </button>
  </div>
);