import { motion } from 'framer-motion';

const stats = [
  { value: '5000+', label: 'Cars Detailed' },
  { value: '4.9', label: 'Google Rating' },
  { value: '1000+', label: 'Happy Customers' },
  { value: '5', label: 'Years Experience' },
];

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="text-center"
        >
          <div className="font-display text-4xl sm:text-5xl font-bold text-gradient-gold">{s.value}</div>
          <div className="mt-2 text-sm text-muted-foreground uppercase tracking-wider">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
