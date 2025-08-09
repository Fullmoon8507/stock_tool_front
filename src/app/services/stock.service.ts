import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment.development";


export interface Stock {
    code: string;
    name: string;
    // TODO 後で追加。
}

@Injectable({ providedIn: 'root' })
export class StockService {
    private http = inject(HttpClient)
    private base = environment.apiBaseUrl;

    /** バックエンドの一覧取得。必要ならクエリをつける */
    getList(query?: string): Observable<Stock[]> {
        let params = new HttpParams;

        if(query) params = params.set('q', query);
        return this.http.get<Stock[]>(`${this.base}/search_stock_list`, { params });
    }
}