#!/usr/bin/env node
import { Command, flags } from '@oclif/command';

import { LaunchDarklyApi } from '../../ld-api';

class ArchiveFlagsCommand extends Command {
  static description = 'Archive feature flags. This takes affect across all LD environments';
  static strict = false
  static enableJsonFlag = true
  static args = [{
    name: 'feature_flag_keys'
  }]
  static flags = {
    apiKey: flags.string({
      required: true,
      description: 'Launchdarkly API key',
    }),
    dryRun: flags.boolean({
      required: false,
      description: 'Do not execute mutation. Just print what would happen.',
    }),
  };

  async run() {
    const { flags, argv } = this.parse(ArchiveFlagsCommand);

    const { apiKey, dryRun } = flags;
    const api = new LaunchDarklyApi({ apiKey });
    if(argv.length === 0) {
      return this._help()
    }
    const inputFlagSet = new Set(argv);
    // fetch all the flags and validate the input
    const allFlags = await api.getAllFeatureFlags();
    const activeFlagSet = new Set(allFlags.items.filter(({ archived, key }) => !archived).map((flag) => flag.key))
    const activeInputFlags: string[] = [];
    inputFlagSet.forEach((key) => {
      if(activeFlagSet.has(key)) {
        activeInputFlags.push(key);
      }
    })

    if(activeInputFlags.length === 0) {
      this.log('No non-archived flags found from that input');
      this.exit(1)
    }
    this.log(`Archiving ${activeInputFlags.length} flags`);
    if(dryRun) {
      this.log(`dryRun enabled...`);
      this.exit(0);
    }
    for(const flagKey of activeInputFlags) {
      this.log(`Archiving ${flagKey}`)
      await api.archiveFlag(flagKey)

    }
    return {
      message: `Archived ${activeInputFlags.length} flags successfully.`
    } ;
  }
}
export = ArchiveFlagsCommand;
