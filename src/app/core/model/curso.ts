import { AlunoDTO } from "./aluno";
import { DisciplinaDTO } from "./disciplina";
import { ProfessorDTO } from "./professor";

export class CursoDTO {
    codigo?: number;
    nome?: string;
    semestre?: number;
    professor?: ProfessorDTO;
    alunos?: AlunoDTO[];
    disciplinas?: DisciplinaDTO[];

}