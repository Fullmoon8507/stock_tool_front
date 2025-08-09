import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Stock, StockService } from "../services/stock.service";

@Component({
    selector: 'app-stocks-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './stocks-list.component.html',
})

export class StocksListComponent implements OnInit {
    private api = inject(StockService)

    loading = false;
    error: string | null = null;
    items: Stock[] = [];
    q = '';

    ngOnInit(): void {
        this.fetch();
    }

    fetch() {
        this.loading = true;
        this.error = null;

        this.api.getList(this.q).subscribe({
            next: (res) => {
                this.items = res ?? [];
                this.loading = false;
            },
            error: (err) => {
                this.error = err?.message ?? 'エラーが発生しました';
                this.loading = false;
            },
        });
    }
}