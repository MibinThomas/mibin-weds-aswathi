import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

// Render the vector monogram for browser and home-screen compatibility.
const source = 'src/app/icon.svg';
await sharp(source).resize(180, 180).png().toFile('src/app/apple-icon.png');
const sizes = [16, 32, 48, 64];
const images = await Promise.all(sizes.map(size => sharp(source).resize(size, size).png().toBuffer()));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
images.forEach((buffer, index) => {
  const entry = 6 + index * 16;
  header[entry] = sizes[index];
  header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(buffer.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += buffer.length;
});
await writeFile('src/app/favicon.ico', Buffer.concat([header, ...images]));
console.log('Generated multi-size favicon and 180px Apple icon.');
