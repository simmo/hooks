import { readdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { bgBlack, bold, white } from 'yoctocolors';

export const header = (title?: string) => {
  console.clear();

  console.log(
    bold(`${bgBlack(white(' 🎒 Hooks '))}${title ? ` ${title} ` : ''}\n`),
  );
};

export const getAllPackages = async () => {
  const packages = await readdir('./packages', {
    withFileTypes: true,
  });

  return packages.filter(item => item.isDirectory()).map(({ name }) => name);
};

export const isString = (value: unknown): value is string =>
  typeof value === 'string';

export const isArray = Array.isArray;

export const isFunction = (value: unknown): value is Function =>
  typeof value === 'function';

export const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean';

export const isNumber = (value: unknown): value is number =>
  typeof value === 'number';

export const isObject = (value: unknown): value is object =>
  typeof value === 'object';

export const isNull = (value: unknown): value is null => value === null;

export const isNonNullObject = (
  value: unknown,
): value is Record<string, unknown> =>
  isObject(value) && !isArray(value) && !isNull(value);

export const isValidScriptExport = (
  script: unknown,
): script is { name: string; run: () => Promise<void> } =>
  isNonNullObject(script) &&
  isString(script['name']) &&
  'run' in script &&
  isFunction(script['run']);

export const createScript = ({
  name,
  task,
}: {
  name: string;
  task: () => Promise<void>;
}) => ({
  name,
  run: async () => {
    header(name);

    await task();

    console.log('');
  },
});
