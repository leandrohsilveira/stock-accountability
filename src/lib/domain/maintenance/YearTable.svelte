<script lang="ts">
  export let years: number[]
</script>

<div class="table-responsive">
  <table class="stripped">
    <tbody>
      {#each years as year}
        <tr>
          <td>{year}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
