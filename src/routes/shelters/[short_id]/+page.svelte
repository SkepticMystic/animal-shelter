<script lang="ts">
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import AnimalCard from "$lib/components/cards/AnimalCard.svelte";
  import Picture from "$lib/components/images/Picture.svelte";
  import ExternalLink from "$lib/components/links/ExternalLink.svelte";
  import LinkLink from "$lib/components/links/LinkLink.svelte";
  import GoogleMap from "$lib/components/map/GoogleMap.svelte";
  import CarouselContent from "$lib/components/ui/carousel/carousel-content.svelte";
  import CarouselItem from "$lib/components/ui/carousel/carousel-item.svelte";
  import Carousel from "$lib/components/ui/carousel/Carousel.svelte";
  import Dialog from "$lib/components/ui/dialog/dialog.svelte";
  import Iconed from "$lib/components/ui/icon/Iconed.svelte";
  import { DONATION_METHOD } from "$lib/const/donation_method.const.js";
  import { IMAGES } from "$lib/const/image.const";
  import type { DonationMethod } from "$lib/schema/donation_method.schema";

  let { data } = $props();
</script>

<div class="space-y-7">
  <div class="flex items-center gap-2">
    <BackButton />
    <h1>{data.shelter.name}</h1>
  </div>

  <div class="flex flex-wrap gap-4">
    {#each [...data.shelter.urls, ...data.shelter.emails, ...data.shelter.phones] as link}
      <LinkLink {link} />
    {/each}
  </div>

  {#if data.shelter.animals.length}
    <div class="flex flex-wrap gap-3">
      {#each data.shelter.animals as animal}
        <AnimalCard {animal} />
      {/each}
    </div>
  {/if}

  {#if data.shelter.description}
    <blockquote>
      {data.shelter.description}
    </blockquote>
  {/if}

  {#if data.shelter.images.length}
    <Carousel>
      {#snippet content()}
        <CarouselContent class="-ml-2 md:-ml-3">
          {#each data.shelter.images as image}
            <CarouselItem class="basis-auto pl-2 md:pl-3">
              <Picture {image} {...IMAGES.SIZES.PREVIEW} />
            </CarouselItem>
          {/each}
        </CarouselContent>
      {/snippet}
    </Carousel>
  {/if}

  {#if data.shelter.donation_methods.length}
    <div class="space-y-2">
      <Iconed reversed icon="lucide/hand-heart" class="size-7">
        <h2>Donate</h2>
      </Iconed>

      {#if data.shelter.npo_number}
        <span class="flex items-center gap-1">
          {data.shelter.name} is a registered non-profit organization (<ExternalLink
            favicon={false}
            link={{
              label: data.shelter.npo_number,
              href: "https://www.npo.gov.za/PublicNpo/Npo",
            }}
          />)
        </span>
      {/if}

      <div class="flex flex-col gap-4">
        {#each data.shelter.donation_methods as donation_method}
          <div class="rounded-lg border p-4">
            <h3>
              {donation_method.label ||
                DONATION_METHOD.KIND.MAP[donation_method.data.kind].label}
            </h3>

            {#if donation_method.data.kind === "url"}
              <ExternalLink
                link={{ label: "", href: donation_method.data.href }}
              />
            {:else if donation_method.data.kind === "bank"}
              <Dialog
                title="Bank details"
                description="Please use the following bank details to make your
                      donation:"
              >
                {#snippet trigger()}
                  View bank details
                {/snippet}

                {#snippet content()}
                  {@const data = donation_method.data as Extract<
                    DonationMethod["data"],
                    { kind: "bank" }
                  >}

                  <ul>
                    <li>
                      <strong> Bank: </strong>
                      {data.bank_name}
                    </li>

                    {#if data.branch_code}
                      <li>
                        <strong> Branch Code: </strong>
                        {data.branch_code}
                      </li>
                    {/if}

                    <li>
                      <strong> Account Number: </strong>
                      {data.account_number}
                    </li>

                    {#if data.swift_code}
                      <li>
                        <strong> Swift Code: </strong>
                        {data.swift_code}
                      </li>
                    {/if}

                    {#if data.reference}
                      <li>
                        <strong> Reference: </strong>
                        {data.reference}
                      </li>
                    {/if}
                  </ul>
                {/snippet}
              </Dialog>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if data.shelter.place}
    <div class="space-y-2">
      <Iconed reversed icon="lucide/map-pin">
        <h2>Location</h2>
      </Iconed>

      <GoogleMap place={data.shelter.place} />
    </div>
  {/if}
</div>
