import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { RSVP } from "../../src/types/RSVP";
import type { RSVP__factory } from "../../src/types/factories/RSVP__factory";

task("deploy:RSVP")
  // .addParam("greeting", "Say hello, be nice")
  .setAction(async function (_args: TaskArguments, { ethers }) {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const rsvpFactory: RSVP__factory = await ethers.getContractFactory("RSVP");
    const rsvp: RSVP = await rsvpFactory.connect(signers[0]).deploy();
    await rsvp.deployed();
    console.log("RSVP deployed to: ", rsvp.address);
  });
