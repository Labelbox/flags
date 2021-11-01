import fetch from 'node-fetch';
import { URL } from 'url';

type LaunchDarklyApiOptions = {
  apiKey: string;
};

type FlagVariation = {
  value: boolean | string | number;
  description: string;
  name?: string;
};

export type FlagResponseItem = {
  name: string;
  kind: string;
  description: string;
  key: string;
  variations: FlagVariation[];
  archived: boolean;
  clientSideAvailability: {
    usingEnvironmentId: boolean;
    usingMobileKey: boolean;
  };
  environments: {
    [envName: string]: {
      fallthrough: {
        variation: number;
      };
    };
  };
};

export type LDAllFlagsResponse = {
  items: FlagResponseItem[];
};
export type ListFlagsOptions = {
  env?: string;
};
export class LaunchDarklyApi {
  private baseURL = 'https://app.launchdarkly.com/api/v2/';

  constructor(private opts: LaunchDarklyApiOptions) {}

  // See https://apidocs.launchdarkly.com/tag/Feature-flags#operation/getFeatureFlags
  // for more information
  async getAllFeatureFlags(
    opts?: ListFlagsOptions
  ): Promise<LDAllFlagsResponse> {
    const authorization = this.opts.apiKey.trim();

    const url = new URL(`${this.baseURL}flags/default`);
    if (opts?.env) {
      url.searchParams.append('env', opts.env);
    }
    const response = await fetch(url.toString(), {
      headers: {
        authorization: authorization,
      },
    });
    if (!response.ok) {
      console.error(
        `Response code: ${response.status}. Api key used: "${authorization}"`
      );
      console.error(await response.text());
      throw new Error('Request to launchdarkly failed');
    }
    return response.json();
  }
}
