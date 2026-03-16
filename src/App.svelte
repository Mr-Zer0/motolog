<script lang="ts">
  import { onMount } from 'svelte'
  import { currentPath } from '@/lib/router'
  import { initApp, isReady } from '@/stores/app'
  import { initAuth, currentUser } from '@/stores/auth'
  import Layout from '@/components/Layout.svelte'
  import Home from '@/pages/Home.svelte'
  import Settings from '@/pages/Settings.svelte'
  import LogDetail from '@/pages/LogDetail.svelte'
  import Login from '@/pages/Login.svelte'
  import NewLog from '@/pages/NewLog.svelte'
  import NotFound from '@/pages/NotFound.svelte'

  let authReady = $state(false)

  onMount(async () => {
    await initAuth()
    authReady = true
  })

  $effect(() => {
    if (authReady && $currentUser && !$isReady) {
      initApp().catch(console.error)
    }
  })

  let logId = $derived(
    $currentPath.startsWith('/log/') ? $currentPath.slice('/log/'.length) : null,
  )
</script>

{#if !authReady || (authReady && $currentUser && !$isReady)}
  <div class="fixed inset-0 flex items-center justify-center bg-background">
    <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
{:else if !$currentUser}
  <Login />
{:else}
  <Layout>
    {#if logId}
      <LogDetail id={logId} />
    {:else if $currentPath === '/settings'}
      <Settings />
    {:else if $currentPath === '/new'}
      <NewLog />
    {:else if $currentPath === '/'}
      <Home />
    {:else}
      <NotFound />
    {/if}
  </Layout>
{/if}
