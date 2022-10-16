import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ErrorHandlerService } from "src/app/core/error-handler.service";
import { ProfessorDTO } from "src/app/core/model/professor";
import { ProfessorService } from "../professor.service";

@Component({
  selector: 'app-professor-cadastro',
  templateUrl: './professor-cadastro.component.html',
  styleUrls: ['./professor-cadastro.component.css']
})
export class ProfessorCadastroComponent implements OnInit {
  
  formulario!: FormGroup;

  
  constructor(
    private professorService: ProfessorService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.configurarFormulario();
    this.title.setTitle('Nova Professor');
    const codigoProfessor = this.route.snapshot.params['codigo'];

    if (codigoProfessor) {
      this.carregarProfessor(codigoProfessor)
    }
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [],
      nome: [null, [ this.validarObrigatoriedade, this.validarTamanhoMinimo(5) ]],
      salario: [null, [ this.validarObrigatoriedade ]],
      dataNascimento: [ null, Validators.required ]
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
  
  carregarProfessor(codigo: number) {
    this.professorService.buscarPorCodigo(codigo)
      .then(professor => {
        console.log(professor);
        this.formulario.patchValue(professor)
      },
      erro => this.errorHandler.handle(erro));
  }

  salvar() {
    if (this.editando) {
      this.atualizarProfessor()
    } else {
      this.adicionarProfessor()
    }
  }

  atualizarProfessor() {
    this.professorService.atualizar(this.formulario.value)
      .then((professor:ProfessorDTO) => {
          this.formulario.patchValue(professor)
          this.messageService.add({ severity: 'success', detail: 'Professor alterado com sucesso!' });
          this.atualizarTituloEdicao();
        }
      ).catch(erro => this.errorHandler.handle(erro))
  }

  adicionarProfessor() {
    this.professorService.adicionar(this.formulario.value)
      .then(professorAdicionado => {
        this.messageService.add({ severity: 'success', detail: 'Professor adicionado com sucesso!' });

        this.router.navigate(['/professor', professorAdicionado.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo() {
    this.formulario.reset(new ProfessorDTO);

    this.router.navigate(['professor/novo']);
  }

  private atualizarTituloEdicao() {
    this.title.setTitle(`Edição de professor: ${this.formulario.get('nome')!.value}`);
  }
}
