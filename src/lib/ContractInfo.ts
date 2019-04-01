import { VestingContract, HashedTimeLockedContract, Contract } from './PublicRequestTypes';

export abstract class ContractInfo {
    public static fromObject(o: ContractInfoEntry): VestingContractInfo | HashedTimeLockedContractInfo {
        switch (o.type) {
            case Nimiq.Account.Type.VESTING:
                return VestingContractInfo.fromObject(o as VestingContractInfoEntry);
            case Nimiq.Account.Type.HTLC:
                return HashedTimeLockedContractInfo.fromObject(o as HashedTimeLockedContractInfoEntry);
            default: throw new Error('Unknown contract type: ' + o.type);
        }
    }

    public walletId?: string;

    constructor(
        public type: Nimiq.Account.Type,
        public label: string,
        public address: Nimiq.Address,
        public balance?: number,
    ) {}

    public get userFriendlyAddress(): string {
        return this.address.toUserFriendlyAddress();
    }

    public abstract toObject(): ContractInfoEntry;

    public abstract toContractType(): Contract;
}

export class VestingContractInfo extends ContractInfo {
    public static fromObject(o: VestingContractInfoEntry): VestingContractInfo {
        return new VestingContractInfo(
            o.label,
            new Nimiq.Address(o.address),
            new Nimiq.Address(o.owner),
            o.start,
            o.stepAmount,
            o.stepBlocks,
            o.totalAmount,
            o.balance,
        );
    }

    public constructor(
        public label: string,
        public address: Nimiq.Address,
        public owner: Nimiq.Address,
        public start: number,
        public stepAmount: number,
        public stepBlocks: number,
        public totalAmount: number,
        public balance?: number,
    ) {
        super(Nimiq.Account.Type.VESTING, label, address, balance);
    }

    public toObject(): VestingContractInfoEntry {
        return {
            type: this.type,
            label: this.label,
            address: new Uint8Array(this.address.serialize()),
            owner: new Uint8Array(this.owner.serialize()),
            start: this.start,
            stepAmount: this.stepAmount,
            stepBlocks: this.stepBlocks,
            totalAmount: this.totalAmount,
            balance: this.balance,
        };
    }

    public toContractType(): VestingContract {
        return {
            type: Nimiq.Account.Type.VESTING,
            label: this.label,
            address: this.userFriendlyAddress,
            owner: this.owner.toUserFriendlyAddress(),
            start: this.start,
            stepAmount: this.stepAmount,
            stepBlocks: this.stepBlocks,
            totalAmount: this.totalAmount,
        };
    }

    public calculateAvailableAmount(height: number, currentBalance = this.totalAmount) {
        return (currentBalance - this.totalAmount)
        + Math.min(
            this.totalAmount,
            Math.max(0, Math.floor((height - this.start) / this.stepBlocks)) * this.stepAmount,
        );
    }
}

export class HashedTimeLockedContractInfo extends ContractInfo {
    public static fromObject(o: HashedTimeLockedContractInfoEntry): HashedTimeLockedContractInfo {
        return new HashedTimeLockedContractInfo(
            o.label,
            new Nimiq.Address(o.address),
            new Nimiq.Address(o.sender),
            new Nimiq.Address(o.recipient),
            new Nimiq.Hash(o.hashRoot),
            o.hashCount,
            o.timeout,
            o.totalAmount,
            o.balance,
        );
    }

    public constructor(
        public label: string,
        public address: Nimiq.Address,
        public sender: Nimiq.Address,
        public recipient: Nimiq.Address,
        public hashRoot: Nimiq.Hash,
        public hashCount: number,
        public timeout: number,
        public totalAmount: number,
        public balance?: number,
    ) {
        super(Nimiq.Account.Type.HTLC, label, address, balance);
    }

    public toObject(): HashedTimeLockedContractInfoEntry {
        return {
            type: this.type,
            label: this.label,
            address: new Uint8Array(this.address.serialize()),
            sender: new Uint8Array(this.sender.serialize()),
            recipient: new Uint8Array(this.recipient.serialize()),
            hashRoot: new Uint8Array(this.hashRoot.serialize()),
            hashCount: this.hashCount,
            timeout: this.timeout,
            totalAmount: this.totalAmount,
            balance: this.balance,
        };
    }

    public toContractType(): HashedTimeLockedContract {
        return {
            type: Nimiq.Account.Type.VESTING,
            label: this.label,
            address: this.userFriendlyAddress,
            sender: this.sender.toUserFriendlyAddress(),
            recipient: this.recipient.toUserFriendlyAddress(),
            hashRoot: this.hashRoot.toHex(),
            hashCount: this.hashCount,
            timeout: this.timeout,
            totalAmount: this.totalAmount,
        };
    }
}

/*
 * Database Types
 */
export interface VestingContractInfoEntry {
    type: Nimiq.Account.Type;
    label: string;
    address: Uint8Array;
    owner: Uint8Array;
    start: number;
    stepAmount: number;
    stepBlocks: number;
    totalAmount: number;
    balance?: number;
}

export interface HashedTimeLockedContractInfoEntry {
    type: Nimiq.Account.Type;
    label: string;
    address: Uint8Array;
    sender: Uint8Array;
    recipient: Uint8Array;
    hashRoot: Uint8Array;
    hashCount: number;
    timeout: number;
    totalAmount: number;
    balance?: number;
}

export type ContractInfoEntry = VestingContractInfoEntry | HashedTimeLockedContractInfoEntry;
