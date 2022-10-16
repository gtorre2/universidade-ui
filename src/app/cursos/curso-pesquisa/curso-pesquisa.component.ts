import { Component, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { MessageService, ConfirmationService, LazyLoadEvent } from "primeng/api";
import { Table } from "primeng/table";
import { ErrorHandlerService } from "src/app/core/error-handler.service";
import { AuthService } from "src/app/seguranca/auth.service";
import { CursoFiltro, CursoService } from "../curso.service";

@Component({
  selector: 'app-curso-pesquisa',
  templateUrl: './curso-pesquisa.component.html',
  styleUrls: ['./curso-pesquisa.component.css']
})
export class CursoPesquisaComponent implements OnInit {


  filtro = new CursoFiltro();

  totalRegistros: number = 0

  cursos: any[] = [] ;
  @ViewChild('tabela') grid!: Table;
  
  constructor(
    private auth: AuthService,
    private cursoService: CursoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private confirmationService: ConfirmationService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Pesquisa de Curso');
  }
  
  pesquisar(pagina: number = 0): void {        
    this.filtro.pagina = pagina;
    
    this.cursoService.pesquisar(this.filtro)
      .then((resultado: any) => {
        this.cursos = resultado.cursos;
        this.totalRegistros = resultado.total ;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
      const pagina = event!.first! / event!.rows!;
      this.pesquisar(pagina);
  }

  confirmarExclusao(curso: any): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
          this.excluir(curso);
      }
    });
  }

  excluir(curso: any) {

    this.cursoService.excluir(curso.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
        } else {
          this.grid.reset();
        }

        this.messageService.add({ severity: 'success', detail: 'Curso excluída com sucesso!' })
      })
  }

  naoTemPermissao(permissao: string) {
    return !this.auth.temPermissao(permissao);
  }
}
