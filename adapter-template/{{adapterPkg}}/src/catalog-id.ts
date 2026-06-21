// The canonical hosted URL identifying this catalog. The {{repoSlug}}/blob/main
// skeleton assumes catalog.json is hosted in your GitHub repo on the default
// branch — change it if you host the catalog elsewhere.
export const CATALOG_ID =
  'https://github.com/{{repoSlug}}/blob/main/{{adapterPkg}}/catalogs/{{version}}/catalog.json';
