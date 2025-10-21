import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';

/**
 * Notification Routes
 * 알림 관련 라우트
 */

const router = Router();

// 모든 알림 라우트는 인증 필요
router.use(authenticate);

// 알림 목록 조회
router.get('/', notificationController.getNotifications);

// 읽지 않은 알림 개수 조회
router.get('/unread-count', notificationController.getUnreadCount);

// 모든 알림 읽음 처리 (특정 알림보다 먼저 처리)
router.patch('/read-all', notificationController.markAllAsRead);

// 특정 알림 읽음 처리
router.patch('/:id/read', notificationController.markAsRead);

// 알림 삭제
router.delete('/:id', notificationController.deleteNotification);

export default router;
