import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { VehicleService } from './vehicle.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
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

  constructor(private vehicleService: VehicleService) {}

  ngOnInit() {
    this.isLoading = true;
    this.selectedCustomer = this.emptyCustomer;
    this.getCustomers();
    this.getVehicles();
  }

  clearFilters() {
    this.vehicles = this.allvehicles;
    this.selectedStatus = 0;
    this.selectedCustomer = this.emptyCustomer;
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
    if (this.selectedCustomer.id === -1) {
      this.vehicles = this.allvehicles.filter(v => v.isConnected === (this.selectedStatus === 1));
    } else if (this.selectedStatus === 0) {
      this.vehicles = this.allvehicles.filter(v => v.isConnected === (v.customer.id === this.selectedCustomer.id));
    } else {
      this.vehicles = this.allvehicles.filter(
        v => v.isConnected === (this.selectedStatus === 1) && v.customer.id === this.selectedCustomer.id
      );
    }
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
        this.disconnectedCount = this.vehicles.filter(e => e.isConnected === false).length;
        this.connectedCount = this.vehicles.filter(e => e.isConnected === true).length;
      });
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
