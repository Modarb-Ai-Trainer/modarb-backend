// mongoose seeder script
// takes an optional cli argument "--reset" to reset the database
//
// Usage:
// npm run seed
// npm run seed:reset
// node src/seeder/seed.ts
// node src/seeder/seed.ts --reset

import * as glob from "glob";
import path from "path";

const main = async () => {
  // get cli arguments
  const args = process.argv.slice(2);

  // get cli names that don't start with "--"
  const seederNames = args.filter((arg) => !arg.startsWith("--"));

  // list all files under ./seeders
  const seedersPath = path
    .relative(process.cwd(), path.join(__dirname, "**/*.seeder.{ts,js}"))
    .replace(/\\/g, "/");

  const seedersFiles = glob
    .sync(seedersPath, {})
    .map((file) => {
      return path.resolve(file);
    })
    .filter((file) => {
      if (seederNames.length === 0) {
        return true;
      }

      return seederNames.includes(path.basename(file));
    });

  // run all seeders
  let count = 0;
  for await (const file of seedersFiles) {
    const baseName = path.basename(file);
    console.log(`Running ${baseName} ...`);
    const seeder = await import(file);
    await seeder.default();
    console.log(`${baseName} completed! (${++count}/${seedersFiles.length})`);
  }

  console.log("All seeders completed!");
  process.exit(0);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
