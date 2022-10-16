import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { AlunoFiltro, AlunoService } from "src/app/aluno/aluno.service";
import { ErrorHandlerService } from "src/app/core/error-handler.service";
import { AlunoDTO } from "src/app/core/model/aluno";
import { CursoDTO } from "src/app/core/model/curso";
import { DisciplinaDTO } from "src/app/core/model/disciplina";
import { ProfessorDTO } from "src/app/core/model/professor";
import { SemestreDTO } from "src/app/core/model/semestre";
import { DisciplinaFiltro, DisciplinaService } from "src/app/disciplina/disciplina.service";
import { ProfessorFiltro, ProfessorService } from "src/app/professor/professor.service";
import { CursoService } from "../curso.service";

@Component({
  selector: 'app-curso-cadastro',
  templateUrl: './curso-cadastro.component.html',
  styleUrls: ['./curso-cadastro.component.css']
})
export class CursoCadastroComponent implements OnInit {

  formulario!: FormGroup;
  semestres: SemestreDTO[] = [];
  professores: ProfessorDTO[] = [];
  alunos: AlunoDTO[] = [];
  disciplinas: DisciplinaDTO[] = [];

  constructor(
    private cursoService: CursoService,
    private professorService: ProfessorService,
    private disciplinaService: DisciplinaService,
    private alunoService: AlunoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.configurarFormulario();
    this.title.setTitle('Nova Curso');
    const codigoCurso = this.route.snapshot.params['codigo'];

    if (codigoCurso) {
      this.carregarCurso(codigoCurso)
    }

    this.semestres = [{ codigo: 1, nome: 'Semestre 1' },
    { codigo: 2, nome: 'Semestre 2' },
    { codigo: 3, nome: 'Semestre 3' },
    { codigo: 4, nome: 'Semestre 4' },
    { codigo: 5, nome: 'Semestre 5' },
    { codigo: 6, nome: 'Semestre 6' },
    { codigo: 7, nome: 'Semestre 7' },
    { codigo: 8, nome: 'Semestre 8' },
    { codigo: 9, nome: 'Semestre 9' },
    { codigo: 10, nome: 'Semestre 10' }
    ]

    this.carregarProfessores();
    this.carregarDisciplinas();
    this.carregarAlunos();

  }

  carregarProfessores() {
    let professorFiltro = new ProfessorFiltro();
    this.professorService.pesquisar(professorFiltro)
      .then((resultado: any) => {
        this.professores = resultado.professores;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarDisciplinas() {
    let disciplinaFiltro = new DisciplinaFiltro();
    this.disciplinaService.pesquisar(disciplinaFiltro)
      .then((resultado: any) => {
        this.disciplinas = resultado.disciplinas;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarAlunos() {
    let alunoFiltro = new AlunoFiltro();
    this.alunoService.pesquisar(alunoFiltro)
      .then((resultado: any) => {
        this.alunos = resultado.alunos;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [],
      nome: [null, [this.validarObrigatoriedade, this.validarTamanhoMinimo(5)]],
      semestre: [null, Validators.required],
      professor: [null, Validators.required],
      aluno: [null, Validators.required],
      disciplina: [null, Validators.required],
    });
  }

  validarObrigatoriedade(input: FormControl) {
    return (input.value ? null : { obrigatoriedade: true });
  }

  validarTamanhoMinimo(valor: number) {
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ? null : { tamanhoMinimo: { tamanho: valor } };
    };
  }

  get editando() {
    return Boolean(this.formulario.get('codigo')!.value);
  }

  carregarCurso(codigo: number) {
    this.cursoService.buscarPorCodigo(codigo)
      .then(curso => {
        console.log(curso);
        this.formulario.patchValue(curso)
      },
        erro => this.errorHandler.handle(erro));
  }

  salvar() {
    if (this.editando) {
      this.atualizarCurso()
    } else {
      this.adicionarCurso()
    }
  }

  atualizarCurso() {
    this.cursoService.atualizar(this.formulario.value)
      .then((curso: CursoDTO) => {
        this.formulario.patchValue(curso)
        this.messageService.add({ severity: 'success', detail: 'Curso alterado com sucesso!' });
        this.atualizarTituloEdicao();
      }
      ).catch(erro => this.errorHandler.handle(erro))
  }

  adicionarCurso() {
    
    this.cursoService.adicionar(this.formulario.value)
      .then(cursoAdicionado => {
        this.messageService.add({ severity: 'success', detail: 'Curso adicionado com sucesso!' });

        this.router.navigate(['/curso', cursoAdicionado.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo() {
    this.formulario.reset(new CursoDTO);

    this.router.navigate(['curso/novo']);
  }

  private atualizarTituloEdicao() {
    this.title.setTitle(`Edição de curso: ${this.formulario.get('nome')!.value}`);
  }
}
