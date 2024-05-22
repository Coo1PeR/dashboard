// import { TestBed, waitForAsync } from '@angular/core/testing';
// import { NgxsModule, Store } from '@ngxs/store';
// import { DashboardState } from './dashboard.state';
// import { DashboardAction } from './dashboard.actions';
//
// describe('Dashboard actions', () => {
//   let store: Store;
//
//   beforeEach(waitForAsync () => {
//     void TestBed.configureTestingModule({
//       imports: [NgxsModule.forRoot([DashboardState])]
//     }).compileComponents();
//     store = TestBed.inject(Store);
//   }));
//
//   it('should create', () => {
//     expect(store).toBeTruthy();
//   });
//
//   it('should create an action and add an item', () => {
//     store.dispatch(new DashboardAction('item-1'));
//     store.select(state => state.dashboard.items).subscribe((items: string[]) => {
//       expect(items).toEqual(jasmine.objectContaining([ 'item-1' ]));
//     });
//   });
//
// });
