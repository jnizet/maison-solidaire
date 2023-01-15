import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact } from '../../contact.service';
import * as icons from '../../../icon/icons';
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

  icons = icons;

  constructor(private toastService: ToastService) {}

  ngOnChanges(): void {
    this.channels = [];
    if (this.contact.email) {
      this.channels.push({
        icon: icons.email,
        description: 'Par email\u00a0:',
        href: `mailto:${this.contact.email}`,
        label: this.contact.email
      });
    }
    if (this.contact.phone) {
      this.channels.push({
        icon: icons.phone,
        description: 'Par téléphone\u00a0:',
        href: `tel:${this.contact.phone}`,
        label: this.contact.phone
      });
    }
    if (this.contact.mobile) {
      this.channels.push({
        icon: icons.mobile,
        description: 'Par téléphone portable\u00a0:',
        href: `tel:${this.contact.mobile}`,
        label: this.contact.mobile
      });
    }
    if (this.contact.whatsapp) {
      this.channels.push({
        icon: icons.whatsapp,
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
        icon: icons.copied,
        message: 'Copié dans le presse-papier'
      })
    );
  }
}
