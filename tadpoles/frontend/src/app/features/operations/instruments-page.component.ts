import {Component,DestroyRef,inject,signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Subscription} from 'rxjs';
import {InstrumentPolicyApi,PolicyForm,PolicyRow,SymbolCheck} from '../../core/api/instrument-policy-api.service';
@Component({selector:'app-operations-instruments',imports:[FormsModule,DatePipe],template:`
 <header class="workspace-heading"><p class="eyebrow">TRADING OPERATIONS</p><h1 tabindex="-1">Instruments</h1><p>Manage validated USD equities. Changes affect new decisions; accepted instructions retain their policy snapshots. Current halts apply before booking.</p></header>
 <p role="status" aria-live="polite">{{message()}}</p>
 <section class="panel"><form (ngSubmit)="load(true)" class="filters"><label for="policy-search">Search instruments</label><input id="policy-search" name="search" [(ngModel)]="search" maxlength="80"/><button type="submit">Search</button><button type="button" (click)="reset()">Add instrument</button></form>
 <div class="table-wrapper" tabindex="0" aria-label="Instrument policies, scroll horizontally"><table><caption>Catalog and validation state</caption><thead><tr><th>Symbol</th><th>Policy</th><th>Last checked (UTC)</th><th>Action</th></tr></thead><tbody>@for(row of rows();track row.instrumentId){<tr><td>{{row.ticker}}<small>{{row.name}} · {{row.currency}}</small></td><td>{{!row.active?'Full halt':row.buyAllowed&&row.sellAllowed?'Buy and sell':row.sellAllowed?'Sell only':row.buyAllowed?'Buy only':'No trading'}} · revision {{row.revision}}</td><td>{{row.validatedAt?(row.validatedAt|date:'medium':'UTC'):'Not validated'}}</td><td><button type="button" (click)="edit(row)">Edit / deactivate</button></td></tr>}</tbody></table></div>
 <div class="actions"><button type="button" [disabled]="page===0" (click)="page=page-1;load()">Previous</button><span>Page {{page+1}}</span><button type="button" [disabled]="rows().length<100" (click)="page=page+1;load()">Next</button></div></section>
 <section class="panel"><h2>{{id?'Edit instrument':'Add instrument'}}</h2>
 <form (ngSubmit)="save()"><fieldset [disabled]="saving()"><legend>Identity and provider validation</legend>
 <label for="instrument-symbol">Enter ticker/instrument</label><div class="actions"><input id="instrument-symbol" name="providerSymbol" [(ngModel)]="form.providerSymbol" (ngModelChange)="invalidate()" [readOnly]="!!id && identityLocked" maxlength="30"/><button type="button" data-test-symbol (click)="test()" [disabled]="testing() || !form.providerSymbol">{{testing()?'Testing…':'Test with Fauxnance'}}</button></div>
 @if(check();as c){<section class="notice"><h3>Recognized: {{c.symbol}}</h3><p>{{c.currency}} · {{c.source}} · {{c.asOf|date:'medium':'UTC'}} UTC</p><p>Quote currently usable: {{c.quoteUsable?'Yes':'No'}} · Platform eligible: {{c.eligible?'Yes':'No'}}</p><p>{{c.reason}}</p><p>Daily chart available: {{c.chartAvailable?'Yes':'Not confirmed'}} · {{c.chartReason}}</p><p>{{c.disclaimer}}</p></section>}
 <label for="policy-ticker">Catalog ticker</label><input id="policy-ticker" name="ticker" [(ngModel)]="form.ticker" [readOnly]="!!id" (ngModelChange)="invalidate()" required maxlength="30"/>
 <label for="policy-name">Name</label><input id="policy-name" name="name" [(ngModel)]="form.name" required maxlength="120"/>
 <label for="policy-venue">Venue label</label><input id="policy-venue" name="venue" [(ngModel)]="form.venue" required maxlength="40"/><p>Venue is an Operations label; a quote response alone does not verify listing identity. Review the provider mapping before enabling.</p>
 <label for="policy-step">Quantity step (shares)</label><input id="policy-step" name="step" [(ngModel)]="form.quantityStep" inputmode="decimal"/>
 <label for="policy-max-quantity">Maximum quantity</label><input id="policy-max-quantity" name="maxQuantity" [(ngModel)]="form.maxQuantity" inputmode="decimal"/>
 <label for="policy-max-notional">Maximum consideration (USD)</label><input id="policy-max-notional" name="maxNotional" [(ngModel)]="form.maxNotional" inputmode="decimal"/>
 <label for="policy-age">Maximum quote age (seconds, 1–600)</label><input id="policy-age" name="age" [(ngModel)]="form.quoteMaxAgeSeconds" type="number" min="1" max="600"/>
 <p>Session policy: provider open, or a verified U.S. core session when provider status is unknown. Settlement: immediate internal booking. Project fee: zero.</p>
 <label><input name="active" type="checkbox" [(ngModel)]="form.active"/> Active</label><label><input name="buyAllowed" type="checkbox" [(ngModel)]="form.buyAllowed"/> Allow buys</label><label><input name="sellAllowed" type="checkbox" [(ngModel)]="form.sellAllowed"/> Allow sells</label>
 @if(!form.active || !form.sellAllowed){<p class="notice">This blocks exits from held positions and may reject accepted orders. Use active + allow sells + disable buys for a sell-only exit policy.</p>}
 <label for="policy-reason">Reason for change (8–500 characters)</label><textarea id="policy-reason" name="reason" [(ngModel)]="form.reason" minlength="8" maxlength="500" required></textarea>
 <p>Saving rechecks the current provider values. Full halts remain available during provider outages. Deactivation preserves instruments and historical records.</p><button type="submit">{{saving()?'Saving…':!form.active?'Save full halt':'Save policy'}}</button><button type="button" (click)="reset()">Cancel</button>
 </fieldset></form></section>`})
export class OperationsInstrumentsComponent {
 private readonly api=inject(InstrumentPolicyApi);private readonly destroy=inject(DestroyRef);private validation?:Subscription;private listing?:Subscription;
 readonly rows=signal<PolicyRow[]>([]);readonly check=signal<SymbolCheck|null>(null);readonly message=signal('');readonly testing=signal(false);readonly saving=signal(false);
 search='';page=0;id?:number;identityLocked=false;form:PolicyForm=this.empty();
 constructor(){this.load();this.destroy.onDestroy(()=>{this.validation?.unsubscribe();this.listing?.unsubscribe();});}
 private empty():PolicyForm{return {ticker:'',name:'',providerSymbol:'',venue:'',quantityStep:'1',maxQuantity:'1000',maxNotional:'100000',quoteMaxAgeSeconds:600,active:true,buyAllowed:true,sellAllowed:true,reason:'',revision:0};}
 load(reset=false){if(reset)this.page=0;this.listing?.unsubscribe();this.listing=this.api.list(this.search,this.page).subscribe({next:r=>this.rows.set(r),error:e=>this.error(e)});}
 invalidate(){this.validation?.unsubscribe();this.check.set(null);this.testing.set(false);}
 test(){this.invalidate();this.testing.set(true);this.message.set('');this.validation=this.api.test(this.form.providerSymbol.trim().toUpperCase()).subscribe({next:c=>{this.check.set(c);this.testing.set(false);},error:e=>{this.testing.set(false);this.error(e);}});}
 edit(row:PolicyRow){this.invalidate();this.id=row.instrumentId;this.identityLocked=!!row.providerSymbol;this.form={...this.empty(),ticker:row.ticker,name:row.name,providerSymbol:row.providerSymbol??row.ticker,venue:row.venue??'',quantityStep:row.quantityStep??'1',maxQuantity:row.maxQuantity??'1000',maxNotional:row.maxNotional??'100000',quoteMaxAgeSeconds:row.quoteMaxAgeSeconds??600,active:row.active,buyAllowed:row.buyAllowed??true,sellAllowed:row.sellAllowed??true,revision:row.revision};}
 reset(){this.invalidate();this.id=undefined;this.identityLocked=false;this.form=this.empty();}
 save(){if(this.saving())return;this.saving.set(true);this.api.save({...this.form},this.id).pipe(takeUntilDestroyed(this.destroy)).subscribe({next:row=>{this.saving.set(false);this.message.set('Policy saved. Revision '+row.revision+'.');this.edit(row);this.load();},error:e=>{this.saving.set(false);this.error(e);}});}
 private error(e:{error?:{message?:string}}){this.message.set(e.error?.message??'Unable to complete request. Try again; no success is assumed.');}
}
