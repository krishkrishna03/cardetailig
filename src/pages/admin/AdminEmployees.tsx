import { UserCog, Download } from 'lucide-react';
import { employees } from '@/data/mockData';
import { StatCard, DashboardCard } from '@/components/dashboard/DashboardUI';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, exportToCsv } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function AdminEmployees() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={UserCog} label="Total Employees" value={employees.length} />
        <StatCard icon={UserCog} label="Active Today" value={5} />
        <StatCard icon={UserCog} label="Assigned Jobs" value={14} />
        <StatCard icon={UserCog} label="Avg Performance" value="4.8★" />
      </div>

      <div className="flex justify-end"><Button variant="outline" size="sm" onClick={() => exportToCsv('employees.csv', employees as unknown as Record<string, unknown>[])}><Download className="mr-2 h-4 w-4" /> Export</Button></div>

      <DashboardCard title="Employee Management">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="pb-3 font-medium">Employee</th>
                <th className="pb-3 font-medium">Attendance</th>
                <th className="pb-3 font-medium">Assigned</th>
                <th className="pb-3 font-medium">Completed</th>
                <th className="pb-3 font-medium">Performance</th>
                <th className="pb-3 font-medium">Salary</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} className="border-b border-border/50 hover:bg-white/5">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9"><AvatarImage src={e.avatar} /><AvatarFallback>{e.name[0]}</AvatarFallback></Avatar>
                      <div><p className="font-medium">{e.name}</p><p className="text-xs text-muted-foreground">{e.role}</p></div>
                    </div>
                  </td>
                  <td className="py-3"><div className="flex items-center gap-2"><Progress value={e.attendance} className="h-2 w-16" /><span className="text-xs">{e.attendance}%</span></div></td>
                  <td className="py-3"><Badge variant="secondary">{e.assignedJobs} active</Badge></td>
                  <td className="py-3">{e.completedJobs}</td>
                  <td className="py-3"><span className="text-gold">★</span> {e.performance}</td>
                  <td className="py-3 font-semibold">{formatCurrency(e.salary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
}
