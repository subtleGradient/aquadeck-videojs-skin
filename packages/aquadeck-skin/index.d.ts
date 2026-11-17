export interface AquaDeckOptions {
 src: string; poster?: string; label?: string;
 chapters?: { title: string; startTime: number; endTime?: number }[];
 captions?: { src: string; language?: string; label?: string }[];
 /** Absolute or document-relative directory ending in '/'. Omit with supported bundlers. */
 assetBase?: string;
 crossOrigin?: 'anonymous' | 'use-credentials';
 reflections?: boolean;
}
export interface AquaDeckInstance {
 root: HTMLElement; player: HTMLElement & { store: unknown }; video: HTMLVideoElement;
 seek(seconds: number): unknown; play(): unknown; pause(): unknown;
 setReflections(enabled: boolean): void;
 dispose(): void;
}
export function mountAquaDeck(host: HTMLElement, options: AquaDeckOptions): Promise<AquaDeckInstance>;
