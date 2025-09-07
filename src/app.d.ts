declare global {
  namespace App {
    interface PageData {
      seo?: {
        title: string;
        desc?: string | null;
        image?: string | null;
      };
    }

    namespace Superforms {
      type Message = import("$lib/interfaces/index").Result<
        string | undefined,
        string | undefined
      >;
    }
  }
}

export {};
