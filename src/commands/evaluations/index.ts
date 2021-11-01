#!/usr/bin/env node
import { Command, flags } from '@oclif/command';
import { LaunchDarklyApi } from '../../ld-api';
import { parseApiResponse } from '../../parser';
import { YamlFormatter } from '../../yaml-formatter';

export default class DefaultFlagRulesCommand extends Command {
  static description =
    'Get default rule value for all flags in an environment. Defaults to yaml format';
  static flags = {
    apiKey: flags.string({
      required: true,
      description: 'Launchdarkly API key',
    }),
    env: flags.string({
      required: true,
      description: 'Launchdarkly environment name',
    }),
    platform: flags.enum<'server' | 'client'>({
      required: true,
      options: ['server', 'client'],
      default: 'server',
      description:
        'The platform for which these evaluation apply. See here for more details: https://docs.launchdarkly.com/sdk/concepts/client-side-server-side',
    }),
  };

  async run() {
    const { args, flags } = this.parse(DefaultFlagRulesCommand);
    const { apiKey, env, platform } = flags;
    const api = new LaunchDarklyApi({ apiKey });
    const allFlags = await api.getAllFeatureFlags({ env });
    this.debug('Successfully fetched flags from launchdarkly');
    const parsedFlagValues = parseApiResponse({
      apiResponse: allFlags,
      envName: env,
      platform,
    });
    const output = YamlFormatter.format(parsedFlagValues);
    this.log(output);
  }
}
