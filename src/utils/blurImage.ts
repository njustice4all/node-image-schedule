import sharp from 'sharp';

export default (buffer: Buffer) => {
  return sharp(buffer)
    .resize(100, 20)
    .blur(5)
    .toBuffer();
};
