/**
 * Data Transformation Utilities
 * 데이터 변환을 위한 유틸리티 함수들
 */

/**
 * snake_case를 camelCase로 변환
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * camelCase를 snake_case로 변환
 */
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * 객체의 키를 snake_case에서 camelCase로 변환
 */
export const keysToCamel = <T = any>(obj: any): T => {
  if (Array.isArray(obj)) {
    return obj.map(v => keysToCamel(v)) as any;
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = snakeToCamel(key);
      result[camelKey] = keysToCamel(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

/**
 * 객체의 키를 camelCase에서 snake_case로 변환
 */
export const keysToSnake = <T = any>(obj: any): T => {
  if (Array.isArray(obj)) {
    return obj.map(v => keysToSnake(v)) as any;
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = camelToSnake(key);
      result[snakeKey] = keysToSnake(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

/**
 * null 값을 제거
 */
export const removeNullValues = <T extends Record<string, any>>(
  obj: T
): Partial<T> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
};

/**
 * undefined 값을 제거
 */
export const removeUndefinedValues = <T extends Record<string, any>>(
  obj: T
): Partial<T> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
};

/**
 * 빈 문자열을 null로 변환
 */
export const emptyStringsToNull = <T extends Record<string, any>>(
  obj: T
): T => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === 'string' && value.trim() === '') {
      acc[key as keyof T] = null as any;
    } else {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as T);
};

/**
 * 객체에서 특정 키들만 선택
 */
export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
};

/**
 * 객체에서 특정 키들을 제외
 */
export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result as Omit<T, K>;
};
