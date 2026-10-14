/**
 * Runs `body` with the site-wide indexing switch open.
 *
 * Indexing is closed unless `ALLOW_INDEXING=true` (`indexingAllowed` in
 * `services/seo.ts`), and the closed default renders `noindex` on every page by
 * itself. A test about a page's *own* `noindex` prop has to open the switch
 * first or it passes on the default and would keep passing after someone
 * deleted the prop it exists to protect.
 *
 * Restores the previous value, so a file that runs these alongside tests of the
 * closed default doesn't depend on their order.
 */
export const withIndexingAllowed = async <T>(
  body: () => T | Promise<T>,
): Promise<T> => {
  const previous = process.env.ALLOW_INDEXING;
  process.env.ALLOW_INDEXING = "true";
  try {
    return await body();
  } finally {
    if (previous === undefined) {
      delete process.env.ALLOW_INDEXING;
    } else {
      process.env.ALLOW_INDEXING = previous;
    }
  }
};
