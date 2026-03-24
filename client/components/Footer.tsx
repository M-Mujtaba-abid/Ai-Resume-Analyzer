"use client";

import Link from "next/link";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "AI Scanner", href: "/scanner" },
        { name: "Pricing", href: "/pricing" },
        { name: "ATS Guide", href: "/blog/ats-guide" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "Github" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Mail, href: "mailto:hello@resumeai.com", label: "Email" },
  ];

  return (
    <footer className="relative bg-background border-t border-border pt-16 pb-8 px-6 overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-600/50 to-transparent" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              R
            </div>
            <span className="text-2xl font-black tracking-tighter italic">
              ResuScan<span className="text-blue-600 italic">.AI</span>
            </span>
          </Link>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm text-lg font-medium leading-relaxed">
            Revolutionizing the way you apply for jobs. Get AI-powered insights
            and beat the ATS in seconds.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4">
            {socialLinks.map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                whileHover={{ y: -3 }}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors border border-transparent hover:border-blue-600/20"
                aria-label={social.label}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Links Sections */}
        {footerLinks.map((section, i) => (
          <div key={i} className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100">
              {section.title}
            </h4>
            <ul className="space-y-4">
              {section.links.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 font-semibold transition-all"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 dark:text-slate-500 text-sm font-medium">
        <p>© {currentYear} ResumeAI. Built with ⚡ in Lahore.</p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:underline underline-offset-4">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline underline-offset-4">
            Terms
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            All Systems Operational
          </div>
        </div>
      </div>
    </footer>
  );
}
