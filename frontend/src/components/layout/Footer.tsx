"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import useAuth from '@/hooks/useAuth';

const publicQuickLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/explore', label: 'Explore' },
  { href: '/contact', label: 'Contact' },
];

const protectedQuickLinks = [
  { href: '/gallery', label: 'Gallery' },
];

const supportLinks = [
  { href: '/help', label: 'Help Center' },
  { href: '/faq', label: 'FAQ' },
];

const legalLinks = [
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/cookies', label: 'Cookie Policy' },
];

const socialLinks = [
  { href: 'https://facebook.com/hoy', icon: FaFacebookF, label: 'Facebook' },
  { href: 'https://instagram.com/hoy', icon: FaInstagram, label: 'Instagram' },
  { href: 'https://twitter.com/hoy', icon: FaTwitter, label: 'Twitter' },
];

export function Footer() {
  const { user } = useAuth();

  const quickLinks = [...publicQuickLinks, ...(user ? protectedQuickLinks : [])];

  return (
    <footer className="bg-coffee-bean text-white-plum">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="block">
              <h3 className="text-gold text-2xl font-bold">HOY</h3>
            </Link>
            <p className="text-sm">
              Discover and experience events in a whole new way. Join our community and be part of something extraordinary.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white-plum hover:text-gold transition-colors duration-200"
                >
                  <span className="sr-only">{social.label}</span>
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-gold text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {!user && (
                <>
                  <li>
                    <Link 
                      href="/login" 
                      className="hover:text-gold transition-colors duration-200"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/register" 
                      className="hover:text-gold transition-colors duration-200"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-gold text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white-plum/10">
          <p className="text-center text-sm">
            &copy; {new Date().getFullYear()} HOY. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
