import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-password-success',
  standalone:true,
  templateUrl: './password-success.component.html',
  styleUrls: ['./password-success.component.scss'],
  imports: [
    InputTextModule,
    ProgressSpinnerModule,
    CommonModule
  ]
})
export class PasswordSuccessComponent implements OnInit {
  user: string = '';
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit():void{
  
    this.route.paramMap.subscribe(params=>{
      const UserName:string = params.get('userName') ?? '';
      this.user=UserName;
     // console.log('user',UserName);
      //console.log('user2',this.user);
      
      setTimeout(() => {
        this.loading = false;
      
        setTimeout(() => {
          this.redirectToPasswordReset();  // Redirige a la vista
        }, 5000); 
      }, 1000); 

    })
  }

  redirectToPasswordReset() {
    this.router.navigate(['/password-reset']).then(() => {
      this.location.replaceState('/password-reset');  // Reemplaza la entrada en el historial
    });
  }
  

}
