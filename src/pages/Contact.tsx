import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Twitter, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/Section';
import { Section } from '@/components/Section';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const contactInfo = [
  { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
  { icon: Mail, label: 'Email', value: 'hello@detailpro.com' },
  { icon: MapPin, label: 'Studio', value: 'Bandra West, Mumbai 400050' },
  { icon: Clock, label: 'Working Hours', value: 'Mon–Sun, 9 AM – 8 PM' },
];

export function Contact() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    toast.success('Message sent! We will get back to you shortly.');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <>
      <PageHeader eyebrow="Get in Touch" title="Contact Us" subtitle="Have a question or want to schedule a visit? We are here to help." />

      <Section className="pt-0">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map placeholder */}
          <div className="space-y-6">
            <Card className="overflow-hidden p-0">
              <div className="relative aspect-[4/3] bg-card flex items-center justify-center">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, hsl(43 74% 58% / 0.2), transparent 60%)' }} />
                <div className="text-center relative">
                  <MapPin className="h-12 w-12 text-gold mx-auto mb-3" />
                  <p className="font-display text-lg font-semibold">DetailPro Studio</p>
                  <p className="text-sm text-muted-foreground">Bandra West, Mumbai</p>
                  <p className="text-xs text-muted-foreground mt-2">Interactive map will appear here</p>
                </div>
              </div>
            </Card>

            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info) => (
                <motion.div key={info.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
                  <Card className="p-5 h-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg gold-gradient text-black mb-3">
                      <info.icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{info.label}</p>
                    <p className="text-sm font-medium mt-1">{info.value}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Follow us:</span>
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-gold hover:border-gold transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <Card className="p-8">
            <h3 className="font-display text-2xl font-bold mb-2">Send a Message</h3>
            <p className="text-muted-foreground mb-6">Fill out the form and we will respond within 24 hours.</p>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" required placeholder="Your name" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" required placeholder="+91 ..." className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required placeholder="you@example.com" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" required placeholder="How can we help?" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" required rows={5} placeholder="Tell us about your car and what you need..." className="mt-1.5" />
              </div>
              <Button type="submit" disabled={submitting} className="w-full gold-gradient text-black hover:opacity-90">
                {submitting ? 'Sending...' : <>Send Message <Send className="ml-2 h-4 w-4" /></>}
              </Button>
            </form>
          </Card>
        </div>
      </Section>
    </>
  );
}
