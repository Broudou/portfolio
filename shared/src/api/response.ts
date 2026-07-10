/**
 * Standard envelope for every API response. Controllers never return bare
 * JSON — they always wrap it via `apiResponse.ts` helpers on the server so
 * the client can discriminate on `success` without inspecting status codes.
 */
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
