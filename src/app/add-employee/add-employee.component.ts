import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpService } from '../emp.service';
import { Employee } from '../model';
import { IndexedDBService } from '../service/indexdb.service';
import { SignalService } from '../service/signal.service';
import { ModeService } from '../service/mode.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  @ViewChild('role') role!: ElementRef;
  @Output() employeeUpdated = new EventEmitter<Employee>();
  selectedrole = '';
  addEmpForm!: FormGroup;
  selectedMonth = null;
  newEmployee: Employee = new Employee();
  sharedData: any;
  updatebtn = false;
  emp_id: any;
  employeedata: any;
  submitted = false;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private empservice: EmpService,
    private indexService: IndexedDBService,
    private signalService: SignalService,
    private modeService: ModeService
  ) { }

  ngOnInit() {
    this.modeService.getUpdateMode().subscribe(isUpdateMode => {
      this.sharedData = this.empservice.getData();
      if (isUpdateMode == false) {
        this.sharedData = undefined;
      }

      if (this.sharedData) {
        console.log(this.sharedData);
        this.emp_id = this.sharedData.id;
      }

      this.updatebtn = !!this.sharedData;

      this.addEmpForm = this.formBuilder.group({
        empName: ['', [Validators.required]],
        empRole: ['', [Validators.required]],
        empstartDate: ['', [Validators.required]],
        empendDate: ['']
      });

      if (this.sharedData !== undefined) {
        this.addEmpForm.patchValue({
          empName: this.sharedData.empName,
          empRole: this.sharedData.empRole,
          empstartDate: this.sharedData.empstartDate,
          empendDate: this.sharedData.empendDate,
        });
      }
    });
  }

  onCancel(){
    this.goBack();
  }

  get f() {
    return this.addEmpForm.controls;
  }

  onSelected(): void {
    this.selectedrole = this.role.nativeElement.value;
  }

  addEmployee() {
    this.submitted = true;
    if (this.addEmpForm.invalid) {
      return;
    }
    const employee = this.addEmpForm.value;
    console.log(employee);

    this.indexService.addEmployee(employee).then(() => {
      this.signalService.employeeAdded.emit(employee);
      this.goBack()
    })
    this.ngOnInit();
  }

  goBack() {
    this.router.navigate(['/employeeList']);
  }

  async updateEmployee() {
    this.submitted = true;
    console.log(this.addEmpForm.value);
    this.employeedata = this.addEmpForm.value;
    const updatedEmployee = { ...this.sharedData, ...this.employeedata };

    await this.indexService.updateEmployee(updatedEmployee).then(() => {
      this.signalService.employeeUpdated.emit(updatedEmployee);
      this.goBack();
    })
    alert('Updated successfully');
    this.addEmpForm.reset();
  }
}
