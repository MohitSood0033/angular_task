import { Injectable } from '@angular/core';
import { Employee } from './model';

@Injectable({
  providedIn: 'root'
})
export class EmpService {
  private employees: Employee[] = [];
  sharedData: any;
  constructor() { }

  // getEmployees(): Employee[] {
  //   return this.employees;
  // }

  // addEmployee(employee: Employee) {
  //   console.log('dddddd',this.employees)

  //   this.employees.push(employee);
  //   console.log('dddddd',this.employees)
  // }

  setData(data: any): void {
    this.sharedData = data;
  }

  getData(): any {
    return this.sharedData;
  }
}
