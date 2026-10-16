import { Component, inject } from '@angular/core';
import { DisplayCurrencyComponent } from './display-currency.component';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WorkspaceApi, Portfolio, Page, Order } from '../../core/api/workspace-api.service';
import { OrderStatusService } from '../../core/api/order-status.service';
import { PageResource } from '../../shared/workspace/page-resource';
import { RequestStateComponent } from '../../shared/workspace/request-state.component';
import { OrdersTableComponent } from '../../shared/workspace/orders-table.component';
@Component({
  selector: 'app-account-page',
  imports: [DisplayCurrencyComponent, DatePipe, RouterLink, RequestStateComponent, OrdersTableComponent],
  template: ` <header class="workspace-heading">
      <p class="eyebrow">MY ACCOUNT</p>
      <h1 tabindex="-1">{{ portfolioOnly ? 'Your portfolio' : 'Your account at a glance' }}</h1>
      <p>See what is available, explore instruments and follow your orders.</p>
    </header>
    <app-request-state
      [loading]="resource.loading()"
      [error]="resource.error()"
      [status]="resource.status()"
      (retry)="load()"
    />
    @if (resource.data(); as data) {
        <div class="section-heading">
          <p class="eyebrow">USD ACCOUNT · INTERNAL BOOKING</p>
          <div class="actions"><a routerLink="/app/banking">Deposit / withdraw</a><a routerLink="/app/markets">Find an instrument →</a></div>
        </div>
        <div class="summary-grid">
          @for (balance of data.balances; track balance.currency) {
            <section class="panel">
              <p class="eyebrow">AVAILABLE {{ balance.currency }}</p>
              <h2 class="mono-value">
                {{ balance.available }} <small>{{ balance.currency }}</small>
              </h2>
              <p>Posted balance: {{ balance.posted }}</p>
              <p>Held for pending buys: {{ balance.reserved }}</p>
              <p class="as-of">Committed {{ balance.updatedAt | date: 'medium' : 'UTC' }} UTC</p>
            </section>
          }
        </div>
        @for (balance of data.balances; track balance.currency) {
          @if (balance.currency === 'USD') { <app-display-currency [availableUsd]="balance.available" /> }
        }
        <p class="muted">
          Available cash is your posted balance minus amounts reserved for pending buys. Sales settle internally when the fill commits.
        </p>
        @if (!data.tradingEnabled) {
          <p class="notice">
            New order admission is currently unavailable. Your orders and balances remain saved.
          </p>
        }
        <section class="panel">
          <div class="section-heading">
            <h2>Your positions</h2>
            <a routerLink="/app/markets">Browse markets</a>
          </div>
          @if (!data.currentPositions?.length) {
            <div class="empty">
              <h3>Your first investment starts here</h3>
              <p>Choose an instrument and review its estimated impact before buying.</p>
              <p>
                If your available cash is zero, add a bank reference and make an internal deposit.
              </p>
            </div>
          } @else {
            <div
              class="table-wrapper"
              tabindex="0"
              aria-label="Current positions, scroll horizontally"
            >
              <table>
                <caption>
                  Committed positions · pending buys are not included
                </caption>
                <thead>
                  <tr>
                    <th>Instrument</th>
                    <th>Owned</th>
                    <th>Reserved to sell</th>
                    <th>Available to sell</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of data.currentPositions; track p.instrumentId) {
                    <tr>
                      <td>
                        <a [routerLink]="['/app/instruments', p.instrumentId]">{{ p.ticker }}</a
                        ><small>{{ p.name }} · {{ p.currency }}</small>
                      </td>
                      <td>{{ p.owned }}</td>
                      <td>{{ p.reserved }}</td>
                      <td>{{ p.available }}</td>
                      <td>
                        <a
                          [routerLink]="['/app/trade', p.instrumentId]"
                          [queryParams]="{ side: 'BUY' }"
                          >Buy</a
                        >
                        @if (hasUnits(p.available)) {
                          <a
                            class="position-sell"
                            [routerLink]="['/app/trade', p.instrumentId]"
                            [queryParams]="{ side: 'SELL' }"
                            >Sell</a
                          >
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>
      @if (data.migrationExceptions?.length) {<section class="notice"><h2>Historical records need review</h2><p>These records are preserved separately and cannot be spent or sold.</p>@for(e of data.migrationExceptions;track e.id){<p>Reference {{e.id}} · {{e.kind}}</p>}</section>}
      <p class="as-of">
        Retrieved {{ data.retrievedAt | date: 'medium' : 'UTC' }} UTC · automatic updates for up to
        10 minutes; refresh to resume.
      </p>
      <p class="muted">{{ data.limitation }}</p>
    }
    @if (!portfolioOnly) {
      <section class="panel">
        <div class="section-heading">
          <h2>Recent orders</h2>
          <a routerLink="/app/orders">All orders →</a>
        </div>
        <app-request-state
          [loading]="recent.loading()"
          [error]="recent.error()"
          [status]="recent.status()"
          (retry)="loadOrders()"
        />
        @if (recent.data(); as orders) {
          <app-orders-table [orders]="orders.items" />
        }
      </section>
    }`,
})
export class AccountPageComponent {
  private readonly api = inject(WorkspaceApi);
  readonly portfolioOnly = inject(ActivatedRoute).snapshot.data['portfolioOnly'] === true;
  readonly resource = new PageResource<Portfolio>();
  readonly recent = new PageResource<Page<Order>>();
  constructor() {
    this.load();
    inject(OrderStatusService)
      .watch()
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.load());
  }
  load() {
    this.resource.load(this.api.portfolio());
    if (!this.portfolioOnly) this.loadOrders();
  }
  loadOrders() {
    this.recent.load(this.api.orders({ pageSize: 5 }));
  }
  hasUnits(value: string) {
    return /[1-9]/.test(value);
  }
}
