import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Award, Car, Users, TrendingUp } from 'lucide-react';
import { Section, SectionHeading, PageHeader } from '@/components/Section';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import type { TeamMember } from '@/types';

const timeline = [
  { year: '2020', title: 'The Beginning', desc: 'DetailPro started in a single-bay garage in Mumbai with one founder and a passion for perfection.' },
  { year: '2021', title: 'First 500 Cars', desc: 'Word spread quickly. We detailed our 500th car within the first year and expanded to a 3-bay studio.' },
  { year: '2022', title: 'Ceramic Coating Certified', desc: 'Became certified applicators for premium ceramic coating brands and introduced PPF services.' },
  { year: '2023', title: '1000+ Happy Customers', desc: 'Crossed 1000 satisfied customers and launched our membership program with 3 tiers.' },
  { year: '2024', title: 'AI Inspection Launch', desc: 'Pioneered AI-powered vehicle inspection to give customers transparent, data-driven recommendations.' },
  { year: '2025', title: '5000+ Cars Detailed', desc: 'Now the most-reviewed premium detailing studio in the region with a 4.9-star average rating.' },
];

const achievements = [
  { icon: Car, value: '5000+', label: 'Cars Detailed' },
  { icon: Users, value: '1000+', label: 'Happy Customers' },
  { icon: Award, value: '4.9★', label: 'Google Rating' },
  { icon: TrendingUp, value: '5', label: 'Years of Trust' },
];

export function About() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    let active = true;
    const loadTeam = async () => {
      try {
        const data = await api.getTeam();
        if (active) setTeamMembers(data as TeamMember[]);
      } catch {
        if (active) setTeamMembers([]);
      }
    };

    loadTeam();
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHeader eyebrow="Our Story" title="Driven by Perfection" subtitle="What started as a one-man passion project is now the region's most trusted premium car detailing studio." />

      {/* Story */}
      <Section className="pt-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <img src="https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="Studio" className="rounded-2xl premium-shadow" />
          </motion.div>
          <div>
            <SectionHeading eyebrow="Company Story" title="From Garage to Studio" />
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>In 2020, Karan Malhotra returned from Germany after a decade of training with master detailers at some of Europe's finest studios. He came back with one conviction: Indian luxury car owners deserved world-class detailing.</p>
              <p>What began as a single-bay garage in Bandra has grown into a state-of-the-art studio with certified technicians, premium imported products, and a loyal clientele of enthusiasts and collectors.</p>
              <p>Today, DetailPro is known for obsessive attention to detail, transparent pricing, and results that make cars look better than the day they left the showroom.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section className="bg-card/30">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: Target, title: 'Our Mission', desc: 'To deliver detailing services so meticulous that every customer feels like they are driving a brand-new car off our lot. We hold ourselves to international standards and never cut corners.' },
            { icon: Eye, title: 'Our Vision', desc: 'To be the most trusted name in premium car care across the country, combining human craftsmanship with AI-driven inspection to set a new industry benchmark for transparency and quality.' },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <Card className="h-full p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gold-gradient text-black mb-5">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Why We Started */}
      <Section>
        <SectionHeading center eyebrow="Why We Started" title="The Problem We Set Out to Solve" />
        <p className="text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Luxury car owners were stuck choosing between cheap, careless washes and expensive dealerships with weeks-long waitlists. There was no middle ground — no studio that combined premium products, certified skill, and honest pricing. We built DetailPro to be exactly that.
        </p>
      </Section>

      {/* Achievements */}
      <Section className="bg-card/30">
        <SectionHeading center eyebrow="Achievements" title="Numbers That Matter" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {achievements.map((a, i) => (
            <motion.div key={a.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center">
              <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl glass mb-3">
                <a.icon className="h-7 w-7 text-gold" />
              </div>
              <div className="font-display text-3xl font-bold">{a.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{a.label}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section>
        <SectionHeading center eyebrow="Our Journey" title="Achievements Timeline" />
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-border sm:-translate-x-1/2" />
          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`relative flex gap-6 mb-10 sm:w-1/2 ${i % 2 === 0 ? 'sm:pr-10 sm:text-right' : 'sm:ml-auto sm:pl-10'}`}
            >
              <div className={`absolute top-1.5 h-4 w-4 rounded-full gold-gradient ring-4 ring-background ${i % 2 === 0 ? 'left-2 sm:left-auto sm:-right-2' : 'left-2 sm:-left-2'}`} />
              <div className="pl-10 sm:pl-0">
                <span className="text-gold font-display font-bold text-lg">{item.year}</span>
                <h3 className="font-display text-lg font-semibold mt-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section className="bg-card/30">
        <SectionHeading center eyebrow="Meet the Team" title="The People Behind the Shine" subtitle="A small, dedicated team of certified professionals obsessed with making your car perfect." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <Card className="h-full overflow-hidden group">
                <div className="aspect-square overflow-hidden">
                  <img src={m.avatar} alt={m.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-display font-semibold">{m.name}</h3>
                  <p className="text-sm text-gold">{m.role}</p>
                  <p className="text-xs text-muted-foreground mt-1">{m.experience} experience</p>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{m.bio}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  );
}
