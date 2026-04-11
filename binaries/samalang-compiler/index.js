#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const binaryName = 'sl-compiler';
const sourcePath = path.resolve("./sl"); 
const targetPath = `/usr/local/bin/${binaryName}`;

const args = process.argv.slice(2);
const command = args[0];

if (command === 'install') {
    if (fs.existsSync(targetPath)) {
        console.log(`Perintah "${binaryName}" sudah ada di sistem.`);
        process.exit(0);
    }

    try {
        if (!fs.existsSync(sourcePath)) {
            console.error(`File binary asli tidak ada di: ${sourcePath}`);
            process.exit(1);
        }

        execSync(`chmod +x "${sourcePath}"`);
        execSync(`sudo ln -s "${sourcePath}" "${targetPath}"`);
        
        console.log(`Berhasil. Sekarang gunakan perintah: ${binaryName}`);
    } catch (error) {
        console.error('Gagal:', error.message);
    }

} else if (command === 'uninstall') {
    try {
        if (fs.existsSync(targetPath)) {
            execSync(`sudo rm "${targetPath}"`);
            console.log('Berhasil dihapus.');
        } else {
            console.log('Perintah tidak ditemukan di sistem.');
        }
    } catch (error) {
        console.error('Gagal uninstall:', error.message);
    }
} else {
    console.log(`Gunakan: sl-compiler install | uninstall`);
}