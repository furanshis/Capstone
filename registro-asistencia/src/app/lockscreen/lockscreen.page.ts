import { Component } from '@angular/core';
import { PinService } from 'src/app/services/pin.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.page.html',
  styleUrls: ['./lockscreen.page.scss'],
})
export class LockscreenPage {
  enteredPin: string = '';
  numbers: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  pinDots: boolean[] = [false, false, false, false]; // Estado de los círculos

  constructor(
    private pinService: PinService,
    private router: Router,
    private alertController: AlertController
  ) {}

  addNumber(num: string) {
    if (this.enteredPin.length < 4) {
      this.enteredPin += num;
      this.pinDots[this.enteredPin.length - 1] = true; // Ennegrecer el círculo correspondiente
    }

    if (this.enteredPin.length === 4) {
      this.submitPin(); // Intentar enviar el PIN una vez que se ingresan 4 dígitos
    }
  }

  clearPin() {
    this.enteredPin = '';
    this.pinDots.fill(false); // Restablecer los círculos
  }

  async submitPin() {
    const isValid = await this.pinService.validatePin(this.enteredPin);
    if (isValid) {
      this.router.navigateByUrl('/home');
    } else {
      const alert = await this.alertController.create({
        header: 'Codigo Incorrecto',
        message: 'Porfavor Intentalo Denuevo.',
        buttons: ['OK'],
      });
      await alert.present();
      this.clearPin(); // Restablecer el PIN en caso de que sea inválido
    }
  }
}

