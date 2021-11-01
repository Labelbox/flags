import { FlagResponseItem, LDAllFlagsResponse } from './ld-api';

export type ParseOptions = {
  apiResponse: LDAllFlagsResponse;
  envName: string;
  platform: 'server' | 'client';
};
export const parseApiResponse = ({
  apiResponse,
  envName,
  platform,
}: ParseOptions) => {
  const filter =
    platform === 'client'
      ? (i: FlagResponseItem) => i.clientSideAvailability.usingEnvironmentId
      : () => true;
  return apiResponse.items.filter(filter).map((item) => {
    const variationIndex = item.environments[envName].fallthrough.variation;
    return {
      key: item.key,
      value: formatValue(item.variations[variationIndex].value),
    };
  });
};

const formatValue = (value: unknown) => {
  switch (typeof value) {
    case 'string':
      return JSON.stringify(value);
    default:
      return JSON.stringify(JSON.stringify(value));
  }
};
