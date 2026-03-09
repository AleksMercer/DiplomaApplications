<script lang="ts">
  import LoadView from './views/LoadView.svelte'
  import FilterView from './views/FilterView.svelte'
  import FormView from './views/FormView.svelte'
  import { onMount } from 'svelte'

  let route = window.location.pathname

  function setPageMetric(path: string) {
    const name =
      path === '/load' ? 'Load' :
      path === '/filter' ? 'Filter' :
      path === '/form' ? 'Form' : path
    ;(window as any).__metrics?.setPage?.(name)
  }

  function navigate(path: string) {
    if (path === route) return
    history.pushState({}, '', path)
    route = path
    setPageMetric(path)
  }

  onMount(() => {
    setPageMetric(route)
    const onPop = () => {
      route = window.location.pathname
      setPageMetric(route)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  })
</script>

<div class="min-h-screen bg-gray-50">
  <nav class="bg-white shadow p-4 flex gap-4 justify-center">
    <a href="/load" class="text-blue-600 hover:underline" on:click|preventDefault={() => navigate('/load')}>Load</a>
    <a href="/filter" class="text-blue-600 hover:underline" on:click|preventDefault={() => navigate('/filter')}>Filter</a>
    <a href="/form" class="text-blue-600 hover:underline" on:click|preventDefault={() => navigate('/form')}>Form</a>
  </nav>
  <main class="container mx-auto p-4">
    {#if route === '/' || route === '/load'}
      <LoadView />
    {:else if route === '/filter'}
      <FilterView />
    {:else if route === '/form'}
      <FormView />
    {:else}
      <LoadView />
    {/if}
  </main>
</div>