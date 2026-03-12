<script lang="ts">
  import { onMount } from 'svelte'
  import { currentPath } from '@/lib/router'
  import { initApp, isReady } from '@/stores/app'
  import Layout from '@/components/Layout.svelte'
  import Home from '@/pages/Home.svelte'
  import Settings from '@/pages/Settings.svelte'

  onMount(() => {
    initApp().catch(console.error)
  })
</script>

{#if !$isReady}
  <div class="fixed inset-0 flex items-center justify-center bg-background">
    <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
{:else}
  <Layout>
    {#if $currentPath === '/settings'}
      <Settings />
    {:else}
      <Home />
    {/if}
  </Layout>
{/if}
