#!/usr/bin/env node

import { createWriteStream } from "fs";
import { mkdir, readdir, stat } from "fs/promises";
import { basename, join } from "path";
import { fileURLToPath } from "url";

import AdmZip from "adm-zip";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

async function main() {
    const root = join(__dirname, "..");
    const distDesktop = join(root, "dist", "desktop");

    try {
        const s = await stat(distDesktop);
        if (!s.isDirectory()) {
            console.error("[packDesktop] dist/desktop n'existe pas ou n'est pas un dossier. Lance d'abord `pnpm build`.");
            process.exit(1);
        }
    } catch {
        console.error("[packDesktop] dist/desktop n'existe pas. Lance d'abord `pnpm build`.");
        process.exit(1);
    }

    const outDir = join(root, "dist", "artifacts");
    await mkdir(outDir, { recursive: true });

    const zipName = "kordexcord-desktop.zip";
    const outPath = join(outDir, zipName);

    const zip = new AdmZip();
    zip.addLocalFolder(distDesktop, "desktop");
    zip.writeZip(outPath);

    console.log(`[packDesktop] Archive créée: ${outPath}`);
}

void main();

