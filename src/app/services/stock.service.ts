import { Injectable, PLATFORM_ID, TransferState, inject, makeStateKey } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, of, tap } from "rxjs";
import { environment } from "../environments/environment.development";
import { isPlatformServer } from "@angular/common";


export interface Stock {
    code: string;
    name: string;
    // TODO 後で追加。
}

@Injectable({ providedIn: 'root' })
export class StockService {
    private http = inject(HttpClient);
    private state = inject(TransferState);
    private platformId = inject(PLATFORM_ID);
    private base = environment.apiBaseUrl;

    /** バックエンドの一覧取得。必要ならクエリをつける */
    getList(query?: string): Observable<Stock[]> {
        let params = new HttpParams;
        if(query) params = params.set('q', query);

        // SSR<->CSR で共有するキー（URL+クエリで一意化）
        const key = makeStateKey<Stock[]>(`stocks:${this.base}/search_stock_list?=${query ?? ''}`);

        // ブラウザ側：SSRが埋めたデータがあればそれを返す
        const cached = this.state.get(key, null as unknown as Stock[] | null);
        if(cached){
            // 使い終わったら片付け（メモリ節約）
            this.state.remove(key);
            return of(cached);
        }

        // SSRまたはブラウザで通常リクエスト
        return this.http
            .get<Stock[]>(`${this.base}/search_stock_list`, { params })
            .pipe(
                // SSR側なら、結果を埋め込んでブラウザに渡す
                tap((res) => {
                    if(isPlatformServer(this.platformId)){
                        this.state.set(key, res);
                    }
                })
            );
    }
}