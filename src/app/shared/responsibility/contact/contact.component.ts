import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact } from '../../contact.service';
import {
  at,
  clipboard2,
  clipboard2Check,
  phone,
  telephone,
  whatsapp
} from '../../../bootstrap-icons/bootstrap-icons';
import { IconDirective } from '../../../icon/icon.directive';
import { from } from 'rxjs';
import { ToastService } from '../../../toast/toast.service';

interface Channel {
  href: string;
  icon: string;
  description: string;
  label: string;
}

@Component({
  selector: 'ms-contact',
  standalone: true,
  imports: [CommonModule, IconDirective],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent implements OnChanges {
  @Input() contact!: Contact;

  channels: Array<Channel> = [];

  icons = {
    copy: clipboard2
  };

  constructor(private toastService: ToastService) {}

  ngOnChanges(): void {
    this.channels = [];
    if (this.contact.email) {
      this.channels.push({
        icon: at,
        description: 'Par email\u00a0:',
        href: `mailto:${this.contact.email}`,
        label: this.contact.email
      });
    }
    if (this.contact.phone) {
      this.channels.push({
        icon: telephone,
        description: 'Par téléphone\u00a0:',
        href: `tel:${this.contact.phone}`,
        label: this.contact.phone
      });
    }
    if (this.contact.mobile) {
      this.channels.push({
        icon: phone,
        description: 'Par téléphone portable\u00a0:',
        href: `tel:${this.contact.mobile}`,
        label: this.contact.mobile
      });
    }
    if (this.contact.whatsapp) {
      this.channels.push({
        icon: whatsapp,
        description: 'Par Whatsapp\u00a0:',
        href: `https://wa.me/${this.whatsappNumber(this.contact.whatsapp)}`,
        label: this.contact.whatsapp
      });
    }
  }

  private whatsappNumber(whatsapp: string) {
    const regex = /\D/g;
    return whatsapp.replace(regex, '');
  }

  copy(value: string) {
    from(navigator.clipboard.writeText(value)).subscribe(() =>
      this.toastService.display({
        icon: clipboard2Check,
        message: 'Copié dans le presse-papier'
      })
    );
  }
}
