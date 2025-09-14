<!-- <script lang="ts">
  import { PUBLIC_GOOGLE_MAPS_API_KEY } from "$env/static/public";
  import { PlaceAutocomplete } from "places-autocomplete-svelte";
  import type {
    ComponentOptions,
    PlaceResult,
    RequestParams,
  } from "places-autocomplete-svelte/interfaces";

  let fullResponse: PlaceResult | null = $state(null);
  let placesError = $state("");

  // --- Event Handlers ---
  const handleResponse = (response: PlaceResult) => {
    console.log("Place Selected:", response);
    fullResponse = response;
    placesError = ""; // Clear previous errors
  };

  const handleError = (error: string) => {
    console.error("Places Autocomplete Error:", error);
    placesError = error;
    fullResponse = null; // Clear previous results
  };

  // --- Configuration (Optional) ---

  // Control API request parameters
  const requestParams: Partial<RequestParams> = $state({
    region: "ZA",
    language: "en-ZA",
    includedRegionCodes: ["ZA"], // Only show results in the specified regions,
    // Optional
    // The origin point from which to calculate geodesic distance to the destination
    origin: {
      lat: -34.417264,
      lng: 19.150987,
    },
  });

  // Control which data fields are fetched for Place Details (affects cost!)
  const fetchFields: string[] = $state([
    "formatted_address",
    "geometry",
    "name",
    "place_id",
  ]);

  // Control component appearance and behavior
  const options: Partial<ComponentOptions> = $state({
    placeholder: "Start typing your address...",
    debounce: 200, // Debounce input by 200ms (default is 100ms)
    distance: true, // Show distance if origin is provided in requestParams
    distance_units: "km", // Use kilometers for distance (default is 'miles')
    classes: {
      // Example: Override input styling and highlight class
      input: "my-custom-input-class border-blue-500",
      // Customize suggestion highlighting
      highlight: "bg-yellow-200 text-black",
    },
  });
</script>

{#if placesError}
  <div class="error-message" role="alert">
    Error: {placesError}
  </div>
{/if}

<PlaceAutocomplete
  {PUBLIC_GOOGLE_MAPS_API_KEY}
  {requestParams}
  {fetchFields}
  {options}
  onResponse={handleResponse}
  onError={handleError}
/>

{#if fullResponse}
  <h2>Selected Place Details:</h2>
  <pre>{JSON.stringify(fullResponse, null, 2)}</pre>
{/if}

<style>
  /* Example of styling an overridden class */
  :global(.my-custom-input-class) {
    padding: 0.75rem;
    border-radius: 0.25rem;
    width: 100%;
    /* Add other styles */
  }
  .error-message {
    color: red;
    margin-bottom: 1rem;
  }
</style> -->

<script lang="ts">
  import { PUBLIC_GOOGLE_MAPS_API_KEY } from "$env/static/public";
  import { PlaceAutocomplete } from "places-autocomplete-svelte";
  import type { PlaceResult } from "places-autocomplete-svelte/interfaces";

  let fullResponse: PlaceResult | null = $state(null);

  const onResponse = (response: PlaceResult) => {
    fullResponse = response;
    console.log("Place Selected:", response);
  };

  const onError = (error: string) => {
    console.error("Autocomplete Error:", error);
  };
</script>

<PlaceAutocomplete {PUBLIC_GOOGLE_MAPS_API_KEY} {onResponse} {onError} />

{#if fullResponse}
  <pre>{JSON.stringify(fullResponse, null, 2)}</pre>
{/if}
