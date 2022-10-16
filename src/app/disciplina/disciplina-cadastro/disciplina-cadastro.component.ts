import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ErrorHandlerService } from "src/app/core/error-handler.service";
import { DisciplinaDTO } from "src/app/core/model/disciplina";
import { DisciplinaService } from "../disciplina.service";

@Component({
  selector: 'app-disciplina-cadastro',
  templateUrl: './disciplina-cadastro.component.html',
  styleUrls: ['./disciplina-cadastro.component.css']
})
export class DisciplinaCadastroComponent implements OnInit {
  
  formulario!: FormGroup;

  
  constructor(
    private disciplinaService: DisciplinaService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.configurarFormulario();
    this.title.setTitle('Nova Disciplina');
    const codigoDisciplina = this.route.snapshot.params['codigo'];

    if (codigoDisciplina) {
      this.carregarDisciplina(codigoDisciplina)
    }
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [],
      nome: [null, [ this.validarObrigatoriedade, this.validarTamanhoMinimo(5) ]]
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
  
  carregarDisciplina(codigo: number) {
    this.disciplinaService.buscarPorCodigo(codigo)
      .then(disciplina => {
        console.log(disciplina);
        this.formulario.patchValue(disciplina)
      },
      erro => this.errorHandler.handle(erro));
  }

  salvar() {
    if (this.editando) {
      this.atualizarDisciplina();
    } else {
      this.adicionarDisciplina();
    }
  }

  atualizarDisciplina() {
    this.disciplinaService.atualizar(this.formulario.value)
      .then((disciplina:DisciplinaDTO) => {
          this.formulario.patchValue(disciplina)
          this.messageService.add({ severity: 'success', detail: 'Disciplina alterada com sucesso!' });
          this.atualizarTituloEdicao();
        }
      ).catch(erro => this.errorHandler.handle(erro))
  }

  adicionarDisciplina() {
    this.disciplinaService.adicionar(this.formulario.value)
      .then(() => {
        this.messageService.add({ severity: 'success', detail: 'Disciplina adicionada com sucesso!' });
        this.router.navigate(['/disciplina']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo() {
    this.formulario.reset(new DisciplinaDTO);

    this.router.navigate(['disciplina/novo']);
  }

  private atualizarTituloEdicao() {
    this.title.setTitle(`Edição de disciplina: ${this.formulario.get('nome')!.value}`);
  }
}
