// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IRSVP {
    error EventAlreadyCreated();
    error InsufficientDeposit();
    error EventHasBeenStarted();
    error ReachedMaxAttendees();
    error AttendeeAlreadyRegistered();
    error AccessDenied();
    error AttendeeNotRegistered();
    error AttendeeAlreadyClaimed();
    error AlreadyPaidOut();
    error WithdrawTooEarly();

    event EventCreated(
        bytes32 eventId,
        address creator,
        uint256 deposit,
        uint256 startAt,
        uint32 maxAttendees,
        string contentCID
    );
    event EventRSVP(bytes32 eventId, address attendee);
    event EventCheckedIn(bytes32 eventId, address attendee);
    event UnclaimedDepositPaid(bytes32 eventId, uint256 unclaimedAmount);
}
