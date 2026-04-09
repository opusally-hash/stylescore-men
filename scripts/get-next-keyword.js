#!/usr/bin/env node

const {
  loadKeywordsConfig,
  parseArgs,
  selectNextQueueEntry
} = require("./lib/publishing-helpers");

function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = loadKeywordsConfig();
  const nextEntry = selectNextQueueEntry(config);

  if (!nextEntry) {
    if (args["allow-empty"]) {
      if (!args.field) {
        console.log("{}");
      }

      return;
    }

    console.error("No eligible keyword is scheduled for publishing.");
    process.exit(1);
  }

  if (args.field) {
    const value = nextEntry[args.field];

    if (typeof value === "undefined") {
      console.error(`Field "${args.field}" does not exist on the queue entry.`);
      process.exit(1);
    }

    if (typeof value === "object") {
      console.log(JSON.stringify(value));
      return;
    }

    console.log(value);
    return;
  }

  console.log(JSON.stringify(nextEntry, null, 2));
}

main();
