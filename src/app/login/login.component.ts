import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  constructor(
    private elementRef: ElementRef, 
    private auth:AuthService,
    private router:Router) 
    { }

  loginForm: FormGroup

  ngOnInit(): void {
    if (this.auth.verifyToken()) {
      this.router.navigate(["dashboard"])
    }
    this.loginForm = new FormGroup({ 
      "user": new FormControl("", Validators.required), 
      "password": new FormControl("", Validators.required) 
    })
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundRepeat = "no-repeat" 
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundSize = "cover" 
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = 
    "url(assets/img/bg-img.jpg),linear-gradient(to bottom, rgba(112,97,97, 0.1) 40%,rgba(112,97,97, 0.1) 40%)";
  }

  login() {
    let miInfo = {
      user: this.loginForm.controls["user"].value,
      password: this.loginForm.controls["password"].value
    }
    console.log(miInfo)
    let loginSubs = this.auth.loginMutation(miInfo.user, miInfo.password).subscribe(({ data }:any) => {
      console.log('got data', data.signIn.token);
      this.auth.saveToken(data.signIn.token);
      this.auth.login() 
      loginSubs.unsubscribe();
    },(error) => {
      this.loginForm.controls["user"].setValue("");
      this.loginForm.controls["password"].setValue("");
      this.loginForm.controls["user"].setErrors({incorrect:true});
      loginSubs.unsubscribe();
    });
  }

}
