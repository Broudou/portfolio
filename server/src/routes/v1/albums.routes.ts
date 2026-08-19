import { Router } from 'express';
import {
  createAlbumSchema,
  reorderAlbumsSchema,
  reorderPhotosSchema,
  updateAlbumSchema,
} from '@portfolio/shared';
import {
  createAlbum,
  deleteAlbum,
  getAlbumBySlug,
  listAlbums,
  reorderAlbums,
  updateAlbum,
} from '../../controllers/album.controller.js';
import {
  addPhotos,
  listPhotosByAlbum,
  reorderPhotos,
} from '../../controllers/photo.controller.js';
import { optionalAuth, requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { uploadPhotos } from '../../middleware/upload.middleware.js';

export const albumsRouter = Router();

albumsRouter.get('/', optionalAuth, listAlbums);
albumsRouter.patch('/reorder', requireAuth, validate(reorderAlbumsSchema), reorderAlbums);
albumsRouter.get('/:albumId/photos', optionalAuth, listPhotosByAlbum);
albumsRouter.post('/:albumId/photos', requireAuth, uploadPhotos, addPhotos);
albumsRouter.patch(
  '/:albumId/photos/reorder',
  requireAuth,
  validate(reorderPhotosSchema),
  reorderPhotos,
);
albumsRouter.get('/:slug', optionalAuth, getAlbumBySlug);
albumsRouter.post('/', requireAuth, validate(createAlbumSchema), createAlbum);
albumsRouter.put('/:id', requireAuth, validate(updateAlbumSchema), updateAlbum);
albumsRouter.delete('/:id', requireAuth, deleteAlbum);
