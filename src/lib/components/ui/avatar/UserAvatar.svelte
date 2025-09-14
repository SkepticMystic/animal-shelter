<script lang="ts">
  import Picture from "$lib/components/images/Picture.svelte";
  import { IMAGES } from "$lib/const/image.const";
  import type { User } from "better-auth";
  import type { AvatarRootProps } from "bits-ui";

  let {
    user,
    ...rest
  }: AvatarRootProps & { user: Pick<User, "name" | "image"> } = $props();

  const label = user.name;
</script>

<Picture
  {...rest}
  {...IMAGES.SIZES.AVATAR}
  title={label}
  src={user.image}
  alt="{label} avatar"
  fallback={label.at(0)}
/>
<!-- 
<Avatar
  {...rest}
  title={label}
  src={user.image}
  alt="{label} avatar"
  fallback={label.at(0) ?? "?"}
/> -->
