<script lang="ts">
  interface Props {
    /** Pre-rendered, sanitized HTML — see lib/utils/markdown.ts. Never pass raw user markdown here. */
    html: string;
  }

  let { html }: Props = $props();
</script>

<div class="prose">
  {@html html}
</div>
