export type PaymentFailure =
  | 'invalid-promotion-code'
  | 'promotion-code-expired'
  | 'ticket-already-has-vip'
  | 'vip-no-longer-available';
