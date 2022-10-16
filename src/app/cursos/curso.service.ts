import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CursoDTO } from '../core/model/curso';
import { CursoProjecaoDTO } from '../core/model/cursoProjecao';

export class CursoFiltro {
  nome?: string
  pagina: number = 0
  itensPorPagina: number = 5
}

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  
  cursoUrl: string;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) {
    this.cursoUrl = `${environment.apiUrl}/cursos`
  }

  uploadHeaders() {
    return new HttpHeaders()
      .append('Authorization', 'Bearer ' + localStorage.getItem('token'))
  }

  pesquisar(filtro: CursoFiltro): Promise<any> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
      
    let params = new HttpParams()
                      .set('page', filtro.pagina)
                      .set('size', filtro.itensPorPagina);
    

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }   
   
    return this.http.get(`${this.cursoUrl}?resumo`, { headers, params })
      .toPromise()
      .then((response : any) => {
        const cursos = response['content'];

        const resultado = {
          cursos,
          total: response['totalElements']
        };

        return resultado;
      });
  }

  excluir(codigo: number): Promise<void> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.delete<void>(`${this.cursoUrl}/${codigo}`, { headers })
      .toPromise();
  }

  adicionar(curso: CursoDTO): Promise<CursoDTO> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');

    return this.http.post<CursoDTO>(this.cursoUrl, curso, { headers })
      .toPromise();
  }

  atualizar(curso: CursoDTO): Promise<CursoDTO> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');
  
    return this.http.put<CursoDTO>(`${this.cursoUrl}/${curso.codigo}`, curso, { headers })
      .toPromise()
      .then((response:any) => {
        return response;
      });
  }

  buscarPorCodigo(codigo: number): Promise<CursoProjecaoDTO> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.get(`${this.cursoUrl}/${codigo}`, { headers })
      .toPromise()
      .then((response:any) => {
        return response;
      });
  }

}
