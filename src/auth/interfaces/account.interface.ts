import { CustomClaims } from '@auth/interfaces/custom-claims.interface';

export interface Account {
  id: string;
  claims: CustomClaims;
}
