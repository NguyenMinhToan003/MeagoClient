import { NameAvatar } from '@/components/shared/user-avatar';

const sampleNames = [
  'Duc Pham',
  'Emma Vo',
  'Chau Le',
  'Demo 2',
  'Alice Nguyen',
  'Frank Ho',
  'Gia Han',
  'Bao Tran',
  'Khanh Nguyen',
  'Quang Vu',
] as const;

export function FoundationAvatarDemo() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {sampleNames.map((name) => (
        <div key={name} className="flex min-w-0 items-center gap-3 rounded-lg border bg-background p-3">
          <NameAvatar className="size-11" displayName={name} />
          <span className="truncate text-sm font-medium" title={name}>
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}
