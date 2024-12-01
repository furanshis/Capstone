import { Component, OnInit } from '@angular/core';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';

@Component({
  selector: 'app-pin-screen',
  templateUrl: './pin-screen.page.html',
  styleUrls: ['./pin-screen.page.scss'],
})
export class PinScreenPage implements OnInit {
  pin: string = '';
  dots: number[] = [1, 2, 3, 4];

  constructor(private fingerprint: FingerprintAIO) {}

  ngOnInit() {}

  async addNumber(num: string) {
    if (this.pin.length < 4) {
      this.pin += num;
    }
  }

  deleteNumber() {
    this.pin = this.pin.slice(0, -1);
  }

  cancel() {
    this.pin = '';
  }

  async useBiometric() {
    try {
      const result = await this.fingerprint.show({
        title: 'Biometric Authentication',
        subtitle: 'Confirm your identity',
        description: 'Please use your fingerprint to authenticate',
        disableBackup: false, // Permite usar PIN si biometría falla
      });
      if (result) {
        console.log('Biometric authentication successful');
        // Handle successful authentication
      }
    } catch (error) {
      console.error('Biometric authentication failed', error);
      // Handle failure
    }
  }
}
