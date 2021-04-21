<div class="card">

  <div class="card-header text-center">
    <slot name="header"></slot>
  </div>
  <slot></slot>
  {#if $$slots.body}
    <div class="card-body">
      <slot name="body"></slot>
    </div>
  {/if}
  {#if $$slots.footer}
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  {/if}

</div>