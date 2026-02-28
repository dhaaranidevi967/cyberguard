import React from 'react';
import { 
  Scale, 
  PhoneCall, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  Clock, 
  Lock, 
  ChevronRight,
  LifeBuoy
} from 'lucide-react';

export default function RecoverySystem() {
  const recoverySteps = [
    {
      title: 'First 1 Hour: Immediate Action',
      icon: Clock,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      steps: [
        'Disconnect from the internet if malware is suspected.',
        'Change passwords for primary email and banking accounts.',
        'Contact your bank to freeze cards and report fraud.',
        'Enable Two-Factor Authentication (2FA) on all critical accounts.'
      ]
    },
    {
      title: 'Within 24 Hours: Reporting',
      icon: FileText,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      steps: [
        'File a report at cybercrime.gov.in (or your local portal).',
        'Gather all evidence: screenshots, transaction IDs, and call logs.',
        'Notify your mobile service provider if it was a SIM swap scam.',
        'Inform your contacts if your social media was compromised.'
      ]
    },
    {
      title: 'Long-term: Account Security',
      icon: Lock,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      steps: [
        'Monitor credit reports for unauthorized activity.',
        'Update security software on all devices.',
        'Review privacy settings on all social platforms.',
        'Educate yourself on the specific scam type to prevent recurrence.'
      ]
    }
  ];

  const helplines = [
    { name: 'National Cyber Crime Helpline', number: '1930', desc: 'Available 24/7 for immediate reporting.' },
    { name: 'Police Emergency', number: '112', desc: 'For immediate physical threat or local assistance.' },
    { name: 'Women Helpline', number: '1091', desc: 'Specialized support for online harassment.' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Cyber Support & Recovery</h1>
        <p className="text-slate-500">Comprehensive guidance and support for victims of cybercrime. You are not alone.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <LifeBuoy className="w-6 h-6 text-indigo-600" />
              Step-by-Step Recovery Guide
            </h3>
            <div className="space-y-4">
              {recoverySteps.map((section, i) => (
                <div key={i} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className={`p-6 ${section.bg} border-b border-slate-100 flex items-center gap-4`}>
                    <div className={`p-2.5 rounded-xl bg-white shadow-sm`}>
                      <section.icon className={`w-6 h-6 ${section.color}`} />
                    </div>
                    <h4 className="font-bold text-slate-900">{section.title}</h4>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-4">
                      {section.steps.map((step, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0 mt-0.5">
                            {j + 1}
                          </div>
                          <p className="text-slate-700 text-sm leading-relaxed">{step}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Scale className="w-6 h-6 text-indigo-600" />
              Legal Awareness & Rights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">IT Act 2000</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Understand Section 66D (punishment for cheating by personation) and Section 66C (identity theft).
                </p>
                <button className="mt-4 text-indigo-600 text-xs font-bold flex items-center gap-1 hover:underline">
                  Read Simplified Summary <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">Victim Rights</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  You have the right to file an FIR at any police station (Zero FIR) regardless of jurisdiction.
                </p>
                <button className="mt-4 text-indigo-600 text-xs font-bold flex items-center gap-1 hover:underline">
                  Learn More <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-emerald-600" />
              Official Helplines
            </h3>
            <div className="space-y-4">
              {helplines.map((item, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-900">{item.name}</span>
                    <span className="text-lg font-black text-indigo-600">{item.number}</span>
                  </div>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Report Incident Now
            </button>
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl text-white">
            <h3 className="text-xl font-bold mb-4">Evidence Checklist</h3>
            <p className="text-sm text-slate-400 mb-6">Ensure you have these ready before reporting:</p>
            <ul className="space-y-4">
              {[
                'Screenshots of messages/emails',
                'Bank statement showing transaction',
                'URL of the malicious website',
                'Call logs and recordings',
                'UPI IDs or Account numbers used'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
