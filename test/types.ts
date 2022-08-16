import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { RSVP } from "../src/types/RSVP";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    rsvp: RSVP;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: SignerWithAddress[];
  }
}

// export interface Signers {
//   admin: SignerWithAddress;
//   user1: SignerWithAddress;
// }
