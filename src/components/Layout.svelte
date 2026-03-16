<script lang="ts">
  import type { Snippet } from 'svelte'
  import { Plus, Settings, LogOut } from 'lucide-svelte'
  import { currentPath, navigate } from '@/lib/router'
  import { signOut } from '@/stores/auth'

  let { children }: { children: Snippet } = $props()
</script>

<div class="min-h-screen bg-background">
  <!-- Topbar: hidden below sm -->
  <header class="hidden sm:block sticky top-0 z-10 bg-card border-b border-border">
    <div class="mx-auto w-full max-w-3xl px-4 h-14 flex items-center justify-between">
      <span class="font-semibold text-foreground">MotoLog</span>
      <nav class="flex items-center gap-1">
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
        <button
          onclick={signOut}
          class="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Sign out"
        >
          <LogOut size={16} />
        </button>
      </nav>
    </div>
  </header>

  <!-- Page content -->
  <main class="mx-auto w-full max-w-3xl pb-20 sm:pb-0">
    {@render children()}
  </main>

  <!-- Bottom bar: visible below sm only -->
  <nav
    class="sm:hidden fixed bottom-0 inset-x-0 z-10 bg-card border-t border-border flex items-center gap-3 px-4 h-16"
  >
    <button
      onclick={() => navigate('/new')}
      class="flex items-center justify-center gap-2 flex-1 h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-colors text-sm font-medium"
    >
      <Plus size={18} />
      New log entry
    </button>

    <button
      onclick={() => navigate('/settings')}
      class="flex flex-col items-center gap-1 px-3 py-2 transition-colors {$currentPath === '/settings'
        ? 'text-primary'
        : 'text-muted-foreground'}"
    >
      <Settings size={20} />
      <span class="text-xs font-medium">Settings</span>
    </button>
  </nav>
</div>
