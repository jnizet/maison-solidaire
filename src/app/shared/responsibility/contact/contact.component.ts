import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { Contact } from '../../contact.service';
import * as icons from '../../../icon/icons';
import { IconDirective } from '../../../icon/icon.directive';
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
  imports: [IconDirective],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  contact = input.required<Contact>();

  channels: Signal<Array<Channel>> = computed(() => {
    const channels: Array<Channel> = [];
    const contact = this.contact();
    if (contact.email) {
      channels.push({
        icon: icons.email,
        description: 'Par email\u00a0:',
        href: `mailto:${contact.email}`,
        label: contact.email
      });
    }
    if (contact.phone) {
      channels.push({
        icon: icons.phone,
        description: 'Par téléphone\u00a0:',
        href: `tel:${contact.phone}`,
        label: contact.phone
      });
    }
    if (contact.mobile) {
      channels.push({
        icon: icons.mobile,
        description: 'Par téléphone portable\u00a0:',
        href: `tel:${contact.mobile}`,
        label: contact.mobile
      });
    }
    if (contact.whatsapp) {
      channels.push({
        icon: icons.whatsapp,
        description: 'Par Whatsapp\u00a0:',
        href: `https://wa.me/${this.whatsappNumber(contact.whatsapp)}`,
        label: contact.whatsapp
      });
    }
    return channels;
  });

  icons = icons;

  constructor(private toastService: ToastService) {}

  private whatsappNumber(whatsapp: string) {
    const regex = /\D/g;
    return whatsapp.replace(regex, '');
  }

  async copy(value: string) {
    await navigator.clipboard.writeText(value);
    this.toastService.display({
      icon: icons.copied,
      message: 'Copié dans le presse-papier'
    });
  }
}
