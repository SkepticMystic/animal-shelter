<script lang="ts">
  import { MicrochipLookupClient } from "$lib/clients/microchip_lookup.client";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import type { MaybePromise } from "$lib/interfaces";
  import type { MicrochipLookup } from "$lib/server/db/schema/microchip_lookup.model";
  import type { APIResult } from "$lib/utils/form.util";
  import { MicrochipLookupUtil } from "$lib/utils/microchip_lookup/microchip_lookup.utils";
  import type { ComponentProps } from "svelte";
  import { toast } from "svelte-sonner";

  let {
    on_error,
    on_success,
    microchip_number = $bindable(),
    ...rest_props
  }: {
    microchip_number?: string | null;

    on_success: (data: {
      results: MicrochipLookup[];
      merged: MicrochipLookup["data"];
    }) => MaybePromise<unknown>;

    on_error?: (
      error: Extract<APIResult<unknown>, { ok: false }>["error"],
    ) => MaybePromise<unknown>;
  } & ComponentProps<typeof Input> = $props();

  const lookup = async () => {
    if (!microchip_number) return;

    const result = await MicrochipLookupClient.lookup({ microchip_number });

    if (!result.ok) {
      console.error("Microchip lookup failed", result.error);
      await on_error?.(result.error);
    } else {
      const merged = MicrochipLookupUtil.merge_results_data(result.data);
      console.log("Microchip lookup merged", merged);
      if (!merged.found) {
        toast.warning("No match found for this microchip number");
      }

      await on_success({ merged, results: result.data });
    }
  };
</script>

<ButtonGroup>
  <Input {...rest_props} bind:value={microchip_number} />

  <Button
    icon="lucide/search"
    disabled={!microchip_number}
    onclick={() => lookup()}
    variant="secondary"
  ></Button>
</ButtonGroup>
