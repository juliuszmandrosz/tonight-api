import { WhereFilterOp } from 'firebase-admin/lib/firestore';

export interface QueryParam {
  fieldName: string;
  fieldValue: any;
  operator: WhereFilterOp;
}
