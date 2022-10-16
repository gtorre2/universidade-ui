import { Component, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { MessageService, ConfirmationService, LazyLoadEvent } from "primeng/api";
import { Table } from "primeng/table";
import { ErrorHandlerService } from "src/app/core/error-handler.service";
import { AuthService } from "src/app/seguranca/auth.service";
import { DisciplinaFiltro, DisciplinaService } from "../disciplina.service";


@Component({
  selector: 'app-disciplina-pesquisa',
  templateUrl: './disciplina-pesquisa.component.html',
  styleUrls: ['./disciplina-pesquisa.component.css']
})
export class DisciplinaPesquisaComponent implements OnInit {

  filtro = new DisciplinaFiltro();

  totalRegistros: number = 0

  disciplinas: any[] = [] ;
  @ViewChild('tabela') grid!: Table;
  
  constructor(
    private auth: AuthService,
    private disciplinaService: DisciplinaService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private confirmationService: ConfirmationService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Pesquisa de Disciplina');
    this.pesquisar();
  }
  
  pesquisar(pagina: number = 0): void {        
    this.filtro.pagina = pagina;
    
    this.disciplinaService.pesquisar(this.filtro)
      .then((resultado: any) => {
        this.disciplinas = resultado.disciplinas;
        this.totalRegistros = resultado.total ;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
      const pagina = event!.first! / event!.rows!;
      this.pesquisar(pagina);
  }

  confirmarExclusao(disciplina: any): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
          this.excluir(disciplina);
      }
    });
  }

  excluir(disciplina: any) {

    this.disciplinaService.excluir(disciplina.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
        } else {
          this.grid.reset();
        }

        this.messageService.add({ severity: 'success', detail: 'Agenda excluída com sucesso!' })
      })
  }

  naoTemPermissao(permissao: string) {
    return !this.auth.temPermissao(permissao);
  }
}
