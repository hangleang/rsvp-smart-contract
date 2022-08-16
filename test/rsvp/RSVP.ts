import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

// import type { Signers } from "../types";
import { shouldBehaveLikeRSVP } from "./RSVP.behavior";
import { deployRSVPFixture } from "./RSVP.fixture";

describe("Unit tests", function () {
  before(async function () {
    // this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers = signers;

    this.loadFixture = loadFixture;
  });

  describe("RSVP", function () {
    beforeEach(async function () {
      const { rsvp } = await this.loadFixture(deployRSVPFixture);
      this.rsvp = rsvp;
    });

    shouldBehaveLikeRSVP();
  });
});
