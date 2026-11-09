// PostToolUse hook: format every file Claude edits or writes.
// Claude Code sends JSON on stdin; we only need tool_input.file_path.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const input = JSON.parse(readFileSync(0, "utf8"));
const file = input?.tool_input?.file_path;

if (typeof file !== "string") process.exit(0);

try {
  execFileSync(
    "pnpm",
    ["exec", "prettier", "--write", "--ignore-unknown", file],
    { cwd: process.env.CLAUDE_PROJECT_DIR, stdio: "ignore" },
  );
} catch {
  // A formatting failure must never block the agent's work.
}
