<script lang="ts">
  import FormFieldset from "$lib/components/form/fieldset/FormFieldSet.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Dialog from "$lib/components/ui/dialog/dialog.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import {
    DONATION_METHOD,
    type IDonationMethod,
  } from "$lib/const/donation_method.const";
  import { ICONS } from "$lib/const/icon.const";
  import type { DonationMethod } from "$lib/schema/donation_method.schema";
  import type { ShelterSchema } from "$lib/server/db/schema/shelter.model";
  import { DonationMethodUtil } from "$lib/utils/donation_method/donation_method.util";
  import {
    arrayProxy,
    type ArrayProxy,
    type FormPathArrays,
    type SuperForm,
  } from "sveltekit-superforms";
  import DonationMethodForm from "./DonationMethodForm.svelte";

  let {
    form,
    name,
  }: {
    form: SuperForm<ShelterSchema.InsertIn>;
    name: FormPathArrays<ShelterSchema.InsertIn, DonationMethod>;
  } = $props();

  const { values } = arrayProxy(
    form,
    name,
  ) satisfies ArrayProxy<DonationMethod>;

  const actions = {
    add: (kind: IDonationMethod.KindId) => {
      $values = [
        ...$values,
        {
          label: "",
          id: crypto.randomUUID().split("-")[0],
          data: {
            ...DONATION_METHOD.KIND.DEFAULTS[kind],
          },
        },
      ];
    },

    remove: (id: string) => {
      $values = $values.filter((v) => v.id !== id);
    },
  };
</script>

<FormFieldset
  {form}
  {name}
  legend="Donation methods"
  description="Optional ways to donate to the shelter."
>
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
    {#each $values as { id }, i (id)}
      <div class="flex items-center gap-1">
        <span class="max-w-xs flex-1 truncate rounded-md border px-2 py-1">
          <strong>
            {DONATION_METHOD.KIND.MAP[$values[i].data.kind].label}:
          </strong>
          {DonationMethodUtil.format($values[i])}
        </span>

        <Button
          type="button"
          variant="outline"
          icon={ICONS.CLOSE}
          onclick={() => actions.remove(id)}
        />

        <Dialog size="icon" title="Edit donation method">
          {#snippet trigger()}
            <Icon icon={ICONS.EDIT} />
          {/snippet}

          {#snippet content()}
            <DonationMethodForm {form} name="{name}[{i}]" />
          {/snippet}

          {#snippet actions({ close })}
            <Button variant="outline" onclick={close}>Close</Button>
          {/snippet}
        </Dialog>
      </div>
    {/each}

    <div class="flex gap-1">
      {#each DONATION_METHOD.KIND.IDS as kind}
        <Button
          type="button"
          variant="outline"
          icon="lucide/hand-heart"
          onclick={() => actions.add(kind)}
        >
          Add {DONATION_METHOD.KIND.MAP[kind].label}
        </Button>
      {/each}
    </div>
  </div>
</FormFieldset>
