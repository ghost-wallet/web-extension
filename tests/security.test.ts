import { readdir } from 'node:fs/promises';
import { Dirent } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

async function getJavaScriptFilesRecursively(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(directory, entry.name);
      return entry.isDirectory() ? getJavaScriptFilesRecursively(fullPath) : fullPath;
    })
  );
  return Array.prototype.concat(...files).filter((file) => file.endsWith('.js'));
}

jest.mock('node:fs/promises', () => ({
  readdir: jest.fn(),
}));

function createMockDirent(name: string, isDirectory: boolean): Dirent {
  return {
    name,
    isDirectory: () => isDirectory,
    isFile: () => !isDirectory,
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isSymbolicLink: () => false,
    isFIFO: () => false,
    isSocket: () => false,
  } as Dirent;
}

describe('getJavaScriptFilesRecursively', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should recursively get JavaScript files in nested directories', async () => {
    const mockFilesLevel1 = [
      createMockDirent('file1.js', false),
      createMockDirent('folder', true),
    ];
    const mockFilesLevel2 = [
      createMockDirent('file2.js', false),
      createMockDirent('file3.ts', false),
    ];

    (readdir as jest.MockedFunction<typeof readdir>)
      .mockResolvedValueOnce(mockFilesLevel1)
      .mockResolvedValueOnce(mockFilesLevel2);

    const result = await getJavaScriptFilesRecursively('/test-directory');
    expect(result).toEqual([
      '/test-directory/file1.js',
      '/test-directory/folder/file2.js',
    ]);
  });

  it('should handle errors thrown by readdir', async () => {
    (readdir as jest.MockedFunction<typeof readdir>).mockRejectedValue(new Error('Failed to read directory'));

    await expect(getJavaScriptFilesRecursively('/test-directory')).rejects.toThrow(
      'Failed to read directory'
    );
  });

  it('should skip non-JavaScript files in nested directories', async () => {
    const mockFilesLevel1 = [
      createMockDirent('file1.ts', false),
      createMockDirent('folder', true),
    ];
    const mockFilesLevel2 = [
      createMockDirent('file2.js', false),
      createMockDirent('file3.css', false),
    ];

    (readdir as jest.MockedFunction<typeof readdir>)
      .mockResolvedValueOnce(mockFilesLevel1)
      .mockResolvedValueOnce(mockFilesLevel2);

    const result = await getJavaScriptFilesRecursively('/test-directory');
    expect(result).toEqual(['/test-directory/folder/file2.js']);
  });
});
