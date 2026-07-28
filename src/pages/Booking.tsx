import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Car, User, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/Section';
import { Section } from '@/components/Section';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Service } from '@/types';

const timeSlots = ['09:00 AM', '10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];
const carBrands = ['Porsche', 'BMW', 'Mercedes', 'Audi', 'Tesla', 'Lamborghini', 'Ferrari', 'Range Rover', 'Toyota', 'Honda', 'Maruti', 'Other'];
const paymentMethods = ['UPI', 'Card', 'Cash', 'Online'];

export function Booking() {
  const [params] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState(params.get('service') || '');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  useEffect(() => {
    let active = true;
    const loadServices = async () => {
      try {
        const data = await api.getServices();
        if (active) setServices(data as Service[]);
      } catch {
        if (active) setServices([]);
      }
    };

    loadServices();
    return () => {
      active = false;
    };
  }, []);

  const service = services.find((s) => s.id === selectedService);

  useEffect(() => {
    if (params.get('service')) setSelectedService(params.get('service')!);
  }, [params]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.target as HTMLFormElement);
    await api.createBooking({
      customerId: 'guest',
      customerName: String(form.get('name')),
      carBrand: String(form.get('carBrand')),
      carModel: String(form.get('carModel')),
      vehicleNumber: String(form.get('vehicleNumber')),
      serviceId: selectedService,
      serviceName: service?.name || '',
      date: String(form.get('date')),
      time: String(form.get('time')),
      paymentMethod,
      amount: service?.price || 0,
      notes: String(form.get('notes') || ''),
    });
    setSubmitting(false);
    setSuccess(true);
    toast.success('Booking confirmed! Check your email for details.');
  };

  if (success) {
    return (
      <>
        <PageHeader title="Booking Confirmed" />
        <Section className="pt-0">
          <Card className="max-w-lg mx-auto p-10 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
              <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-green-500/20 text-green-400 mb-6">
                <CheckCircle2 className="h-10 w-10" />
              </div>
            </motion.div>
            <h2 className="font-display text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground mb-6">We have received your booking request. Our team will confirm your appointment shortly via email and SMS.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild className="gold-gradient text-black"><Link to="/">Back Home</Link></Button>
              <Button asChild variant="outline"><Link to="/services">View Services</Link></Button>
            </div>
          </Card>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Book Now" title="Schedule Your Detail" subtitle="Fill in your details and pick a time that works for you." />

      <Section className="pt-0">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2">
            <Card className="p-4 sm:p-6 lg:p-8">
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2"><User className="h-5 w-5 text-gold" /> Personal Details</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" required placeholder="John Doe" className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" required placeholder="+91 ..." className="mt-1.5" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required placeholder="you@example.com" className="mt-1.5" />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div>
                  <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2"><Car className="h-5 w-5 text-gold" /> Vehicle Details</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="carBrand">Car Brand</Label>
                      <Select name="carBrand" required>
                        <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select brand" /></SelectTrigger>
                        <SelectContent>{carBrands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="carModel">Car Model</Label>
                      <Input id="carModel" name="carModel" required placeholder="e.g. 911 Carrera" className="mt-1.5" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                      <Input id="vehicleNumber" name="vehicleNumber" required placeholder="MH 01 XX 1234" className="mt-1.5" />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div>
                  <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2"><CreditCard className="h-5 w-5 text-gold" /> Service & Schedule</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Choose Service</Label>
                      <Select value={selectedService} onValueChange={setSelectedService} required>
                        <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select a service" /></SelectTrigger>
                        <SelectContent>
                          {services.length === 0 ? (
                            <SelectItem value="loading" disabled>Loading services...</SelectItem>
                          ) : (
                            services.map((s) => <SelectItem key={s.id} value={s.id}>{s.name} — {formatCurrency(s.price)}</SelectItem>)
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date" className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Date</Label>
                        <Input id="date" name="date" type="date" required className="mt-1.5" min={new Date().toISOString().slice(0, 10)} />
                      </div>
                      <div>
                        <Label htmlFor="time" className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Time</Label>
                        <Select name="time" required>
                          <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select time" /></SelectTrigger>
                          <SelectContent>{timeSlots.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="notes">Special Notes (optional)</Label>
                      <Textarea id="notes" name="notes" rows={3} placeholder="Any specific concerns or requests..." className="mt-1.5" />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div>
                  <h3 className="font-display text-lg font-semibold mb-4">Payment Method</h3>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {paymentMethods.map((m) => (
                      <div key={m} className="flex items-center gap-2">
                        <RadioGroupItem value={m} id={`pay-${m}`} />
                        <Label htmlFor={`pay-${m}`} className="cursor-pointer">{m}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Button type="submit" disabled={submitting} className="w-full gold-gradient text-black hover:opacity-90" size="lg">
                  {submitting ? 'Submitting...' : <>Submit Booking <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card className="p-4 sm:p-6 sticky top-24 lg:top-28">
              <h3 className="font-display text-lg font-semibold mb-4">Booking Summary</h3>
              {service ? (
                <div className="space-y-4">
                  <div className="aspect-[16/10] rounded-lg overflow-hidden">
                    <img src={service.afterImage} alt={service.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="font-semibold">{service.name}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0">
                    <div><p className="text-sm text-muted-foreground">Duration</p><p className="font-medium">{service.duration}</p></div>
                    <div className="text-right"><p className="text-sm text-muted-foreground">Payment</p><p className="font-medium">{paymentMethod}</p></div>
                  </div>
                  <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-display text-2xl font-bold text-gold">{formatCurrency(service.price)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Select a service to see pricing and details here.</p>
              )}
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
