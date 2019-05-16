import { RpcServer } from '@nimiq/rpc';
import { BrowserDetection } from '@nimiq/utils';
import { WalletStore } from '@/lib/WalletStore';
import { WalletInfoEntry, WalletInfo } from '@/lib/WalletInfo';
import CookieJar from '@/lib/CookieJar';
import Config from 'config';
import { Account } from './lib/PublicRequestTypes';

class IFrameApi {
    public static run() {
        const rpcServer = new RpcServer(Config.privilegedOrigins);

        // Register handlers
        rpcServer.onRequest('list', IFrameApi.list);

        rpcServer.init();
    }

    public static async list(): Promise<Account[]> {
        let wallets: WalletInfoEntry[];
        if (BrowserDetection.isIOS() || BrowserDetection.isSafari()) {
            wallets = await CookieJar.eat();
        } else {
            wallets = await WalletStore.Instance.list();
        }
        if (wallets.length > 0) {
            return wallets
                .filter((wallet) => !wallet.keyMissing)
                .map((wallet) => WalletInfo.objectToAccountType(wallet));
        }

        // If no wallets exist, see if the Keyguard has keys
        const client = new (await import('@nimiq/keyguard-client')).KeyguardClient(Config.keyguardEndpoint);
        const hasKeys = await client.hasKeys();
        if (hasKeys.success) {
            throw new Error('ACCOUNTS_LOST');
        }

        // If no keys exist, check for legacy accounts
        const hasLegacyAccounts = await client.hasLegacyAccounts();
        if (hasLegacyAccounts.success) {
            throw new Error('MIGRATION_REQUIRED');
        }

        return [];
    }
}

IFrameApi.run();
