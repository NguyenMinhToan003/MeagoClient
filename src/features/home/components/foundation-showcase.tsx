import { Headphones, Library, ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const foundations = [
  {
    icon: Headphones,
    title: 'Audio experience',
    description: 'Không gian nền cho nội dung audio và truyện dài tập.',
  },
  {
    icon: Library,
    title: 'Reusable UI',
    description: 'Primitive, composition và feature được tách thành ranh giới rõ ràng.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure session flow',
    description: 'Access token trong memory và refresh credential trong httpOnly cookie.',
  },
] as const;

export function FoundationShowcase() {
  return (
    <main className="min-h-svh bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="space-y-4">
          <Badge variant="secondary">Meago foundation</Badge>
          <div className="max-w-2xl space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Nền UI sạch để phát triển theo domain
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              shadcn/ui cung cấp primitive thuộc codebase; business UI tiếp tục được cô lập trong
              từng feature.
            </p>
          </div>
        </header>

        <Separator />

        <section className="grid gap-4 md:grid-cols-3">
          {foundations.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <Icon aria-hidden="true" className="text-primary size-5" />
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Primitive kiểm chứng</CardTitle>
            <CardDescription>
              Form mẫu chỉ kiểm tra theme, spacing và accessibility label; chưa nối auth API.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="foundation-email">Email</Label>
              <Input
                id="foundation-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@meago.vn"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button">Primary action</Button>
              <Button type="button" variant="outline">
                Secondary action
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
