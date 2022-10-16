import { AuthGuard } from '../seguranca/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CursoPesquisaComponent } from './curso-pesquisa/curso-pesquisa.component';
import { CursoCadastroComponent } from './curso-cadastro/curso-cadastro.component';


const routes: Routes = [
    { 
      path: '', 
      component: CursoPesquisaComponent, 
      canActivate: [AuthGuard],
      //data: { roles: ['ROLE_PESQUISAR_AGENDA'] } 
    },
    { 
      path: 'novo', 
      component: CursoCadastroComponent, 
      canActivate: [AuthGuard],
   //   data: { roles: ['ROLE_CADASTRAR_AGENDA'] } 
    },
    {
      path: ':codigo', 
      component: CursoCadastroComponent, 
      canActivate: [AuthGuard],
     // data: { roles: ['ROLE_CADASTRAR_AGENDA'] } 
    }
  ];
  
  @NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
  })
  export class CursoRoutingModule { }