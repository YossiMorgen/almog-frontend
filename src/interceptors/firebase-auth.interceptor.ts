import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { API_CONFIG } from "../config/api.config";
import { Observable } from "rxjs";

@Injectable()
export class FirebaseAuthInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const auth = this.injector.get(AuthService);

    const isApi = req.url.startsWith(API_CONFIG.BASE_URL);
    const token = auth.getToken();

    if (isApi && token) {
      const modified = req.clone({
        setHeaders: { authorization: `Bearer ${token}` }
      });
      return next.handle(modified);
    }
    return next.handle(req);
  }
}
