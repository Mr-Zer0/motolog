<script lang="ts">
  import { navigate } from '@/lib/router'
</script>

<div class="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
  <p class="text-6xl font-bold text-primary mb-4">404</p>
  <h1 class="text-xl font-semibold text-foreground mb-2">Page not found</h1>
  <p class="text-sm text-muted-foreground mb-6">
    The page you're looking for doesn't exist.
  </p>
  <button
    onclick={() => navigate('/')}
    class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors"
  >
    Go home
  </button>
</div>
