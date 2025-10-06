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
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Item from "$lib/components/ui/item/Item.svelte";

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

  const crud = {
    add: (kind: IDonationMethod.KindId) => {
      $values = [
        ...$values,
        {
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
  <div class="flex flex-wrap gap-2">
    {#each $values as { id }, i (id)}
      <Item
        size="sm"
        variant="outline"
        title={DONATION_METHOD.KIND.MAP[$values[i].data.kind].label}
        description={DonationMethodUtil.format($values[i])}
      >
        {#snippet actions()}
          <Dialog
            icon={ICONS.EDIT}
            variant="outline"
            title="Edit donation method"
          >
            {#snippet content()}
              <DonationMethodForm {form} name="{name}[{i}]" />
            {/snippet}

            {#snippet actions({ close })}
              <Button variant="outline" onclick={close}>Close</Button>
            {/snippet}
          </Dialog>

          <Button
            type="button"
            variant="outline"
            icon={ICONS.CLOSE}
            onclick={() => crud.remove(id)}
          />
        {/snippet}
      </Item>
    {/each}

    <ButtonGroup orientation="vertical">
      {#each DONATION_METHOD.KIND.IDS as kind (kind)}
        <Button
          type="button"
          variant="outline"
          onclick={() => crud.add(kind)}
          {...DONATION_METHOD.KIND.MAP[kind]}
        ></Button>
      {/each}
    </ButtonGroup>
  </div>
</FormFieldset>
