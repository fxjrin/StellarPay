import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CC6THIWIYPXPQEZJ7WJSBD4DNG4HBALIVKDF53E3GS46BYFFIHUH34QV",
    }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAQAAAAAAAAAAAAAAC1VzZXJQcm9maWxlAAAAAAMAAAAAAAAAB2FkZHJlc3MAAAAAEwAAAAAAAAAKY3JlYXRlZF9hdAAAAAAABgAAAAAAAAAIdXNlcm5hbWUAAAAQ",
            "AAAAAQAAAAAAAAAAAAAAB1BheW1lbnQAAAAACAAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAdjbGFpbWVkAAAAAAEAAAAAAAAAB21lc3NhZ2UAAAAAEAAAAAAAAAAKcGF5bWVudF9pZAAAAAAABgAAAAAAAAAScmVjaXBpZW50X3VzZXJuYW1lAAAAAAAQAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAYAAAAAAAAABXRva2VuAAAAAAAAEw==",
            "AAAAAAAAAA1SZWdpc3RlciB1c2VyAAAAAAAACHJlZ2lzdGVyAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAh1c2VybmFtZQAAABAAAAAA",
            "AAAAAAAAAAtHZXQgcHJvZmlsZQAAAAALZ2V0X3Byb2ZpbGUAAAAAAQAAAAAAAAAIdXNlcm5hbWUAAAAQAAAAAQAAA+gAAAfQAAAAC1VzZXJQcm9maWxlAA==",
            "AAAAAAAAAB9DcmVhdGUgcGF5bWVudCB3aXRoIFJFQUwgZXNjcm93AAAAAA5jcmVhdGVfcGF5bWVudAAAAAAABQAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAABJyZWNpcGllbnRfdXNlcm5hbWUAAAAAABAAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAdtZXNzYWdlAAAAABAAAAABAAAABg==",
            "AAAAAAAAABpHZXQgcGF5bWVudCBjb3VudCBmb3IgdXNlcgAAAAAAEWdldF9wYXltZW50X2NvdW50AAAAAAAAAQAAAAAAAAAIdXNlcm5hbWUAAAAQAAAAAQAAAAY=",
            "AAAAAAAAACBHZXQgcGF5bWVudCBJRCBhdCBpbmRleCBmb3IgdXNlcgAAABFnZXRfcGF5bWVudF9pZF9hdAAAAAAAAAIAAAAAAAAACHVzZXJuYW1lAAAAEAAAAAAAAAAFaW5kZXgAAAAAAAAGAAAAAQAAA+gAAAAG",
            "AAAAAAAAAA1DbGFpbSBwYXltZW50AAAAAAAADWNsYWltX3BheW1lbnQAAAAAAAACAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAApwYXltZW50X2lkAAAAAAAGAAAAAA==",
            "AAAAAAAAABFHZXQgcGF5bWVudCBieSBJRAAAAAAAAAtnZXRfcGF5bWVudAAAAAABAAAAAAAAAApwYXltZW50X2lkAAAAAAAGAAAAAQAAA+gAAAfQAAAAB1BheW1lbnQA"]), options);
        this.options = options;
    }
    fromJSON = {
        register: (this.txFromJSON),
        get_profile: (this.txFromJSON),
        create_payment: (this.txFromJSON),
        get_payment_count: (this.txFromJSON),
        get_payment_id_at: (this.txFromJSON),
        claim_payment: (this.txFromJSON),
        get_payment: (this.txFromJSON)
    };
}
