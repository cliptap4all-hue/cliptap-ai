/**
 * Helper to stitch two images side by side into a single 16:9 canvas
 * for image-to-video models (e.g. Wan-I2V for hugging / interaction)
 */
export async function stitchTwoImages(img1Src: string, img2Src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const width = 1280;
    const height = 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    // Background dark filler
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, height);

    const image1 = new Image();
    const image2 = new Image();
    let loadedCount = 0;

    const draw = () => {
      loadedCount++;
      if (loadedCount === 2) {
        const halfWidth = width / 2;

        // Draw image 1 on left half (fitted and centered)
        const scale1 = Math.min(halfWidth / image1.width, height / image1.height);
        const w1 = image1.width * scale1;
        const h1 = image1.height * scale1;
        const x1 = (halfWidth - w1) / 2;
        const y1 = (height - h1) / 2;
        ctx.drawImage(image1, x1, y1, w1, h1);

        // Draw image 2 on right half (fitted and centered)
        const scale2 = Math.min(halfWidth / image2.width, height / image2.height);
        const w2 = image2.width * scale2;
        const h2 = image2.height * scale2;
        const x2 = halfWidth + (halfWidth - w2) / 2;
        const y2 = (height - h2) / 2;
        ctx.drawImage(image2, x2, y2, w2, h2);

        // Subtle gradient divider in the middle
        const grad = ctx.createLinearGradient(halfWidth - 3, 0, halfWidth + 3, 0);
        grad.addColorStop(0, 'rgba(0,0,0,0.4)');
        grad.addColorStop(0.5, 'rgba(255,255,255,0.2)');
        grad.addColorStop(1, 'rgba(0,0,0,0.4)');
        ctx.fillStyle = grad;
        ctx.fillRect(halfWidth - 3, 0, 6, height);

        resolve(canvas.toDataURL('image/jpeg', 0.9));
      }
    };

    image1.crossOrigin = 'anonymous';
    image2.crossOrigin = 'anonymous';
    image1.onload = draw;
    image2.onload = draw;
    image1.onerror = () => reject(new Error('Failed to load first image'));
    image2.onerror = () => reject(new Error('Failed to load second image'));

    image1.src = img1Src;
    image2.src = img2Src;
  });
}
