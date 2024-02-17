export interface AlgoliaRetrieveParams {
  query: string;
  filterBy: string[][];
  aroundLatLng: string;
  aroundRadius: number;
  pageNumber: number;
  pageSize: number;
}
