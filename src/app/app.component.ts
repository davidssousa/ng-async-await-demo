import { Component } from '@angular/core';
import { Employee } from './employee.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  url = 'http://dummy.restapiexample.com/api/v1/employee/34';

  subscribeResult: Employee;
  promiseResult: Employee;
  asyncResult: Employee;

  conditionalPromiseResult: Employee;
  conditionalAsyncResult: Employee;

  additionPromiseResult: number;
  additionAsyncResult: number;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.getValueWithPromise();
    this.getValueWithAsync();

    this.addWithPromise();
    this.addWithAsync();

    this.getDataUsingSubscribe();
    this.getDataUsingPromise();
    this.getAsyncData();

    this.getConditionalDataUsingPromise();
    this.getConditionalDataUsingAsync();


  }

  resolveAfter2Seconds(x) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
  }

  getValueWithPromise() {
    this.resolveAfter2Seconds(20).then(value => {
      console.log(`promise result: ${value}`);
    });
    console.log('I will not wait until promise is resolved');
  }

  async getValueWithAsync() {
    const value = <number>await this.resolveAfter2Seconds(20);
    console.log(`async result: ${value}`);
  }


  addWithPromise() {
    this.resolveAfter2Seconds(20).then(data1 => {
      let result1 = <number>data1;
      this.resolveAfter2Seconds(30).then(data2 => {
        let result2 = <number>data2;
        this.additionPromiseResult = result1 + result2;
        console.log(`promise result: ${this.additionPromiseResult}`);
      });
    });
  }

  async addWithAsync() {
    const result1 = <number>await this.resolveAfter2Seconds(20);
    const result2 = <number>await this.resolveAfter2Seconds(30);
    this.additionAsyncResult = result1 + result2;
    console.log(`async result: ${this.additionAsyncResult}`);
  }

  getDataUsingSubscribe() {
    this.httpClient.get<Employee>(this.url).subscribe(data => {
      this.subscribeResult = data;
      console.log('Subscribe executed.')
    });
    console.log('I will not wait until subscribe is executed..');
  }

  getDataUsingPromise() {
    this.httpClient.get<Employee>(this.url).toPromise().then(data => {
      this.promiseResult = data;
      console.log('Promise resolved.')
    });
    console.log('I will not wait until promise is resolved..');
  }

  async getAsyncData() {
    this.asyncResult = await this.httpClient.get<Employee>(this.url).toPromise();
    console.log('No issues, I will wait until promise is resolved..');
  }

  getConditionalDataUsingPromise() {
    this.httpClient.get<Employee>(this.url).toPromise().then(data => {
      console.log('First Promise resolved.')
      if (data.id > 5) {
        let anotherUrl = 'http://dummy.restapiexample.com/api/v1/employee/23';
        this.httpClient.get<Employee>(anotherUrl).toPromise().then(data => {
          this.conditionalPromiseResult = data;
          console.log('Second Promise resolved.')
        });
      }
    });
  }

  async getConditionalDataUsingAsync() {
    let data = await this.httpClient.get<Employee>(this.url).toPromise();
    if (data.id > 5) {
      let anotherUrl = 'http://dummy.restapiexample.com/api/v1/employee/23';
      this.conditionalAsyncResult = await this.httpClient.get<Employee>(anotherUrl).toPromise();
    }
    console.log('No issues, I will wait until promise is resolved..');
  }
}
