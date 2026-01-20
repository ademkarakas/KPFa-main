# Backend API Specification - Activity Image Upload

## Overview

This document describes the exact backend API expectations for activity image uploads based on the Angular implementation guide provided.

## Request Format

### Create Activity Endpoint

```
POST /api/activities
```

### Update Activity Endpoint

```
PUT /api/activities/{id}
```

## Request Body Structure

### Main Request DTO

```typescript
{
  // Text fields
  titleTr: string;              // Required
  titleDe: string;              // Required
  descriptionTr: string;        // Required
  descriptionDe: string;        // Required
  detailedContentTr?: string;   // Optional
  detailedContentDe?: string;   // Optional

  // Date and category
  date: string;                 // Required, format: YYYY-MM-DD
  category: string;             // Required

  // Address (PascalCase fields)
  address: {
    Street: string;             // Required
    HouseNo?: string;           // Optional
    ZipCode?: string;           // Optional
    City: string;               // Required
    State?: string;             // Optional
    Country: string;            // Required
  };

  // MAIN IMAGE - IMPORTANT: Provide EITHER imageUrl OR imageBase64, NEVER both
  imageUrl?: string | null;     // HTTP(S) URL or null
  imageBase64?: string | null;  // Base64 string (NO "data:image/...;base64," prefix)
  imageFileName?: string | null; // Only when using Base64

  // Gallery images array
  galleryImages?: GalleryImageDto[];

  // Additional fields
  videoUrl?: string | null;
  isActive: boolean;

  // Only for updates
  id?: string;
}
```

### Gallery Image DTO

```typescript
{
  url?: string | null;          // HTTP(S) URL or null
  base64Data?: string | null;   // Base64 string (NO data URI prefix)
  fileName?: string | null;     // Only when using Base64
}
```

## Important Rules

### Rule 1: Main Image - Mutual Exclusivity

```typescript
// ✅ CORRECT - Using Base64
{
  imageUrl: null,
  imageBase64: "base64string...",
  imageFileName: "photo.jpg"
}

// ✅ CORRECT - Using URL
{
  imageUrl: "https://example.com/image.jpg",
  imageBase64: null,
  imageFileName: null
}

// ❌ WRONG - Both provided
{
  imageUrl: "https://example.com/image.jpg",
  imageBase64: "base64string...",
  imageFileName: "photo.jpg"
}

// ❌ WRONG - Neither provided
{
  imageUrl: null,
  imageBase64: null,
  imageFileName: null
}
```

### Rule 2: Base64 Format - NO Data URI Prefix

```typescript
// ❌ WRONG - With data URI prefix
{
  imageBase64: "data:image/jpeg;base64,/9j/4AAQSkZJRg...";
}

// ✅ CORRECT - Just the base64 string
{
  imageBase64: "/9j/4AAQSkZJRg...";
}

// Note: Backend may strip data URI prefix if provided, but best practice is to not include it
```

### Rule 3: Gallery Images

```typescript
// Each gallery image can be EITHER URL or Base64

// ✅ CORRECT - Gallery with mixed types
{
  galleryImages: [
    {
      url: "https://example.com/image1.jpg",
      base64Data: null,
      fileName: null,
    },
    {
      url: null,
      base64Data: "base64string2...",
      fileName: "image2.jpg",
    },
    {
      url: "https://example.com/image3.jpg",
      base64Data: null,
      fileName: null,
    },
  ];
}

// ✅ CORRECT - Gallery all Base64
{
  galleryImages: [
    {
      url: null,
      base64Data: "base64string1...",
      fileName: "image1.jpg",
    },
    {
      url: null,
      base64Data: "base64string2...",
      fileName: "image2.jpg",
    },
  ];
}
```

## Size Limits

These are the CLIENT-SIDE limits that should match backend limits:

```typescript
// File validation
MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB (before compression)
MAX_BASE64_SIZE = 2 * 1024 * 1024; // 2MB (after compression)
MAX_GALLERY_IMAGES = 10; // Max 10 images per activity
MAX_PAYLOAD_SIZE = 20 * 1024 * 1024; // 20MB (total request)
```

**Backend should enforce**:

- Individual Base64 string max 2-5MB
- Gallery images max 10-15 per activity
- Total request payload max 20-50MB
- HTTP headers max enforced by server (typically 8-16KB)

## HTTP Response Codes

### Success Responses

#### 200 OK

```json
{
  "id": "uuid",
  "titleTr": "...",
  "titleDe": "...",
  "imageSource": "https://... or data:image/...",
  "imageMetadata": {
    "storageType": "URL" | "Database",
    "mimeType": "image/jpeg",
    "fileName": "photo.jpg",
    "fileSizeKB": 512
  },
  "galleryImages": [
    "https://... or data:image/...",
    "https://... or data:image/..."
  ]
}
```

#### 201 Created

Same structure as 200 OK

### Error Responses

#### 400 Bad Request

```json
{
  "error": "Cannot provide both ImageUrl and ImageBase64. Choose one.",
  "timestamp": "2026-01-20T10:00:00Z"
}
```

Common 400 errors:

- "Cannot provide both ImageUrl and ImageBase64"
- "Base64 data URIs are not allowed for URL field"
- "Invalid image Base64 format"
- "Gallery images must be array of GalleryImageDto"
- "Invalid date format. Expected YYYY-MM-DD"
- "Title is required"

#### 413 Payload Too Large

```
Server rejected request - total size exceeds server limit
```

**Solution**: Client sends fewer/smaller images

#### 431 Request Header Fields Too Large

```
HTTP/1.1 431 Request Header Fields Too Large
```

**Solution**: Clear cookies or reduce header data

#### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "message": "Failed to process image",
  "timestamp": "2026-01-20T10:00:00Z"
}
```

**Check**:

- Backend logs for specific error
- Image data validity
- Database connection
- Disk space for storage

## Image Processing

### Client-Side (Frontend)

1. Validate file type (image/\*)
2. Validate file size (≤5MB)
3. Compress image (1200×1200px, 70% quality)
4. Validate compressed size (≤2MB)
5. Convert to Base64
6. Remove data URI prefix
7. Validate total payload (≤20MB)
8. Send request

### Server-Side (Backend - Expected)

1. Receive Base64 string
2. Validate format
3. Decode Base64 to binary
4. Validate image binary
5. Store or reference image
6. Return image source (URL or data URI)
7. Return image metadata

## Example Request

### Using Base64 Upload

```json
{
  "titleTr": "Anadolu Lezzetleri Kermesi",
  "titleDe": "Basar für anatolische Köstlichkeiten",
  "descriptionTr": "Türk mutfağının eşsiz lezzetlerinin sunulduğu kermes",
  "descriptionDe": "Ein Basar mit einzigartigen Geschmäckern der türkischen Küche",
  "date": "2026-01-24",
  "address": {
    "Street": "Münsterplatz",
    "HouseNo": "2",
    "ZipCode": "79098",
    "City": "Freiburg",
    "State": "Baden-Württemberg",
    "Country": "Deutschland"
  },
  "category": "social",

  "imageUrl": null,
  "imageBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD/...",
  "imageFileName": "kermes-main.jpg",

  "galleryImages": [
    {
      "url": null,
      "base64Data": "/9j/4AAQSkZJRgABAQEAYABgAAD/...",
      "fileName": "kermes-gallery-1.jpg"
    },
    {
      "url": "https://example.com/kermes-2.jpg",
      "base64Data": null,
      "fileName": null
    }
  ],

  "videoUrl": null,
  "isActive": true
}
```

### Using URL Only

```json
{
  "titleTr": "Anadolu Lezzetleri Kermesi",
  "titleDe": "Basar für anatolische Köstlichkeiten",
  "descriptionTr": "...",
  "descriptionDe": "...",
  "date": "2026-01-24",
  "address": { ... },
  "category": "social",

  "imageUrl": "https://cdn.example.com/kermes-main.jpg",
  "imageBase64": null,
  "imageFileName": null,

  "galleryImages": [
    {
      "url": "https://cdn.example.com/kermes-1.jpg",
      "base64Data": null,
      "fileName": null
    },
    {
      "url": "https://cdn.example.com/kermes-2.jpg",
      "base64Data": null,
      "fileName": null
    }
  ],

  "videoUrl": null,
  "isActive": true
}
```

## Expected Response

### Success Response (200/201)

```json
{
  "id": "d415e443-71e8-4b2e-b20d-4a037857fe3f",
  "titleTr": "Anadolu Lezzetleri Kermesi",
  "titleDe": "Basar für anatolische Köstlichkeiten",
  "descriptionTr": "...",
  "descriptionDe": "...",
  "date": "2026-01-24",
  "address": {
    "Street": "Münsterplatz",
    "HouseNo": "2",
    "ZipCode": "79098",
    "City": "Freiburg",
    "State": "Baden-Württemberg",
    "Country": "Deutschland"
  },
  "category": "social",

  "imageSource": "https://cdn.example.com/images/d415e443.jpg",
  "imageMetadata": {
    "storageType": "URL",
    "mimeType": "image/jpeg",
    "fileName": "kermes-main.jpg",
    "fileSizeKB": 512
  },

  "galleryImages": [
    "https://cdn.example.com/images/d415e443-g1.jpg",
    "https://cdn.example.com/images/d415e443-g2.jpg"
  ],

  "videoUrl": null,
  "isActive": true,
  "createdAt": "2026-01-20T10:00:00Z",
  "updatedAt": "2026-01-20T10:00:00Z"
}
```

## Debugging Checklist

### Client-Side (Frontend)

- [x] Base64 string is WITHOUT "data:image/...;base64," prefix
- [x] Either imageUrl OR imageBase64 is provided (not both)
- [x] imageFileName is only provided when using Base64
- [x] Gallery images follow same rule (url OR base64Data, not both)
- [x] Total payload < 20MB
- [x] All required fields present
- [x] Date format is YYYY-MM-DD
- [x] Address fields have correct casing (PascalCase)

### Server-Side (Backend)

- [x] Base64 string can be decoded properly
- [x] Image binary is valid
- [x] Storage has sufficient space
- [x] File upload directory has write permissions
- [x] Maximum payload size is >= 20MB
- [x] Maximum header size is >= 8KB
- [x] Request timeout is sufficient (30+ seconds)

## Performance Considerations

### Network

- **Typical size**: 5MB payload (10 images)
- **Typical time**: 2-10 seconds (depends on connection)
- **Timeout**: Should be ≥ 30 seconds

### Server

- **CPU**: Minimal (already compressed)
- **Disk**: 500KB per image × 10 = 5MB per activity
- **Memory**: Base64 decoding requires minimal memory

### Browser

- **Memory**: Peak during compression (< 100MB)
- **CPU**: 500ms-2s total for 10 images
- **Storage**: Temporary (cleared after upload)

## Monitoring & Logging

### Recommended Server Logging

```
POST /api/activities
  - Payload size: 4.5MB
  - Image count: 10
  - Compression ratio: 9:1
  - Processing time: 250ms
  - Status: 201 Created
```

### Error Scenarios to Log

- File size exceeded
- Invalid Base64 format
- Insufficient disk space
- Database write failed
- Duplicate image detected
- Storage service unavailable

---

**Version**: 1.0  
**Last Updated**: January 20, 2026  
**Status**: Final Reference
