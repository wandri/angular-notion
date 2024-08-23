import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { AngularComponent } from '../../type';

@Component({
  selector: 'an-link',
  host: { ngSkipHydration: 'true' },
  standalone: true,
  imports: [NgComponentOutlet, NgTemplateOutlet],
  template: `
    @if (component()) {
      <ng-container
        *ngComponentOutlet="
          component() ?? null;
          content: templateRef;
          inputs: {
            href: href(),
            className: className(),
          }
        "
      />
    } @else {
      <a
        [className]="className()"
        [href]="href() ?? null"
        [attr.type]="type() ?? null"
        target="_blank"
        rel="noopener noreferrer"
        [attr.download]="download() ?? null"
      >
        <ng-container *ngTemplateOutlet="innerContent" />
      </a>
    }
    <ng-template #innerContent>
      <ng-content />
    </ng-template>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnLinkComponent implements OnInit {
  readonly component = input<AngularComponent | null | undefined>(null);
  readonly className = input<string>('');
  readonly href = input.required<string | undefined>();
  readonly type = input<string | undefined>(undefined);
  readonly target = input<string | undefined>(undefined);
  readonly rel = input<string | undefined>(undefined);
  readonly media = input<string | undefined>(undefined);
  readonly download = input<string | undefined>(undefined);

  readonly vcr = inject(ViewContainerRef);
  templateRef: any[] = [];
  readonly template = viewChild.required<TemplateRef<any>>('innerContent');

  ngOnInit() {
    if (this.component()) {
      const templateRef = this.template();
      this.templateRef = [this.vcr.createEmbeddedView(templateRef).rootNodes];
    }
  }
}
