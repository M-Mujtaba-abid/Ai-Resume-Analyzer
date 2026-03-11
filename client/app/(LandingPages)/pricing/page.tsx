import React from 'react';
import { Check  } from 'lucide-react';

export default function Pricing() {
  const plans = [
    { name: "Standard", price: "0", features: ["3 Scans", "Keyword Suggestions"], popular: false },
    { name: "Pro", price: "19", features: ["Unlimited Scans", "ATS Score", "AI Bullet-Points", "24/7 Support"], popular: true },
    { name: "Team", price: "99", features: ["10 Users", "Collaborative Editing", "Custom Branding"], popular: false },
  ];

  return (
    <div className="min-h-screen bg-background pt-5 pb-20 px-6">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter italic">Simple <span className="text-blue-600">Pricing.</span></h1>
        <p className="text-xl text-slate-500">Stop paying for applications. Start paying for results.</p>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div key={i} className={`p-8 rounded-[2.5rem] border flex flex-col ${plan.popular ? 'border-blue-600 bg-card shadow-2xl scale-105' : 'border-border bg-background'}`}>
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="mb-6">
               <span className="text-5xl font-black">${plan.price}</span>
               <span className="text-slate-500">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 grow">
              {plan.features.map((f, idx) => (
                <li key={idx} className="flex items-center gap-3 font-medium text-slate-600 dark:text-slate-300 italic">
                  <Check size={18} className="text-blue-600" /> {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-foreground text-background'}`}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}