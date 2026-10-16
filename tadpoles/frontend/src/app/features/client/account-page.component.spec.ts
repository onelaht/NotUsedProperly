import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Subject, EMPTY } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { OrderStatusService } from '../../core/api/order-status.service';
import { AccountPageComponent } from './account-page.component';
describe('independent account resources', () => {
  it('keeps confirmed balances useful when recent orders fail', () => {
    TestBed.configureTestingModule({
      imports: [AccountPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: {} } } },
        { provide: AuthService, useValue: { sessionChanged: new Subject<void>() } },
        { provide: OrderStatusService, useValue: { watch: () => EMPTY } },
      ],
    });
    const http = TestBed.inject(HttpTestingController);
    const f = TestBed.createComponent(AccountPageComponent);
    http
      .expectOne((r) => r.url.endsWith('/portfolio'))
      .flush({
        tradingEnabled: true,
        balances: [{ currency: 'USD', posted: '1000', reserved: '500', available: '500' }],
        currentPositions: [],
        positions: [],
        retrievedAt: new Date().toISOString(),
      });
    http
      .expectOne((r) => r.url.endsWith('/orders'))
      .flush({}, { status: 503, statusText: 'Unavailable' });
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Display currency');
    expect(f.nativeElement.textContent).toContain('AVAILABLE USD');
    expect(f.nativeElement.textContent).toContain('500');
    expect(f.nativeElement.textContent).toContain('Unable to connect');
    http.verify();
  });
});
