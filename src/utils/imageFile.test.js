import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fileToSlideImage, computeScaledSize } from './imageFile';

describe('computeScaledSize', () => {
  it('ne redimensionne pas une image déjà sous la limite', () => {
    expect(computeScaledSize(800, 600, 1920)).toEqual({ width: 800, height: 600, scale: 1 });
  });

  it('ne redimensionne pas une image exactement à la limite', () => {
    expect(computeScaledSize(1920, 1080, 1920)).toEqual({ width: 1920, height: 1080, scale: 1 });
  });

  it('réduit une image au-dessus de la limite avec un facteur d\'échelle uniforme', () => {
    const result = computeScaledSize(3840, 2160, 1920);
    expect(result.scale).toBeCloseTo(0.5);
    expect(result.width).toBe(1920);
    expect(result.height).toBe(1080);
  });

  it('préserve le ratio d\'aspect pour une image au format portrait', () => {
    const result = computeScaledSize(2000, 4000, 1920);
    // Même facteur d'échelle appliqué aux deux côtés : le ratio original est conservé.
    expect(result.width / result.height).toBeCloseTo(2000 / 4000, 5);
    expect(result.height).toBe(1920);
  });
});

describe('fileToSlideImage', () => {
  it('rejette un fichier qui n\'est pas une image', async () => {
    const file = new File(['hello'], 'notice.txt', { type: 'text/plain' });
    await expect(fileToSlideImage(file)).rejects.toThrow(/n'est pas une image/);
  });

  it('conserve un SVG tel quel, sans passer par le canvas', async () => {
    const file = new File(['<svg></svg>'], 'icon.svg', { type: 'image/svg+xml' });
    const result = await fileToSlideImage(file);
    expect(result).toMatch(/^data:image\/svg\+xml/);
  });

  it('conserve un GIF tel quel (pas de rastérisation qui figerait l\'animation)', async () => {
    const file = new File(['gif89a'], 'anim.gif', { type: 'image/gif' });
    const result = await fileToSlideImage(file);
    expect(result).toMatch(/^data:image\/gif/);
  });

  describe('avec une image raster', () => {
    let currentDims;

    beforeEach(() => {
      currentDims = { width: 100, height: 100 };

      // jsdom ne décode pas réellement les images : on simule un Image dont onload
      // fournit les dimensions naturelles définies par chaque test via `currentDims`.
      class FakeImage {
        set src(_value) {
          queueMicrotask(() => {
            this.naturalWidth = currentDims.width;
            this.naturalHeight = currentDims.height;
            this.onload?.();
          });
        }
      }
      vi.stubGlobal('Image', FakeImage);

      // jsdom n'implémente pas le rendu canvas : on stub juste ce qui est utilisé.
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: vi.fn() });
      vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/jpeg;base64,RESIZED');
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
    });

    it('renvoie l\'image d\'origine sans passer par le canvas si elle est sous la limite', async () => {
      currentDims = { width: 800, height: 600 };
      const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' });

      const result = await fileToSlideImage(file);

      expect(result).toMatch(/^data:image\/jpeg;base64,/);
      expect(result).not.toBe('data:image/jpeg;base64,RESIZED');
      expect(HTMLCanvasElement.prototype.toDataURL).not.toHaveBeenCalled();
    });

    it('redimensionne via canvas une image au-dessus de la limite, en conservant le type MIME', async () => {
      currentDims = { width: 4000, height: 2000 };
      const file = new File(['data'], 'photo.png', { type: 'image/png' });

      const result = await fileToSlideImage(file);

      expect(result).toBe('data:image/jpeg;base64,RESIZED');
      expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledWith('image/png', expect.any(Number));
    });

    it('rejette si le fichier ne peut pas être décodé comme une image', async () => {
      class FailingImage {
        set src(_value) {
          queueMicrotask(() => this.onerror?.(new Error('boom')));
        }
      }
      vi.stubGlobal('Image', FailingImage);

      const file = new File(['data'], 'corrupt.jpg', { type: 'image/jpeg' });
      await expect(fileToSlideImage(file)).rejects.toThrow(/décodé comme une image/);
    });
  });
});
