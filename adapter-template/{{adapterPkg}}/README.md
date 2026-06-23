# {{adapterPkg}}

The publishable A2UI catalog/adapter mapping A2UI components to {{Library}}
React wrappers, built over [`@a2ui/react`](https://www.npmjs.com/package/@a2ui/react).

The catalog has two halves: `catalog.ts` builds a `Catalog<ReactComponentImplementation>` over
`@a2ui/react`'s common schemas (A2UI component names → {{Library}} React wrappers in `components/`),
and `catalogs/{{version}}/catalog.json` is the declarative catalog the agent reads. The JSON is
hosted at the URL in `catalog-id.ts` (`github.com/{{repoSlug}}/blob/main/...`); keep the two in sync.

Consumed from the [`client`](../client) workspace via the yarn workspace edge; published on its own
as the one releasable package.

## Commands

```bash
yarn workspace {{adapterPkg}} run build      # tsc → dist/
yarn workspace {{adapterPkg}} run typecheck
yarn workspace {{adapterPkg}} run test       # vitest
```
