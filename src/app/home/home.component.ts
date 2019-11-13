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

  constructor(private vehicleService: VehicleService) {}

  ngOnInit() {
    this.isLoading = true;
    this.getCustomers();
    this.getVehicles();
  }

  clearFilters() {
    this.vehicles = this.allvehicles;
    this.selectedStatus = 0;
  }

  filterConnected(isConnected: boolean) {
    this.vehicles = this.allvehicles.filter(v => v.isConnected === isConnected);
  }

  filterByCustomer() {
    console.log(this.selectedCustomer);
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
