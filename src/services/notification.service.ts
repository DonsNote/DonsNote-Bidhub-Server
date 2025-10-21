import { supabase } from '../config/supabase';
import { Notification, NotificationCreateInput, NotificationType } from '../types/notification.types';

/**
 * Notification Service
 * 알림 관련 비즈니스 로직
 */

export const notificationService = {
  /**
   * 알림 생성
   */
  async createNotification(input: NotificationCreateInput): Promise<Notification> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: input.user_id,
          type: input.type,
          title: input.title,
          message: input.message,
          link: input.link,
          metadata: input.metadata,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Notification;
    } catch (error) {
      console.error('Create notification error:', error);
      throw new Error('Failed to create notification');
    }
  },

  /**
   * 사용자의 알림 목록 조회
   */
  async getNotifications(
    userId: string,
    filters?: {
      read?: boolean;
      type?: NotificationType;
      limit?: number;
      offset?: number;
    }
  ): Promise<Notification[]> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (filters?.read !== undefined) {
        query = query.eq('read', filters.read);
      }

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Notification[];
    } catch (error) {
      console.error('Get notifications error:', error);
      throw new Error('Failed to get notifications');
    }
  },

  /**
   * 읽지 않은 알림 개수 조회
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Get unread count error:', error);
      throw new Error('Failed to get unread count');
    }
  },

  /**
   * 알림을 읽음 상태로 변경
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Mark as read error:', error);
      throw new Error('Failed to mark notification as read');
    }
  },

  /**
   * 모든 알림을 읽음 상태로 변경
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  },

  /**
   * 알림 삭제
   */
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Delete notification error:', error);
      throw new Error('Failed to delete notification');
    }
  },
};
