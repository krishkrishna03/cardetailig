import { PageHeader } from '@/components/Section';
import { Section } from '@/components/Section';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

const faqs = [
  { q: 'Do you offer pickup and drop?', a: 'Yes, we offer pickup and drop for selected locations and memberships.' },
  { q: 'How long does a detailing service take?', a: 'Most services take between 45 minutes and a full day depending on the package.' },
  { q: 'Do you provide ceramic coating?', a: 'Yes, we offer premium ceramic and graphene coating packages with warranty.' },
  { q: 'Can I book for a luxury car?', a: 'Absolutely. We specialize in premium and luxury vehicle care.' },
];

export function FAQ() {
  return (
    <>
      <PageHeader eyebrow="Support" title="Frequently Asked Questions" subtitle="Everything you need to know about our services, warranties, and policies." />

      <Section className="pt-0">
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="glass rounded-xl px-5 border-border">
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center glass rounded-2xl p-8">
            <HelpCircle className="h-10 w-10 text-gold mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-5">Our team is happy to help with any specific queries.</p>
            <Button asChild className="gold-gradient text-black">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
