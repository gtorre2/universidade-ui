import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DisciplinaDTO } from '../core/model/disciplina';

export class DisciplinaFiltro {
  nome?: string
  pagina: number = 0
  itensPorPagina: number = 5
}

@Injectable({
  providedIn: 'root'
})
export class DisciplinaService {
  
  disciplinaUrl: string;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) {
    this.disciplinaUrl = `${environment.apiUrl}/disciplinas`
  }

  uploadHeaders() {
    return new HttpHeaders()
      .append('Authorization', 'Bearer ' + localStorage.getItem('token'))
  }

  pesquisar(filtro: DisciplinaFiltro): Promise<any> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
      
    let params = new HttpParams()
                      .set('page', filtro.pagina)
                      .set('size', filtro.itensPorPagina);
  
    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }   
    
    return this.http.get(`${this.disciplinaUrl}?resumo`, { headers, params })
      .toPromise()
      .then((response : any) => {
        const disciplinas = response['content'];

        const resultado = {
          disciplinas,
          total: response['totalElements']
        };

        return resultado;
      });
  }

  excluir(codigo: number): Promise<void> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.delete<void>(`${this.disciplinaUrl}/${codigo}`, { headers })
      .toPromise();
  }

  adicionar(disciplina: DisciplinaDTO): Promise<DisciplinaDTO> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');

    return this.http.post<DisciplinaDTO>(this.disciplinaUrl, disciplina, { headers })
      .toPromise();
  }

  atualizar(disciplina: DisciplinaDTO): Promise<DisciplinaDTO> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');
  
    return this.http.put<DisciplinaDTO>(`${this.disciplinaUrl}/${disciplina.codigo}`, disciplina, { headers })
      .toPromise()
      .then((response:any) => {

        return response;
      });
  }

  buscarPorCodigo(codigo: number): Promise<DisciplinaDTO> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.get(`${this.disciplinaUrl}/${codigo}`, { headers })
      .toPromise()
      .then((response:any) => {

        return response;
      });
  }

}
