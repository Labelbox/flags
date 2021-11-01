# flags

Generates source code artifacts based on [LaunchDarkly](https://launchdarkly.com/) feature flags

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
