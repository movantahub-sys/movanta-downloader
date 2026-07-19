/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Platform = 'youtube' | 'instagram' | 'facebook' | 'twitter' | 'tiktok' | 'video' | 'audio' | 'generic' | 'unknown';

export interface MediaFormat {
  id: string;
  quality: string;
  resolution: string;
  codec: string;
  audioCodec: string;
  bitrate: string;
  fps: number;
  hdr: boolean;
  sizeBytes: number;
  sizeFormatted: string;
  container: string;
  estimatedTimeSec: number;
  language?: string;
  isAudioOnly: boolean;
  isVideoOnly: boolean;
}

export interface MediaMetadata {
  url: string;
  platform: Platform;
  title: string;
  uploader: string;
  uploaderAvatar?: string;
  duration: number; // in seconds
  durationFormatted: string;
  views?: number;
  viewsFormatted?: string;
  publishDate: string;
  description: string;
  thumbnail: string;
  formats: MediaFormat[];
  subtitles?: Array<{ lang: string; label: string; url: string }>;
}

export interface HistoryItem {
  id: string;
  url: string;
  platform: Platform;
  title: string;
  thumbnail: string;
  quality: string;
  sizeFormatted: string;
  timestamp: string;
  status: 'completed' | 'queued' | 'downloading' | 'failed';
  progress: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface DownloadQueueItem {
  id: string;
  url: string;
  platform: Platform;
  title: string;
  status: 'queued' | 'downloading' | 'completed' | 'failed';
  progress: number;
  sizeFormatted: string;
}

export interface AdminStats {
  downloadCount: number;
  popularPlatforms: Record<Platform, number>;
  popularFormats: Record<string, number>;
  successRate: number;
  failureRate: number;
  averageDownloadSizeMB: number;
  activeQueueLength: number;
  cacheHits: number;
  systemLoad: {
    cpu: number;
    memory: number;
    disk: number;
  };
}
