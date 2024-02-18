export interface AlgoliaRetrieveParams {
  query: string;
  filters: string;
  aroundLatLng?: string;
  aroundRadius?: number;
  page: number;
  hitsPerPage: number;
}
