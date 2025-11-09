import * as freighter from '@stellar/freighter-api';

export const wallet = {
  isConnected: () => freighter.isConnected(),
  getAddress: () => freighter.getAddress(),
  signTransaction: (xdr: string, options?: any) => freighter.signTransaction(xdr, options),
  getNetwork: () => freighter.getNetwork(),
};
