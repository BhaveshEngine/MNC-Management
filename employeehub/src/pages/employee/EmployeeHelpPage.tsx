import { useState } from 'react';
import { Search, Mail, Phone, Clock, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/AppStore';
import { currentEmployee } from '@/data/employee-mock-data';
import { cn } from '@/lib/utils';

const FAQS = [
  { topic: 'Leave', q: 'How is annual leave calculated?', a: 'Annual leave is calculated pro-rata based on your joining date, providing 14 days per calendar year.' },
  { topic: 'Leave', q: 'Can I carry forward unused sick leave?', a: 'Sick leave cannot be carried forward to the next year. It resets every January 1st.' },
  { topic: 'Payroll', q: 'When are payslips generated?', a: 'Payslips are generated and uploaded to the portal on the last working day of every month.' },
  { topic: 'Payroll', q: 'How do I change my tax declaration?', a: 'You can update your tax declaration by submitting a new HR Query request through the Requests tab.' },
  { topic: 'Attendance', q: 'What happens if I forget to check out?', a: 'You can submit an Attendance Correction request for that specific date through the Attendance page.' },
  { topic: 'Assets', q: 'My laptop screen is flickering. What should I do?', a: 'Please go to the Assets page and click "Report an Issue" to notify the IT department for a replacement.' },
];

export function EmployeeHelpPage() {
  const { submitGeneralRequest } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  });

  const filteredFaqs = FAQS.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.subject || !contactForm.message) return;

    submitGeneralRequest({
      employeeId: currentEmployee.id,
      category: 'Other',
      subject: contactForm.subject,
      description: contactForm.message,
      priority: 'Medium',
    });
    
    setShowSuccess(true);
    setContactForm({ subject: '', message: '' });
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <div className="max-w-[1200px] mx-auto animate-slide-up space-y-6">
      <PageHeader
        title="Help & Support"
        subtitle="Find answers or get in touch with the support teams."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: FAQs */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="flex flex-col gap-4">
            <h3 className="text-[16px] font-bold text-gray-900">Frequently Asked Questions</h3>
            <Input 
              placeholder="Search for answers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
            
            <div className="space-y-3 mt-2">
              {filteredFaqs.length === 0 ? (
                <p className="text-[13px] text-gray-500 text-center py-4">No matching FAQs found.</p>
              ) : (
                filteredFaqs.map((faq, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
                    <button 
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600 block mb-1">{faq.topic}</span>
                        <span className="text-[14px] font-semibold text-gray-900">{faq.q}</span>
                      </div>
                      <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", openFaq === i && "rotate-180")} />
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 pt-1 text-[13px] text-gray-600 leading-relaxed border-t border-gray-100 bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right: Contact & Form */}
        <div className="space-y-6">
          <Card className="space-y-6">
            <h3 className="text-[16px] font-bold text-gray-900">Contact Directories</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-brand-50 rounded-lg text-brand-600 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">HR Department</p>
                  <p className="text-[12px] text-gray-500">hr.support@mnc.com</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-brand-50 rounded-lg text-brand-600 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">IT Helpdesk</p>
                  <p className="text-[12px] text-gray-500">+91 1800 123 4567</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-brand-50 rounded-lg text-brand-600 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">Working Hours</p>
                  <p className="text-[12px] text-gray-500">Mon - Fri, 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-[16px] font-bold text-gray-900">Send a Message</h3>
            {showSuccess ? (
              <div className="p-4 bg-success-50 text-success-700 rounded-lg text-[13px] font-medium flex gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                Your message has been sent to the support team.
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    required
                    type="text"
                    value={contactForm.subject}
                    onChange={e => setContactForm(s => ({ ...s, subject: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px]"
                    placeholder="Brief subject..."
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={e => setContactForm(s => ({ ...s, message: e.target.value }))}
                    className="w-full p-3 rounded-lg border border-gray-200 text-[13px]"
                    placeholder="How can we help you?"
                  />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
