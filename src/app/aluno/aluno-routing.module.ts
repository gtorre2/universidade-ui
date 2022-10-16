import { AuthGuard } from '../seguranca/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlunoCadastroComponent } from './aluno-cadastro/aluno-cadastro.component';
import { AlunoPesquisaComponent } from './aluno-pesquisa/aluno-pesquisa.component';

const routes: Routes = [
    { 
      path: '', 
      component: AlunoPesquisaComponent, 
      canActivate: [AuthGuard],
     // data: { roles: ['ROLE_PESQUISAR_AGENDA'] } 
    },
    { 
      path: 'novo', 
      component: AlunoCadastroComponent, 
      canActivate: [AuthGuard],
      //data: { roles: ['ROLE_CADASTRAR_AGENDA'] } 
    },
    {
      path: ':codigo', 
      component: AlunoCadastroComponent, 
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
  export class AlunoRoutingModule { }