declare global {
  namespace App {
    interface PageData {
      seo?: {
        title: string;
        image?: string | null;
        description?: string | null;
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
