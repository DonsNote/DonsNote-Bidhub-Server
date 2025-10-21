import { Response } from 'express';
import { ApiResponse, ErrorResponse } from '../types';

/**
 * Response Utility Functions
 * API 응답 형식을 통일하기 위한 유틸리티
 */

/**
 * 성공 응답 전송
 */
export const sendSuccess = <T = any>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message })
  };

  return res.status(statusCode).json(response);
};

/**
 * 에러 응답 전송
 */
export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 500,
  message?: string
): Response => {
  const response: ErrorResponse = {
    success: false,
    error,
    ...(message && { message }),
    statusCode
  };

  return res.status(statusCode).json(response);
};

/**
 * 생성 성공 응답 (201)
 */
export const sendCreated = <T = any>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
): Response => {
  return sendSuccess(res, data, message, 201);
};

/**
 * Bad Request 응답 (400)
 */
export const sendBadRequest = (
  res: Response,
  error: string,
  message?: string
): Response => {
  return sendError(res, error, 400, message);
};

/**
 * Unauthorized 응답 (401)
 */
export const sendUnauthorized = (
  res: Response,
  error: string = 'Unauthorized',
  message?: string
): Response => {
  return sendError(res, error, 401, message);
};

/**
 * Forbidden 응답 (403)
 */
export const sendForbidden = (
  res: Response,
  error: string = 'Forbidden',
  message?: string
): Response => {
  return sendError(res, error, 403, message);
};

/**
 * Not Found 응답 (404)
 */
export const sendNotFound = (
  res: Response,
  error: string = 'Resource not found',
  message?: string
): Response => {
  return sendError(res, error, 404, message);
};

/**
 * Internal Server Error 응답 (500)
 */
export const sendServerError = (
  res: Response,
  error: string = 'Internal server error',
  message?: string
): Response => {
  return sendError(res, error, 500, message);
};
