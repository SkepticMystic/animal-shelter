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
  import { parseDate, type ParsingOption } from "chrono-node";
  import { untrack } from "svelte";

  let {
    reference_date,
    parsing_options,
    open = $bindable(),
    value = $bindable(),
    placeholder = "3 days ago or 16 June 2026",
  }: {
    open?: boolean;
    placeholder?: string;
    reference_date?: Date;
    value: Date | undefined | null;
    parsing_options?: ParsingOption;
  } = $props();

  let query = $state(value ? Format.date(value) : "");

  const get_date_value_from_query = (q: string) => {
    const date = parseDate(q, reference_date, parsing_options);

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
  <Input
    {placeholder}
    class="pr-10"
    bind:value={
      () => query,
      (v) => {
        query = v;

        date_value = get_date_value_from_query(v);

        value = date_value ? date_value.toDate(getLocalTimeZone()) : undefined;
      }
    }
  />

  <Popover.Root {open}>
    <Popover.Trigger>
      {#snippet child({ props })}
        <!-- NOTE: For some reason I still have to add the size="icon", otherwise it shrinks too small -->
        <Button
          {...props}
          size="icon"
          variant="ghost"
          icon="lucide/calendar"
          class="absolute top-1/2 right-1 size-7 -translate-y-1/2"
        >
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
