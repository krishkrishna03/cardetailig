import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, ShieldCheck, Sparkles, Droplets, Award, Star, Quote, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Section, SectionHeading } from '@/components/Section';
import { StatsBar } from '@/components/StatsBar';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import {
  galleryItems as defaultGalleryItems,
  membershipPlans as defaultMembershipPlans,
  reviews as defaultReviews,
} from '@/data/mockData';
import type { GalleryItem, MembershipPlan, Review } from '@/types';

const heroImg =
  'https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=1920';

const whyChoose = [
  { icon: Award, title: 'Premium Products', desc: 'We use only top-tier, imported detailing products trusted by luxury car owners worldwide.' },
  { icon: ShieldCheck, title: 'Certified Professionals', desc: 'Our detailers are factory-trained and certified in advanced coating and correction techniques.' },
  { icon: Droplets, title: 'Steam Cleaning', desc: 'Eco-friendly steam technology that sanitizes without harsh chemicals or water waste.' },
  { icon: Sparkles, title: 'Ceramic & PPF', desc: 'Industry-leading ceramic coatings and self-healing PPF with up to 10-year warranties.' },
];

export function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(defaultGalleryItems);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>(defaultMembershipPlans);
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const gallerySlides = galleryItems.slice(0, 5);
  const activeGallerySlide = gallerySlides[activeSlide];

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      try {
        const [galleryData, membershipData, reviewData] = await Promise.all([
          api.getGallery(),
          api.getMemberships(),
          api.getReviews(),
        ]);

        if (!active) return;

        // Keep bundled content if an API response uses an older schema.
        // The slider requires both beforeImage and afterImage.
        if (isGalleryItems(galleryData)) setGalleryItems(galleryData);
        if (Array.isArray(membershipData)) setMembershipPlans(membershipData as MembershipPlan[]);
        if (Array.isArray(reviewData)) setReviews(reviewData as Review[]);
      } catch {
        // Default content remains available when the backend is offline.
      }
    };

    loadContent();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!gallerySlides.length) return;
    const t = setInterval(() => setActiveSlide((s) => (s + 1) % gallerySlides.length), 4000);
    return () => clearInterval(t);
  }, [gallerySlides.length]);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 w-full pt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <Badge className="mb-6 glass text-gold border-gold/30">
              <Sparkles className="mr-1.5 h-3 w-3" /> Premium Detailing Studio
            </Badge>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight">
              Premium Car Detailing That Makes Your Car Look <span className="text-gradient-gold">Brand New</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              From ceramic coatings to paint correction, we restore and protect luxury vehicles with obsessive attention to detail.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="gold-gradient text-black hover:opacity-90">
                <Link to="/booking">Book Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="glass border-white/20">
                <Link to="/services">View Services</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 inset-x-0 pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="glass rounded-2xl px-6 py-6 premium-shadow">
              <StatsBar />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <Section id="why-us">
        <SectionHeading
          center
          eyebrow="Why DetailPro"
          title="Craftsmanship Meets Technology"
          subtitle="Every vehicle is treated like our own. We combine old-world craftsmanship with modern technology to deliver results that exceed expectations."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyChoose.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full p-6 hover:border-gold/40 transition-all duration-300 hover:-translate-y-1 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gold-gradient text-black mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Gallery Slider */}
      <Section id="gallery" className="bg-card/30">
        <div className="flex items-end justify-between mb-10">
          <SectionHeading
            eyebrow="Recent Work"
            title="Transformations That Speak"
            subtitle="Drag the slider to see the difference our detailing makes."
          />
          <div className="hidden sm:flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setActiveSlide((s) => (s - 1 + gallerySlides.length) % gallerySlides.length)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setActiveSlide((s) => (s + 1) % gallerySlides.length)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {activeGallerySlide ? (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BeforeAfterSlider
              key={activeGallerySlide.id}
              beforeImage={activeGallerySlide.beforeImage}
              afterImage={activeGallerySlide.afterImage}
            />
          </div>
          <div className="flex flex-col justify-center">
            <Badge className="w-fit mb-3 capitalize">{activeGallerySlide.category}</Badge>
            <h3 className="font-display text-2xl font-bold mb-2">{activeGallerySlide.title}</h3>
            <p className="text-muted-foreground">{activeGallerySlide.description}</p>
            <Button asChild className="mt-6 w-fit" variant="outline">
              <Link to="/gallery">View Full Gallery <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
        ) : (
          <p className="text-muted-foreground">Gallery transformations are loading. Please check back shortly.</p>
        )}
      </Section>

      {/* Testimonials */}
      <Section id="testimonials">
        <SectionHeading center eyebrow="Testimonials" title="Loved by Car Enthusiasts" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card className="h-full p-6 flex flex-col">
                <Quote className="h-8 w-8 text-gold/40 mb-3" />
                <p className="text-sm leading-relaxed flex-1">{r.comment}</p>
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border">
                  <img src={r.avatar} alt={r.customerName} className="h-10 w-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{r.customerName}</p>
                    <p className="text-xs text-muted-foreground">{r.service}</p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className={`h-3.5 w-3.5 ${idx < r.rating ? 'text-gold fill-gold' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Membership */}
      <Section id="membership" className="bg-card/30">
        <SectionHeading center eyebrow="Membership" title="Plans That Save You More" subtitle="Join our membership program for exclusive discounts, priority booking, and free services." />
        <div className="grid gap-6 md:grid-cols-3">
          {membershipPlans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className={`relative h-full p-8 flex flex-col ${plan.popular ? 'border-gold/50 gold-glow' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gold-gradient text-black">Most Popular</Badge>
                )}
                <div className={`text-sm font-semibold uppercase tracking-wider mb-2 bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display text-4xl font-bold">₹{plan.price.toLocaleString('en-IN')}</span>
                  <span className="text-sm text-muted-foreground">/{plan.period}</span>
                </div>
                <ul className="space-y-3 flex-1">
                  {plan.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm">
                      <span className="text-gold mt-0.5">✓</span> {b}
                    </li>
                  ))}
                </ul>
                <Button asChild className={`mt-6 ${plan.popular ? 'gold-gradient text-black' : ''}`} variant={plan.popular ? 'default' : 'outline'}>
                  <Link to="/booking">Book Membership</Link>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/60" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              Ready to Make Your Car <span className="text-gradient-gold">Look Brand New?</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">Book your appointment today and experience the DetailPro difference.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="gold-gradient text-black hover:opacity-90">
                <Link to="/booking">Book Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="glass">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function isGalleryItems(value: unknown): value is GalleryItem[] {
  return Array.isArray(value) && value.every((item) => (
    typeof item === 'object' && item !== null
    && typeof (item as GalleryItem).beforeImage === 'string'
    && typeof (item as GalleryItem).afterImage === 'string'
  ));
}
