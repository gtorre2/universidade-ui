import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ProfessorDTO } from '../core/model/professor';

export class ProfessorFiltro {
  nome?: string
  dataNascimento?: Date
  pagina: number = 0
  itensPorPagina: number = 5
}

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {
  
  professorUrl: string;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) {
    this.professorUrl = `${environment.apiUrl}/professores`
  }

  uploadHeaders() {
    return new HttpHeaders()
      .append('Authorization', 'Bearer ' + localStorage.getItem('token'))
  }

  pesquisar(filtro: ProfessorFiltro): Promise<any> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
      
    let params = new HttpParams()
                      .set('page', filtro.pagina)
                      .set('size', filtro.itensPorPagina);
    

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }   
    
    if (filtro.dataNascimento) {
      params = params.set('dataNascimento', this.datePipe.transform(filtro.dataNascimento, 'yyyy-MM-dd')!);
    }

    return this.http.get(`${this.professorUrl}?resumo`, { headers, params })
      .toPromise()
      .then((response : any) => {
        const professores = response['content'];

        const resultado = {
          professores,
          total: response['totalElements']
        };

        return resultado;
      });
  }

  listar(): Promise<any> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    
    return this.http.get(`${this.professorUrl}`, { headers })
      .toPromise()
      .then((response : any) => {
        const professores = response['content'];

        const resultado = {
          professores,
          total: response['totalElements']
        };

        return resultado;
      });
  }

  excluir(codigo: number): Promise<void> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.delete<void>(`${this.professorUrl}/${codigo}`, { headers })
      .toPromise();
  }

  adicionar(professor: ProfessorDTO): Promise<ProfessorDTO> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');

    return this.http.post<ProfessorDTO>(this.professorUrl + '/resumo', professor, { headers })
      .toPromise();
  }

  atualizar(professor: ProfessorDTO): Promise<ProfessorDTO> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');
  
    return this.http.put<ProfessorDTO>(`${this.professorUrl}/${professor.codigo}`, professor, { headers })
      .toPromise()
      .then((response:any) => {
        this.converterStringsParaDatas([response]);

        return response;
      });
  }

  buscarPorCodigo(codigo: number): Promise<ProfessorDTO> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.get(`${this.professorUrl}/${codigo}`, { headers })
      .toPromise()
      .then((response:any) => {
        this.converterStringsParaDatas([response]);

        return response;
      });
  }

  private converterStringsParaDatas(professors: any[]) {

    for (const professor of professors) {
      
      professor.dataNascimento = new Date(professor.dataNascimento);
   
    }
  }

}
