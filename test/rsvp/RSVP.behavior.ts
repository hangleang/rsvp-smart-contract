import { expect } from "chai";
import { BigNumber } from "ethers";
import { solidityKeccak256 } from "ethers/lib/utils";
import { ethers } from "hardhat";

export function shouldBehaveLikeRSVP(): void {
  it("should return the new event once it's created", async function () {
    const [creator] = this.signers;
    const deposit: BigNumber = ethers.utils.parseEther("1");
    const maxAttendees: number = 3;
    const startAt: number = 1718926200;
    const contentID: string = "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi";
    const expectedEventId = solidityKeccak256(
      ["address", "address", "uint256", "uint256", "uint32"],
      [creator.address, this.rsvp.address, startAt, deposit, maxAttendees],
    );

    await expect(await this.rsvp.connect(creator).createEvent(contentID, startAt, deposit, maxAttendees))
      .to.emit(this.rsvp, "EventCreated")
      .withArgs(expectedEventId, creator.address, deposit, startAt, maxAttendees, contentID);

    expect((await this.rsvp.events(expectedEventId)).id).to.be.eq(expectedEventId);
  });

  it("should store confirmed RSVP once user confirm RSVP", async function () {
    const [creator, user1, user2] = this.signers;
    const deposit: BigNumber = ethers.utils.parseEther("1");
    const maxAttendees: number = 3;
    const startAt: number = 1718926200;
    const contentID: string = "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi";
    const eventId = solidityKeccak256(
      ["address", "address", "uint256", "uint256", "uint32"],
      [creator.address, this.rsvp.address, startAt, deposit, maxAttendees],
    );
    await this.rsvp.connect(creator).createEvent(contentID, startAt, deposit, maxAttendees);
    await expect(await this.rsvp.connect(user1).rsvpEvent(eventId, { value: deposit }))
      .to.emit(this.rsvp, "EventRSVP")
      .withArgs(eventId, user1.address);

    expect(await this.rsvp.eventToConfirmedRSVPs(eventId, user1.address)).to.eq(true);
    expect(await this.rsvp.eventToConfirmedRSVPs(eventId, user2.address)).to.eq(false);
    expect(await ethers.provider.getBalance(this.rsvp.address)).to.eq(deposit);
  });

  it("should not allow confirm RSVP once reach max attendees", async function () {
    const [creator, user1, user2, user3] = this.signers;
    const deposit: BigNumber = ethers.utils.parseEther("1");
    const maxAttendees: number = 2;
    const startAt: number = 1718926200;
    const contentID: string = "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi";
    const eventId = solidityKeccak256(
      ["address", "address", "uint256", "uint256", "uint32"],
      [creator.address, this.rsvp.address, startAt, deposit, maxAttendees],
    );
    await this.rsvp.connect(creator).createEvent(contentID, startAt, deposit, maxAttendees);
    await this.rsvp.connect(user1).rsvpEvent(eventId, { value: deposit });
    await this.rsvp.connect(user2).rsvpEvent(eventId, { value: deposit });
    await expect(this.rsvp.connect(user3).rsvpEvent(eventId, { value: deposit })).to.be.revertedWithCustomError(
      this.rsvp,
      "ReachedMaxAttendees",
    );

    expect(await ethers.provider.getBalance(this.rsvp.address)).to.eq(deposit.mul(2));
  });

  it("should be able to claim deposit by creator", async function () {
    const [creator, user1, user2, user3] = this.signers;
    const deposit: BigNumber = ethers.utils.parseEther("1");
    const maxAttendees: number = 3;
    const startAt: number = 1718926200;
    const contentID: string = "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi";
    const eventId = solidityKeccak256(
      ["address", "address", "uint256", "uint256", "uint32"],
      [creator.address, this.rsvp.address, startAt, deposit, maxAttendees],
    );
    await this.rsvp.connect(creator).createEvent(contentID, startAt, deposit, maxAttendees);
    await this.rsvp.connect(user1).rsvpEvent(eventId, { value: deposit });
    await this.rsvp.connect(user2).rsvpEvent(eventId, { value: deposit });
    await this.rsvp.connect(user3).rsvpEvent(eventId, { value: deposit });
    expect(await ethers.provider.getBalance(this.rsvp.address)).to.eq(deposit.mul(3));

    await ethers.provider.send("evm_increaseTime", [1718926200]);
    await expect(this.rsvp.connect(creator).checkInEvent(eventId, user1.address))
      .to.emit(this.rsvp, "EventCheckedIn")
      .withArgs(eventId, user1.address);

    expect(await this.rsvp.eventToClaimedRSVPs(eventId, user1.address)).to.eq(true);
    expect(await this.rsvp.eventToClaimedRSVPs(eventId, user2.address)).to.eq(false);
    expect(await ethers.provider.getBalance(this.rsvp.address)).to.eq(deposit.mul(2));
  });

  it("should be able to withdraw unclaimed deposit by creator", async function () {
    const [creator, user1, user2, user3] = this.signers;
    const deposit: BigNumber = ethers.utils.parseEther("1");
    const maxAttendees: number = 3;
    const startAt: number = 1718926200;
    const contentID: string = "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi";
    const eventId = solidityKeccak256(
      ["address", "address", "uint256", "uint256", "uint32"],
      [creator.address, this.rsvp.address, startAt, deposit, maxAttendees],
    );
    await this.rsvp.connect(creator).createEvent(contentID, startAt, deposit, maxAttendees);
    await this.rsvp.connect(user1).rsvpEvent(eventId, { value: deposit });
    await this.rsvp.connect(user2).rsvpEvent(eventId, { value: deposit });
    await this.rsvp.connect(user3).rsvpEvent(eventId, { value: deposit });
    expect(await ethers.provider.getBalance(this.rsvp.address)).to.eq(deposit.mul(3));

    await ethers.provider.send("evm_increaseTime", [1718926200]);
    await this.rsvp.connect(creator).checkInEvent(eventId, user1.address);
    await this.rsvp.connect(creator).checkInEvent(eventId, user2.address);

    await ethers.provider.send("evm_increaseTime", [15778800000000]);
    await expect(this.rsvp.connect(creator).withdrawUnclaimedDeposit(eventId))
      .to.emit(this.rsvp, "UnclaimedDepositPaid")
      .withArgs(eventId, deposit);
    expect(await ethers.provider.getBalance(this.rsvp.address)).to.eq(0);
  });
}
