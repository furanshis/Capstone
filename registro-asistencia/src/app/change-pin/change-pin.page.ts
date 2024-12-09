import { Component } from '@angular/core';
import { PinService } from 'src/app/services/pin.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-change-pin',
  templateUrl: './change-pin.page.html',
  styleUrls: ['./change-pin.page.scss'],
})
export class ChangePinPage {
  newPin: string = '';
  confirmPin: string = '';
  goBack(){
    window.history.back();
  }

  constructor(
    private pinService: PinService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  async changePin() {
    if (this.newPin !== this.confirmPin) {
      const alert = await this.alertController.create({
        header: 'Pins no coinciden',
        message: 'Porfavor, asegurate que los dos pin sean similares.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    await this.pinService.setPin(this.newPin);
    const alert = await this.alertController.create({
      header: 'Exito',
      message: 'Tu pin ha sido cambiado con exito.',
      buttons: ['OK'],
    });
    await alert.present();
    this.navCtrl.navigateBack('/lockscreen');
  }
}

