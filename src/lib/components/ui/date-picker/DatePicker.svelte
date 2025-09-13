<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Format } from "$lib/utils/format.util";
  import { cn } from "$lib/utils/shadcn.util";
  import {
    fromDate,
    getLocalTimeZone,
    type DateValue,
  } from "@internationalized/date";
  import type { ClassValue } from "svelte/elements";

  let {
    onchange,
    value = $bindable(),
    ...rest
  }: {
    class?: ClassValue;
    value: Date | null | undefined;
    onchange?: (date: Date | undefined) => void;
  } = $props();

  let contentRef = $state<HTMLElement | null>(null);
  let instance: DateValue | undefined = $derived(
    value ? fromDate(value, getLocalTimeZone()) : undefined,
  );
</script>

<Popover.Root>
  <Popover.Trigger
    class={cn(
      buttonVariants({
        variant: "outline",
        class: "w-fit max-w-sm min-w-36 justify-between gap-2 font-normal",
      }),
      !value && "text-muted-foreground",
      rest.class,
    )}
  >
    {instance
      ? Format.date(instance.toDate(getLocalTimeZone()))
      : "Pick a date"}
    <Icon icon="lucide/calendar" />
  </Popover.Trigger>

  <Popover.Content bind:ref={contentRef} class="w-auto p-0">
    <Calendar
      type="single"
      value={instance}
      captionLayout="dropdown"
      onValueChange={(date) => {
        instance = date;
        value = date?.toDate(getLocalTimeZone());
        onchange?.(value);
      }}
    />
  </Popover.Content>
</Popover.Root>
