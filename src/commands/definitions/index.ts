#!/usr/bin/env node
import { Command, flags } from '@oclif/command';
import { LaunchDarklyApi } from '../../ld-api';
import { writeFlagEnumFile } from '../../generate';
import { resolve } from 'path';

class GenerateFlagsCommand extends Command {
  static description = 'Generate typescript definitions for launchdarkly flags';
  static flags = {
    apiKey: flags.string({
      required: true,
      description: 'Launchdarkly API key',
    }),
    outFile: flags.string({
      required: true,
      description: 'Output typescript file path',
    }),
  };

  async run() {
    const { args, flags } = this.parse(GenerateFlagsCommand);

    const { apiKey, outFile } = flags;
    const api = new LaunchDarklyApi({ apiKey });
    const allFlags = await api.getAllFeatureFlags();
    const activeFlags = allFlags.items.filter(({ archived }) => !archived);
    await writeFlagEnumFile(activeFlags, resolve(process.cwd(), outFile));
  }
}
export = GenerateFlagsCommand;
