import { execSync } from 'child_process';
import { mkdirSync, existsSync, createWriteStream } from 'fs';
import https from 'https';
import extract from 'extract-zip';
import path from 'path';
import os from "os";

function getChromeVersion() {
    try {
        const isWindows = os.platform() === 'win32';
        const command = isWindows
            ? `adb shell dumpsys package com.android.chrome | findstr versionName`
            : `adb shell dumpsys package com.android.chrome | grep versionName`;

        const output = execSync(command, { encoding: 'utf-8' });
        const matches = output.match(/versionName=([\d.]+)/g);

        if (!matches || matches.length === 0) {
            throw new Error('No version found');
        }

        const versions = matches.map(str => str.split('=')[1]);
        const sortedVersions = versions.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
        return sortedVersions[0];
    } catch (err) {
        console.error('Failed to get Chrome version:', err.message);
        return null;
    }
}

function getDownloadUrl(version, platform = 'win64') {
    const base = 'https://storage.googleapis.com/chrome-for-testing-public';
    return `${base}/${version}/${platform}/chromedriver-${platform}.zip`;
}

async function downloadDriver(version, platform = 'win64') {
    const url = getDownloadUrl(version, platform);
    const downloadPath = path.resolve('chromedriver', 'chromedriver.zip');

    if (!existsSync('chromedriver')) mkdirSync('chromedriver');

    const file = createWriteStream(downloadPath);
    console.log('Downloading:', url);

    await new Promise((resolve, reject) => {
        https.get(url, (res) => {
            res.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', reject);
    });

    await extract(downloadPath, { dir: path.resolve('chromedriver') });
    console.log('Downloaded and extracted ChromeDriver.');
}

export async function setupChromedriver() {
    const chromeVersion = getChromeVersion();
    if (!chromeVersion) throw new Error('Unable to detect Chrome version');

    const majorVersion = chromeVersion.split('.')[0];
    const response = await fetch(`https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json`);
    const data = await response.json();

    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('Major Version:', majorVersion);

    // Use the version from Stable directly
    const version = data.channels.Stable.version;

    if (!version.startsWith(majorVersion)) {
        throw new Error(`Mismatch: Chrome major version ${majorVersion} not matching Stable version ${version}`);
    }

    const platform =
        process.platform === 'win32' ? 'win64' :
        process.platform === 'darwin' ? 'mac-arm64' :
        'linux64';

    await downloadDriver(version, platform);

    return path.resolve('chromedriver', process.platform === 'win32' ? 'chromedriver.exe' : 'chromedriver');
}
