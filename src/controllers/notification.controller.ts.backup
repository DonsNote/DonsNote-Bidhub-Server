import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';
import { NotificationType } from '../types/notification.types';

/**
 * Notification Controller
 * 알림 관련 HTTP 요청 처리
 */

export const notificationController = {
  /**
   * 사용자의 알림 목록 조회
   * GET /api/notifications
   */
  async getNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { read, type, limit, offset } = req.query;

      const filters = {
        read: read === 'true' ? true : read === 'false' ? false : undefined,
        type: type as NotificationType | undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };

      const notifications = await notificationService.getNotifications(userId, filters);

      res.json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get notifications',
      });
    }
  },

  /**
   * 읽지 않은 알림 개수 조회
   * GET /api/notifications/unread-count
   */
  async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const count = await notificationService.getUnreadCount(userId);

      res.json({
        success: true,
        count,
      });
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get unread count',
      });
    }
  },

  /**
   * 알림을 읽음 상태로 변경
   * PATCH /api/notifications/:id/read
   */
  async markAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      await notificationService.markAsRead(id, userId);

      res.json({
        success: true,
        message: 'Notification marked as read',
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark notification as read',
      });
    }
  },

  /**
   * 모든 알림을 읽음 상태로 변경
   * PATCH /api/notifications/read-all
   */
  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      await notificationService.markAllAsRead(userId);

      res.json({
        success: true,
        message: 'All notifications marked as read',
      });
    } catch (error) {
      console.error('Mark all as read error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark all notifications as read',
      });
    }
  },

  /**
   * 알림 삭제
   * DELETE /api/notifications/:id
   */
  async deleteNotification(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      await notificationService.deleteNotification(id, userId);

      res.json({
        success: true,
        message: 'Notification deleted',
      });
    } catch (error) {
      console.error('Delete notification error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete notification',
      });
    }
  },
};
