import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class MaestrosService {
  constructor(
    private http: HttpClient, // Para llamadas a peticiones HTTP
    private validatorService: ValidatorService, // Para jalar validaciones
    private errorService: ErrorsService, // Para jalar validaciones
    private facadeService: FacadeService //Para la autenticación
  ) {}

  public esquemaMaestro() {
    return {
      clave_trabajador: '',
      nombre: '',
      apellidos: '',
      email: '',
      password: '',
      confirmar_password: '',
      fecha_nacimiento: null as Date | null,
      telefono: '',
      rfc: '',
      cubiculo: '',
      area_investigacion: '',
      materias: [] as string[],
    };
  }

  public validarMaestros(data: any, editar: boolean) {
    const error: any = {};

    if (!this.validatorService.required(data['clave_trabajador'])) {
      error['clave_trabajador'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['nombre'])) {
      error['nombre'] = this.errorService.required;
    }
    if (!this.validatorService.required(data['apellidos'])) {
      error['apellidos'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['email'])) {
      error['email'] = this.errorService.required;
    } else if (!this.validatorService.max(data['email'], 40)) {
      error['email'] = this.errorService.max(40);
    } else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    if (!editar) {
      if (!this.validatorService.required(data['password'])) {
        error['password'] = this.errorService.required;
      }
      if (!this.validatorService.required(data['confirmar_password'])) {
        error['confirmar_password'] = this.errorService.required;
      }
      if (
        this.validatorService.required(data['password']) &&
        this.validatorService.required(data['confirmar_password']) &&
        data['password'] !== data['confirmar_password']
      ) {
        error['confirmar_password'] = 'Las contraseñas no coinciden';
      }
    }

    if (!this.validatorService.required(data['fecha_nacimiento'])) {
      error['fecha_nacimiento'] = this.errorService.required;
    } else {
      const edad = this.calcularEdad(new Date(data['fecha_nacimiento']));
      if (edad < 18) {
        error['fecha_nacimiento'] = 'El maestro debe ser mayor de 18 años';
      }
    }

    if (!this.validatorService.required(data['telefono'])) {
      error['telefono'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['rfc'])) {
      error['rfc'] = this.errorService.required;
    } else if (!this.validatorService.min(data['rfc'], 12)) {
      error['rfc'] = this.errorService.min(12);
      alert('La longitud del RFC es menor; deben ser 12 o 13 caracteres.');
    } else if (!this.validatorService.max(data['rfc'], 13)) {
      error['rfc'] = this.errorService.max(13);
      alert('La longitud del RFC es mayor; deben ser 12 o 13 caracteres.');
    }

    if (!this.validatorService.required(data['cubiculo'])) {
      error['cubiculo'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['area_investigacion'])) {
      error['area_investigacion'] = this.errorService.required;
    }

    if (!Array.isArray(data['materias']) || data['materias'].length === 0) {
      error['materias'] = 'Selecciona al menos una materia';
    }

    return error;
  }

  private calcularEdad(fecha: Date): number {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const m = hoy.getMonth() - fecha.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
    return edad;
  }
}
