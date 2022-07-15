import { Client } from 'typesense';

export interface TypesenseRepositoryParams {
  typesense: Client;
  collectionName: string;
  queryBy: string;
}
