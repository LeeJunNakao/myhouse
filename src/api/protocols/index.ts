export interface HttpRequest {
  body: any,
}

export interface HttpResponse {
  status: number,
  body: any,
}

export interface Controller {
  post: (httpRequest: HttpRequest) => Promise<HttpResponse>,
  get: (httpRequest: HttpRequest) => Promise<HttpResponse>,
  put: (httpRequest: HttpRequest) => Promise<HttpResponse>,
  delete: (httpRequest: HttpRequest) => Promise<HttpResponse>,
}
