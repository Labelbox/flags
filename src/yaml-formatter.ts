export class YamlFormatter {
  static format(flagValues: { key: string; value: unknown }[]) {
    return flagValues
      .map(({ key, value }) => {
        return `${formatFlagKey(key)}: ${value}`;
      })
      .join('\n');
  }
}

const formatFlagKey = (flagKey: string) => {
  return `FLAG_${flagKey.replace(/-/g, '_').toUpperCase()}`;
};
