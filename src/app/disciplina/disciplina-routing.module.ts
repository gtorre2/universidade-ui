import { AuthGuard } from '../seguranca/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisciplinaPesquisaComponent } from './disciplina-pesquisa/disciplina-pesquisa.component';
import { DisciplinaCadastroComponent } from './disciplina-cadastro/disciplina-cadastro.component';

const routes: Routes = [
    { 
      path: '', 
      component: DisciplinaPesquisaComponent, 
      canActivate: [AuthGuard],
      //data: { roles: ['ROLE_PESQUISAR_AGENDA'] } 
    },
    { 
      path: 'novo', 
      component: DisciplinaCadastroComponent, 
      canActivate: [AuthGuard],
      //data: { roles: ['ROLE_CADASTRAR_AGENDA'] } 
    },
    {
      path: ':codigo', 
      component: DisciplinaCadastroComponent, 
      canActivate: [AuthGuard],
      //data: { roles: ['ROLE_CADASTRAR_AGENDA'] } 
    }
  ];
  
  @NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
  })
  export class DisciplinaRoutingModule { }