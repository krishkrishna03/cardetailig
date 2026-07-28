import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, ArrowRight, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Section } from '@/components/Section';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { BlogPost } from '@/types';

export function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    const loadPost = async () => {
      try {
        const [postData, allPosts] = await Promise.all([api.getBlogPost(id || ''), api.getBlogPosts()]);
        if (!active) return;
        setPost(postData as BlogPost | null);
        setPosts(allPosts as BlogPost[]);
      } catch {
        if (active) {
          setPost(null);
          setPosts([]);
        }
      }
    };

    loadPost();
    setLoaded(true);
    window.scrollTo(0, 0);
    return () => {
      active = false;
    };
  }, [id]);

  if (!post) {
    return (
      <>
        <Navbar />
        <Section className="pt-32 text-center">
          <h1 className="font-display text-3xl font-bold">Post not found</h1>
          <Button asChild className="mt-6"><Link to="/blog">Back to Blog</Link></Button>
        </Section>
        <Footer />
      </>
    );
  }

  const related = posts.filter((p) => p.id !== id).slice(0, 2);

  return (
    <>
      <Navbar />
      <motion.article initial={{ opacity: 0 }} animate={{ opacity: loaded ? 1 : 0 }} transition={{ duration: 0.4 }}>
        <div className="relative h-[50vh] min-h-[360px] overflow-hidden">
          <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 pb-10">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
              <Badge className="mb-4">{post.category}</Badge>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">{post.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {post.author}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatDate(post.date)}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.readTime} read</span>
              </div>
            </div>
          </div>
        </div>

        <Section className="pt-12">
          <div className="max-w-3xl mx-auto">
            <Button asChild variant="ghost" size="sm" className="mb-8">
              <Link to="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog</Link>
            </Button>
            <div className="space-y-6">
              {post.content.map((para, i) => (
                <motion.p key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="text-lg leading-relaxed text-muted-foreground">
                  {para}
                </motion.p>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="font-display text-xl font-bold mb-6">Related Articles</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {related.map((r) => (
                  <Link key={r.id} to={`/blog/${r.id}`} className="group">
                    <div className="aspect-[16/10] overflow-hidden rounded-xl mb-3">
                      <img src={r.image} alt={r.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h4 className="font-semibold group-hover:text-gold transition-colors">{r.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button asChild className="gold-gradient text-black">
                <Link to="/booking">Book a Service <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </Section>
      </motion.article>
      <Footer />
    </>
  );
}
