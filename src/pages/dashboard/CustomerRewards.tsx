import { Gift, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { StatCard, DashboardCard } from '@/components/dashboard/DashboardUI';
import { Progress } from '@/components/ui/progress';

const rewardHistory = [
  { desc: 'Ceramic Coating booking', points: 1500, date: '2025-06-15', type: 'earned' },
  { desc: 'Paint Correction booking', points: 700, date: '2025-05-10', type: 'earned' },
  { desc: 'Referral bonus - Rohan', points: 500, date: '2025-04-20', type: 'earned' },
  { desc: 'Redeemed: Free Premium Wash', points: -999, date: '2025-04-01', type: 'spent' },
  { desc: 'Premium Wash booking', points: 100, date: '2025-04-15', type: 'earned' },
];

export function CustomerRewards() {
  const { user } = useAuth();
  const points = user?.rewardPoints || 0;
  const nextTier = 3000;
  const pct = Math.min(100, (points / nextTier) * 100);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Gift} label="Available Points" value={points.toLocaleString()} />
        <StatCard icon={TrendingUp} label="Points Earned (Total)" value="3,950" />
        <StatCard icon={Star} label="Tier" value="Gold" />
      </div>

      <DashboardCard title="Progress to Platinum">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Gold</span>
          <span className="font-semibold">{points} / {nextTier} pts</span>
          <span className="text-muted-foreground">Platinum</span>
        </div>
        <Progress value={pct} className="h-3" />
        <p className="text-xs text-muted-foreground mt-2">Earn {(nextTier - points).toLocaleString()} more points to unlock Platinum tier and 3x reward multipliers.</p>
      </DashboardCard>

      <DashboardCard title="Reward History">
        <div className="space-y-3">
          {rewardHistory.map((r, i) => (
            <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-lg glass">
              <div>
                <p className="text-sm font-medium">{r.desc}</p>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </div>
              <span className={`font-semibold ${r.type === 'earned' ? 'text-green-400' : 'text-red-400'}`}>
                {r.type === 'earned' ? '+' : ''}{r.points} pts
              </span>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
