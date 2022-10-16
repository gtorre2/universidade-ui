import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ErrorHandlerService } from "src/app/core/error-handler.service";
import { AlunoDTO } from "src/app/core/model/aluno";
import { AlunoService } from "../aluno.service";

@Component({
  selector: 'app-aluno-cadastro',
  templateUrl: './aluno-cadastro.component.html',
  styleUrls: ['./aluno-cadastro.component.css']
})
export class AlunoCadastroComponent implements OnInit {
  
  formulario!: FormGroup;

  
  constructor(
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
    this.title.setTitle('Novo Aluno');
    const codigoAluno = this.route.snapshot.params['codigo'];

    if (codigoAluno) {
      this.carregarAluno(codigoAluno)
    }
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [],
      nome: [null, [ this.validarObrigatoriedade, this.validarTamanhoMinimo(5) ]],
      nota: [ null, Validators.required ],
      dataNascimento: [null, Validators.required],
      matricula: [null, Validators.required]
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
  
  carregarAluno(codigo: number) {
    this.alunoService.buscarPorCodigo(codigo)
      .then(aluno => {
        this.formulario.patchValue(aluno)
      },
      erro => this.errorHandler.handle(erro));
  }

  salvar() {
    if (this.editando) {
      this.atualizarAluno();
    } else {
      this.adicionarAluno()
    }
  }

  atualizarAluno() {
    this.alunoService.atualizar(this.formulario.value)
      .then((aluno:AlunoDTO) => {
          this.formulario.patchValue(aluno)
          this.messageService.add({ severity: 'success', detail: 'Aluno alterado com sucesso!' });
          this.atualizarTituloEdicao();
        }
      ).catch(erro => this.errorHandler.handle(erro))
  }

  adicionarAluno() {
    this.alunoService.adicionar(this.formulario.value)
      .then(alunoAdicionado => {
        this.messageService.add({ severity: 'success', detail: 'Aluno adicionado com sucesso!' });

        this.router.navigate(['/aluno', alunoAdicionado.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo() {
    this.formulario.reset(new AlunoDTO);

    this.router.navigate(['aluno/novo']);
  }

  private atualizarTituloEdicao() {
    this.title.setTitle(`Edição de aluno: ${this.formulario.get('nome')!.value}`);
  }
}
