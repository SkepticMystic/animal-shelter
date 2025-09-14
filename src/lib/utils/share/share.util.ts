import type { SHARE } from "$lib/const/share.const";
import { err, suc } from "../result.util";
import { Url } from "../urls";

const native = async (data: ShareData) => {
  if (!navigator.share) return err();

  try {
    return suc(await navigator.share(data));
  } catch (error) {
    console.log("navigator.share error", error);
    return err();
  }
};

// SOURCE: https://github.com/bradvin/social-share-urls/blob/master/code/javascript/javascript/social-share-media.js
const build_social_url = {
  twitter: (data: ShareData) =>
    Url.build("https://twitter.com", "/intent/tweet", {
      url: data.url,
      text: data.text,
    }),

  facebook: (data: ShareData) =>
    Url.build("https://www.facebook.com", "/sharer.php", {
      u: data.url,
    }),

  linkedin: (data: ShareData) =>
    Url.build("https://www.linkedin.com", "/sharing/share-offsite", {
      url: data.url,
    }),

  whatsapp: (data: ShareData) =>
    Url.build("https://wa.me", "/", {
      url: data.url,
      text: data.text,
    }),

  telegram: (data: ShareData) =>
    Url.build("https://t.me", "/share/url", {
      url: data.url,
      text: data.text,
    }),

  reddit: (data: ShareData) =>
    Url.build("https://www.reddit.com", "/submit", {
      url: data.url,
      title: data.text,
    }),

  pinterest: (data: ShareData) =>
    Url.build("https://pinterest.com", "/pin/create/button", {
      url: data.url,
      description: data.text,
    }),
} satisfies Record<(typeof SHARE.SOCIAL.IDS)[number], (data: ShareData) => URL>;

export const Share = {
  native,
  build_social_url,
};
