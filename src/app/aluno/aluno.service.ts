import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AlunoDTO } from '../core/model/aluno';

export class AlunoFiltro {
  nome?: string
  pagina: number = 0
  itensPorPagina: number = 5
}

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  
  alunoUrl: string;

  constructor(
    private http: HttpClient,
  ) {
    this.alunoUrl = `${environment.apiUrl}/alunos`
  }

  uploadHeaders() {
    return new HttpHeaders()
      .append('Authorization', 'Bearer ' + localStorage.getItem('token'))
  }

  pesquisar(filtro: AlunoFiltro): Promise<any> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
      
    let params = new HttpParams()
                      .set('page', filtro.pagina)
                      .set('size', filtro.itensPorPagina);
    
    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }   
 
    return this.http.get(`${this.alunoUrl}?resumo`, { headers, params })
      .toPromise()
      .then((response : any) => {
        const alunos = response['content'];

        const resultado = {
          alunos,
          total: response['totalElements']
        };

        return resultado;
      });
  }

  excluir(codigo: number): Promise<void> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.delete<void>(`${this.alunoUrl}/${codigo}`, { headers })
      .toPromise();
  }

  adicionar(aluno: AlunoDTO): Promise<AlunoDTO> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');

    return this.http.post<AlunoDTO>(this.alunoUrl, aluno, { headers })
      .toPromise();
  }

  atualizar(aluno: AlunoDTO): Promise<AlunoDTO> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');
  
    return this.http.put<AlunoDTO>(`${this.alunoUrl}/${aluno.codigo}`, aluno, { headers })
      .toPromise()
      .then((response:any) => {
        //this.converterStringsParaDatas([response]);

        return response;
      });
  }

  buscarPorCodigo(codigo: number): Promise<AlunoDTO> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.get(`${this.alunoUrl}/${codigo}`, { headers })
      .toPromise()
      .then((response:any) => {
     //   this.converterStringsParaDatas([response]);

        return response;
      });
  }

  // private converterStringsParaDatas(alunos: any[]) {

  //   for (const aluno of alunos) {
      
  //     aluno.dataNascimento = new Date(aluno.dataNascimento);
   
  //   }
  // }

}
