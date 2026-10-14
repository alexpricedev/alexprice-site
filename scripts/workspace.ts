#!/usr/bin/env bun

/**
 * Per-workspace env provisioning.
 *
 * Conductor gives every workspace its own git worktree but copies one `.env` into
 * all of them, so every agent gets the same `PORT` and would fight for it.
 * `provision` rewrites this workspace's `.env` to use `CONDUCTOR_PORT`, which is
 * what makes `run_mode = "concurrent"` safe. `destroy` exists for symmetry and
 * future resources; there is nothing workspace-specific to tear down today.
 *
 * Both are wired into `.conductor/settings.toml` and both are safe to re-run.
 * Cloud workspaces get neither: `CONDUCTOR_PORT` is unset there and the sandbox
 * has one checkout, so there is nothing to collide with.
 */

const DEV_ENV = ".env";

const readEnv = async (path: string): Promise<string> => {
  const file = Bun.file(path);
  if (!(await file.exists())) {
    throw new Error(
      `${path} not found — the Conductor setup script copies it from the repository root before this runs`,
    );
  }
  return file.text();
};

/**
 * Replace `key`'s value in place, keeping the comment that explains it. Only an
 * uncommented assignment is rewritten; if there is none the variable is
 * appended, so a fork that deleted the line still gets a working file.
 */
const setEnvValue = (text: string, key: string, value: string): string => {
  const line = new RegExp(`^${key}=.*$`, "m");
  if (line.test(text)) return text.replace(line, `${key}=${value}`);
  return `${text.replace(/\n*$/, "\n")}${key}=${value}\n`;
};

async function provision(): Promise<void> {
  const workspace = process.env.CONDUCTOR_WORKSPACE_NAME;
  const port = process.env.CONDUCTOR_PORT;

  if (!(workspace && port)) {
    console.log(
      "workspace: CONDUCTOR_WORKSPACE_NAME or CONDUCTOR_PORT is unset — leaving .env as copied.",
    );
    console.log(
      "workspace: expected in cloud workspaces, which have one checkout and nothing to collide with.",
    );
    return;
  }

  let env = await readEnv(DEV_ENV);
  env = setEnvValue(env, "PORT", port);
  env = setEnvValue(env, "APP_URL", `http://localhost:${port}`);
  await Bun.write(DEV_ENV, env);

  console.log(`workspace: provisioning "${workspace}"`);
  console.log(`  port ${port} — dev server, APP_URL http://localhost:${port}`);
}

async function destroy(): Promise<void> {
  const workspace = process.env.CONDUCTOR_WORKSPACE_NAME;
  if (workspace) {
    console.log(`workspace: "${workspace}" has no resources to tear down.`);
  }
}

const command = process.argv[2];

try {
  if (command === "provision") {
    await provision();
  } else if (command === "destroy") {
    await destroy();
  } else {
    console.error("Usage: bun run scripts/workspace.ts provision|destroy");
    process.exit(1);
  }
} catch (error) {
  console.error(
    `workspace: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
}

export {};
