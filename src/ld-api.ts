import fetch from 'node-fetch';
import { URL } from 'url';
import {sleep} from "./utils";

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

  private readonly PROJECT_KEY = 'default';

  constructor(private opts: LaunchDarklyApiOptions) {}

  // See https://apidocs.launchdarkly.com/tag/Feature-flags#operation/getFeatureFlags
  // for more information
  async getAllFeatureFlags(
    opts?: ListFlagsOptions
  ): Promise<LDAllFlagsResponse> {
    const url = new URL(`${this.baseURL}flags/${this.PROJECT_KEY}`);
    if (opts?.env) {
      url.searchParams.append('env', opts.env);
    }
    const response = await this.get(url);
    if (!response.ok) {
      console.error(
        `Response code: ${response.status}.`
      );
      console.error(await response.text());
      throw new Error('Request to launchdarkly failed');
    }
    return response.json();
  }



  async archiveFlag(flagKey: string) {
    const url = new URL(`${this.baseURL}flags/${this.PROJECT_KEY}/${flagKey}`);
    const res = await this.semanticPatch(url, {
      comment: 'Automated archive using @labelbox/flags',
      instructions: [
        {
          kind: 'archiveFlag'
        }
      ]
    });
    if(res.status == 403) {
      throw new Error('HTTP 403 response. Make sure your api key has write access.')
    }
    if(res.status == 429) {
      // This is super hacky but I tried to parse the `x-retry-after` header but the timestamp returned
      // was very far into the future.
      await sleep(10_000)
      throw new Error(`Archive failed`,)
    }
    if(res.status !== 200) {
      console.log(res.status);
      console.error(JSON.stringify(await res.json(), null, 2))
      throw new Error(`Archive failed`,)
    }
  }

  private async get(url: string | URL ) {
    const authorization = this.opts.apiKey.trim();
    return fetch(url.toString(), {
      headers: {
        authorization,
      },
    })
  }

  private async semanticPatch(url: string | URL, body: unknown ) {
    const authorization = this.opts.apiKey.trim();
    return fetch(url.toString(),
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json; domain-model=launchdarkly.semanticpatch',
          authorization,
        },
        body: JSON.stringify(body),
      });
  }

}
