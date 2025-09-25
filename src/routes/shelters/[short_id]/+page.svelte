<script lang="ts">
  import { AccessClient } from "$lib/clients/access_control.client.js";
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import ShareButton from "$lib/components/buttons/ShareButton.svelte";
  import AnimalCard from "$lib/components/cards/AnimalCard.svelte";
  import Picture from "$lib/components/images/Picture.svelte";
  import ExternalLink from "$lib/components/links/ExternalLink.svelte";
  import LinkLink from "$lib/components/links/LinkLink.svelte";
  import GoogleMap from "$lib/components/map/GoogleMap.svelte";
  import PrerenderedMarkdown from "$lib/components/text/PrerenderedMarkdown.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import ItemCarousel from "$lib/components/ui/carousel/ItemCarousel.svelte";
  import Dialog from "$lib/components/ui/dialog/dialog.svelte";
  import Iconed from "$lib/components/ui/icon/Iconed.svelte";
  import { APP } from "$lib/const/app.js";
  import { DONATION_METHOD } from "$lib/const/donation_method.const.js";
  import { ICONS } from "$lib/const/icon.const.js";
  import { IMAGES } from "$lib/const/image.const";
  import { ROUTES } from "$lib/const/routes.const.js";
  import type { DonationMethod } from "$lib/schema/donation_method.schema";
  import { Format } from "$lib/utils/format.util.js";

  let { data } = $props();

  const share_data: ShareData = {
    title: data.shelter.name,
    text: `Check out ${data.shelter.name} on ${APP.NAME}`,
  };
</script>

<!-- TODO: Use some better wrapper elements. Like article, probably. Just check if the h1 should be in or out of the article -->
<article class="space-y-7">
  <header class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <BackButton />
      <h1>{data.shelter.name}</h1>
    </div>

    <div class="flex items-center gap-2">
      {#if AccessClient.member_can( { organization: ["update"] }, ) && AccessClient.org_owns(data.shelter)}
        <Button
          icon={ICONS.EDIT}
          href={ROUTES.SHELTER_EDIT}
          title="Edit shelter"
        />
      {/if}

      <ShareButton data={share_data} />
    </div>
  </header>

  <section class="flex flex-wrap gap-4">
    {#each [...data.shelter.urls, ...data.shelter.emails, ...data.shelter.phones] as link}
      <LinkLink {link} />
    {/each}
  </section>

  {#if data.shelter.animals.length}
    <section class="flex flex-wrap gap-3">
      {#each data.shelter.animals as animal}
        <AnimalCard {animal} />
      {/each}
    </section>
  {/if}

  {#if data.prerendered.description}
    <section>
      <blockquote>
        <PrerenderedMarkdown html={data.prerendered.description} />
      </blockquote>
    </section>
  {/if}

  {#if data.shelter.images.length}
    <section>
      <ItemCarousel items={data.shelter.images}>
        {#snippet item(image, i)}
          <Picture {image} {...IMAGES.SIZES.PREVIEW} prioritize={i < 2} />
        {/snippet}
      </ItemCarousel>
    </section>
  {/if}

  {#if data.shelter.donation_methods.length}
    <section class="space-y-2">
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
    </section>
  {/if}

  {#if data.shelter.place}
    <section class="space-y-2">
      <Iconed reversed icon="lucide/map-pin">
        <h2>Location</h2>
      </Iconed>

      <GoogleMap place={data.shelter.place} />
    </section>
  {/if}

  <footer>
    <p class="text-sm text-muted-foreground">
      Last updated: <em>{Format.datetime(data.shelter.updatedAt)}</em>
    </p>
  </footer>
</article>
