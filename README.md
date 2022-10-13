# flags
Generates source code artifacts based on [LaunchDarkly](https://launchdarkly.com/) feature flags

## Build Status
[![Codefresh build status]( https://g.codefresh.io/api/badges/pipeline/labelbox/Miscellaneous%2Fflags?type=cf-1&key=eyJhbGciOiJIUzI1NiJ9.NWQzNzdlNjVmZWI4NjYzYzk4ZDgxMjIx.GwskoPRs5bgpPN9L4pAIr0UKTw5C2pbiQu5T-FtNRvM)]( https://g.codefresh.io/pipelines/edit/new/builds?id=62bb84fcafdeddcee90e9348&pipeline=flags&projects=Miscellaneous&projectId=62bb84d2afdeddd10d0e9347)

## @labelbox/flags

### Typescript definitions of flag names

```shell
Generate typescript definitions for launchdarkly flags

USAGE
  $ flags definitions

OPTIONS
  --apiKey=apiKey    (required) Launchdarkly API key
  --outFile=outFile  (required) Output typescript file path

```

#### Example

```bash
flags definitions \
 --apiKey $LD_API_KEY \
 --outFile ./flags.ts
```

### Get default rules for all flags of an environment

Builds a yaml file of all flags and their default values. Uses the `FLAG_` prefix for flag keys.

```
Get default rule value for all flags in an environment. Defaults to yaml format

USAGE
  $ flags evaluations

OPTIONS
  --apiKey=apiKey             (required) Launchdarkly API key
  --env=env                   (required) Launchdarkly environment name
  --platform=(server|client)  (required) [default: server] The platform for which these evaluation apply. See here for more details: https://docs.launchdarkly.com/sdk/concepts/client-side-server-side

```

### Example

```shell
flags evaluations \
 --apiKey $LD_API_KEY \
 --env production \
 --platform server > flags.yaml
```


### Archive flags

Archives a set of input feature flags by key.

If input flag does not exist or is already archived, the flag is ignored.

```
Archive feature flags. This takes affect across all LD environments

USAGE
  $ flags archive [FEATURE_FLAG_KEYS]

OPTIONS
  --apiKey=apiKey  (required) Launchdarkly API key
  --dryRun         Do not execute mutation. Just print what would happen.

```

### Example

```shell
flags archive \
 --apiKey $LD_API_KEY \
 flag-one flag-two flag-three
```
