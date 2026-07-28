import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ImageIcon, X, Sparkles, Check, Gauge, AlertTriangle, Droplets, Package } from 'lucide-react';
import { PageHeader } from '@/components/Section';
import { Section } from '@/components/Section';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface AnalysisResult {
  dirtLevel: number;
  paintCondition: number;
  minorScratches: number;
  interiorCleanliness: number;
  recommendedPackage: string;
  estimatedPrice: string;
}

export function AIInspection() {
  const [images, setImages] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [stage, setStage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...urls].slice(0, 6));
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const runAnalysis = async () => {
    if (images.length === 0) return;
    setAnalyzing(true);
    setResult(null);
    setProgress(0);

    const stages = [
      'Preprocessing images...',
      'Detecting paint surface...',
      'Analyzing dirt accumulation...',
      'Identifying scratches & swirls...',
      'Evaluating interior condition...',
      'Matching recommended package...',
    ];

    for (let i = 0; i < stages.length; i++) {
      setStage(stages[i]);
      await new Promise((r) => setTimeout(r, 700));
      setProgress(((i + 1) / stages.length) * 100);
    }

    const results: AnalysisResult[] = [
      { dirtLevel: 78, paintCondition: 62, minorScratches: 45, interiorCleanliness: 55, recommendedPackage: 'Premium Detail + Ceramic Coating', estimatedPrice: '₹16,998' },
      { dirtLevel: 55, paintCondition: 80, minorScratches: 25, interiorCleanliness: 70, recommendedPackage: 'Premium Wash + Wax Polish', estimatedPrice: '₹2,298' },
      { dirtLevel: 90, paintCondition: 40, minorScratches: 70, interiorCleanliness: 35, recommendedPackage: 'Full Detail + Paint Correction', estimatedPrice: '₹9,498' },
    ];
    setResult(results[Math.floor(Math.random() * results.length)]);
    setAnalyzing(false);
    setStage('');
  };

  return (
    <>
      <PageHeader eyebrow="AI-Powered" title="AI Vehicle Inspection" subtitle="Upload photos of your car and our AI will analyze its condition and recommend the perfect service package." />

      <Section className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Upload zone */}
          <Card className="p-8 mb-8">
            <div
              onClick={() => inputRef.current?.click()}
              onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-gold/50 transition-colors"
            >
              <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl gold-gradient text-black mb-4">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-1">Upload Car Photos</h3>
              <p className="text-sm text-muted-foreground">Drag & drop or click to upload. Up to 6 images (exterior, interior, close-ups).</p>
            </div>

            {images.length > 0 && (
              <div className="mt-6">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img src={img} alt={`upload ${i}`} className="h-full w-full object-cover" />
                      <button onClick={() => removeImage(i)} className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5"><ImageIcon className="h-4 w-4" /> {images.length} image(s) selected</p>
                  <Button onClick={runAnalysis} disabled={analyzing} className="gold-gradient text-black hover:opacity-90">
                    <Sparkles className="mr-2 h-4 w-4" /> {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Analysis screen */}
          <AnimatePresence>
            {analyzing && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className="p-8 text-center">
                  <div className="relative h-20 w-20 mx-auto mb-6">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="h-full w-full rounded-full border-4 border-border border-t-gold" />
                    <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-gold" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">AI Analysis Running...</h3>
                  <p className="text-sm text-muted-foreground mb-4">{stage}</p>
                  <Progress value={progress} className="max-w-md mx-auto" />
                  <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}%</p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {result && !analyzing && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                      <Check className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold">Analysis Complete</h3>
                      <p className="text-sm text-muted-foreground">Here is what our AI found on your vehicle.</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {[
                      { icon: Gauge, label: 'Dirt Level', value: result.dirtLevel, suffix: '%' },
                      { icon: Sparkles, label: 'Paint Condition', value: result.paintCondition, suffix: '%' },
                      { icon: AlertTriangle, label: 'Minor Scratches', value: result.minorScratches, suffix: '%' },
                      { icon: Droplets, label: 'Interior Cleanliness', value: result.interiorCleanliness, suffix: '%' },
                    ].map((m) => (
                      <div key={m.label} className="glass rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground flex items-center gap-2"><m.icon className="h-4 w-4 text-gold" /> {m.label}</span>
                          <span className="font-display font-bold">{m.value}{m.suffix}</span>
                        </div>
                        <Progress value={m.value} className="h-2" />
                      </div>
                    ))}
                  </div>

                  <div className="glass rounded-xl p-5 bg-gold/5 border-gold/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-gold" />
                      <span className="text-sm text-muted-foreground">Recommended Package</span>
                    </div>
                    <h4 className="font-display text-lg font-bold">{result.recommendedPackage}</h4>
                    <p className="text-2xl font-bold text-gold mt-1">{result.estimatedPrice}</p>
                    <Button asChild className="mt-4 gold-gradient text-black">
                      <a href="/booking">Book This Package</a>
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    This is a demo analysis. In production, images are sent to a Python AI service (OpenCV / YOLO) for real detection.
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>
    </>
  );
}
