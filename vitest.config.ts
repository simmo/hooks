import { readdirSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

const testExtensions = '{ts,js,tsx,jsx}';
const packageNames = readdirSync(new URL('./packages', import.meta.url), {
  withFileTypes: true,
})
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name);

const projects = packageNames.flatMap(name => [
  {
    extends: true as const,
    test: {
      name: `${name}:client`,
      include: [`packages/${name}/client.test.${testExtensions}`],
      environment: 'happy-dom',
    },
  },
  {
    extends: true as const,
    test: {
      name: `${name}:server`,
      include: [`packages/${name}/**/*.test.${testExtensions}`],
      exclude: [`packages/${name}/client.test.${testExtensions}`],
      environment: 'node',
    },
  },
]);

export default defineConfig({
  test: {
    projects,
  },
});
