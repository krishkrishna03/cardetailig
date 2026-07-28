import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/Section';
import { Section } from '@/components/Section';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { BlogPost } from '@/types';

export function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let active = true;
    const loadPosts = async () => {
      try {
        const data = await api.getBlogPosts();
        if (active) setBlogPosts(data as BlogPost[]);
      } catch {
        if (active) setBlogPosts([]);
      }
    };

    loadPosts();
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHeader eyebrow="Insights" title="The DetailPro Blog" subtitle="Expert tips, guides, and stories from the world of premium car care." />

      <Section className="pt-0">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <Card className="h-full overflow-hidden group hover:border-gold/40 transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold leading-snug mb-2 group-hover:text-gold transition-colors">{post.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" /> {formatDate(post.date)}
                    </div>
                    <Button asChild size="sm" variant="ghost">
                      <Link to={`/blog/${post.id}`}>Read <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  );
}
