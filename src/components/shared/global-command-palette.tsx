'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';
import { useGlobalCommands } from '@/features/commands/use-global-commands';

export const OPEN_COMMAND_PALETTE_EVENT = 'meago:open-command-palette';

export function GlobalCommandPalette() {
  const [open, setOpen] = useState(false);
  const t = useTranslations('Navigation');
  const commands = useGlobalCommands();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpen);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpen);
    };
  }, []);

  const run = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title={t('commands')}>
      <CommandInput placeholder={t('searchCommands')} />
      <CommandList>
        <CommandEmpty>{t('noCommand')}</CommandEmpty>
        <CommandGroup heading={t('commands')}>
          {commands.map((command) => (
            <CommandItem key={command.id} value={`${command.id} ${command.label}`} onSelect={() => run(command.run)}>
              {command.icon}
              {command.label}
              {command.shortcut ? <CommandShortcut>{command.shortcut}</CommandShortcut> : null}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
