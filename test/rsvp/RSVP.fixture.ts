import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import type { RSVP } from "../../src/types/RSVP";
import type { RSVP__factory } from "../../src/types/factories/RSVP__factory";

export async function deployRSVPFixture(): Promise<{ rsvp: RSVP }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];

  const rsvpFactory: RSVP__factory = await ethers.getContractFactory("RSVP");
  const rsvp: RSVP = await rsvpFactory.connect(admin).deploy();
  await rsvp.deployed();

  return { rsvp };
}
