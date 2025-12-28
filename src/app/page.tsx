'use client';

import { AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { LobbyScreen } from '@/components/LobbyScreen';
import { TopicsScreen } from '@/components/TopicsScreen';
import { ChatShell } from '@/components/ChatShell';
import { Vision2026Screen } from '@/components/Vision2026Screen';

export default function Home() {
  const currentScene = useAppStore((state) => state.currentScene);

  return (
    <main className="min-h-screen grain-overlay">
      <AnimatePresence mode="wait">
        {currentScene === 'lobby' && <LobbyScreen key="lobby" />}
        {currentScene === 'topics' && <TopicsScreen key="topics" />}
        {currentScene === 'chat' && <ChatShell key="chat" />}
        {currentScene === 'vision2026' && <Vision2026Screen key="vision2026" />}
      </AnimatePresence>
    </main>
  );
}
