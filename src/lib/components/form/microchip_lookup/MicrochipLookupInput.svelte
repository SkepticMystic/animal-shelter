<script lang="ts">
  import { MicrochipLookupClient } from "$lib/clients/microchip_lookup.client";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import type { MaybePromise } from "$lib/interfaces";
  import type { MicrochipLookupResult } from "$lib/services/microchip_lookup/microchip_lookup.service";
  import type { APIResult } from "$lib/utils/form.util";
  import { MicrochipLookupUtil } from "$lib/utils/microchip_lookup/microchip_lookup.utils";
  import type { ComponentProps } from "svelte";
  import { toast } from "svelte-sonner";

  let {
    warn,
    on_error,
    on_success,
    microchip_number = $bindable(),
    ...rest_props
  }: {
    warn?: boolean;
    microchip_number?: string | null;

    on_success: (data: {
      results: MicrochipLookupResult[];
      merged: MicrochipLookupResult["data"];
    }) => MaybePromise<unknown>;

    on_error?: (
      error: Extract<APIResult<unknown>, { ok: false }>["error"],
    ) => MaybePromise<unknown>;
  } & ComponentProps<typeof Input> = $props();

  const lookup = async () => {
    if (!microchip_number) return;
    else if (
      warn &&
      !confirm(
        "If found, some of this data will overwrite existing data you've filled in. Continue?",
      )
    ) {
      return;
    }

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

<div class="flex gap-1">
  <Input {...rest_props} bind:value={microchip_number} />

  <Button
    icon="lucide/search"
    disabled={!microchip_number}
    onclick={() => lookup()}
  ></Button>
</div>
