import { Component, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { MessageService, ConfirmationService, LazyLoadEvent } from "primeng/api";
import { Table } from "primeng/table";
import { ErrorHandlerService } from "src/app/core/error-handler.service";
import { AuthService } from "src/app/seguranca/auth.service";
import { AlunoFiltro, AlunoService } from "../aluno.service";

@Component({
  selector: 'app-aluno-pesquisa',
  templateUrl: './aluno-pesquisa.component.html',
  styleUrls: ['./aluno-pesquisa.component.css']
})
export class AlunoPesquisaComponent implements OnInit {


 filtro = new AlunoFiltro();

  totalRegistros: number = 0

  alunos: any[] = [] ;
  @ViewChild('tabela') grid!: Table;
  
  constructor(
    private auth: AuthService,
    private alunoService: AlunoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private confirmationService: ConfirmationService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Pesquisa de Aluno');
  }
  
  pesquisar(pagina: number = 0): void {        
    this.filtro.pagina = pagina;
    
    this.alunoService.pesquisar(this.filtro)
      .then((resultado: any) => {
        this.alunos = resultado.alunos;
        this.totalRegistros = resultado.total;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
      const pagina = event!.first! / event!.rows!;
      this.pesquisar(pagina);
  }

  confirmarExclusao(aluno: any): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
          this.excluir(aluno);
      }
    });
  }

  excluir(aluno: any) {

    this.alunoService.excluir(aluno.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
        } else {
          this.grid.reset();
        }

        this.messageService.add({ severity: 'success', detail: 'Aluno excluída com sucesso!' })
      })
  }

  naoTemPermissao(permissao: string) {
    return !this.auth.temPermissao(permissao);
  }
}
