#!/usr/bin/env node
/*
  Updates README.md version badges by replacing placeholders with actual versions:
  - {{PROJECT_VERSION}} from backend/pom.xml (<project> version)
  - {{SPRING_BOOT_VERSION}} from backend/pom.xml (<parent> version)
  - {{NEXT_VERSION}} from frontend/package.json (dependencies.next)
  - {{TYPESCRIPT_VERSION}} from frontend/package.json (devDependencies.typescript)
*/

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const readmePath = path.resolve(root, "README.md");
const pomPath = path.resolve(root, "backend", "pom.xml");
const packageJsonPath = path.resolve(root, "frontend", "package.json");

function readFileSafe(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch (e) {
    console.error(`[update-readme-versions] Failed to read ${p}:`, e.message);
    process.exitCode = 1;
    return null;
  }
}

function cleanVersion(version) {
  if (!version) return "";
  return String(version)
    .trim()
    .replace(/^\^|^~/, "");
}

function extractFromPom(xml) {
  // Spring Boot parent version
  const parentBlock = xml.match(/<parent>[\s\S]*?<\/parent>/);
  const springBootVersion = parentBlock
    ? (parentBlock[0].match(/<version>([^<]+)<\/version>/) || [])[1]
    : undefined;

  // Project version right after this project's artifactId
  const projectVersion = (xml.match(
    /<artifactId>dry-cleaning-order-system<\/artifactId>[\s\S]*?<version>([^<]+)<\/version>/
  ) || [])[1];

  // Common properties (optional)
  const getProp = (name) => {
    const re = new RegExp(`<${name}>([^<]+)<\\/${name}>`);
    const m = xml.match(re);
    return m ? m[1] : undefined;
  };
  const mapstructVersion = getProp("mapstruct.version");
  const springdocVersion = getProp("springdoc.version");

  return {
    springBootVersion: cleanVersion(springBootVersion),
    projectVersion: cleanVersion(projectVersion),
    mapstructVersion: cleanVersion(mapstructVersion),
    springdocVersion: cleanVersion(springdocVersion),
  };
}

function extractFromPackageJson(jsonStr) {
  const pkg = JSON.parse(jsonStr);
  const next = pkg.dependencies && pkg.dependencies.next;
  const ts =
    (pkg.devDependencies && pkg.devDependencies.typescript) ||
    pkg.dependencies?.typescript;
  return {
    nextVersion: cleanVersion(next),
    typescriptVersion: cleanVersion(ts),
  };
}

function main() {
  const readme = readFileSafe(readmePath);
  const pom = readFileSafe(pomPath);
  const packageJson = readFileSafe(packageJsonPath);
  if (!readme || !pom || !packageJson) return;

  const {
    springBootVersion,
    projectVersion,
    mapstructVersion,
    springdocVersion,
  } = extractFromPom(pom);
  const { nextVersion, typescriptVersion } =
    extractFromPackageJson(packageJson);

  // Parse extra FE versions
  const pkg = JSON.parse(packageJson);
  const reactVersion = cleanVersion(pkg.dependencies?.react);
  const muiVersion = cleanVersion(
    pkg.dependencies?.["@mui/material"] ||
      pkg.dependencies?.["@mui/material-nextjs"]
  );
  const reactQueryVersion = cleanVersion(
    pkg.dependencies?.["@tanstack/react-query"]
  );
  const zustandVersion = cleanVersion(pkg.dependencies?.zustand);
  const zodVersion = cleanVersion(pkg.dependencies?.zod);
  const orvalVersion = cleanVersion(
    pkg.devDependencies?.["@orval/core"] ||
      pkg.dependencies?.["@orval/core"] ||
      pkg.devDependencies?.["orval"] ||
      pkg.dependencies?.["orval"]
  );

  const replacements = {
    "{{SPRING_BOOT_VERSION}}": springBootVersion,
    "{{PROJECT_VERSION}}": projectVersion,
    "{{NEXT_VERSION}}": nextVersion,
    "{{TYPESCRIPT_VERSION}}": typescriptVersion,
    "{{REACT_VERSION}}": reactVersion,
    "{{MUI_VERSION}}": muiVersion,
    "{{REACT_QUERY_VERSION}}": reactQueryVersion,
    "{{ZUSTAND_VERSION}}": zustandVersion,
    "{{ZOD_VERSION}}": zodVersion,
    "{{MAPSTRUCT_VERSION}}": mapstructVersion,
    "{{SPRINGDOC_VERSION}}": springdocVersion,
    "{{ORVAL_VERSION}}": orvalVersion,
  };

  let updated = readme;
  for (const [placeholder, value] of Object.entries(replacements)) {
    if (!value) continue;
    const re = new RegExp(
      placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "g"
    );
    updated = updated.replace(re, value);
  }

  // Also update existing badges/text with explicit numbers (no placeholders)
  const safe = (s) => (s ? String(s) : "");
  const replaceSegment = (str, re, version) =>
    version
      ? str.replace(re, (_m, p1, _old, p3) => `${p1}${version}${p3}`)
      : str;

  // Shields badges
  updated = replaceSegment(
    updated,
    /(version-)([^-]+)(-blue\.svg)/,
    safe(projectVersion)
  );
  updated = replaceSegment(
    updated,
    /(Spring%20Boot-)([^-]+)(-brightgreen\.svg)/,
    safe(springBootVersion)
  );
  updated = replaceSegment(
    updated,
    /(Next\.js-)([^-]+)(-black\.svg)/,
    safe(nextVersion)
  );
  updated = replaceSegment(
    updated,
    /(React-)([^-]+)(-61DAFB\.svg)/,
    safe(reactVersion)
  );
  updated = replaceSegment(
    updated,
    /(TypeScript-)([^-]+)(-3178C6\.svg)/,
    safe(typescriptVersion)
  );
  updated = replaceSegment(
    updated,
    /(MUI-)([^-]+)(-0081CB\.svg)/,
    safe(muiVersion)
  );
  updated = replaceSegment(
    updated,
    /(React%20Query-)([^-]+)(-FF4154\.svg)/,
    safe(reactQueryVersion)
  );
  updated = replaceSegment(
    updated,
    /(Zustand-)([^-]+)(-4E6E5D\.svg)/,
    safe(zustandVersion)
  );
  updated = replaceSegment(
    updated,
    /(Zod-)([^-]+)(-3E67B1\.svg)/,
    safe(zodVersion)
  );
  // From docker-compose.dev.yml
  try {
    const compose = readFileSafe(
      path.resolve(root, "docker", "docker-compose.dev.yml")
    );
    if (compose) {
      const pgImg = (compose.match(/postgres:(\d+)/) || [])[1];
      const redisImg = (compose.match(/redis:(\S+)/) || [])[1];
      if (pgImg) {
        updated = replaceSegment(
          updated,
          /(PostgreSQL-)([^-]+)(-336791\.svg)/,
          `"${pgImg}"`.replace(/"/g, "")
        );
        updated = updated.replace(/PostgreSQL\s+14\+/g, `PostgreSQL ${pgImg}`);
      }
      if (redisImg) {
        updated = replaceSegment(
          updated,
          /(Redis-)([^-]+)(-DC382D\.svg)/,
          redisImg
        );
      }
    }
  } catch (_) {}
  updated = replaceSegment(
    updated,
    /(MapStruct-)([^-]+)(-orange\.svg)/,
    safe(mapstructVersion)
  );
  updated = replaceSegment(
    updated,
    /(Springdoc-)([^-]+)(-85EA2D\.svg)/,
    safe(springdocVersion)
  );
  updated = replaceSegment(
    updated,
    /(Orval-)([^-]+)(-4B32C3\.svg)/,
    safe(orvalVersion)
  );

  // Text mentions in Tech Stack sections
  updated = projectVersion
    ? updated.replace(
        /\bVersion:?[\s]*[0-9]+\.[0-9]+\.[0-9]+/g,
        `Version: ${projectVersion}`
      )
    : updated;
  updated = springBootVersion
    ? updated.replace(
        /Spring Boot\s+[0-9]+\.[0-9]+\.[0-9]+/g,
        `Spring Boot ${springBootVersion}`
      )
    : updated;
  updated = nextVersion
    ? updated.replace(
        /Next\.js\s+[0-9]+\.[0-9]+(\.[0-9]+)?/g,
        `Next.js ${nextVersion}`
      )
    : updated;
  updated = reactVersion
    ? updated.replace(
        /React\s+[0-9]+\.[0-9]+(\.[0-9]+)?/g,
        `React ${reactVersion}`
      )
    : updated;
  updated = typescriptVersion
    ? updated.replace(
        /TypeScript\s+[0-9]+(\.[0-9]+)?/g,
        `TypeScript ${typescriptVersion}`
      )
    : updated;

  if (updated !== readme) {
    fs.writeFileSync(readmePath, updated, "utf8");
    console.log(
      "[update-readme-versions] README.md updated with versions:",
      replacements
    );
  } else {
    console.log("[update-readme-versions] No changes to README.md");
  }
}

main();
