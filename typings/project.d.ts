/// <reference types="@total-typescript/ts-reset" />

declare namespace API {
  interface Response<T = any> {
    code: number;
    message: string;
    data: T | null;
    success?: boolean;
    errorData?: Array<{
      errorCode: string
      errorMessage: string
      propertyName: string
    }>
  }
}