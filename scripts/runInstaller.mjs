/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import "./checkNodeVersion.js";

import { execFileSync } from "child_process";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { Readable } from "stream";
import { finished } from "stream/promises";
import { fileURLToPath } from "url";

const BASE_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE_DIR = join(BASE_DIR, "dist", "Installer");

function getFilename() {
    switch (process.platform) {
        case "win32":
            return "KordexcordCli.exe";
        case "darwin":
            return "Kordexcord.MacOS.zip";
        case "linux":
            return "KordexcordCli-linux";
        default:
            throw new Error("Unsupported platform: " + process.platform);
    }
}

// URL distante optionnelle vers ton installateur Go compilé.
// Peut être surchargée via KORDEXCORD_INSTALLER_URL.
const REMOTE_INSTALLER_URL = process.env.KORDEXCORD_INSTALLER_URL
    || "https://github.com/clydedc/kordexcord-installer-go/releases/latest/download/kordexcord-cli.exe";

function getLocalInstallerPath() {
    if (process.env.KORDEXCORD_INSTALLER_PATH) {
        const p = process.env.KORDEXCORD_INSTALLER_PATH.trim();
        if (existsSync(p)) return p;
    }
    const filename = getFilename();
    const inDist = join(FILE_DIR, filename);
    if (existsSync(inDist)) return inDist;
    return null;
}

async function ensureBinary() {
    const local = getLocalInstallerPath();
    if (local) {
        console.log("Using local installer:", local);
        return local;
    }

    // Aucun binaire local, on tente de télécharger celui de ta release GitHub.
    mkdirSync(FILE_DIR, { recursive: true });

    const filename = getFilename();
    const targetPath = join(FILE_DIR, filename);
    const url = REMOTE_INSTALLER_URL;

    console.log("No local installer found. Downloading from:", url);

    const res = await fetch(url, {
        headers: {
            "User-Agent": "Kordexcord (https://github.com/KordexCord/KordexCord)"
        }
    });

    if (!res.ok || !res.body) {
        throw new Error(
            `Échec du téléchargement de l'installateur Kordexcord (${res.status} ${res.statusText}).\n` +
            `Définis KORDEXCORD_INSTALLER_PATH vers ton .exe ou place ${filename} dans ${FILE_DIR}.`
        );
    }

    const body = Readable.fromWeb(res.body);
    await finished(body.pipe(createWriteStream(targetPath, {
        mode: 0o755,
        autoClose: true
    })));

    console.log("Finished downloading installer to", targetPath);

    return targetPath;
}



const installerBin = await ensureBinary();

console.log("Now running Installer...");

const argStart = process.argv.indexOf("--");
const args = argStart === -1 ? [] : process.argv.slice(argStart + 1);

try {
    execFileSync(installerBin, args, {
        stdio: "inherit",
        env: {
            ...process.env,
            KORDEXCORD_USER_DATA_DIR: BASE_DIR,
            KORDEXCORD_DIRECTORY: join(BASE_DIR, "dist/desktop"),
            KORDEXCORD_DEV_INSTALL: "1"
        }
    });
} catch {
    console.error("Something went wrong. Please check the logs above.");
}
