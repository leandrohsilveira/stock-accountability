<script lang="ts">
  import { Table } from 'sveltestrap'

  export let years: number[]
</script>

<Table striped responsive>
  <tbody>
    {#each years as year}
      <tr>
        <td>{year}</td>
      </tr>
    {/each}
  </tbody>
</Table>
