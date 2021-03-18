export interface HttpRequest {
  body: any,
}

export interface HttpResponse {
  status: number,
  body: any,
}

export interface Controller {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>,
}
