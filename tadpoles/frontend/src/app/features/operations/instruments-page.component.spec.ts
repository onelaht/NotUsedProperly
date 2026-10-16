import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting,HttpTestingController} from '@angular/common/http/testing';
import {OperationsInstrumentsComponent} from './instruments-page.component';
describe('Operations instrument controls',()=>{
 it('provides a symbol test beside the input and invalidates results when the symbol changes',async()=>{
  TestBed.configureTestingModule({imports:[OperationsInstrumentsComponent],providers:[provideHttpClient(),provideHttpClientTesting()]});
  const f=TestBed.createComponent(OperationsInstrumentsComponent);f.detectChanges();await f.whenStable();const http=TestBed.inject(HttpTestingController);http.match(()=>true).forEach(r=>r.flush([]));
  const input=f.nativeElement.querySelector('#instrument-symbol') as HTMLInputElement;expect(input).not.toBeNull();input.value='AAPL';input.dispatchEvent(new Event('input'));await f.whenStable();f.detectChanges();
  f.nativeElement.querySelector('[data-test-symbol]').click();const old=http.expectOne(r=>r.url.endsWith('/test'));expect(old.request.params.get('symbol')).toBe('AAPL');
  input.value='MSFT';input.dispatchEvent(new Event('input'));await f.whenStable();f.detectChanges();expect(old.cancelled).toBe(true);expect(f.nativeElement.textContent).not.toContain('Recognized: AAPL');http.verify();
 });
});
