import { Component, OnInit, OnDestroy } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { VehicleService } from './vehicle.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  allvehicles: any[];
  vehicles: any[];

  customers: any[];

  disconnectedCount = 0;
  connectedCount = 0;
  isLoading = false;
  selectedStatus = 0;
  selectedCustomer: any;

  emptyCustomer = {
    name: 'Select Customer',
    id: -1
  };
  subscription: any;

  constructor(private vehicleService: VehicleService) {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.isLoading = true;
    this.selectedCustomer = this.emptyCustomer;
    this.getCustomers();
    this.getVehicles();

    const source = interval(300000);
    this.subscription = source.subscribe((val: any) => this.updateRandomStatus());
  }

  clearFilters() {
    this.vehicles = this.allvehicles;
    this.selectedStatus = 0;
    this.selectedCustomer = this.emptyCustomer;
  }

  updateRandomStatus() {
    this.allvehicles.forEach(function(part: any, index: any) {
      this[index].isConnected = Math.random() >= 0.5;
    }, this.allvehicles);

    this.recalculateCounts();
    this.filterData();
  }

  filterConnected(status: number) {
    this.selectedStatus = status;
    this.filterData();
  }

  filterByCustomer(customer: any) {
    this.selectedCustomer = customer;
    this.filterData();
  }

  private filterData() {
    if (this.selectedCustomer.id === -1 && this.selectedStatus !== 0) {
      this.vehicles = this.allvehicles.filter(v => v.isConnected === (this.selectedStatus === 1));
      return;
    }

    if (this.selectedStatus === 0 && this.selectedCustomer.id !== -1) {
      this.vehicles = this.allvehicles.filter(v => v.customer.id === this.selectedCustomer.id);
      return;
    }

    this.vehicles = this.allvehicles.filter(
      // tslint:disable-next-line: triple-equals
      v => v.isConnected === (this.selectedStatus == 1) && v.customer.id === this.selectedCustomer.id
    );
  }

  private getVehicles() {
    this.vehicleService
      .getVehicles()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((data: any) => {
        this.allvehicles = data;
        this.vehicles = data;
        this.recalculateCounts();
      });
  }

  private recalculateCounts() {
    this.disconnectedCount = this.allvehicles.filter(e => e.isConnected === false).length;
    this.connectedCount = this.allvehicles.filter(e => e.isConnected === true).length;
  }

  private getCustomers() {
    this.vehicleService
      .getCustomers()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((data: any) => {
        this.customers = data;
      });
  }
}
