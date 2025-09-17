<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Format } from "$lib/utils/format.util";
  import {
    CalendarDate,
    getLocalTimeZone,
    type DateValue,
  } from "@internationalized/date";
  import { parseDate } from "chrono-node";
  import { untrack } from "svelte";
  import Icon from "../icon/Icon.svelte";
  import Labeled from "../label/Labeled.svelte";

  let {
    open,
    value = $bindable(),
  }: {
    open?: boolean;
    value: Date | undefined | null;
  } = $props();

  let query = $state(value ? Format.date(value) : "");

  const get_date_value_from_query = (q: string) => {
    const date = parseDate(q);

    if (date) {
      return new CalendarDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
      );
    } else {
      return undefined;
    }
  };

  let date_value = $state<DateValue | undefined>(
    untrack(() => get_date_value_from_query(query)),
  );
</script>

<div class="relative flex gap-2">
  <Labeled label="Date">
    <Input
      class="pr-10"
      placeholder="Tomorrow or next week"
      bind:value={
        () => query,
        (v) => {
          query = v;

          date_value = get_date_value_from_query(v);

          value = date_value
            ? date_value.toDate(getLocalTimeZone())
            : undefined;
        }
      }
    />
  </Labeled>

  <Popover.Root bind:open>
    <Popover.Trigger>
      {#snippet child({ props })}
        <Button
          {...props}
          variant="ghost"
          class="absolute top-1/2 right-2 size-6 -translate-y-1/2"
        >
          <Icon icon="lucide/calendar" class="size-3.5" />

          <span class="sr-only">Select date</span>
        </Button>
      {/snippet}
    </Popover.Trigger>

    <Popover.Content class="w-auto overflow-hidden p-0" align="end">
      <Calendar
        type="single"
        captionLayout="dropdown"
        onValueChange={(_dv) => {
          open = false;
        }}
        bind:value={
          () => date_value,
          (dv) => {
            date_value = dv;

            if (dv) {
              value = dv.toDate(getLocalTimeZone());
              query = Format.date(value);
            } else {
              value = undefined;
              query = "";
            }
          }
        }
      />
    </Popover.Content>
  </Popover.Root>
</div>
