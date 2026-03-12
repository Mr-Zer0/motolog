<script lang="ts">
  import type { Snippet } from 'svelte'
  import { currentPath, navigate } from '@/lib/router'

  let { children }: { children: Snippet } = $props()
</script>

<div class="min-h-screen bg-background">
  <header class="sticky top-0 z-10 bg-card border-b border-border">
    <div class="mx-auto w-full max-w-[768px] px-4 h-14 flex items-center justify-between">
      <span class="font-semibold text-foreground">MotoLog</span>
      <nav class="flex gap-1">
        <button
          onclick={() => navigate('/')}
          class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors {$currentPath === '/'
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-foreground'}"
        >
          Home
        </button>
        <button
          onclick={() => navigate('/settings')}
          class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors {$currentPath === '/settings'
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-foreground'}"
        >
          Settings
        </button>
      </nav>
    </div>
  </header>
  <main class="mx-auto w-full max-w-[720px]">
    {@render children()}
  </main>
</div>
