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
  import Icon from "$lib/components/ui/icon/Icon.svelte";
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

<article>
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

  <address class="flex flex-wrap gap-4">
    {#each [...data.shelter.urls, ...data.shelter.emails, ...data.shelter.phones] as link (link.id)}
      <LinkLink {link} />
    {/each}
  </address>

  {#if data.shelter.animals.length}
    <section class="flex flex-wrap gap-3">
      {#each data.shelter.animals as animal (animal.id)}
        <AnimalCard {animal} images={animal.images} />
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
    <section>
      <header>
        <Iconed reversed icon="lucide/hand-heart" class="size-7">
          <h2>Donate</h2>
        </Iconed>

        <p class="text-muted-foreground">
          Your donations help {data.shelter.name} continue their important work.
          You can choose from the following methods to contribute:
        </p>
      </header>

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

      <ul class="flex flex-wrap gap-3">
        {#each data.shelter.donation_methods as donation_method (donation_method.id)}
          {@const label =
            donation_method.label ||
            DONATION_METHOD.KIND.MAP[donation_method.data.kind].label}

          <li class="w-full max-w-[400px] rounded-lg border p-3 shadow-sm">
            <div class="flex items-center justify-between">
              <h4>
                {label}
              </h4>

              {#if donation_method.data.kind === "url"}
                <ExternalLink
                  link={{ label: "", href: donation_method.data.href }}
                />
              {:else if donation_method.data.kind === "bank"}
                <Dialog
                  title="Bank details"
                  description="Please use the following bank details to make your donation:"
                >
                  {#snippet trigger()}
                    <Icon
                      icon="lucide/wallet-cards"
                      title="View bank details"
                    />
                    Bank details
                  {/snippet}

                  {#snippet content()}
                    {@const data = donation_method.data as Extract<
                      DonationMethod["data"],
                      { kind: "bank" }
                    >}

                    <dl>
                      <div>
                        <dt>Bank</dt>
                        <dd>{data.bank_name}</dd>
                      </div>

                      {#if data.branch_code}
                        <div>
                          <dt>Branch Code</dt>
                          <dd>{data.branch_code}</dd>
                        </div>
                      {/if}

                      <div>
                        <dt>Account Number</dt>
                        <dd>{data.account_number}</dd>
                      </div>

                      {#if data.swift_code}
                        <div>
                          <dt>Swift Code</dt>
                          <dd>{data.swift_code}</dd>
                        </div>
                      {/if}

                      {#if data.reference}
                        <div>
                          <dt>Reference</dt>
                          <dd>{data.reference}</dd>
                        </div>
                      {/if}
                    </dl>
                  {/snippet}
                </Dialog>
              {/if}
            </div>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if data.shelter.place}
    <section>
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
