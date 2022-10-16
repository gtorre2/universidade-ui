import { AuthGuard } from '../seguranca/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfessorPesquisaComponent } from './professor-pesquisa/professor-pesquisa.component';
import { ProfessorCadastroComponent } from './professor-cadastro/professor-cadastro.component';


const routes: Routes = [
    { 
      path: '', 
      component: ProfessorPesquisaComponent, 
      canActivate: [AuthGuard],
     // data: { roles: ['ROLE_PESQUISAR_AGENDA'] } 
    },
    { 
      path: 'novo', 
      component: ProfessorCadastroComponent, 
      canActivate: [AuthGuard],
     // data: { roles: ['ROLE_CADASTRAR_AGENDA'] } 
    },
    {
      path: ':codigo', 
      component: ProfessorCadastroComponent, 
      canActivate: [AuthGuard],
      data: { roles: ['ROLE_CADASTRAR_AGENDA'] } 
    }
  ];
  
  @NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
  })
  export class ProfessorRoutingModule { }