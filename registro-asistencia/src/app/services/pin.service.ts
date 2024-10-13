import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class PinService {
  private readonly PIN_KEY = 'userPin';

  async setPin(pin: string): Promise<void> {
    await Preferences.set({ key: this.PIN_KEY, value: pin });
  }

  async validatePin(enteredPin: string): Promise<boolean> {
    const { value } = await Preferences.get({ key: this.PIN_KEY });
    return value === enteredPin;
  }

  async hasPin(): Promise<boolean> {
    const { value } = await Preferences.get({ key: this.PIN_KEY });
    return !!value;
  }
}
